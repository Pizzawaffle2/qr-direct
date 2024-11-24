'use client';

import {useState } from 'react';
import {TeamRole } from '@prisma/client';
import {Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button } from '@/components/ui/button';
import {useToast } from '@/components/ui/use-toast';
import {Shield, ShieldAlert, ShieldCheck, User } from 'lucide-react';

interface RoleManagerProps {
  teamId: string;
  memberId: string;
  currentRole: TeamRole;
  memberName: string;
  onSuccess?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roleIcons = {
  OWNER: ShieldAlert,
  ADMIN: ShieldCheck,
  MEMBER: Shield,
  VIEWER: User,
};

const roleDescriptions = {
  ADMIN: 'Can manage team members and settings',
  MEMBER: 'Can create and manage QR codes',
  VIEWER: 'Can view QR codes and analytics',
};

export function RoleManager({
  teamId,
  memberId,
  currentRole,
  memberName,
  onSuccess,
  open,
  onOpenChange,
}: RoleManagerProps) {
  const [role, setRole] = useState<TeamRole>(currentRole);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpdateRole = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/teams/${teamId}/members`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, role }),
      });

      if (!response.ok) throw new Error('Failed to update role');

      toast({
        title: 'Role updated',
        description: `${memberName}'s role has been updated to ${role.toLowerCase()}.`,
      });

      onSuccess?.();
      onOpenChange(false);
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to update role. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change member role</DialogTitle>
          <DialogDescription>Change the role and permissions for {memberName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Select value={role} onValueChange={(value) => setRole(value as TeamRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleDescriptions).map(([key, description]) => {
                const Icon = roleIcons[key as keyof typeof roleIcons];
                return (
                  <SelectItem key={key} value={key} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span className="capitalize">{key.toLowerCase()}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{description}</span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={handleUpdateRole} disabled={isLoading || role === currentRole}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
