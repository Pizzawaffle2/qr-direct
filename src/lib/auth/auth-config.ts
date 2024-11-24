import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { MAX_LOGIN_ATTEMPTS, LOCK_TIME_MINUTES } from "@/constants/auth";
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_TIER, USER_ROLE } from "@/constants/enums";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize providers array
const providers: any[] = [
  CredentialsProvider({
    id: "credentials",
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials): Promise<any> {
      if (!credentials?.email || !credentials?.password) {
        throw new Error("Please enter your email and password");
      }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            settings: true,
          }
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const remainingMinutes = Math.ceil(
            (user.lockedUntil.getTime() - Date.now()) / (1000 * 60)
          );
          throw new Error(
            `Account is locked. Please try again in ${remainingMinutes} minutes`
          );
        }

        if (!user.password) {
          throw new Error("Please sign in with your OAuth provider");
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          // Increment failed login attempts
          const updatedFailedAttempts = (user.failedLoginAttempts || 0) + 1;
          const shouldLock = updatedFailedAttempts >= MAX_LOGIN_ATTEMPTS;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: updatedFailedAttempts,
              lockedUntil: shouldLock 
                ? new Date(Date.now() + LOCK_TIME_MINUTES * 60 * 1000)
                : null,
            },
          });

          if (shouldLock) {
            throw new Error(
              `Too many failed attempts. Account locked for ${LOCK_TIME_MINUTES} minutes`
            );
          }

          throw new Error(
            `Invalid password. ${MAX_LOGIN_ATTEMPTS - updatedFailedAttempts} attempts remaining`
          );
        }

        // Reset failed attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role as USER_ROLE,
          username: user.username,
          subscriptionStatus: user.subscriptionStatus || SUBSCRIPTION_STATUS.INACTIVE,
          subscriptionTier: user.subscriptionTier || SUBSCRIPTION_TIER.FREE,
        };
    }
  })
];

// Add Google Provider
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  );
}

// Add GitHub Provider
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent"
        }
      }
    })
  );
}

// Add LinkedIn Provider
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  providers.push(
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      authorization: {
        params: { scope: 'openid profile email' }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: USER_ROLE.USER,
          subscriptionStatus: SUBSCRIPTION_STATUS.INACTIVE
        };
      }
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.role = (token.role || USER_ROLE.USER) as USER_ROLE;
        session.user.subscriptionStatus = token.subscriptionStatus as keyof typeof SUBSCRIPTION_STATUS;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || USER_ROLE.USER;
        token.subscriptionStatus = user.subscriptionStatus || SUBSCRIPTION_STATUS.INACTIVE;
      }
      return token;
    },
    async signIn({ user }) {
      if (!user?.email) {
        return false;
      }

      if (process.env.RESEND_FROM_EMAIL && user.email) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL,
            to: user.email,
            subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || 'our app'}`,
            html: `<p>Welcome! We're glad to have you.</p>`
          });
        } catch (error: any) {
          console.error('Failed to send welcome email:', error);
        }
      }
      return true;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
};