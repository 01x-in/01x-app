import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Navbar from "@/components/navbar";
import { MentorsShowcase } from "@/components/mentors/MentorsShowcase";
import { BuiltIn01X } from "@/components/projects/BuiltIn01X";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="scroll-snap-container bg-background">

        {/* ── HERO ── */}
        <section id="hero" className="section-full min-h-screen pt-24 md:pt-16">
          <div className="container-narrow text-center md:-mt-8">
            <Badge variant="outline" className="mb-6 rounded-full px-4 py-1.5 text-xs font-medium border-border/50">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand"></span>
              AI-Native Community
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
              Zero → One → Scale
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
              We build with AI. We build every day.<br />
              We are builders who adopted AI early, share what we learn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/cohort">Explore the Cohort →</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8" asChild>
                <Link href="#community">Join our Community</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── WHAT WE BELIEVE ── */}
        <section id="beliefs" className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              What we believe.
            </h2>
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  AI <s>replaces</s> amplifies builders.
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Building with AI well requires knowing what you&apos;re building and why.
                  The best use of AI is to move faster on decisions you&apos;ve already
                  thought through — not to outsource the thinking itself.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Shipping is the only real education.
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  You don&apos;t learn product thinking from a framework. You learn it by
                  making hard decisions in the open, iterating on real feedback, and
                  shipping things that can fail. That&apos;s how we learned.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">
                  Early adoption compounds.
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  We were using AI to build products before it was mainstream. That
                  experience — the dead ends, the breakthroughs, the changed workflows —
                  is what we share. You don&apos;t have to learn it all the hard way.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE 01X TEAM ── */}
        <MentorsShowcase variant="team" />

        {/* ── THE COHORT ── */}
        <section id="cohort" className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
              The 01x Cohort.
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
              This is how we share what we know. 100 days of structured mentorship,
              graded deliverables, and peer accountability — to take you from idea
              to shipped product.
            </p>

            {/* 3-column stat summary */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
              <div className="space-y-2 text-center">
                <p className="text-2xl font-semibold">100 days</p>
                <p className="text-sm text-muted-foreground">Structured, not open-ended</p>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-2xl font-semibold">8–12 builders</p>
                <p className="text-sm text-muted-foreground">Small cohorts, by design</p>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-2xl font-semibold">AI-first</p>
                <p className="text-sm text-muted-foreground">From day one</p>
              </div>
            </div>

            {/* CTA card */}
            <Card className="bg-card/50 max-w-xl mx-auto text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Zero → One. In 100 days.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  14 weeks. 4 phases. 3 gates. You enter with an idea and leave
                  with a shipped product.
                </p>
                <Button size="lg" className="text-base px-8" asChild>
                  <Link href="/cohort">Explore the Cohort →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* ── BUILT WITH 01X ── */}
        <BuiltIn01X />

        {/* ── THE 01X COMMUNITY ── */}
        <section id="community" className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
              The 01x community.
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
              The cohort is the program. The community is everything around it.
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="text-xl">Community Slack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    Join the conversation. Builders, the 01x team, and people serious
                    about shipping with AI — all in one place.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="https://join.slack.com/t/01xcommunity/shared_invite" target="_blank" rel="noopener noreferrer">
                      Join the Slack →
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl">The 01x Dispatch</CardTitle>
                    <Badge variant="outline" className="text-xs font-normal">Starting soon</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  <p className="leading-relaxed">
                    Curated lessons from building with AI. Patterns we&apos;ve noticed,
                    tools we&apos;ve stress-tested, and ideas worth thinking about.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ── IS THIS FOR YOU? ── */}
        <section id="for-you" className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center">
              Is 01x for you?
            </h2>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-foreground">This is for you if:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You believe AI is a tool that makes good builders faster
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You want to build real products, not just study how to
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You&apos;re ready to ship something — not just explore an idea indefinitely
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You value a curated, high-signal environment
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-600 shrink-0">✓</span>
                    You want to learn from people who were doing this before it was obvious
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-foreground">This is not for you if:</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You&apos;re looking for passive content or pre-recorded courses
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You need your idea fully validated before you commit to building it
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You expect AI to handle the hard thinking
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You&apos;re not comfortable building in the open, with peers
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-600 shrink-0">×</span>
                    You need guarantees before you invest time or money
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-center text-muted-foreground mt-12 max-w-xl mx-auto">
              We&apos;d rather you find that out now than on Day 50.
            </p>
          </div>
        </section>

        {/* ── CTA + FOOTER ── */}
        <section id="cta" className="section-full min-h-screen flex-col justify-between py-0">
          <div className="flex-1 flex items-center justify-center">
            <div className="container-narrow text-center">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Ready to build with us?
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                Start with the cohort. Or join the community. Either way, you&apos;re among builders.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-base px-10" asChild>
                  <Link href="/cohort/apply">Apply to the Cohort</Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base px-10" asChild>
                  <Link href="https://join.slack.com/t/01xcommunity/shared_invite" target="_blank" rel="noopener noreferrer">
                    Join the Slack
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          <Footer />
        </section>

      </div>
    </>
  );
}
