// File: src/emails/verification-email.tsx
import {Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  verificationUrl: string;
}

export function VerificationEmail({ verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email address for QR Direct</Preview>
      <Body
        style={{
          backgroundColor: '#f3f4f6',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Container
          style={{
            margin: '40px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            maxWidth: '600px',
          }}
        >
          <Text
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Verify your email address
          </Text>
          <Text
            style={{
              fontSize: '16px',
              color: '#4b5563',
              lineHeight: '24px',
            }}
          >
            Thanks for signing up for QR Direct! Please verify your email address by clicking the
            button below.
          </Text>
          <Section
            style={{
              textAlign: 'center',
              margin: '32px 0',
            }}
          >
            <Button
              href={verificationUrl}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              Verify Email Address
            </Button>
          </Section>
          <Text
            style={{
              fontSize: '14px',
              color: '#6b7280',
            }}
          >
            If you didn't sign up for QR Direct, you can safely ignore this email.
          </Text>
          <Text
            style={{
              fontSize: '14px',
              color: '#6b7280',
            }}
          >
            Or copy and paste this URL into your browser:
            <br />
            <span style={{ color: '#3b82f6' }}>{verificationUrl}</span>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
