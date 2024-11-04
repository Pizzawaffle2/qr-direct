import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components"

interface TeamInvitationEmailProps {
  invitationUrl: string
  teamName: string
  inviterName: string
}

export function TeamInvitationEmail({
  invitationUrl,
  teamName,
  inviterName,
}: TeamInvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Join {teamName} on QR Direct</Preview>
      <Body style={{
        backgroundColor: "#f3f4f6",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
      }}>
        <Container style={{
          padding: "2rem",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          maxWidth: "36rem",
          marginTop: "2rem",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        }}>
          <Heading style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            textAlign: "center",
            color: "#111827",
          }}>
            You've been invited to join a team
          </Heading>
          <Text style={{ fontSize: "1rem", color: "#4b5563" }}>
            {inviterName} has invited you to join {teamName} on QR Direct.
          </Text>
          <Section style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
              href={invitationUrl}
              style={{
                backgroundColor: "#3b82f6",
                color: "#ffffff",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Join Team
            </Button>
          </Section>
          <Text style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            This invitation will expire in 7 days. If you did not expect this invitation,
            you can safely ignore this email.
          </Text>
          <Text style={{ fontSize: "0.875rem", color: "#6b7280" }}>
            Or copy and paste this URL into your browser:
            <br />
            <Link
              href={invitationUrl}
              style={{ color: "#3b82f6", textDecoration: "none" }}
            >
              {invitationUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}