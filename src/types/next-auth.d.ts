import 'next-auth';
import { DefaultSession, DefaultUser } from 'next-auth';

interface User extends DefaultUser {
  subscriptionTier?: string | null;
  subscriptionStatus?: 'active' | 'inactive' | null;
}

declare module 'next-auth' {
  interface User extends IUser {}
  
  interface Session {
    user: IUser & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends IUser {}
}