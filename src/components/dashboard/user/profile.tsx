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

function getInitials(name: string | null | undefined): string {
  return name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';
}

export function Profile({ user }: ProfileProps) {
  return (
    <Card className="w-full">
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
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Subscription Status</p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {user.subscriptionStatus || 'Free Plan'}
            </p>
            <Badge
              variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}
            >
              {user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href="/settings">
            <Cog className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            try {
              await signOut({ callbackUrl: '/' });
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}