import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { WhatWorks } from "./_components/what-works";
import { WhatCosts } from "./_components/what-costs";

export const metadata: Metadata = {
  title: "About — 01X",
  description:
    "We're a group of full-stack builders from India who used AI to ship a new idea every month. This is the story of what we learned.",
};

const founders = [
  {
    name: "Tushar Sarang",
    role: "Co-founder",
    bio: "Full-stack engineer and product thinker. Obsessed with finding the shortest path from idea to working software. Believes the best way to learn is to ship, break, and ship again.",
    x: "https://x.com/tusharsarang",
    initials: "TS",
  },
  {
    name: "Ankit Mishra",
    role: "Co-founder",
    bio: "Builder at heart with a sharp eye for product and UX. Has an uncanny ability to identify what matters in an early-stage product and ruthlessly cut everything else.",
    initials: "AM",
  },
  {
    name: "Ankit Gupta",
    role: "Co-founder",
    bio: "Engineer who thinks in systems. Brings the technical depth that turns quick prototypes into products that actually hold up. The one who asks the hard questions.",
    initials: "AG",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar variant="pages" />
      <div className="scroll-snap-container bg-background">

        {/* ── HERO ── */}
        <section className="section-full min-h-screen pt-24 md:pt-16 flex items-center">
          <div className="container-narrow text-center md:-mt-8">
            <Badge
              variant="outline"
              className="mb-6 rounded-full px-4 py-1.5 text-xs font-medium border-border/50"
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-brand" />
              The story
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-[1.15]">
              2 Builders. 1 Year.<br />
              <span className="text-muted-foreground">Everything we learned.</span>
            </h1>
            <div className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto space-y-1">
              <p>We used Claude, Codex, and every AI tool we could get.</p>
              <p>Trying to compress months of work into days.</p>
              <p>Obsessing over how fast we could actually build.</p>
              <p>01X is us sharing what we figured out.</p>
            </div>
          </div>
        </section>

        {/* ── WHAT WORKS ── */}
        <section className="section-full">
          <div className="container-wide">
            <div className="text-center mb-12">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-3">
                What works
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
                Things we&rsquo;d do again.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-sm mx-auto text-sm">
                Patterns that consistently moved us forward.
              </p>
            </div>
            <WhatWorks />
          </div>
        </section>

        {/* ── WHAT COSTS YOU ── */}
        <section className="section-full">
          <div className="container-wide">
            <div className="text-center mb-12">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-3">
                What to avoid
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
                Things that cost us.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-sm mx-auto text-sm">
                Mistakes we made so you don&rsquo;t have to.
              </p>
            </div>
            <WhatCosts />
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="section-full">
          <div className="container-narrow">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
              The team
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 leading-tight">
              Three builders.<br />One shared obsession.
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {founders.map((founder) => (
                <div
                  key={founder.name}
                  className="rounded-2xl border bg-card p-6 flex flex-col gap-4"
                >
                  <div className="h-12 w-12 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-brand">{founder.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold">{founder.name}</p>
                    <p className="text-xs text-muted-foreground">{founder.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{founder.bio}</p>
                  {founder.x && (
                    <a
                      href={founder.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      X / Twitter →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY 01X COHORT ── */}
        <section className="section-full">
          <div className="container-narrow text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight">
              We turned the playbook into a cohort.
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-4 leading-relaxed">
              Everything we learned about shipping fast, validating early, and using AI as a serious leverage tool — distilled into a 100-day program for builders who are serious about going from zero to one.
            </p>
            <p className="text-muted-foreground max-w-md mx-auto mb-10 text-sm">
              Not a course. Not a community. A structured sprint with real accountability, real mentors, and a real deadline.
            </p>
            <a
              href="/cohort"
              className="inline-flex items-center gap-2 rounded-full bg-brand text-background px-8 py-3 text-sm font-semibold hover:bg-brand/90 transition-colors"
            >
              See the Cohort →
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
