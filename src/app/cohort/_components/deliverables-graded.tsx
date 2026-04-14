import { cn } from "@/lib/utils";

type Grade = {
  level: "L1" | "L2" | "L3";
  name: string;
  description: string;
  theme: "green" | "neutral" | "red";
};

const grades: Grade[] = [
  {
    level: "L1",
    name: "Ship-grade",
    description:
      "Complete, clear, demonstrates real understanding and effort. This is the standard.",
    theme: "green",
  },
  {
    level: "L2",
    name: "Draft-grade",
    description:
      "Good attempt. Gaps remain. Shows engagement but needs refinement.",
    theme: "neutral",
  },
  {
    level: "L3",
    name: "Incomplete",
    description:
      "Didn\u2019t show up meaningfully. This is the signal that you\u2019re falling behind.",
    theme: "red",
  },
];

const themeConfig = {
  green: {
    // Outer card border
    cardBorder: "border-[#d7ff00]/70",
    // 2px top accent bar
    accentBar: "bg-[#d7ff00]",
    // Large grade number text
    levelText: "text-[#d7ff00]",
    // Left cell tinted background (~10% opacity)
    leftBg: "bg-[#d7ff00]/10",
    // "GRADE" label text (~60% opacity)
    gradeLabel: "text-[#d7ff00]/60",
  },
  neutral: {
    cardBorder: "border-border/60",
    accentBar: "bg-border",
    levelText: "text-foreground",
    leftBg: "bg-muted/30",
    gradeLabel: "text-muted-foreground/60",
  },
  red: {
    cardBorder: "border-destructive/40",
    accentBar: "bg-destructive/50",
    levelText: "text-destructive",
    leftBg: "bg-destructive/10",
    gradeLabel: "text-destructive/60",
  },
};

export function DeliverablesGraded() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {grades.map((grade) => {
        const t = themeConfig[grade.theme];
        return (
          <div
            key={grade.level}
            className={cn(
              "rounded-xl border overflow-hidden bg-card flex flex-col",
              t.cardBorder
            )}
          >
            {/* 2px top accent bar — full width, flush to top, inside border-radius */}
            <div className={cn("h-[2px] w-full shrink-0", t.accentBar)} />

            {/* Two-column internal layout */}
            <div className="flex flex-1">
              {/* Left cell — fixed ~72px wide */}
              <div
                className={cn(
                  "w-[72px] shrink-0 flex flex-col items-center justify-center gap-0.5 border-r border-border py-5",
                  t.leftBg
                )}
              >
                <span className={cn("text-2xl font-semibold leading-none", t.levelText)}>
                  {grade.level}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-medium tracking-widest uppercase leading-none mt-1",
                    t.gradeLabel
                  )}
                >
                  GRADE
                </span>
              </div>

              {/* Right cell */}
              <div className="flex-1 p-4 flex flex-col justify-center">
                <p className="text-sm font-semibold text-foreground mb-1.5">
                  {grade.name}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {grade.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
