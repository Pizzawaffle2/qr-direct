// src\app\api\auth\[...nextauth].ts

import NextAuth, { type NextAuthOptions, DefaultSession, Session } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
// import LinkedInProvider from "next-auth/providers/linkedin"
import {PrismaAdapter } from '@next-auth/prisma-adapter';
import {prisma } from '@/lib/db/prisma';
import {JWT } from 'next-auth/jwt';
import {UserRole, SubscriptionStatus, SubscriptionTier } from '@/types/user';
import {USER_ROLE, SUBSCRIPTION_STATUS, SUBSCRIPTION_TIER } from '@/constants/user';
import EmailProvider from 'next-auth/providers/email';

// Extended User type with additional safety features
interface ExtendedUser {
  id: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string | null;
  subscriptionTier?: SubscriptionTier;
  emailVerified?: Date | null;
  lastLogin?: Date;
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
}

// Type extensions
declare module 'next-auth' {
  interface User extends ExtendedUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      subscriptionStatus: SubscriptionStatus;
      subscriptionTier?: SubscriptionTier;
      stripeCustomerId?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    subscriptionStatus: SubscriptionStatus;
    stripeCustomerId?: string | null;
    subscriptionTier?: SubscriptionTier | null;
    emailVerified?: Date | null;
    iat: number;
    exp: number;
  }
}

// Enhanced helper functions with error handling and logging
const getUserData = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        stripeCustomerId: true,
        subscriptionStatus: true,
        subscriptionTier: true,
        role: true,
        emailVerified: true,
        lastLoginAt: true,
        lockedUntil: true,
        failedLoginAttempts: true,
      },
    });

    if (!user) {
      console.warn(`User not found: ${userId}`);
      return null;
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      console.warn(`Account locked for user: ${userId}`);
      throw new Error('Account is temporarily locked');
    }
    return user;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};
const getDefaultUserData = () => ({
  role: USER_ROLE.USER,
  subscriptionStatus: SUBSCRIPTION_STATUS.INACTIVE,
  subscriptionTier: SUBSCRIPTION_TIER.FREE,
  stripeCustomerId: null,
  failedLoginAttempts: 0,
  lockedUntil: null,
});

// Enhanced auth configuration with additional security measures
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
        secure: process.env.NODE_ENV === 'production',
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Check if email is verified for email provider
        if (account?.provider === 'email' && !user.emailVerified) {
          return false;
        }

        // Update last login time
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return true;
      } catch (error) {
        console.error('Sign in callback error:', error);
        return false;
      }
    },

    async jwt({ token, user, account }): Promise<JWT> {
      try {
        // Initial sign in
        if (account && user) {
          const extendedUser = user as unknown as ExtendedUser;
          return {
            ...token,
            id: extendedUser.id,
            role: extendedUser.role,
            stripeCustomerId: extendedUser.stripeCustomerId,
            subscriptionStatus: extendedUser.subscriptionStatus,
            subscriptionTier: extendedUser.subscriptionTier,
            emailVerified: extendedUser.emailVerified,
          };
        }

        // Subsequent calls
        const userData = await getUserData(token.sub!);

        if (userData) {
          return {
            ...token,
            role: userData.role as UserRole,
            stripeCustomerId: userData.stripeCustomerId,
            subscriptionStatus: userData.subscriptionStatus as SubscriptionStatus,
            subscriptionTier: userData.subscriptionTier as SubscriptionTier,
            emailVerified: userData.emailVerified,
            id: token.sub || '',
          };
        }
      } catch (error) {
        console.error('JWT callback error:', error);
      }
      return {
        ...token,
        ...getDefaultUserData(),
        role: USER_ROLE.USER as UserRole,
        subscriptionStatus: SUBSCRIPTION_STATUS.INACTIVE as SubscriptionStatus,
        subscriptionTier: SUBSCRIPTION_TIER.FREE as SubscriptionTier,
        stripeCustomerId: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      };
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
    newUser: '/auth/new-user',
  },

  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',

  events: {
    async signIn({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
          lockedUntil: null,
        },
      });
    },
    async signOut() {
      // Clean up any necessary session data
    },
  },
};

export default NextAuth(authOptions);
