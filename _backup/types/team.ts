import { TeamRole, TeamMemberStatus } from '@prisma/client';

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamRole;
  status: TeamMemberStatus;
  invitedBy: string;
  invitedAt: Date;
  joinedAt?: Date;
  expiresAt?: Date;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  subscription?: {
    status: string;
    plan: string;
    maxSeats: number;
  };
}

export interface TeamUsage {
  qrCodesCreated: number;
  storage: number;
  period: Date;
}

export interface ManagingMember {
  action: 'remove' | 'change-role';
  member: TeamMember;
}
