// src/components/settings/profile-settings.tsx
'use client';

enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TRIAL = 'TRIAL',
}

import {User as NextAuthUser } from 'next-auth';
import {useForm } from 'react-hook-form';
import {zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {Button } from '@/components/ui/button';
import {Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input } from '@/components/ui/input';
import {Textarea } from '@/components/ui/textarea';
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {useState } from 'react';
import {useToast } from '@/components/ui/use-toast';

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(30, { message: 'Name must not be longer than 30 characters.' }),
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' })
    .max(30, { message: 'Username must not be longer than 30 characters.' }),
  bio: z.string().max(160).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface User {
  id: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  lastLoginAt: Date; // Ensure this property is included
}
interface ProfileSettingsProps {
  user: User;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      username: user.email?.split('@')[0] || '',
      bio: '',
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive&apos;,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name">Name</label>
          <Input id="name" type="text" defaultValue={user.name || &apos;'} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email">Email</label>
          <Input id="email" type="email" defaultValue={user.email || ''} />
        </div>
        <Button type="submit">Save Changes</Button>
      </CardContent>
    </Card>
  );
}
