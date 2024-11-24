// src/config/teams.ts
export const TEAM_CONFIG = {
  roles: {
    OWNER: {
      name: 'Owner',
      description: 'Full access and team management',
      permissions: ['manage_team', 'manage_billing', 'manage_members', 'manage_qr'],
    },
    ADMIN: {
      name: 'Admin',
      description: 'Can manage team and members',
      permissions: ['manage_members', 'manage_qr'],
    },
    MEMBER: {
      name: 'Member',
      description: 'Can create and manage QR codes',
      permissions: ['manage_qr'],
    },
    VIEWER: {
      name: 'Viewer',
      description: 'Can only view QR codes',
      permissions: ['view_qr'],
    },
  },
  maxInviteExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  maxMembersPlan: {
    free: 1,
    pro: 5,
    enterprise: -1, // unlimited
  },
} as const;
