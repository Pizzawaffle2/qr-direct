"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import {
  Loader2,
  MoreVertical,
  UserPlus,
  Settings,
  Users,
  CreditCard,
} from "lucide-react"
import { TeamRole, TeamMemberStatus } from "@prisma/client"
import { CreateTeamDialog } from "@/components/team/create-team-dialog"
import { InviteMemberDialog } from "@/components/team/invite-member-dialog"
import { useTeam } from "@/hooks/use-team"

export default function TeamPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [isInviting, setIsInviting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { team, members, isLoading, mutate } = useTeam()

  const handleCreateTeam = async (data: { name: string }) => {
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to create team")

      const newTeam = await response.json()
      setIsCreating(false)
      router.push(`/team/${newTeam.slug}`)
      
      toast({
        title: "Team created",
        description: `${newTeam.name} has been created successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInviteMember = async (data: {
    email: string
    role: TeamRole
  }) => {
    try {
      const response = await fetch(`/api/teams/${team?.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to invite member")

      setIsInviting(false)
      mutate()
      
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${data.email}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!team) {
    return (
      <div className="container max-w-6xl py-8">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Create your team</h2>
          <p className="text-muted-foreground mb-6">
            Start collaborating with your team members by creating a team.
          </p>
          <Button onClick={() => setIsCreating(true)}>
            <Users className="h-4 w-4 mr-2" />
            Create Team
          </Button>
        </Card>

        <CreateTeamDialog
          open={isCreating}
          onOpenChange={setIsCreating}
          onSubmit={handleCreateTeam}
        />
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">
            Manage your team members and settings
          </p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setIsInviting(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
          <Button variant="outline" onClick={() => router.push(`/team/${team.slug}/settings`)}>
            <Settings className="h-4 w-4 mr-2" />
            Team Settings
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Members</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.user.name}</TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">{member.role.toLowerCase()}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0 rounded-full text-xs font-medium",
{
  "bg-green-100 text-green-700": member.status === "ACTIVE",
  "bg-yellow-100 text-yellow-700": member.status === "PENDING",
  "bg-red-100 text-red-700": member.status === "SUSPENDED",
}
)}>
  {member.status.toLowerCase()}
</span>
</TableCell>
<TableCell>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreVertical className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {team.ownerId === member.userId ? (
        <DropdownMenuItem
          onSelect={() => router.push(`/team/${team.slug}/billing`)}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Manage Billing
        </DropdownMenuItem>
      ) : (
        <>
          {canManageMembers && (
            <>
              <DropdownMenuItem
                onSelect={() => setManagingMember({
                  action: 'change-role',
                  member
                })}
              >
                <Settings className="h-4 w-4 mr-2" />
                Change Role
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onSelect={() => setManagingMember({
                  action: 'remove',
                  member
                })}
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </>
          )}
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</div>
</Card>

{/* Usage Section */}
<Card>
  <div className="p-6">
    <h2 className="text-xl font-semibold mb-4">Team Usage</h2>
    <div className="grid gap-6 md:grid-cols-3">
      <div>
        <p className="text-sm text-muted-foreground">Members</p>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold">
            {members.filter(m => m.status === "ACTIVE").length}
          </p>
          <p className="ml-2 text-sm text-muted-foreground">
            / {team.subscription?.maxSeats || 5}
          </p>
        </div>
        <div className="mt-2 w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all"
            style={{
              width: `${(members.filter(m => m.status === "ACTIVE").length / (team.subscription?.maxSeats || 5)) * 100}%`
            }}
          />
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">QR Codes Created</p>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold">{teamUsage?.qrCodesCreated || 0}</p>
          <p className="ml-2 text-sm text-muted-foreground">
            this month
          </p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {plan.limits.qrCodes === -1 ? 'Unlimited' : `${plan.limits.qrCodes.toLocaleString()} limit`}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Storage Used</p>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold">
            {formatBytes(teamUsage?.storage || 0)}
          </p>
          <p className="ml-2 text-sm text-muted-foreground">
            / {plan.limits.storage === -1 ? '∞' : formatBytes(plan.limits.storage * 1024 * 1024)}
          </p>
        </div>
        <div className="mt-2 w-full bg-secondary h-2 rounded-full overflow-hidden">
          <div
            className="bg-primary h-full transition-all"
            style={{
              width: plan.limits.storage === -1 ? '0%' :
                `${((teamUsage?.storage || 0) / (plan.limits.storage * 1024 * 1024)) * 100}%`
            }}
          />
        </div>
      </div>
    </div>
  </div>
</Card>

{/* Dialogs */}
<CreateTeamDialog
  open={isCreating}
  onOpenChange={setIsCreating}
  onSubmit={handleCreateTeam}
/>

<InviteMemberDialog
  open={isInviting}
  onOpenChange={setIsInviting}
  onSubmit={handleInviteMember}
  remainingSeats={(team.subscription?.maxSeats || 5) - members.filter(m => m.status === "ACTIVE").length}
/>

<AlertDialog open={!!managingMember && managingMember.action === 'remove'}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Remove team member</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to remove {managingMember?.member.user.name} from the team?
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => setManagingMember(null)}>
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        onClick={async () => {
          if (!managingMember) return
          await handleRemoveMember(managingMember.member.id)
          setManagingMember(null)
        }}
        className="bg-red-600 hover:bg-red-700"
      >
        Remove
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

<Dialog 
  open={!!managingMember && managingMember.action === 'change-role'}
  onOpenChange={() => setManagingMember(null)}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Change member role</DialogTitle>
      <DialogDescription>
        Change the role for {managingMember?.member.user.name}
      </DialogDescription>
    </DialogHeader>
    <Select
      value={roleForm.watch('role')}
      onValueChange={(value) => roleForm.setValue('role', value as TeamRole)}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="VIEWER">Viewer</SelectItem>
      </SelectContent>
    </Select>
    <DialogFooter>
      <Button
        onClick={async () => {
          if (!managingMember) return
          await handleChangeRole(
            managingMember.member.id,
            roleForm.getValues('role')
          )
          setManagingMember(null)
        }}
      >
        Save changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
</div>
)
}