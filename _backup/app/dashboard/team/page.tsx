'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MoreVertical, UserPlus, Settings, Users, Trash } from 'lucide-react';
import { useTeam } from '@/hooks/use-team';
import { CreateTeamDialog } from '@/components/team/create-team-dialog';
import { InviteMemberDialog } from '@/components/team/invite-member-dialog';
import { RoleManager } from '@/components/team/role-manager';
import { cn } from '@/lib/utils';

export default function TeamPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [managingMember, setManagingMember] = useState<{
    action: 'remove' | 'change-role';
    member: any;
  } | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { team, members, teamUsage, isLoading, mutate } = useTeam();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Create your team</h2>
            <p className="mb-6 text-muted-foreground">
              Start collaborating with your team members by creating a team.
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Users className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </CardContent>
        </Card>

        <CreateTeamDialog
          open={isCreating}
          onOpenChange={setIsCreating}
          onSubmit={async (data) => {
            try {
              const response = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
              });

              if (!response.ok) throw new Error();

              toast({
                title: 'Team created',
                description: 'Your team has been created successfully.',
              });

              mutate();
            } catch (error) {
              toast({
                title: 'Error',
                description: 'Failed to create team.',
                variant: 'destructive',
              });
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">Manage your team members and settings</p>
        </div>
        <div className="flex gap-4">
          <Button onClick={() => setIsInviting(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
          <Button variant="outline" onClick={() => router.push(`/team/${team.slug}/settings`)}>
            <Settings className="mr-2 h-4 w-4" />
            Team Settings
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.user.name}</TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">{member.role.toLowerCase()}</span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                        {
                          'bg-green-100 text-green-700': member.status === 'ACTIVE',
                          'bg-yellow-100 text-yellow-700': member.status === 'PENDING',
                          'bg-red-100 text-red-700': member.status === 'SUSPENDED',
                        }
                      )}
                    >
                      {member.status.toLowerCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            setManagingMember({
                              action: 'change-role',
                              member,
                            })
                          }
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Change Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() =>
                            setManagingMember({
                              action: 'remove',
                              member,
                            })
                          }
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InviteMemberDialog
        open={isInviting}
        onOpenChange={setIsInviting}
        teamId={team.id}
        onSubmit={async (data) => {
          try {
            const response = await fetch(`/api/teams/${team.id}/members`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error();

            toast({
              title: 'Invitation sent',
              description: 'Team member has been invited successfully.',
            });

            mutate();
          } catch (error) {
            toast({
              title: 'Error',
              description: 'Failed to invite team member.',
              variant: 'destructive',
            });
          }
        }}
      />

      {managingMember?.action === 'change-role' && (
        <RoleManager
          open={true}
          onOpenChange={() => setManagingMember(null)}
          teamId={team.id}
          memberId={managingMember.member.id}
          currentRole={managingMember.member.role}
          memberName={managingMember.member.user.name}
          onSuccess={mutate}
        />
      )}

      <AlertDialog open={managingMember?.action === 'remove'}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove team member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this team member? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setManagingMember(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                try {
                  const response = await fetch(
                    `/api/teams/${team.id}/members?memberId=${managingMember?.member.id}`,
                    { method: 'DELETE' }
                  );

                  if (!response.ok) throw new Error();

                  toast({
                    title: 'Member removed',
                    description: 'Team member has been removed successfully.',
                  });

                  mutate();
                } catch (error) {
                  toast({
                    title: 'Error',
                    description: 'Failed to remove team member.',
                    variant: 'destructive',
                  });
                } finally {
                  setManagingMember(null);
                }
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
