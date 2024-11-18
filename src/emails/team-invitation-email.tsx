// src/emails/team-invitation-email.tsx
/** @jsxRuntime classic */
/** @jsx jsx */

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import styles from './team-invitation-email.module.css';

interface TeamInvitationEmailProps {
  teamName: string;
  invitationUrl: string;
  inviterName: string;
}

export function TeamInvitationEmail({
  teamName,
  invitationUrl,
  inviterName,
}: TeamInvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Body className={styles.emailBody}>
        <Container className={styles.emailContainer}>
          <Text className={styles.title}>
            You're invited to join {teamName}
          </Text>
          <Text className={styles.description}>
            {inviterName} has invited you to join the team {teamName} on QR
            Direct. Click the button below to accept the invitation.
          </Text>
          <Section className={styles.buttonSection}>
            <Button href={invitationUrl} className={styles.button}>
              Accept Invitation
            </Button>
          </Section>
          <Text className={styles.footer}>
            If you didn't expect this invitation, you can safely ignore this
            email.
          </Text>
          <Text className={styles.footer}>
            Or copy and paste this URL into your browser:
            <br />
            <span className={styles.link}>{invitationUrl}</span>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}