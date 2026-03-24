import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CohortFAQ } from "./_components/cohort-faq";

export const metadata: Metadata = {
  title: "The 100-Day Cohort — 01X",
  description:
    "14 weeks. 4 phases. 3 gates. Enter with an idea, leave with a launched product and real users. 8–12 builders per cohort.",
};

const phases = [
  {
    label: "Days 1–2 — Intro",
    body: "You meet your cohort. You meet your mentors. You pressure-test your idea in front of the room. By Sunday night, you have a direction and your first deliverable. No warm-up week. You start moving on Day 1.",
  },
  {
    label: "Weeks 1–2 — Clarity",
    body: "You think you know the problem. Prove it. Talk to real people. Validate your assumptions. Write a problem statement that survives scrutiny.",
    gate: "Gate 1: Validated problem + 3 user conversations. No gate, no building.",
  },
  {
    label: "Weeks 3–8 — Build",
    body: "Build the thing. Not a pitch deck. Not a prototype in Figma. A working product. By Week 6, you put it in front of 10 strangers and watch what happens.",
    gate: "Gate 2: Working MVP + guerrilla test results from 10 real users. No gate, no users.",
  },
  {
    label: "Weeks 9–11 — Users",
    body: "Building was the easy part. Now find 20 people who come back. Run feedback loops. Fix what matters. Ignore what doesn\u2019t. Learn the difference.",
    gate: "Gate 3: 20 active users + retention signal. No gate, no launch.",
  },
  {
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
  },
  { day: "Mon–Tue", label: "Build" },
  {
    day: "Wednesday",
    label: "Async check-in",
    body: "Three questions. What did you ship since Sunday? What\u2019s blocking you? What\u2019s the plan for Thursday–Friday? Your mentor reads it and responds. This catches blockers 3 days before Saturday, not after.",
  },
  { day: "Thu–Fri", label: "Build", body: "Complete your deliverable." },
  {
    day: "Saturday",
    label: "Review",
    body: "Office hours with mentors. Your deliverable gets graded. Your peer reviews your work. No hiding. You leave knowing exactly where you stand.",
  },
];

const grades = [
  {
    level: "L1",
    label: "Ship-grade",
    description:
      "Complete, clear, demonstrates real understanding and effort. This is the standard.",
    accent: "border-[#d7ff00]",
  },
  {
    level: "L2",
    label: "Draft-grade",
    description:
      "Good attempt. Gaps remain. Shows engagement but needs refinement.",
    accent: "border-border",
  },
  {
    level: "L3",
    label: "Incomplete",
    description:
      "Didn\u2019t show up meaningfully. This is the signal that you\u2019re falling behind.",
    accent: "border-destructive/50",
  },
];

const segments = [
  {
    pct: "~40%",
    label: "Technical builders",
    description:
      "who can code their MVP. They are the engine.",
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
    description:
      "with deep vertical knowledge. They ground ideas in reality.",
  },
];

export default function CohortPage() {
  return (
    <>
      <Navbar variant="pages" />
      <main className="min-h-screen flex flex-col bg-background pt-24">
        <div className="flex-1 pb-16">
          {/* ── HERO ── */}
          <section className="container-narrow mb-16 md:mb-24">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-8">
              100 days. Zero to One.
            </h1>
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground leading-relaxed">
              <p>
                14 weeks. 4 phases. 3 gates you have to earn your way through.
              </p>
              <p>
                This is not a course. There are no videos. No &ldquo;community
                access.&rdquo; No passive learning.
              </p>
              <p>
                You enter with an idea. You leave with a launched product and
                real users — or you know exactly why you didn&rsquo;t.
              </p>
              <p>
                8–12 builders per cohort. Seats are limited because attention is
                limited.
              </p>
            </div>
          </section>

          {/* ── SECTION 1: The 100-Day Structure ── */}
          <section className="container-wide mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold mb-12">
              The 100-day structure
            </h2>
            <div className="space-y-6">
              {phases.map((phase) => (
                <div
                  key={phase.label}
                  className="rounded-xl border bg-card/50 p-6"
                >
                  <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase mb-3">
                    {phase.label}
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    {phase.body}
                  </p>
                  {phase.gate && (
                    <div className="mt-4 border-l-2 border-[#d7ff00] pl-4">
                      <p className="text-sm font-medium text-muted-foreground italic">
                        {phase.gate}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 2: What You'll Ship in 100 Days ── */}
          <section className="container-wide mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              What you&rsquo;ll ship in 100 days
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              This is not a list of things you&rsquo;ll &ldquo;learn
              about.&rdquo; These are artifacts you will have built and own when
              you walk out.
            </p>
            <ul className="space-y-3 mb-8">
              {shipItems.map((item) => (
                <li key={item} className="flex gap-3 text-muted-foreground">
                  <span className="text-green-600 dark:text-green-400 shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-muted-foreground">
              If you do the work, you leave with all of this. If you don&rsquo;t,
              you&rsquo;ll know exactly where you stalled.
            </p>
          </section>

          {/* ── SECTION 3: The Weekly Rhythm ── */}
          <section className="container-wide mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              The weekly rhythm
            </h2>
            <p className="text-muted-foreground mb-8">
              Every week. Same beat. No ambiguity.
            </p>
            <div className="space-y-0 divide-y divide-border">
              {weeklyRhythm.map((item) => (
                <div key={item.day} className="flex gap-4 py-4">
                  <span className="text-foreground font-medium w-24 shrink-0">
                    <span className="text-foreground mr-1">→</span>{" "}
                    {item.day}
                  </span>
                  <div>
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    {item.body && (
                      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                        {item.body}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── SECTION 4: Deliverables Are Graded ── */}
          <section className="container-wide mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Deliverables are graded. Every week.
            </h2>
            <p className="text-muted-foreground mb-8">
              Every Sunday produces a mandatory deliverable due by Friday. Graded
              on three levels:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {grades.map((grade) => (
                <Card
                  key={grade.level}
                  className={`border-l-4 ${grade.accent} bg-card/50`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        {grade.level}
                      </span>
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
            <p className="text-muted-foreground">
              You get one resubmission per deliverable. The system rewards
              effort. It does not reward coasting.
            </p>
          </section>

          {/* ── SECTION 5: Two Mentors ── */}
          <section className="container-wide mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8">
              Two mentors. Not optional.
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="rounded-xl border bg-card/50 p-6">
                <h3 className="font-semibold text-lg mb-3">Primary mentor</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Is with you from Day 1 to Day 100. They know your product,
                  your blockers, your tendencies. They read your Wednesday
                  check-ins. They attend your Saturday reviews. They carry
                  context so you don&rsquo;t have to re-explain yourself every
                  week.
                </p>
              </div>
              <div className="rounded-xl border bg-card/50 p-6">
                <h3 className="font-semibold text-lg mb-3">
                  Phase specialist
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Rotates as you progress. Product thinker during Clarity.
                  Execution-focused builder during Build. UX and user psychology
                  during Users. Growth operator during Launch. The right
                  expertise at the right moment.
                </p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Mentors are builders, not lecturers. They&rsquo;ve shipped
              products, made hard calls under uncertainty, and know the
              difference between real progress and motion.
            </p>
          </section>

          {/* ── SECTION 6: Cohort Composition ── */}
          <section className="container-wide mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">
              Cohort composition is deliberate
            </h2>
            <p className="text-muted-foreground mb-8">
              Each cohort is mixed by design:
            </p>
            <div className="space-y-4 mb-8">
              {segments.map((seg) => (
                <div key={seg.pct} className="flex gap-4 items-start">
                  <span className="text-xl font-semibold text-[#d7ff00] w-16 shrink-0 text-right">
                    {seg.pct}
                  </span>
                  <div>
                    <span className="text-foreground">
                      <span className="mr-1">→</span>
                      <span className="font-medium">{seg.label}</span>{" "}
                      {seg.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground">
              You&rsquo;re paired with someone from a different segment for
              weekly peer review. The engineer reviews the product
              person&rsquo;s positioning. The product person reviews the
              engineer&rsquo;s UX. You will see your blind spots.
            </p>
          </section>

          {/* ── SECTION 7: Observer Mode ── */}
          <section className="container-wide mb-16 md:mb-24">
            <div className="rounded-xl border border-dashed bg-muted/20 p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                What if you&rsquo;re not ready
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  If you don&rsquo;t pass a gate, you get one extra week in that
                  phase. If you&rsquo;re still not there, you move to observer
                  mode — you attend sessions, learn from your peers, but you
                  don&rsquo;t launch something that isn&rsquo;t ready.
                </p>
                <p>
                  No shame in it. Observer mode exists because shipping garbage
                  helps no one. You&rsquo;ll know exactly where you stalled and
                  what to fix next.
                </p>
              </div>
            </div>
          </section>

          {/* ── SECTION 8: Pricing ── */}
          <section className="container-wide mb-16 md:mb-24">
            <div className="rounded-xl border bg-muted/10 p-6 md:p-10">
              <h2 className="text-3xl md:text-4xl font-semibold mb-4">
                ₹15,000 for 100 days.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl">
                That&rsquo;s ₹150 per day of structured mentorship, graded
                deliverables, peer review, and accountability. There is no
                cheaper way to get two dedicated mentors, a curated peer cohort,
                and a system that forces you to ship.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex gap-4 items-start">
                  <span className="text-lg font-semibold text-foreground shrink-0 w-8">
                    1.
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      ₹5,000 deposit when your application is accepted.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This locks your seat. Non-refundable. This is the
                      commitment filter.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-lg font-semibold text-foreground shrink-0 w-8">
                    2.
                  </span>
                  <div>
                    <p className="font-medium text-foreground">
                      ₹10,000 before Day 1 — the intro weekend.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay before you start.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground">
                This is not a subscription. Not a paywall. It&rsquo;s a filter.
                If ₹15,000 feels like too much to bet on yourself for 100 days,
                this isn&rsquo;t for you yet.
              </p>
            </div>
          </section>

          {/* ── SECTION 9: FAQ ── */}
          <section className="container-wide mb-16 md:mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold mb-8">FAQ</h2>
            <CohortFAQ />
          </section>

          {/* ── CTA ── */}
          <section className="container-narrow text-center mb-16">
            <p className="text-muted-foreground mb-6">
              Cohorts are limited. Applications are reviewed manually.
            </p>
            <Button size="lg" className="text-base px-10" asChild>
              <Link href="/apply">Apply for the next cohort</Link>
            </Button>
          </section>
        </div>

        <Footer className="mt-24" />
      </main>
    </>
  );
}
