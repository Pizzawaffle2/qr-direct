// File: src/emails/password-reset-email.tsx
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  
  interface PasswordResetEmailProps {
    resetUrl: string;
  }
  
  export function PasswordResetEmail({ resetUrl }: PasswordResetEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>Reset your QR Direct password</Preview>
        <Body style={{
          backgroundColor: '#f3f4f6',
          fontFamily: 'Arial, sans-serif',
        }}>
          <Container style={{
            margin: '40px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            maxWidth: '600px',
          }}>
            <Heading style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '24px',
              textAlign: 'center',
            }}>
              Reset your password
            </Heading>
            <Text style={{
              fontSize: '16px',
              color: '#4b5563',
              lineHeight: '24px',
            }}>
              We received a request to reset your password. Click the button below to choose a new password.
            </Text>
            <Section style={{
              textAlign: 'center',
              margin: '32px 0',
            }}>
              <Button
                href={resetUrl}
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                Reset Password
              </Button>
            </Section>
            <Text style={{
              fontSize: '14px',
              color: '#6b7280',
            }}>
              If you didn't request a password reset, you can safely ignore this email.
            </Text>
            <Text style={{
              fontSize: '14px',
              color: '#6b7280',
            }}>
              Or copy and paste this URL into your browser:
              <br />
              <span style={{ color: '#3b82f6' }}>{resetUrl}</span>
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }