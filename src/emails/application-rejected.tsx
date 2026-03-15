import {
    Html,
    Head,
    Body,
    Container,
    Text,
    Hr,
    Preview,
} from "@react-email/components";

interface ApplicationRejectedEmailProps {
    name: string;
    role: "member" | "mentor";
}

export function ApplicationRejectedEmail({
    name,
    role,
}: ApplicationRejectedEmailProps) {
    const roleLabel = role === "mentor" ? "mentor" : "cohort member";

    return (
        <Html>
            <Head />
            <Preview>Update on your 01X application</Preview>
            <Body style={bodyStyle}>
                <Container style={containerStyle}>
                    <Text style={headingStyle}>Application Update</Text>
                    <Text style={textStyle}>Hi {name},</Text>
                    <Text style={textStyle}>
                        Thank you for your interest in joining 01X as a {roleLabel}. After careful review,
                        we&apos;re unable to approve your application at this time.
                    </Text>
                    <Text style={textStyle}>
                        This doesn&apos;t necessarily mean the door is closed — we encourage you to
                        continue building and re-apply in a future cohort. We&apos;d love to see how
                        you&apos;ve grown.
                    </Text>
                    <Text style={textStyle}>
                        Keep shipping! 🚀
                    </Text>
                    <Hr style={hrStyle} />
                    <Text style={footerStyle}>
                        — The 01X Team
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}

export default ApplicationRejectedEmail;

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

const hrStyle = {
    borderColor: "#e5e7eb",
    margin: "32px 0",
};

const footerStyle = {
    fontSize: "13px",
    color: "#9ca3af",
};
