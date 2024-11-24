// types/next-auth.d.ts
import {User as NextAuthUser } from 'next-auth';
import {USER_ROLE, SUBSCRIPTION_STATUS, SUBSCRIPTION_TIER } from '@/constants/auth';

declare module 'next-auth' {
  interface User extends NextAuthUser {
    role: keyof typeof USER_ROLE;
    username?: string | null;
    subscriptionStatus: keyof typeof SUBSCRIPTION_STATUS;
    subscriptionTier: keyof typeof SUBSCRIPTION_TIER;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: keyof typeof USER_ROLE;
    username?: string | null;
    subscriptionStatus: keyof typeof SUBSCRIPTION_STATUS;
    subscriptionTier: keyof typeof SUBSCRIPTION_TIER;
  }
}
