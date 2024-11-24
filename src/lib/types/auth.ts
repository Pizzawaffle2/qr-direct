// types/auth.ts
import {Session, User } from 'next-auth';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface CustomSession extends Session {
  user: Session['user'] & {
    id: string;
    role: UserRole; // Use enum instead of string
    stripeCustomerId: string | null;
  };
}

export interface CustomToken {
  sub: string;
  role: UserRole; // Use enum instead of string
  stripeCustomerId: string | null;
}
