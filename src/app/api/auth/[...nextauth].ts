// .../api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import NextAuth from "next-auth";
import { authOptions } from "@/config/auth-config";

export const authOptions: NextAuthOptions = {
  // Configure authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
  ],

  // Custom NextAuth secret
  secret: process.env.NEXTAUTH_SECRET,

  // Custom pages for authentication
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",  // Error code passed in query string as ?error=
  },

  // Session settings
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,  // Session lifetime in seconds (30 days)
  },

  // JWT settings
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    encryption: true,
  },

  // Callbacks to control session and token behavior
  callbacks: {
    async session({ session, token }) {
      // Attach the user's ID from the token to the session
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      // Initial sign in
      if (account && profile) {
        token.sub = profile.id;
      }
      return token;
    },
  },

  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",

  // Custom logging configuration
  logger: {
    error(code, metadata) {
      console.error("next-auth error:", code, metadata);
    },
    warn(code, metadata) {
      console.warn("next-auth warning:", code, metadata);
    },
    debug(code, metadata) {
      console.debug("next-auth debug:", code, metadata);
    },
  },  
};

export default NextAuth(authOptions);
