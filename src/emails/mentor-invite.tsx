import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Preview,
} from "@react-email/components";

interface MentorInviteEmailProps {
    name: string;
    signInUrl?: string;
}

/**
 * Sent when an admin creates a mentor account directly (single form or CSV
 * import) — distinct from ApplicationApprovedEmail, which implies the
 * recipient went through the public application flow.
 */
export function MentorInviteEmail({
    name,
    signInUrl = "https://01x.in/login",
}: MentorInviteEmailProps) {
    return (
        <Html>
            <Head />
            <Preview>You&apos;ve been added as a mentor on 01X!</Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Text style={headingStyle}>Welcome to 01X! 🎉</Text>
                    <Text style={textStyle}>Hi {name},</Text>
                    <Text style={textStyle}>
                        You&apos;ve been added as a <strong>Mentor</strong> on 01X by our team.
                    </Text>
                    <Text style={textStyle}>
                        You now have access to the 01X dashboard where you can manage your
                        profile, connect with mentees, and track their projects.
                    </Text>
                    <Section style={buttonContainerStyle}>
                        <Button style={buttonStyle} href={signInUrl}>
                            Sign In to Dashboard
                        </Button>
                    </Section>
                    <Hr style={hrStyle} />
                    <Text style={footerStyle}>
                        If you weren&apos;t expecting this, please reach out to us at hello@01x.in.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

export default MentorInviteEmail;

// Styles
const bodyStyle = {
    backgroundColor: "#f6f9fc",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
};

const containerStyle = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "40px 20px",
    maxWidth: "560px",
    borderRadius: "8px",
};

const headingStyle = {
    fontSize: "24px",
    fontWeight: "600" as const,
    color: "#0a0a0a",
    marginBottom: "24px",
};

const textStyle = {
    fontSize: "16px",
    lineHeight: "26px",
    color: "#374151",
};

const buttonContainerStyle = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const buttonStyle = {
    backgroundColor: "#0a0a0a",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600" as const,
    textDecoration: "none",
    textAlign: "center" as const,
    padding: "12px 24px",
};

const hrStyle = {
    borderColor: "#e5e7eb",
    margin: "32px 0",
};

const footerStyle = {
    fontSize: "13px",
    color: "#9ca3af",
};
