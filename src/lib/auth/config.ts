import {NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import {PrismaAdapter } from '@next-auth/prisma-adapter';
import {prisma } from '@/lib/db/prisma';

import {SubscriptionStatus, SubscriptionTier } from '@/types/user';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user }) {
      try {
        if (!user.email) {
          return false;
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (!existingUser) {
          // Create new user with default settings
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
              role: 'user', // Add the role property
              settings: {
                create: {
                  theme: 'system',
                  defaultBackgroundColor: '#FFFFFF',
                  defaultForegroundColor: '#000000',
                  errorCorrectionLevel: 'M',
                },
              },
              usage: {
                create: {
                  period: new Date(),
                },
              },
            },
          });
        }

        return true;
      } catch (error: any) {
        console.error('Sign in error:', error);
        return false;
      }
    },

        // Check if user exists
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        // Get user data from database
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            subscriptionStatus: true,
            subscriptionTier: true,
            emailVerified: true,
          },
        });

        if (dbUser) {
          token.subscriptionStatus = dbUser.subscriptionStatus ?? 'DEFAULT_STATUS' as SubscriptionStatus;
          token.subscriptionTier = dbUser.subscriptionTier ?? 'DEFAULT_TIER' as SubscriptionTier;
          token.emailVerified = dbUser.emailVerified ? new Date() : null;
        }
      }
      return token;
    },

    async session({ session, token }: { session: any, token: any }) {
      if (token && session.user) {
        session.user.emailVerified = !!token.emailVerified;
        session.user.subscriptionStatus = token.subscriptionStatus as SubscriptionStatus;
        session.user.subscriptionTier = token.subscriptionTier as SubscriptionTier;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === 'development'
}
