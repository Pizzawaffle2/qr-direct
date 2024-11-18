'use client';

import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cog, LogOut } from 'lucide-react';
import Link from 'next/link';

interface ExtendedUser extends User {
  subscriptionTier?: string | null;
  subscriptionStatus: 'active' | 'inactive';
}

interface ProfileProps {
  user: ExtendedUser;
}

const getInitials = (name: string | null | undefined): string => 
  name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

const SubscriptionBadge = ({ status, tier }: { status: string; tier?: string | null }) => (
  <>
    {tier && (
      <Badge variant="secondary" className="ml-2">
        {tier}
      </Badge>
    )}
    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
      {status === 'active' ? 'Active' : 'Inactive'}
    </Badge>
  </>
);

const ProfileHeader = ({ user }: { user: ExtendedUser }) => (
  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
    <Avatar className="h-16 w-16">
      <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
    <div>
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">{user.name}</h2>
        {user.subscriptionTier && (
          <Badge variant="secondary" className="ml-2">
            {user.subscriptionTier}
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </div>
  </CardHeader>
);

const ProfileContent = ({ user }: { user: ExtendedUser }) => (
  <CardContent className="space-y-4">
    <div className="space-y-1">
      <p className="text-sm font-medium">Subscription Status</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">
          {user.subscriptionStatus || 'Free Plan'}
        </p>
        <SubscriptionBadge status={user.subscriptionStatus} tier={user.subscriptionTier} />
      </div>
    </div>
  </CardContent>
);

const ProfileFooter = () => {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <CardFooter className="flex justify-between">
      <Button variant="outline" size="sm" asChild>
        <Link href="/settings">
          <Cog className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleSignOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </CardFooter>
  );
};

export function Profile({ user }: ProfileProps) {
  return (
    <Card className="w-full">
      <ProfileHeader user={user} />
      <ProfileContent user={user} />
      <ProfileFooter />
    </Card>
  );
}
