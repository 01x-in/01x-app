import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { MentorsShowcase } from "@/components/mentors/MentorsShowcase";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="scroll-snap-container bg-background">
        {/* Hero Section */}
        <section id="hero" className="section-full min-h-screen pt-24 md:pt-16">
          <div className="container-narrow text-center md:-mt-8">
            <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 text-xs font-medium border-border/50">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#d7ff00]"></span>
              Coming Soon!
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              Zero → One → Scale
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
              A paid full-stack builder environment.<br />
              You join, explore an idea, use AI to accelerate, and ship an MVP.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/apply">Apply for Access</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" asChild>
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Zero → One → Scale Section */}
        <section id="zero-one-scale" className="section-full">
          <div className="container-wide">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {/* Zero */}
              <div className="space-y-4">
                <Badge variant="outline" className="text-sm font-medium">Zero</Badge>
                <h3 className="text-xl font-semibold">Where ideas start</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You have an idea — maybe half-formed, maybe overwhelming.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Zero is the starting point: raw ambition, undefined scope, real uncertainty.
                </p>
              </div>

              {/* One */}
              <div className="space-y-4">
                <Badge variant="outline" className="text-sm font-medium">One</Badge>
                <h3 className="text-xl font-semibold">A shipped MVP</h3>
                <p className="text-muted-foreground leading-relaxed">
                  One is a working product. Something real that exists in the world.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You built it. You shipped it. It might be rough, but it&apos;s yours.
                  This is where confidence starts.
                </p>
              </div>

              {/* Scale */}
              <div className="space-y-4">
                <Badge variant="outline" className="text-sm font-medium">Scale</Badge>
                <h3 className="text-xl font-semibold">Growth through guidance</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Scale doesn&apos;t mean fundraising. It means refinement.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It means exposure to mentors who&apos;ve built before. It means
                  learning what to do next — and having help deciding.
                </p>
              </div>
            </div>

            <p className="text-center text-muted-foreground mt-12 max-w-xl mx-auto">
              This is a process. Not a promise. We help you move through it — but you do the work.
            </p>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="section-full">
          <div className="container-narrow">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              How It Works
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Join a paid builder cohort",
                  description: "You pay to enter. This filters for people who are serious."
                },
                {
                  step: "02",
                  title: "Explore and refine an idea",
                  description: "Work through uncertainty with structure and peers."
                },
                {
                  step: "03",
                  title: "Use AI to accelerate",
                  description: "AI helps you think faster and prototype faster. It doesn't replace effort."
                },
                {
                  step: "04",
                  title: "Work in small, focused groups",
                  description: "Cohorts are limited. You'll know the people you're building alongside."
                },
                {
                  step: "05",
                  title: "Ship an MVP",
                  description: "You stop exploring and start shipping. Then you iterate, improve, and grow."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <span className="text-sm font-mono text-muted-foreground shrink-0 pt-1">
                    {item.step}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Is Paid Section */}
        <section id="why-paid" className="section-full">
          <div className="container-wide">
            <div className="grid md:grid-cols-5 gap-8 md:gap-16">
              <div className="md:col-span-2">
                <h2 className="text-3xl md:text-4xl font-semibold">
                  Why you pay to be here?
                </h2>
              </div>
              <div className="md:col-span-3 space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Payment isn&apos;t a paywall — it&apos;s a filter.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This is not a subscription to content. You&apos;re not buying videos or courses.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When builders pay, they commit. They show up. They take the work seriously.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The money we collect goes directly toward:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-foreground">→</span>
                    Experienced mentors who are compensated for their time
                  </li>
                  <li className="flex gap-3">
                    <span className="text-foreground">→</span>
                    Focused events and pitch sessions
                  </li>
                  <li className="flex gap-3">
                    <span className="text-foreground">→</span>
                    Infrastructure for cohort management and support
                  </li>
                  <li className="flex gap-3">
                    <span className="text-foreground">→</span>
                    Keeping the environment high-signal and low-noise
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed pt-4">
                  You&apos;re paying for access to a serious building environment — and for the
                  quality of people you&apos;ll build alongside.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Full-Stack Builder Growth Section */}
        <section id="full-stack" className="section-full">
          <div className="container-narrow">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8">
              Builders who touch everything.
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                Full-stack doesn&apos;t just mean code. It means understanding a product end to end —
                from concept to design to backend to delivery.
              </p>
              <p className="leading-relaxed">
                You grow by doing:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-foreground">→</span>
                  You design when design is needed.
                </li>
                <li className="flex gap-3">
                  <span className="text-foreground">→</span>
                  You code when code is needed.
                </li>
                <li className="flex gap-3">
                  <span className="text-foreground">→</span>
                  You talk to users when clarity is needed.
                </li>
              </ul>
              <p className="leading-relaxed pt-4">
                This is not a course in &quot;full-stack development.&quot; You learn by shipping
                real things, repeatedly, over time. Confidence is the outcome.
              </p>
            </div>
          </div>
        </section>

        {/* Role of AI Section */}
        <section id="ai-role" className="section-full">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                  AI as a co-builder.
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  AI accelerates your thinking. It helps you draft faster, debug faster,
                  and explore ideas faster.
                </p>
              </div>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  AI does not:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-red-600">×</span>
                    Remove the need to learn
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600">×</span>
                    Replace your judgment
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600">×</span>
                    Guarantee better outcomes
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed pt-4">
                  Think of AI as a thinking partner, not a replacement for effort.
                  You still have to understand what you&apos;re building and why.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mentors Showcase Section */}
        <MentorsShowcase />

        {/* Mentorship & Events Section */}
        <section id="mentorship" className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              Mentorship & Events
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-xl">Mentorship</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Mentors are experienced industry leaders — people who&apos;ve built companies,
                    shipped products, and navigated uncertainty before.
                  </p>
                  <p className="leading-relaxed">
                    Access happens through:
                  </p>
                  <ul className="space-y-1">
                    <li>→ Scheduled sessions (not on-demand)</li>
                    <li>→ Project reviews and feedback cycles</li>
                    <li>→ Special events and focused office hours</li>
                  </ul>
                  <p className="leading-relaxed pt-2 text-sm">
                    You don&apos;t get a personal mentor by default. You earn access as you grow.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-xl">Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Events are occasional, high-quality sessions designed to sharpen your
                    thinking and expose you to people worth learning from.
                  </p>
                  <p className="leading-relaxed">
                    Examples include:
                  </p>
                  <ul className="space-y-1">
                    <li>→ Demo days for cohort projects</li>
                    <li>→ Builder retrospectives</li>
                    <li>→ Guest sessions with industry practitioners</li>
                  </ul>
                  <p className="leading-relaxed pt-2 text-sm">
                    We host fewer events, not more. Signal over noise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Who This Is For Section */}
        <section id="for-you" className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              Is this for you?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-foreground">This is for you if:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You&apos;re willing to invest money and time in your growth
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You want to build real products, not just learn concepts
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You&apos;re comfortable with uncertainty and iteration
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You value a serious environment over a crowded one
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You&apos;re curious about AI but not expecting it to do your work
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-foreground">This is not for you if:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You&apos;re looking for free courses or passive content
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You want guaranteed outcomes or funding promises
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You expect mentors to do your thinking
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You&apos;re not ready to commit to shipping something
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You&apos;re uncomfortable paying before seeing the full picture
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-center text-muted-foreground mt-12 max-w-xl mx-auto">
              We&apos;d rather you not apply than regret joining. Be honest with yourself.
            </p>
          </div>
        </section>

        {/* Access CTA Section + Footer */}
        <section id="cta" className="section-full min-h-screen flex-col justify-between py-0">
          <div className="flex-1 flex items-center justify-center">
            <div className="container-narrow text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Ready to build?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                Apply for access to an upcoming cohort. We review applications manually.
                If it&apos;s a fit, we&apos;ll be in touch.
              </p>
              <Button size="lg" className="text-base px-10" asChild>
                <Link href="/apply">Apply for Access</Link>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <footer className="border-t">
            <div className="container-wide py-8">
              {/* Mobile: stacked and centered */}
              <div className="flex flex-col items-center gap-4 text-center md:hidden">
                <p className="text-sm text-muted-foreground">
                  Built by people who build. For people who want to.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                  <span className="text-border">|</span>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                  <ThemeToggle />
                </div>
              </div>
              {/* Desktop: horizontal single row */}
              <div className="hidden md:flex items-center justify-between gap-8">
                <p className="text-sm text-muted-foreground shrink-0">
                  Built by people who build. For people who want to.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                  <span className="text-border">|</span>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
                  <span className="text-border">|</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </footer>
        </section>
      </div>
    </>
  );
}

