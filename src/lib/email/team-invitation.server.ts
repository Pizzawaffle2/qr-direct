// src/lib/email/team-invitation.server.ts
import { render } from '@react-email/render';
import React from 'react';
import { sendEmail } from '@/lib/email/send-email';
import { TeamInvitationEmail } from '@/emails/team-invitation-email';
import { ApiError } from '@/lib/errors';

interface TeamInvitationParams {
  email: string;
  teamName: string;
  invitationId: string;
  inviterName: string;
}

interface TeamInvitationContent {
  teamName: string;
  invitationUrl: string;
  inviterName: string;
}

/**
 * Generates the invitation URL for team invitations
 */
const generateInvitationUrl = (invitationId: string): string => {
  const baseUrl = process.env.NEXTAUTH_URL;
  if (!baseUrl) {
    throw new Error('NEXTAUTH_URL environment variable is not set');
  }
  return `${baseUrl}/team-invitation?invitationId=${encodeURIComponent(invitationId)}`;
};

/**
 * Renders the team invitation email content
 */
const renderEmailContent = (params: TeamInvitationContent): string => {
  try {
    return render(React.createElement(TeamInvitationEmail, params));
  } catch (error) {
    throw new ApiError('Failed to render team invitation email', 500, error instanceof Error ? error.message : undefined);
  }
};

/**
 * Sends a team invitation email to the specified recipient
 */
export async function sendTeamInvitation({
  email,
  teamName,
  invitationId,
  inviterName,
}: TeamInvitationParams): Promise<void> {
  try {
    const invitationUrl = generateInvitationUrl(invitationId);
    
    const emailContent = renderEmailContent({
      teamName,
      invitationUrl,
      inviterName,
    });

    await sendEmail({
      to: email,
      subject: `You're invited to join ${teamName} on QR Direct`,
      html: emailContent,
    });
  } catch (error) {
    console.error('Failed to send team invitation:', error);
    throw new ApiError('Failed to send team invitation email', 500);
  }
}
