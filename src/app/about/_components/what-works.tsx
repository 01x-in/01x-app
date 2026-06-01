import { Zap, Timer, Users, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DoCard = {
  icon: LucideIcon;
  verb: string;
  noun: string;
  description: string;
  tag: string;
};

const doCards: DoCard[] = [
  {
    icon: Zap,
    verb: "Ship",
    noun: "before it's ready.",
    description:
      'A working thing in front of a real user beats a perfect thing in your head. AI removes the "not done yet" excuse.',
    tag: "Speed",
  },
  {
    icon: Timer,
    verb: "Use",
    noun: "deadlines as a weapon.",
    description:
      "A hard end date kills scope creep faster than any planning session. Constraints are the point.",
    tag: "Focus",
  },
  {
    icon: Users,
    verb: "Stay",
    noun: "small on purpose.",
    description:
      "Two people with AI move faster than ten without it. Every person you add is coordination overhead.",
    tag: "Leverage",
  },
];

export function WhatWorks() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {doCards.map(({ icon: Icon, verb, noun, description, tag }) => (
        <div
          key={verb}
          className="border border-border rounded-xl overflow-hidden bg-card flex flex-col"
        >
          {/* Visual zone */}
          <div
            className={cn(
              "h-24 bg-muted/50 border-b border-border",
              "flex items-center justify-center"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "bg-brand/10 border border-brand/25"
              )}
            >
              <Icon size={22} className="text-brand" />
            </div>
          </div>

          {/* Content zone */}
          <div className="p-4 flex flex-col">
            <p className="text-xl font-semibold text-brand leading-none">
              {verb}
            </p>
            <p className="text-sm font-medium text-foreground mb-2">{noun}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
            <p className="text-[9px] font-medium tracking-widest uppercase text-muted-foreground/60 mt-3">
              {tag}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
