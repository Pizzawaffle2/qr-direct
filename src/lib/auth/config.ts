import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
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
    async signIn({ user, account, profile }) {
      try {
        if (!user.email) {
          return false;
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new user with default settings
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              emailVerified: new Date(),
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
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;

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
          token.id = dbUser.id;
          token.subscriptionStatus = dbUser.subscriptionStatus;
          token.subscriptionTier = dbUser.subscriptionTier;
          token.emailVerified = dbUser.emailVerified;
        }
      }
      return token;
    },

    async session({ session, token, user }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.subscriptionStatus = token.subscriptionStatus as string;
        session.user.subscriptionTier = token.subscriptionTier as string;
        session.user.emailVerified = Boolean(token.emailVerified);
      }
      return session;
    },
  },

  events: {
    async signIn({ user, account, isNewUser }) {
      try {
        if (isNewUser) {
          await prisma.usage.create({
            data: {
              userId: user.id,
              period: new Date(),
            },
          });
        }
      } catch (error) {
        console.error("Event error:", error);
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
};