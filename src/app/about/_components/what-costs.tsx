import { cn } from "@/lib/utils";

type DontRow = {
  verb: string;
  noun: string;
  description: string;
};

const dontRows: DontRow[] = [
  {
    verb: "skip",
    noun: "validation.",
    description:
      "AI writes code fast. It won't tell you if anyone wants what you built. Talk to users before you build, not after.",
  },
  {
    verb: "prompt",
    noun: "blindly.",
    description:
      "If you can't review what the AI wrote, you don't own the codebase. Understand first, generate second.",
  },
  {
    verb: "split",
    noun: "your focus.",
    description:
      "Context switching kills momentum. One idea deserves your full attention before the next one gets any.",
  },
];

const steps = ["01", "02", "03"];

export function WhatCosts() {
  return (
    <div className="border-t border-border mt-2">
      {dontRows.map(({ verb, noun, description }, i) => (
        <div
          key={verb}
          className={cn(
            "grid py-4",
            i < dontRows.length - 1 && "border-b border-border"
          )}
          style={{ gridTemplateColumns: "48px 1fr" }}
        >
          {/* Left cell — step number */}
          <p className="text-xs font-medium text-destructive/50 pt-0.5">
            {steps[i]}
          </p>

          {/* Right cell — content */}
          <div>
            <p className="text-base font-medium text-foreground mb-1.5">
              <span className="text-muted-foreground font-normal">Don&rsquo;t </span>
              <span className="text-destructive font-semibold">{verb} </span>
              <span className="text-foreground font-medium">{noun}</span>
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
