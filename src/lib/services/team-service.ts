import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { TeamRole, TeamMemberStatus } from "@prisma/client"
import { sendTeamInvitation } from "@/lib/email/team-invitation"

interface CreateTeamData {
  name: string
  ownerId: string
}

interface InviteMemberData {
  email: string
  role: TeamRole
  teamId: string
  invitedBy: string
}

export class TeamService {
  static async createTeam(data: CreateTeamData) {
    const { name, ownerId } = data

    const slug = await this.generateUniqueSlug(name)

    // Create Stripe customer for team
    const customer = await stripe.customers.create({
      name: name,
      metadata: {
        type: 'team',
        teamId: slug,
      },
    })

    // Create team with owner as first member
    const team = await prisma.team.create({
      data: {
        name,
        slug,
        ownerId,
        billingId: customer.id,
        members: {
          create: {
            userId: ownerId,
            role: TeamRole.OWNER,
            status: TeamMemberStatus.ACTIVE,
            invitedBy: ownerId,
            joinedAt: new Date(),
          },
        },
        subscription: {
          create: {
            seats: 1,
            maxSeats: 5,
          },
        },
      },
      include: {
        members: true,
        subscription: true,
      },
    })

    return team
  }

  static async inviteMember(data: InviteMemberData) {
    const { email, role, teamId, invitedBy } = data

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    })

    // Check seats limit
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: true,
        subscription: true,
      },
    })

    if (!team) throw new Error("Team not found")

    const activeMembers = team.members.filter(
      m => m.status === TeamMemberStatus.ACTIVE
    ).length

    if (activeMembers >= team.subscription.maxSeats) {
      throw new Error("Team has reached maximum seats")
    }

    // Create invitation
    const invitation = await prisma.teamMember.create({
      data: {
        teamId,
        userId: user?.id || '',
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
      inviterName: (await prisma.user.findUnique({ where: { id: invitedBy } }))?.name || '',
    })

    return invitation
  }

  static async acceptInvitation(invitationId: string, userId: string) {
    const invitation = await prisma.teamMember.findUnique({
      where: { id: invitationId },
      include: { team: true },
    })

    if (!invitation) throw new Error("Invitation not found")
    if (invitation.status !== TeamMemberStatus.PENDING) {
      throw new Error("Invitation is no longer valid")
    }
    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      throw new Error("Invitation has expired")
    }

    // Update invitation
    const member = await prisma.teamMember.update({
      where: { id: invitationId },
      data: {
        userId,
        status: TeamMemberStatus.ACTIVE,
        joinedAt: new Date(),
      },
      include: { team: true },
    })

    return member
  }

  static async removeMember(teamId: string, userId: string, removedBy: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    })

    if (!team) throw new Error("Team not found")

    // Check permissions
    const remover = team.members.find(m => m.userId === removedBy)
    const memberToRemove = team.members.find(m => m.userId === userId)

    if (!remover || !memberToRemove) throw new Error("Member not found")
    if (remover.role !== TeamRole.OWNER && remover.role !== TeamRole.ADMIN) {
      throw new Error("Not authorized")
    }
    if (memberToRemove.role === TeamRole.OWNER) {
      throw new Error("Cannot remove team owner")
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
  }

  static async updateMemberRole(
    teamId: string,
    userId: string,
    newRole: TeamRole,
    updatedBy: string
  ) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    })

    if (!team) throw new Error("Team not found")

    // Check permissions
    const updater = team.members.find(m => m.userId === updatedBy)
    const memberToUpdate = team.members.find(m => m.userId === userId)

    if (!updater || !memberToUpdate) throw new Error("Member not found")
    if (updater.role !== TeamRole.OWNER) {
      throw new Error("Only team owner can change roles")
    }
    if (memberToUpdate.role === TeamRole.OWNER) {
      throw new Error("Cannot change owner's role")
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
  }

  private static async generateUniqueSlug(name: string) {
    const baseSlug = name
      .toLowerCase()
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