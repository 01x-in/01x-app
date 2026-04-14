import {
  Sun,
  Code2,
  MessageCircle,
  CheckSquare,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type RhythmDay = {
  abbr: string;
  type: "structured" | "build";
  icon: LucideIcon;
  role: string;
};

type RhythmCard = {
  role: string;
  description: string;
  buildDays?: string[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const days: RhythmDay[] = [
  { abbr: "SUN", type: "structured", icon: Sun,           role: "Direction" },
  { abbr: "MON", type: "build",      icon: Code2,         role: "Build"     },
  { abbr: "TUE", type: "build",      icon: Code2,         role: "Build"     },
  { abbr: "WED", type: "structured", icon: MessageCircle, role: "Check-in"  },
  { abbr: "THU", type: "build",      icon: Code2,         role: "Build"     },
  { abbr: "FRI", type: "build",      icon: Code2,         role: "Build"     },
  { abbr: "SAT", type: "structured", icon: CheckSquare,   role: "Review"    },
];

const cards: RhythmCard[] = [
  {
    role: "Direction",
    description:
      "Mentor-led session. Framework, context, hard questions. You set your weekly goal and get your deliverable assignment.",
  },
  {
    role: "Build",
    description:
      "Execute on your weekly goal. No meetings, no ceremony. Ship the deliverable.",
    buildDays: ["Mon", "Tue", "Thu", "Fri"],
  },
  {
    role: "Async check-in",
    description:
      "Three questions. What did you ship? What's blocking you? What's the plan for Thu–Fri? Your mentor responds same day.",
  },
  {
    role: "Review",
    description:
      "Office hours with mentors. Your deliverable gets graded. Your peer reviews your work. No hiding. You leave knowing exactly where you stand.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function WeeklyRhythm() {
  return (
    <div className="flex flex-col gap-3">
      {/* ── Part 1: 7-day grid ── */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const Icon = day.icon;
          const isStructured = day.type === "structured";

          return (
            <div
              key={day.abbr}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg",
                isStructured
                  ? "border border-[#d7ff00] bg-[#d7ff00]/5"
                  : "bg-muted/50"
              )}
            >
              {/* Day abbreviation */}
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wide uppercase",
                  !isStructured && "text-muted-foreground"
                )}
                style={isStructured ? { color: "#d7ff00" } : undefined}
              >
                {day.abbr}
              </span>

              {/* Icon circle */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  isStructured ? "bg-[#d7ff00]/10" : "bg-muted"
                )}
              >
                <Icon
                  size={13}
                  className={cn(
                    isStructured ? "text-[#d7ff00]" : "text-muted-foreground"
                  )}
                />
              </div>

              {/* Role label */}
              <span className="text-[9px] text-center text-muted-foreground leading-tight">
                {day.role}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Part 2: 4-card grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {cards.map((card) => (
          <div
            key={card.role}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className="text-sm font-medium text-foreground mb-1.5">
              {card.role}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {card.description}
            </p>
            {card.buildDays && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {card.buildDays.map((d) => (
                  <span
                    key={d}
                    className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded border border-border"
                  >
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
