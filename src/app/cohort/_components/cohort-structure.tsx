"use client";

import { useState } from "react";
import {
  Calendar,
  Users,
  Zap,
  MessageCircle,
  FileText,
  Clock,
  Code,
  Repeat,
  TrendingUp,
  Send,
  Mic,
  Flag,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type Phase = {
  id: number;
  tag: string;
  name: string;
  body: string;
  gate: { label: string; text: string } | null;
  badges: { icon: LucideIcon; label: string }[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

const phases: Phase[] = [
  {
    id: 0,
    tag: "Days 1–2",
    name: "Intro",
    body: "You meet your cohort. You meet your mentors. You pressure-test your idea in front of the room. By Sunday night, you have a direction and your first deliverable. No warm-up week. You start moving on Day 1.",
    gate: null,
    badges: [
      { icon: Calendar, label: "Saturday–Sunday" },
      { icon: Users, label: "8–12 builders" },
      { icon: Zap, label: "Day 1, moving" },
    ],
  },
  {
    id: 1,
    tag: "Weeks 1–2",
    name: "Clarity",
    body: "You think you know the problem. Prove it. Talk to real people. Validate your assumptions. Write a problem statement that survives scrutiny.",
    gate: {
      label: "Gate 1",
      text: "Validated problem statement + 3 user conversations. No gate, no building.",
    },
    badges: [
      { icon: MessageCircle, label: "3 user interviews" },
      { icon: FileText, label: "Problem statement" },
      { icon: Clock, label: "2 weeks" },
    ],
  },
  {
    id: 2,
    tag: "Weeks 3–8",
    name: "Build",
    body: "Build the thing. Not a pitch deck. Not a prototype in Figma. A working product. By Week 6, you put it in front of 10 strangers and watch what happens.",
    gate: {
      label: "Gate 2",
      text: "Working MVP + guerrilla test results from 10 real users. No gate, no users.",
    },
    badges: [
      { icon: Code, label: "Working MVP" },
      { icon: Users, label: "10 real users" },
      { icon: Clock, label: "6 weeks" },
    ],
  },
  {
    id: 3,
    tag: "Weeks 9–11",
    name: "Users",
    body: "Building was the easy part. Now find 20 people who come back. Run feedback loops. Fix what matters. Ignore what doesn't. Learn the difference.",
    gate: {
      label: "Gate 3",
      text: "20 active users + retention signal. No gate, no launch.",
    },
    badges: [
      { icon: Repeat, label: "Feedback loops" },
      { icon: Users, label: "20 active users" },
      { icon: TrendingUp, label: "Retention signal" },
    ],
  },
  {
    id: 4,
    tag: "Weeks 12–14",
    name: "Launch",
    body: "You go public. Twice. First launch to learn, second launch to land. The cohort ends with Demo Day — you stand up and show what you shipped.",
    gate: null,
    badges: [
      { icon: Send, label: "2 public launches" },
      { icon: Mic, label: "Demo Day" },
      { icon: Flag, label: "Day 100" },
    ],
  },
];

// ─── Step number labels ───────────────────────────────────────────────────────

const STEP_LABELS = ["0", "1", "2", "3", "4"];

// ─── Component ───────────────────────────────────────────────────────────────

export function CohortStructure() {
  const [selected, setSelected] = useState<number>(0);
  const phase = phases[selected];

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* ── Desktop: two-column grid ── */}
      <div className="hidden md:grid md:grid-cols-2">
        {/* Left column — phase selector */}
        <div className="border-r border-border">
          {phases.map((p, i) => {
            const isSelected = selected === i;
            const isLast = i === phases.length - 1;

            return (
              <button
                key={p.id}
                onClick={() => setSelected(i)}
                className={cn(
                  "w-full text-left flex items-stretch gap-0 transition-colors duration-150",
                  !isLast && "border-b border-border",
                  isSelected ? "bg-muted/40" : "hover:bg-muted/20"
                )}
              >
                {/* Step number */}
                <div className="w-16 shrink-0 flex items-center justify-center py-5 pl-4">
                  <span
                    className="font-mono text-2xl font-semibold leading-none transition-colors duration-150"
                    style={
                      isSelected
                        ? { color: "var(--brand)" }
                        : undefined
                    }
                  >
                    {STEP_LABELS[i]}
                  </span>
                </div>

                {/* Phase info */}
                <div className="flex-1 py-5 pr-4 pl-3">
                  <p className="text-xs text-muted-foreground tracking-widest uppercase mb-0.5">
                    {p.tag}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {p.name}
                    </p>
                    {p.gate && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium tracking-wide bg-brand/10 text-brand">
                        {p.gate.label}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column — detail panel */}
        <DetailPanel phase={phase} />
      </div>

      {/* ── Mobile: stacked layout ── */}
      <div className="md:hidden">
        {/* Horizontal scrollable tab strip */}
        <div className="flex overflow-x-auto border-b border-border scrollbar-none">
          {phases.map((p, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(i)}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-3 shrink-0 border-r border-border last:border-r-0 transition-colors duration-150",
                  isSelected ? "bg-muted/40" : "hover:bg-muted/20"
                )}
              >
                <span
                  className="font-mono text-base font-semibold leading-none transition-colors duration-150"
                  style={
                    isSelected
                      ? { color: "var(--brand)" }
                      : undefined
                  }
                >
                  {STEP_LABELS[i]}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel below tabs */}
        <DetailPanel phase={phase} />
      </div>
    </div>
  );
}

// ─── Detail Panel (shared between desktop & mobile) ──────────────────────────

function DetailPanel({ phase }: { phase: Phase }) {
  return (
    <div className="p-6 md:p-8">
      {/* Phase name */}
      <h3 className="text-2xl font-semibold text-foreground">
        {phase.name}
      </h3>

      {/* Body */}
      <p className="text-sm text-muted-foreground leading-relaxed mt-3">
        {phase.body}
      </p>

      {/* Gate callout */}
      {phase.gate && (
        <div className="border-l-2 border-brand pl-3 mt-4 bg-brand/5 py-2 pr-3 rounded-r-md">
          <p className="text-[10px] font-medium tracking-widest text-brand uppercase mb-1">
            {phase.gate.label}
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {phase.gate.text}
          </p>
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mt-4">
        {phase.badges.map(({ icon: Icon, label }) => (
          <Badge
            key={label}
            variant="outline"
            className="flex items-center text-xs text-muted-foreground"
          >
            <Icon size={16} className="mr-1.5" />
            {label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
