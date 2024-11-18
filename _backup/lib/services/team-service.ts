// src/services/team-service.ts

import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { 
  Team, 
  TeamMember, 
  TeamRole, 
  TeamMemberStatus, 
  Prisma,
  User
} from "@prisma/client"
import { sendTeamInvitation } from "@/lib/email/team-invitation.server"
import { ApiError } from "@/lib/errors"

// Types
interface CreateTeamData {
  name: string
  ownerId: string
  plan?: string
}

interface InviteMemberData {
  email: string
  role: TeamRole
  teamId: string
  invitedBy: string
}

interface TeamWithRelations extends Team {
  members: TeamMember[]
  subscription: {
    seats: number
    maxSeats: number
  }
}

export class TeamService {
  static async createTeam(data: CreateTeamData) {
    const { name, ownerId, plan = 'free' } = data

    try {
      // Validate owner exists
      const owner = await prisma.user.findUnique({
        where: { id: ownerId },
      })

      if (!owner) {
        throw new ApiError('Owner not found', 404)
      }

      const slug = await this.generateUniqueSlug(name)

      // Create Stripe customer for team
      const customer = await stripe.customers.create({
        name,
        email: owner.email!,
        metadata: {
          type: 'team',
          teamId: slug,
          ownerId,
        },
      })

      // Create team with owner as first member
      const team = await prisma.$transaction(async (tx) => {
        // Create the team
        const newTeam = await tx.team.create({
          data: {
            name,
            slug,
            ownerId,
            plan,
            billingId: customer.id,
          },
        })

        // Create the team member record
        await tx.teamMember.create({
          data: {
            teamId: newTeam.id,
            userId: ownerId,
            role: TeamRole.OWNER,
            status: TeamMemberStatus.ACTIVE,
            invitedBy: ownerId,
            joinedAt: new Date(),
          },
        })

        // Create the team subscription
        await tx.teamSubscription.create({
          data: {
            teamId: newTeam.id,
            stripeCustomerId: customer.id,
            seats: 1,
            maxSeats: 5,
            plan,
          },
        })

        return tx.team.findUnique({
          where: { id: newTeam.id },
          include: {
            members: true,
            subscription: true,
          },
        })
      })

      return team
    } catch (error) {
      if (error instanceof ApiError) throw error
      
      console.error('Team creation error:', error)
      throw new ApiError('Failed to create team', 500)
    }
  }

  static async inviteMember(data: InviteMemberData) {
    const { email, role, teamId, invitedBy } = data

    try {
      // Check if inviter has permission
      const inviter = await prisma.teamMember.findFirst({
        where: {
          teamId,
          userId: invitedBy,
          status: TeamMemberStatus.ACTIVE,
          role: { in: [TeamRole.OWNER, TeamRole.ADMIN] },
        },
      })

      if (!inviter) {
        throw new ApiError('Not authorized to invite members', 403)
      }

      // Get or create user
      const user = await prisma.user.upsert({
        where: { email },
        create: { email },
        update: {},
      })

      // Check if already a member
      const existingMember = await prisma.teamMember.findFirst({
        where: {
          teamId,
          userId: user.id,
        },
      })

      if (existingMember) {
        if (existingMember.status === TeamMemberStatus.ACTIVE) {
          throw new ApiError('User is already a team member', 400)
        }
        if (existingMember.status === TeamMemberStatus.PENDING) {
          throw new ApiError('Invitation already sent', 400)
        }
      }

      // Check seats limit
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: {
          members: true,
          subscription: true,
        },
      })

      if (!team) {
        throw new ApiError('Team not found', 404)
      }

      const activeMembers = team.members.filter(
        m => m.status === TeamMemberStatus.ACTIVE
      ).length

      if (activeMembers >= team.subscription.maxSeats) {
        throw new ApiError('Team has reached maximum seats', 400)
      }

      // Create invitation
      const invitation = await prisma.teamMember.create({
        data: {
          teamId,
          userId: user.id,
          role,
          status: TeamMemberStatus.PENDING,
          invitedBy,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      })

      // Send invitation email
      await sendTeamInvitation({
        email,
        teamName: team.name,
        invitationId: invitation.id,
        inviterName: (await prisma.user.findUnique({ where: { id: invitedBy } }))?.name || 'A team admin',
      })

      return invitation
    } catch (error) {
      if (error instanceof ApiError) throw error
      
      console.error('Team invitation error:', error)
      throw new ApiError('Failed to send invitation', 500)
    }
  }

  static async acceptInvitation(invitationId: string, userId: string) {
    try {
      const invitation = await prisma.teamMember.findUnique({
        where: { id: invitationId },
        include: { 
          team: {
            include: {
              members: true,
              subscription: true,
            }
          } 
        },
      })

      if (!invitation) {
        throw new ApiError('Invitation not found', 404)
      }

      if (invitation.userId !== userId) {
        throw new ApiError('This invitation is for a different user', 403)
      }

      if (invitation.status !== TeamMemberStatus.PENDING) {
        throw new ApiError('Invitation is no longer valid', 400)
      }

      if (invitation.expiresAt && invitation.expiresAt < new Date()) {
        throw new ApiError('Invitation has expired', 400)
      }

      // Check seats again (in case limit changed)
      const activeMembers = invitation.team.members.filter(
        m => m.status === TeamMemberStatus.ACTIVE
      ).length

      if (activeMembers >= invitation.team.subscription.maxSeats) {
        throw new ApiError('Team has reached maximum seats', 400)
      }

      // Update invitation
      const member = await prisma.teamMember.update({
        where: { id: invitationId },
        data: {
          status: TeamMemberStatus.ACTIVE,
          joinedAt: new Date(),
        },
        include: { team: true },
      })

      return member
    } catch (error) {
      if (error instanceof ApiError) throw error
      
      console.error('Accept invitation error:', error)
      throw new ApiError('Failed to accept invitation', 500)
    }
  }

  static async removeMember(teamId: string, userId: string, removedBy: string) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { 
          members: true,
          subscription: true,
        },
      })

      if (!team) {
        throw new ApiError('Team not found', 404)
      }

      // Check permissions
      const remover = team.members.find(m => m.userId === removedBy)
      const memberToRemove = team.members.find(m => m.userId === userId)

      if (!remover) {
        throw new ApiError('Not authorized', 403)
      }

      if (!memberToRemove) {
        throw new ApiError('Member not found', 404)
      }

      if (remover.role !== TeamRole.OWNER && remover.role !== TeamRole.ADMIN) {
        throw new ApiError('Not authorized to remove members', 403)
      }

      if (memberToRemove.role === TeamRole.OWNER) {
        throw new ApiError('Cannot remove team owner', 400)
      }

      // If admin is removing someone, they can't remove other admins
      if (remover.role === TeamRole.ADMIN && memberToRemove.role === TeamRole.ADMIN) {
        throw new ApiError('Admins cannot remove other admins', 403)
      }

      // Remove member
      await prisma.teamMember.delete({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
      })

      // Update Stripe quantity if subscription exists
      if (team.subscription.stripeSubscriptionId) {
        await stripe.subscriptions.update(team.subscription.stripeSubscriptionId, {
          quantity: team.members.length - 1,
        })
      }
    } catch (error) {
      if (error instanceof ApiError) throw error
      
      console.error('Remove member error:', error)
      throw new ApiError('Failed to remove member', 500)
    }
  }

  static async updateMemberRole(
    teamId: string,
    userId: string,
    newRole: TeamRole,
    updatedBy: string
  ) {
    try {
      const team = await prisma.team.findUnique({
        where: { id: teamId },
        include: { members: true },
      })

      if (!team) {
        throw new ApiError('Team not found', 404)
      }

      // Check permissions
      const updater = team.members.find(m => m.userId === updatedBy)
      const memberToUpdate = team.members.find(m => m.userId === userId)

      if (!updater) {
        throw new ApiError('Not authorized', 403)
      }

      if (!memberToUpdate) {
        throw new ApiError('Member not found', 404)
      }

      if (updater.role !== TeamRole.OWNER) {
        throw new ApiError('Only team owner can change roles', 403)
      }

      if (memberToUpdate.role === TeamRole.OWNER) {
        throw new ApiError('Cannot change owner\'s role', 400)
      }

      // Update role
      const member = await prisma.teamMember.update({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
        data: {
          role: newRole,
        },
      })

      return member
    } catch (error) {
      if (error instanceof ApiError) throw error
      
      console.error('Update role error:', error)
      throw new ApiError('Failed to update member role', 500)
    }
  }

  private static async generateUniqueSlug(name: string) {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    let slug = baseSlug
    let counter = 1

    while (await prisma.team.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    return slug
  }
}