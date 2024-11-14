'use client';

import { User } from 'next-auth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cog, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface ProfileProps {
  user: User & {
    subscriptionTier?: string | null;
    subscriptionStatus?: 'active' | 'inactive' | null;
  };
}

export function Profile({ user }: ProfileProps) {
  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || '?';

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image || undefined} alt={user.name || 'User'} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{user.name}</h2>
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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Subscription Status</p>
            <p className="text-sm text-muted-foreground">
              {user.subscriptionStatus || 'Free Plan'}
            </p>
          </div>
          <Badge
            variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}
          >
            {user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
          </Badge>
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
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}