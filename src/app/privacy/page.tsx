import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata = {
    title: "Privacy Policy — 01X",
    description: "Privacy Policy for the 01X builder cohort program.",
};

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <div className="pt-28 pb-16">
                <div className="container-narrow">
                    <h1 className="text-3xl font-semibold mb-2">Privacy Policy</h1>
                    <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">Our Commitment</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    At 01X, we understand that builders share sensitive information about their projects,
                                    ideas, and aspirations. <strong className="text-foreground">We treat your information with
                                        the same care we'd want for our own ideas.</strong>
                                </p>
                                <p>
                                    This Privacy Policy explains what we collect, why, and how we protect it.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p><strong className="text-foreground">Application Information:</strong></p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Name, email, and location</li>
                                    <li>LinkedIn/portfolio URLs (optional)</li>
                                    <li>Project descriptions and ideas</li>
                                    <li>Background and skills</li>
                                    <li>Goals and expectations</li>
                                </ul>

                                <p><strong className="text-foreground">Usage Information:</strong></p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>How you interact with our platform</li>
                                    <li>Session and device information</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>We use your information to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Review your application and assess fit for our cohorts</li>
                                    <li>Personalize your cohort experience</li>
                                    <li>Match you with relevant mentors (with your consent)</li>
                                    <li>Facilitate connections with potential co-founders (only if you opt in)</li>
                                    <li>Improve our programs and platform</li>
                                    <li>Communicate important updates</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Your Ideas Are Protected</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    <strong className="text-foreground">We will never share your project ideas,
                                        business concepts, or confidential information with anyone outside of the 01X team
                                        without your explicit consent.</strong>
                                </p>
                                <p>
                                    Your ideas are shared only with:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Our core team for application review</li>
                                    <li>Assigned mentors (only relevant details, with your knowledge)</li>
                                    <li>Fellow cohort members (only what you choose to share)</li>
                                </ul>
                                <p>
                                    We do not sell, license, or monetize your ideas in any way. Period.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>We protect your data through:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Encrypted data transmission (HTTPS)</li>
                                    <li>Secure storage with limited access</li>
                                    <li>Regular security reviews</li>
                                    <li>Minimal data retention — we only keep what we need</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Third-Party Services</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use limited third-party services to operate 01X (e.g., email, analytics, payment processing).
                                These services have access only to the data necessary for their function and are bound by
                                their own privacy policies. We do not share your project ideas or confidential information
                                with these services.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>You have the right to:</p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong className="text-foreground">Access</strong> — Request a copy of your data</li>
                                    <li><strong className="text-foreground">Correct</strong> — Update inaccurate information</li>
                                    <li><strong className="text-foreground">Delete</strong> — Request deletion of your data</li>
                                    <li><strong className="text-foreground">Withdraw</strong> — Opt out of marketing communications</li>
                                </ul>
                                <p>
                                    To exercise any of these rights, email us at{" "}
                                    <a href="mailto:privacy@01x.in" className="text-brand hover:underline">
                                        privacy@01x.in
                                    </a>
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Data Retention</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We retain application data for the duration of your participation plus a reasonable period
                                for follow-up opportunities. If you withdraw your application or request deletion, we will
                                remove your data within 30 days, except where required by law.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">8. Updates</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update this Privacy Policy as our practices evolve. Significant changes will be
                                communicated via email. The "Last updated" date at the top reflects the most recent revision.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">9. Contact Us</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Questions or concerns about privacy? We're happy to help. Reach out at{" "}
                                <a href="mailto:privacy@01x.in" className="text-brand hover:underline">
                                    privacy@01x.in
                                </a>
                            </p>
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t">
                        <Link
                            href="/"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
