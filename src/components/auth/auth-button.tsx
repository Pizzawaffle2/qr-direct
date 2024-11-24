'use client';

import {signIn } from 'next-auth/react';
import {Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface AuthButtonProps {
  provider: string;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: 'default' | 'outline';
  callbackUrl?: string;
}

export function AuthButton({
  provider,
  icon: Icon,
  children,
  variant = 'default',
  callbackUrl = '/',
}: AuthButtonProps) {
  const handleClick = async () => {
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <Button variant={variant} className="w-full" onClick={handleClick}>
      <Icon className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
}
