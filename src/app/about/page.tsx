import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { WhatWorks } from "./_components/what-works";
import { WhatCosts } from "./_components/what-costs";

export const metadata: Metadata = {
  title: "About — 01X",
  description:
    "I'm a full-stack builder from India who used AI to ship a new idea every month. This is the story of what I learned.",
};


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
              Dozens of ideas.<br />
              <span className="text-muted-foreground">Everything I learned.</span>
            </h1>
            <div className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto space-y-1">
              <p>I used Claude, Codex, and every AI tool I could get.</p>
              <p>Trying to compress months of work into days.</p>
              <p>Obsessing over how fast I could actually build.</p>
              <p>01X is me sharing what I figured out.</p>
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
                Things I&rsquo;d do again.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-sm mx-auto text-sm">
                Patterns that consistently moved me forward.
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
                Things that cost me.
              </h2>
              <p className="text-muted-foreground mt-3 max-w-sm mx-auto text-sm">
                Mistakes I made so you don&rsquo;t have to.
              </p>
            </div>
            <WhatCosts />
          </div>
        </section>

        {/* ── FOUNDER ── */}
        <section className="section-full">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-semibold leading-tight">
                  &ldquo;I could build this.&rdquo;<br />
                  <span className="text-muted-foreground">&ldquo;Does anyone actually need it?&rdquo;</span>
                </h2>
              </div>
              <div className="rounded-2xl border bg-card p-6 flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                    <span className="text-xl font-semibold text-brand">TS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-base">Tushar Sarang</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Engineering Manager</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Full-stack engineer obsessed with finding the shortest path from idea to working software. Believes the only way to learn is to ship, break, and ship again — faster each time. Spent the last year pushing AI tooling to its absolute limits so others don&rsquo;t have to figure it out the hard way.
                </p>
                <a
                  href="https://x.com/tusharsarang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  X / Twitter →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="section-full">
          <div className="container-narrow">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-center leading-tight">
              Come build with me.
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Cohort */}
              <div className="rounded-2xl border bg-card p-6 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-brand mb-2">The Cohort</p>
                  <p className="font-semibold text-lg leading-snug">For builders ready to commit.</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  100 days. Structure, accountability, mentors, and a real deadline. For people who are serious about shipping something from zero to one.
                </p>
                <a
                  href="/cohort"
                  className="inline-flex items-center gap-2 rounded-full bg-brand text-background px-6 py-2.5 text-sm font-semibold hover:bg-brand/90 transition-colors self-start"
                >
                  See the Cohort →
                </a>
              </div>

              {/* Community */}
              <div className="rounded-2xl border bg-card p-6 flex flex-col gap-4">
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-2">The Community</p>
                  <p className="font-semibold text-lg leading-snug">For builders who want to stay sharp.</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  A Slack for people actively building with AI. Share what&rsquo;s working, ask what isn&rsquo;t, and stay close to what&rsquo;s being built.
                </p>
                <a
                  href="https://slack.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:bg-card transition-colors self-start"
                >
                  Join the Community →
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
