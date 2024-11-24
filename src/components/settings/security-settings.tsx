'use client';

import {useState } from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {Button } from '@/components/ui/button';
import {Input } from '@/components/ui/input';
import {Label } from '@/components/ui/label';
import {Switch } from '@/components/ui/switch';
import {useToast } from '@/components/ui/use-toast';
import {Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {Shield, Key, Smartphone } from 'lucide-react';

export function SecuritySettings() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const { toast } = useToast();

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Add your password change logic here
      toast({
        title: 'Password updated',
        description: 'Your password has been changed successfully.',
      });
      setShowPasswordDialog(false);
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to update password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handle2FAToggle = async (enabled: boolean) => {
    try {
      // Add your 2FA toggle logic here
      setIs2FAEnabled(enabled);
      toast({
        title: enabled ? '2FA Enabled' : '2FA Disabled',
        description: enabled
          ? 'Two-factor authentication has been enabled.'
          : 'Two-factor authentication has been disabled.',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to update 2FA settings.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your account security settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Password Change */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <Label>Password</Label>
              </div>
              <p className="text-sm text-muted-foreground">Change your account password</p>
            </div>
            <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
              Change Password
            </Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-4 w-4" />
                <Label>Two-Factor Authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch checked={is2FAEnabled} onCheckedChange={handle2FAToggle} />
          </div>
        </div>

        {/* API Access */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <Label>API Access</Label>
              </div>
              <p className="text-sm text-muted-foreground">Manage API keys and access tokens</p>
            </div>
            <Button variant="outline">Manage Keys</Button>
          </div>
        </div>
      </CardContent>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your current password and choose a new one</DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" required placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" required placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input id="confirm" type="password" required placeholder="Confirm new password" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Change Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
