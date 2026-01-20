import Navbar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export const metadata = {
    title: "Terms of Service — 01X",
    description: "Terms of Service for the 01X builder cohort program.",
};

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <div className="pt-28 pb-16">
                <div className="container-narrow">
                    <h1 className="text-3xl font-semibold mb-2">Terms of Service</h1>
                    <p className="text-muted-foreground mb-8">Last updated: January 2026</p>

                    <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-xl font-semibold mb-3">1. Welcome to 01X</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                These Terms of Service ("Terms") govern your use of the 01X platform and participation
                                in our builder cohort programs. By accessing or using 01X, you agree to be bound by these Terms.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">2. Your Ideas Are Yours</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    <strong className="text-foreground">We want to be crystal clear: your ideas, concepts, and intellectual
                                        property remain 100% yours.</strong>
                                </p>
                                <p>
                                    When you share your project ideas, code, designs, or business concepts through 01X —
                                    whether in your application, during cohort sessions, or in any other context — you retain
                                    full ownership. We do not claim any rights to your intellectual property.
                                </p>
                                <p>
                                    We will never:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Use your ideas to build competing products</li>
                                    <li>Share your confidential information with third parties without consent</li>
                                    <li>Claim ownership or equity in your projects</li>
                                    <li>Require you to assign any IP rights to participate</li>
                                </ul>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">3. Cohort Participation</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    By joining a 01X cohort, you agree to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Participate actively and in good faith</li>
                                    <li>Treat fellow cohort members with respect</li>
                                    <li>Not share other participants' confidential ideas without permission</li>
                                    <li>Complete the cohort program requirements</li>
                                </ul>
                                <p>
                                    Cohort fees are non-refundable once the program begins, except at our sole discretion
                                    for exceptional circumstances.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">4. Community Guidelines</h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    01X is a community of builders. We expect all participants to:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Be constructive in feedback and criticism</li>
                                    <li>Respect intellectual property of others</li>
                                    <li>Not engage in harassment, discrimination, or harmful behavior</li>
                                    <li>Maintain confidentiality of private discussions</li>
                                </ul>
                                <p>
                                    We reserve the right to remove participants who violate these guidelines without refund.
                                </p>
                            </div>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">5. Mentorship & Advice</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Mentorship and advice provided through 01X is for informational and educational purposes only.
                                Mentors share their experience and perspectives, but their guidance does not constitute
                                professional legal, financial, or business advice. You are responsible for your own decisions.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">6. No Guarantees</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                While we strive to provide valuable programs and connections, 01X does not guarantee
                                any specific outcomes, including but not limited to: funding, revenue, user acquisition,
                                co-founder matching, or business success. Your results depend on your effort and execution.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">7. Changes to Terms</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We may update these Terms from time to time. Significant changes will be communicated
                                to active participants. Continued use of 01X after changes constitutes acceptance of
                                the updated Terms.
                            </p>
                        </section>

                        <Separator />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Questions about these Terms? Reach out to us at{" "}
                                <a href="mailto:hello@01x.dev" className="text-[#d7ff00] hover:underline">
                                    hello@01x.dev
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
