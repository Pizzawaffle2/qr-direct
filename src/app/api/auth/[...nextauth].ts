import NextAuth, { type NextAuthOptions, DefaultSession, Session } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import LinkedInProvider from "next-auth/providers/linkedin"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/db/prisma"
import { JWT } from "next-auth/jwt"

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      subscriptionStatus: SubscriptionStatus
      // Extend this with any other user properties you need
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: UserRole
    subscriptionStatus: SubscriptionStatus
    lastLoginAt: Date
    // Add other user properties here
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    subscriptionStatus: SubscriptionStatus
    // Add other token properties here
  }
}

// Enums for type safety
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR"
}

export enum SubscriptionStatus {
  FREE = "FREE",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE"
}

export enum AuthProvider {
  GOOGLE = "google",
  GITHUB = "github",
  LINKEDIN = "linkedin"
}

// Type for provider-specific profile data
interface ProviderProfile {
  provider: AuthProvider
  providerId: string
  email: string
  name?: string
  image?: string
  metadata?: Record<string, any>
}

/**
 * Configuration options for NextAuth
 */
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
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    })
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      try {
        // Initial sign in
        if (account && user) {
          token.id = user.id
          token.role = user.role
          token.subscriptionStatus = user.subscriptionStatus
          
          // Update last login timestamp
          await prisma.user.update({
            data: { lastLoginAt: new Date() }
          })
        }

        // Return previous token if it hasn't expired
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },

    async session({ session, token }): Promise<Session> {
      try {
        if (session.user) {
          session.user.id = token.id
          session.user.role = token.role
          session.user.subscriptionStatus = token.subscriptionStatus
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },

    async signIn({ user, account, profile }): Promise<boolean> {
      try {
        if (!user.email) {
          throw new Error('Email is required for authentication')
        }

        const providerData: ProviderProfile = {
          provider: account?.provider as AuthProvider,
          providerId: profile?.sub || '',
          email: user.email,
          name: user.name || '',
          image: user.image || '',
          metadata: profile
        }

        // Update or create user with provider data
        await updateUserProfile(user.email, providerData)

        return true
      } catch (error) {
        console.error('Sign in callback error:', error)
        await logAuthError(user.email ?? null, account?.provider, error)
        return false
      }
    }
  },

  events: {
    async signIn({ user, account, isNewUser }) {
        await prisma.userActivity.create({
          data: {
            userId: user.id,
            type: isNewUser ? 'SIGN_UP' : 'SIGN_IN',
            provider: account?.provider,
            metadata: {
              isNewUser,
              userAgent: process.env.USER_AGENT,
              timestamp: new Date()
            }
          }
        })
      } catch (error: any) {
        console.error('Sign in event error:', error)
      }
    },

    async signOut({ token }: { token: JWT }) {
      try {
        await prisma.userActivity.create({
          data: {
            userId: token.id,
            type: 'SIGN_OUT',
            metadata: {
              timestamp: new Date()
            }
          }
        })
      } catch (error: any) {
        console.error('Sign out event error:', error)
      }
    }
  },

  debug: process.env.NODE_ENV === 'development'
}

/**
 * Helper function to update user profile
 */
async function updateUserProfile(email: string, providerData: ProviderProfile): Promise<void> {
  await prisma.user.upsert({
    where: { email },
    update: {
      name: providerData.name,
      image: providerData.image,
      role: UserRole.USER,
      subscriptionStatus: SubscriptionStatus.FREE,
      email: providerData.email,
      name: providerData.name,
      image: providerData.image,
      emailVerified: new Date(),
    },
    create: {
      email: providerData.email,
      name: providerData.name,
      image: providerData.image,
      emailVerified: new Date(),
      role: UserRole.USER,
      subscriptionStatus: SubscriptionStatus.FREE,
      profile: {
        create: {
          provider: providerData.provider,
          providerId: providerData.providerId,
          metadata: providerData.metadata
        }
      }
    }
  })
}

/**
 * Helper function to log authentication errors
 */
async function logAuthError(email: string | null, provider: string | undefined, error: unknown): Promise<void> {
  console.error(`Auth error for ${email} with provider ${provider}:`, error)
}

// Create and export the auth handler
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
