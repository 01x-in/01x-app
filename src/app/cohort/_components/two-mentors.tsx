import { User } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types & Data ─────────────────────────────────────────────────────────────

type MentorCard = {
  tag: string;
  name: string;
  description: string;
};

const mentors: MentorCard[] = [
  {
    tag: "Day 1 → 100",
    name: "Primary mentor",
    description:
      "Knows your product, your blockers, your tendencies. Reads every Wednesday check-in. Attends every Saturday review. You never re-explain yourself.",
  },
  {
    tag: "Rotates",
    name: "Phase specialist",
    description:
      "Product thinking during Clarity. Execution during Build. UX during Users. Growth during Launch. The right expertise exactly when you need it.",
  },
];

// ── Visual zones ─────────────────────────────────────────────────────────────

function PrimaryMentorVisual() {
  return (
    <div
      className={cn(
        "h-28 bg-secondary border-b border-border",
        "flex flex-col items-center justify-center gap-2"
      )}
    >
      {/* Icon with rings */}
      <div className="relative flex items-center justify-center">
        {/* Dashed outer circle */}
        <div className="w-20 h-20 rounded-full border border-dashed border-brand/25 absolute" />
        {/* Inner ring with icon */}
        <div className="w-14 h-14 rounded-full border border-brand/60 bg-brand/5 flex items-center justify-center">
          <User size={18} stroke="var(--brand)" />
        </div>
      </div>

      {/* 5 presence dots */}
      <div className="flex items-center gap-1.5 mt-1">
        <span className="w-1.5 h-1.5 rounded-full bg-brand opacity-40" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand opacity-40" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand opacity-40" />
        <span className="w-1.5 h-1.5 rounded-full bg-brand opacity-40" />
      </div>
    </div>
  );
}

const phases = [
  { label: "C", name: "Clarity", active: true },
  { label: "B", name: "Build",   active: false },
  { label: "U", name: "Users",   active: false },
  { label: "L", name: "Launch",  active: false },
] as const;

function PhaseSpecialistVisual() {
  return (
    <div
      className={cn(
        "h-28 bg-secondary border-b border-border",
        "flex items-center justify-center"
      )}
    >
      <div className="flex items-start gap-0">
        {phases.map((phase, i) => (
          <div key={phase.label} className="flex items-start">
            {/* Connector line between dots */}
            {i > 0 && (
              <div className="w-8 h-px bg-border self-center -mt-4" />
            )}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center",
                  "text-[9px] font-medium tracking-wide border",
                  phase.active
                    ? "bg-brand/10 border-brand/40 text-brand"
                    : "bg-muted border-border text-muted-foreground"
                )}
              >
                {phase.label}
              </div>
              <span className="text-[8px] text-muted-foreground tracking-wide mt-1">
                {phase.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tag badge ─────────────────────────────────────────────────────────────────

function TagBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex text-[10px] font-medium tracking-wide",
        "px-2 py-0.5 rounded-full border border-border text-muted-foreground mb-2"
      )}
    >
      {children}
    </span>
  );
}

// ── Description renderers ─────────────────────────────────────────────────────

function PrimaryMentorDescription() {
  return (
    <p className="text-xs text-muted-foreground leading-relaxed">
      Knows your product, your blockers, your tendencies.{" "}
      <strong className="text-foreground font-medium">
        Reads every Wednesday check-in. Attends every Saturday review.
      </strong>{" "}
      You never re-explain yourself.
    </p>
  );
}

function PhaseSpecialistDescription() {
  return (
    <p className="text-xs text-muted-foreground leading-relaxed">
      <strong className="text-foreground font-medium">
        Product thinking during Clarity. Execution during Build. UX during
        Users. Growth during Launch.
      </strong>{" "}
      The right expertise exactly when you need it.
    </p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TwoMentors() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Card 1 — Primary mentor */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <PrimaryMentorVisual />
        <div className="p-5">
          <TagBadge>{mentors[0].tag}</TagBadge>
          <p className="text-base font-semibold text-foreground mb-2">
            {mentors[0].name}
          </p>
          <PrimaryMentorDescription />
        </div>
      </div>

      {/* Card 2 — Phase specialist */}
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <PhaseSpecialistVisual />
        <div className="p-5">
          <TagBadge>{mentors[1].tag}</TagBadge>
          <p className="text-base font-semibold text-foreground mb-2">
            {mentors[1].name}
          </p>
          <PhaseSpecialistDescription />
        </div>
      </div>
    </div>
  );
}
