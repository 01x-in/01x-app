import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CohortFAQ } from "./_components/cohort-faq";

export const metadata: Metadata = {
  title: "The 100-Day Cohort — 01X",
  description:
    "14 weeks. 4 phases. 3 gates. Enter with an idea, leave with a launched product and real users. 8–12 builders per cohort.",
};

const phases = [
  {
    step: "01",
    badge: "Intro",
    label: "Days 1–2 — Intro Weekend",
    body: "You meet your cohort. You meet your mentors. You pressure-test your idea in front of the room. By Sunday night, you have a direction and your first deliverable. No warm-up week. You start moving on Day 1.",
  },
  {
    step: "02",
    badge: "Clarity",
    label: "Weeks 1–2 — Clarity",
    body: "You think you know the problem. Prove it. Talk to real people. Validate your assumptions. Write a problem statement that survives scrutiny.",
    gate: "Gate 1: Validated problem + 3 user conversations. No gate, no building.",
  },
  {
    step: "03",
    badge: "Build",
    label: "Weeks 3–8 — Build",
    body: "Build the thing. Not a pitch deck. Not a prototype in Figma. A working product. By Week 6, you put it in front of 10 strangers and watch what happens.",
    gate: "Gate 2: Working MVP + guerrilla test results from 10 real users. No gate, no users.",
  },
  {
    step: "04",
    badge: "Users",
    label: "Weeks 9–11 — Users",
    body: "Building was the easy part. Now find 20 people who come back. Run feedback loops. Fix what matters. Ignore what doesn\u2019t. Learn the difference.",
    gate: "Gate 3: 20 active users + retention signal. No gate, no launch.",
  },
  {
    step: "05",
    badge: "Launch",
    label: "Weeks 12–14 — Launch",
    body: "You go public. Twice. First launch to learn, second launch to land. The cohort ends with Demo Day — you stand up and show what you shipped.",
  },
];

const shipItems = [
  "A validated problem statement backed by real user conversations",
  "A working MVP that solves a real problem for real people",
  "Guerrilla test results from 10 users with documented patterns",
  "20 active users who chose to use your product",
  "A feedback synthesis — what you changed, what you ignored, and why",
  "Launch assets — landing page, positioning, distribution channels mapped",
  "Two public launches with documented results",
  "A Demo Day presentation of your shipped product",
  "A peer network of 8–12 builders who watched you ship",
];

const weeklyRhythm = [
  {
    day: "Sunday",
    label: "Direction",
    body: "Mentor-led session. Framework, context, hard questions. You set your weekly goal. You get your deliverable assignment.",
    highlight: true,
  },
  { day: "Mon–Tue", label: "Build", highlight: false },
  {
    day: "Wednesday",
    label: "Async check-in",
    body: "Three questions. What did you ship since Sunday? What\u2019s blocking you? What\u2019s the plan for Thursday–Friday? Your mentor reads it and responds.",
    highlight: true,
  },
  {
    day: "Thu–Fri",
    label: "Build",
    body: "Complete your deliverable.",
    highlight: false,
  },
  {
    day: "Saturday",
    label: "Review",
    body: "Office hours with mentors. Your deliverable gets graded. Your peer reviews your work. No hiding. You leave knowing exactly where you stand.",
    highlight: true,
  },
];

const grades = [
  {
    level: "L1",
    label: "Ship-grade",
    description:
      "Complete, clear, demonstrates real understanding and effort. This is the standard.",
    cardClass: "border-[#d7ff00] bg-[#d7ff00]/5",
  },
  {
    level: "L2",
    label: "Draft-grade",
    description:
      "Good attempt. Gaps remain. Shows engagement but needs refinement.",
    cardClass: "border-border bg-card/50",
  },
  {
    level: "L3",
    label: "Incomplete",
    description:
      "Didn\u2019t show up meaningfully. This is the signal that you\u2019re falling behind.",
    cardClass: "border-destructive/50 bg-destructive/5",
  },
];

const segments = [
  {
    pct: "~40%",
    label: "Technical builders",
    description: "who can code their MVP. They are the engine.",
  },
  {
    pct: "~30%",
    label: "Product & design thinkers",
    description:
      "who challenge the \u201Cwhat\u201D and \u201Cwhy.\u201D They keep builders honest.",
  },
  {
    pct: "~20%",
    label: "Growth & business operators",
    description:
      "who solve distribution. They prevent \u201Cbuild it and they will come.\u201D",
  },
  {
    pct: "~10%",
    label: "Domain experts",
    description: "with deep vertical knowledge. They ground ideas in reality.",
  },
];

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
                14 weeks. 4 phases. 3 gates.<br />
                You have to earn your way through.
              </p>
              {/* <p>
                This is not a course. There are no videos. No &ldquo;community
                access.&rdquo; No passive learning.
              </p>
              <p>
                You enter with an idea. You leave with a launched product and
                real users — or you know exactly why you didn&rsquo;t.
              </p> */}
              {/* <p className="text-base text-muted-foreground/80">
                8–12 builders per cohort. Seats are limited because attention is
                limited.
              </p> */}
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

        {/* ── SECTION 1: The 100-Day Structure ── */}
        <section id="structure" className="section-full-scrollable">
          <div className="container-wide">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
                The 100-day structure
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-lg mx-auto">
                Five phases. Three gates. Each one earned.
              </p>
            <div className="space-y-4">
              {phases.map((phase, i) => (
                  <div key={phase.step} className="flex gap-4 md:gap-6">
                    <div className="flex flex-col items-center shrink-0">
                      <span className="text-sm font-mono text-muted-foreground w-8 h-8 flex items-center justify-center rounded-full border bg-card">
                        {phase.step}
                      </span>
                      {i < phases.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="pb-6 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant="outline"
                          className="text-xs font-medium"
                        >
                          {phase.badge}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {phase.label}
                        </span>
                      </div>
                      <p className="text-foreground leading-relaxed mb-3">
                        {phase.body}
                      </p>
                      {phase.gate && (
                        <div className="rounded-lg border-l-2 border-[#d7ff00] bg-[#d7ff00]/10 pl-4 pr-4 py-3">
                          <p className="text-sm font-medium text-foreground/90">
                            {phase.gate}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECTION 2: What You'll Ship ── */}
        <section className="section-full">
          <div className="container-wide">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
                What you&rsquo;ll ship in 100 days
              </h2>
              <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-center">
                This is not a list of things you&rsquo;ll &ldquo;learn
                about.&rdquo; These are artifacts you will have built and own
                when you walk out.
              </p>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 mb-10">
                {shipItems.map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-lg bg-card/30 border border-border/50 px-4 py-3 text-sm"
                  >
                    <span className="text-green-500 shrink-0 mt-0.5">✓</span>
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-center text-sm">
                If you do the work, you leave with all of this. If you
                don&rsquo;t, you&rsquo;ll know exactly where you stalled.
              </p>
          </div>
        </section>

        {/* ── SECTION 3: Weekly Rhythm + Grading (combined) ── */}
        <section className="section-full">
          <div className="container-wide">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
              {/* Weekly Rhythm */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                    The weekly rhythm
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Every week. Same beat. No ambiguity.
                  </p>
                  <div className="space-y-2">
                    {weeklyRhythm.map((item) => (
                      <div
                        key={item.day}
                        className={`flex gap-3 rounded-lg p-3 ${
                          item.highlight
                            ? "bg-card/50 border border-border/50"
                            : "opacity-70"
                        }`}
                      >
                        <Badge
                          variant="outline"
                          className="shrink-0 h-fit text-xs font-medium mt-0.5"
                        >
                          {item.day}
                        </Badge>
                        <div>
                          <span className="font-medium text-foreground text-sm">
                            {item.label}
                          </span>
                          {item.body && (
                            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                              {item.body}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              {/* Grading */}
                <div>
                  <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                    Deliverables are graded.
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Every Sunday produces a mandatory deliverable due by Friday.
                  </p>
                  <div className="space-y-3 mb-6">
                    {grades.map((grade) => (
                      <Card
                        key={grade.level}
                        className={`border-l-4 ${grade.cardClass}`}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs"
                            >
                              {grade.level}
                            </Badge>
                            {grade.label}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {grade.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    One resubmission per deliverable. The system rewards effort.
                    It does not reward coasting.
                  </p>
                </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: Two Mentors ── */}
        <section className="section-full">
          <div className="container-wide">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
                Two mentors. Not optional.
              </h2>
              <p className="text-muted-foreground text-center mb-10 max-w-lg mx-auto">
                Mentors are builders, not lecturers. They&rsquo;ve shipped
                products, made hard calls under uncertainty, and know the
                difference between real progress and motion.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="text-xs font-medium"
                      >
                        Day 1 → 100
                      </Badge>
                      Primary mentor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Is with you from Day 1 to Day 100. They know your product,
                      your blockers, your tendencies. They read your Wednesday
                      check-ins. They attend your Saturday reviews. They carry
                      context so you don&rsquo;t have to re-explain yourself
                      every week.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="text-xs font-medium"
                      >
                        Rotates
                      </Badge>
                      Phase specialist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Rotates as you progress. Product thinker during Clarity.
                      Execution-focused builder during Build. UX and user
                      psychology during Users. Growth operator during Launch. The
                      right expertise at the right moment.
                    </p>
                  </CardContent>
                </Card>
              </div>
          </div>
        </section>

        {/* ── SECTION 5: Composition + Observer (combined) ── */}
        <section className="section-full">
          <div className="container-wide">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-center">
                Cohort composition is deliberate
              </h2>
              <p className="text-muted-foreground text-center mb-10">
                Each cohort is mixed by design:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {segments.map((seg) => (
                  <div
                    key={seg.pct}
                    className="rounded-xl border bg-card/50 p-5 text-center"
                  >
                    <span className="block text-3xl md:text-4xl font-semibold text-[#d7ff00] mb-2">
                      {seg.pct}
                    </span>
                    <span className="block font-medium text-foreground text-sm mb-1">
                      {seg.label}
                    </span>
                    <span className="block text-xs text-muted-foreground leading-relaxed">
                      {seg.description}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground text-center text-sm max-w-xl mx-auto mb-12">
                You&rsquo;re paired with someone from a different segment for
                weekly peer review. The engineer reviews the product
                person&rsquo;s positioning. The product person reviews the
                engineer&rsquo;s UX. You will see your blind spots.
              </p>

            {/* Observer Mode callout */}
              <div className="rounded-xl border border-dashed bg-muted/20 p-6 md:p-8 text-center max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-3">
                  What if you&rsquo;re not ready
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  If you don&rsquo;t pass a gate, you get one extra week. Still
                  not there? You move to observer mode — you attend sessions,
                  learn from peers, but don&rsquo;t launch something that
                  isn&rsquo;t ready. No shame in it. You&rsquo;ll know exactly
                  where you stalled.
                </p>
              </div>
          </div>
        </section>

        {/* ── SECTION 6: Pricing ── */}
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

        {/* ── SECTION 7: FAQ ── */}
        <section className="section-full-scrollable">
          <div className="container-wide">
              <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center">
                FAQ
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
