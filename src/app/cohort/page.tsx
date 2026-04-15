import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CohortFAQ } from "./_components/cohort-faq";
import { CohortStructure } from "./_components/cohort-structure";
import { WeeklyRhythm } from "./_components/weekly-rhythm";
import { DeliverablesGraded } from "./_components/deliverables-graded";
import { WhatYouShip } from "./_components/what-you-ship";
import { TwoMentors } from "./_components/two-mentors";
import { CohortComposition } from "./_components/cohort-composition";

export const metadata: Metadata = {
  title: "The 100-Day Cohort — 01X",
  description:
    "14 weeks. 4 phases. 3 gates. Enter with an idea, leave with a launched product and real users. 8–12 builders per cohort.",
};








export default function CohortPage() {
  return (
    <>
      <Navbar variant="pages" />
      <div className="scroll-snap-container bg-background">

        {/* ── HERO ── */}
        <section className="section-full min-h-screen pt-24 md:pt-16">
          <div className="container-narrow text-center md:-mt-8">
            <Badge
              variant="outline"
              className="mb-6 rounded-full px-4 py-1.5 text-xs font-medium border-border/50"
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#d7ff00]" />
              Limited Seats
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-[1.3]">
              100 days.<br />
              Zero → One.
            </h1>
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
              <p>
                14 weeks. 4 phases. 3 gates.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-base px-8" asChild>
                <Link href="/apply">Apply for the Next Cohort</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                asChild
              >
                <Link href="#structure">See the Structure</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── SECTION 1: Structure ── */}
        <section id="structure" className="section-full">
          <div className="container-wide">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
                Earn your way through.
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
                You don&rsquo;t pass the gate — you watch others launch.
              </p>
            <CohortStructure />
          </div>
        </section>

        {/* ── SECTION 2: Weekly Rhythm ── */}
        <section className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-3 text-center">
              The weekly rhythm
            </h2>
            <p className="text-lg text-muted-foreground mb-10 text-center">
              Every week. Same beat. No ambiguity.
            </p>
            <WeeklyRhythm />
          </div>
        </section>

        {/* ── SECTION 3: Grading ── */}
        <section className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
              Deliverables are graded.
            </h2>
            <p className="text-muted-foreground mb-8 text-center">
              Every Sunday produces a mandatory deliverable due by Friday.
            </p>
            <DeliverablesGraded />
            <p className="text-sm text-muted-foreground text-center mt-6">
              One resubmission per deliverable. The system rewards effort.
              It does not reward coasting.
            </p>
          </div>
        </section>

        {/* ── SECTION 4: Two Mentors ── */}
        <section className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
              Two mentors. Not optional.
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
              They&rsquo;ve failed. They&rsquo;ve shipped. They know the difference.
            </p>
            <TwoMentors />
          </div>
        </section>

        {/* ── SECTION 5: Cohort Composition ── */}
        <section className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
              Who&rsquo;s in the room with you
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
              Eight to twelve people. Mixed by design. Every gap covered.
            </p>
            <CohortComposition />
            <p className="text-sm text-muted-foreground text-center leading-relaxed max-w-2xl mx-auto mt-8">
              You&rsquo;re paired with someone from a{" "}
              <strong className="text-foreground font-medium">different segment</strong>{" "}
              every week. The engineer reviews the product person&rsquo;s
              positioning. The product person reviews the engineer&rsquo;s UX.{" "}
              <strong className="text-foreground font-medium">
                You will see your blind spots.
              </strong>
            </p>
          </div>
        </section>

        {/* ── SECTION 6: What You'll Ship ── */}
        <section className="section-full">
          <div className="container-wide">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
              What you walk out with
            </h2>
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-center">
              Not a certificate. Not a completion badge.
            </p>
            <WhatYouShip />
          </div>
        </section>

        

        {/* ── SECTION 7: Pricing ── */}
        <section className="section-full">
          <div className="container-wide">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-semibold mb-4">
                  <span className="text-[#d7ff00]">₹15,000</span> for 100
                  days.
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
                  That&rsquo;s ₹150 per day of structured mentorship, graded
                  deliverables, peer review, and accountability. There is no
                  cheaper way to get two dedicated mentors, a curated peer
                  cohort, and a system that forces you to ship.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
                <div className="rounded-xl border bg-card/50 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono text-muted-foreground w-7 h-7 flex items-center justify-center rounded-full border">
                      1
                    </span>
                    <span className="font-semibold text-foreground">
                      ₹5,000 deposit
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    When your application is accepted. This locks your seat.
                    Non-refundable. This is the commitment filter.
                  </p>
                </div>
                <div className="rounded-xl border bg-card/50 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-mono text-muted-foreground w-7 h-7 flex items-center justify-center rounded-full border">
                      2
                    </span>
                    <span className="font-semibold text-foreground">
                      ₹10,000 before Day 1
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pay before the intro weekend. No installments. Pay before you
                    start.
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
                This is not a subscription. Not a paywall. It&rsquo;s a filter.
                If ₹15,000 feels like too much to bet on yourself for 100 days,
                this isn&rsquo;t for you yet.
              </p>
          </div>
        </section>

        {/* ── SECTION 7: FAQs ── */}
        <section className="section-full-scrollable">
          <div className="container-wide">
              <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center">
                FAQs
              </h2>
              <div className="max-w-2xl mx-auto">
                <CohortFAQ />
              </div>
          </div>
        </section>

        {/* ── CTA + Footer ── */}
        <section className="section-full min-h-screen flex-col justify-between py-0">
          <div className="flex-1 flex items-center justify-center">
              <div className="container-narrow text-center">
                <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                  Ready to build?
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
                  Cohorts are limited. Applications are reviewed manually.
                  If it&rsquo;s a fit, we&rsquo;ll be in touch.
                </p>
                <Button size="lg" className="text-base px-10" asChild>
                  <Link href="/apply">Apply for the Next Cohort</Link>
                </Button>
              </div>
          </div>
          <Footer />
        </section>
      </div>
    </>
  );
}
