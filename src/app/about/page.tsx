import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About — 01X",
  description:
    "We're a group of full-stack builders from India who used AI to ship a new idea every week. This is the story of what we learned.",
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

const lessons = [
  {
    number: "01",
    title: "Speed is a moat.",
    body: "The biggest advantage AI gives you isn't just code generation — it's the ability to validate ideas before your conviction fades. Ship in hours, not weeks.",
  },
  {
    number: "02",
    title: "Vibes are not a product.",
    body: "We built a lot of things nobody wanted. The tool writes the code; you still have to figure out whether the problem is real. AI accelerates both good bets and bad ones.",
  },
  {
    number: "03",
    title: "Context is the bottleneck.",
    body: "The hardest part of AI-assisted development isn't prompting — it's keeping your mental model of the codebase sharp enough to direct the AI well. Review everything.",
  },
  {
    number: "04",
    title: "Weekly deadlines are forcing functions.",
    body: "Shipping on a schedule forces hard decisions. You can't gold-plate when the week ends on Friday. Constraints produce clarity.",
  },
  {
    number: "05",
    title: "Small teams move faster than they think.",
    body: "Three opinionated builders arguing in a group chat is worth more than a 10-person company in a planning sprint. Stay small, stay sharp.",
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
              India
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 leading-[1.3]">
              We shipped an idea<br />
              every week.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We were three full-stack builders from India who believed that somewhere in our weekly experiments lived a million-dollar idea. We used Claude, Codex, and Cline to build faster than we could think.
            </p>
          </div>
        </section>

        {/* ── STORY ── */}
        <section className="section-full">
          <div className="container-narrow">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div>
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
                  The story
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight">
                  Zero to one, week after week.
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    01X (India) started as a simple premise: what if we treated every week like a micro-startup? Pick an idea Monday, ship it Friday.
                  </p>
                  <p>
                    We were early adopters of AI coding tools — Claude, Codex, Cline — and we used them aggressively. Not as a shortcut, but as a force multiplier. The kind that lets a small team move at a pace that would otherwise require ten people.
                  </p>
                  <p>
                    We built fintech tools, health apps, productivity experiments, B2B SaaS concepts, consumer utilities. Most were duds. A few had real signal. All of them taught us something.
                  </p>
                  <p>
                    We never hit a million dollars. But we built something more useful: a repeatable system for taking an idea from zero to working software in days — and the hard-won judgment to know which ideas deserve more than a week.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "50+", label: "Ideas shipped" },
                  { value: "3", label: "Founders" },
                  { value: "1yr+", label: "Of weekly builds" },
                  { value: "∞", label: "Lessons learned" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border bg-card p-6 flex flex-col gap-1"
                  >
                    <span className="text-3xl font-semibold text-brand">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── LESSONS ── */}
        <section className="section-full">
          <div className="container-narrow">
            <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase mb-4">
              What we learned
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold mb-12 max-w-lg leading-tight">
              How to build fast with AI — and what not to do.
            </h2>
            <div className="space-y-6">
              {lessons.map((lesson) => (
                <div
                  key={lesson.number}
                  className="flex gap-6 md:gap-10 p-6 rounded-2xl border bg-card/50 hover:bg-card transition-colors"
                >
                  <span className="text-brand font-mono text-sm font-semibold shrink-0 mt-0.5">
                    {lesson.number}
                  </span>
                  <div>
                    <h3 className="font-semibold mb-1">{lesson.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{lesson.body}</p>
                  </div>
                </div>
              ))}
            </div>
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
