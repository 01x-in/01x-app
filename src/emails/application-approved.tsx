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

interface ApplicationApprovedEmailProps {
    name: string;
    role: "member" | "mentor";
    signInUrl?: string;
}

export function ApplicationApprovedEmail({
    name,
    role,
    signInUrl = "https://01x.in/login",
}: ApplicationApprovedEmailProps) {
    const roleLabel = role === "mentor" ? "Mentor" : "Cohort Member";

    return (
        <Html>
            <Head />
            <Preview>Welcome to 01X — Your application has been approved!</Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Text style={headingStyle}>Welcome to 01X! 🎉</Text>
                    <Text style={textStyle}>Hi {name},</Text>
                    <Text style={textStyle}>
                        Great news — your application to join 01X as a <strong>{roleLabel}</strong> has been approved!
                    </Text>
                    <Text style={textStyle}>
                        You now have access to the 01X dashboard where you can manage your
                        profile, {role === "mentor" ? "connect with mentees, and track their projects" : "work on projects, connect with mentors, and stay on top of your cohort schedule"}.
                    </Text>
                    <Section style={buttonContainerStyle}>
                        <Button style={buttonStyle} href={signInUrl}>
                            Sign In to Dashboard
                        </Button>
                    </Section>
                    <Hr style={hrStyle} />
                    <Text style={footerStyle}>
                        If you didn&apos;t apply to 01X, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

export default ApplicationApprovedEmail;

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
