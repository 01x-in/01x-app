import { Code2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types & Data ──────────────────────────────────────────────────────────────

type Segment = {
  percentage: string;
  name: string;
  description: string;
  role: string;
};

const segments: Segment[] = [
  {
    percentage: "~40%",
    name: "Technical builders",
    description: "They ship the product. Without them nothing gets built.",
    role: "The engine",
  },
  {
    percentage: "~35%",
    name: "Product & design thinkers",
    description:
      "They challenge the what and the why. They keep builders honest.",
    role: "The compass",
  },
  {
    percentage: "~25%",
    name: "Growth & business operators",
    description:
      'They solve distribution. They prevent "build it and they will come."',
    role: "The fuel",
  },
];

// ── Visual zones ──────────────────────────────────────────────────────────────

function TechnicalBuildersVisual() {
  return (
    <div
      className={cn(
        "h-28 bg-secondary border-b border-border",
        "flex items-center justify-center"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Code icon in rounded rect */}
        <div
          className={cn(
            "w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0",
            "bg-brand/10 border border-brand/30"
          )}
        >
          <Code2 size={22} stroke="var(--brand)" />
        </div>

        {/* Code lines */}
        <div className="flex flex-col gap-1.5">
          <div className="h-1.5 w-24 rounded-full bg-brand/20" />
          <div className="h-1.5 w-20 rounded-full bg-border" />
          <div className="h-1.5 w-16 rounded-full bg-border" />
          <div className="h-1.5 w-12 rounded-full bg-border" />
        </div>
      </div>
    </div>
  );
}

function ProductDesignVisual() {
  return (
    <div
      className={cn(
        "h-28 bg-secondary border-b border-border",
        "flex items-center justify-center"
      )}
    >
      {/* Wireframe layout */}
      <div className="flex flex-col gap-1 w-36">
        {/* Header bar */}
        <div
          className={cn(
            "h-3.5 w-full rounded-sm border",
            "bg-brand/20 border-brand/30"
          )}
        />
        {/* Body: sidebar + content */}
        <div className="flex gap-1">
          {/* Sidebar */}
          <div className="h-12 w-10 rounded-sm border border-border bg-transparent" />
          {/* Content area */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-3 rounded-sm border border-border bg-transparent" />
            <div
              className={cn(
                "h-3 rounded-sm border",
                "bg-brand/15 border-border"
              )}
            />
            <div className="h-3 rounded-sm border border-border bg-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowthOperatorsVisual() {
  return (
    <div
      className={cn(
        "h-28 bg-secondary border-b border-border",
        "flex items-center justify-center"
      )}
    >
      <div className="flex items-end gap-2">
        {/* Three vertical bars */}
        <div className="flex items-end gap-1.5">
          <div className="w-4 h-6 rounded-sm bg-border" />
          <div className="w-4 h-10 rounded-sm bg-border" />
          <div className="w-4 h-14 rounded-sm bg-brand" />
        </div>
        {/* TrendingUp icon */}
        <TrendingUp size={16} stroke="var(--brand)" className="mb-0.5" />
      </div>
    </div>
  );
}

// ── Visual zone selector ──────────────────────────────────────────────────────

function CardVisual({ index }: { index: number }) {
  if (index === 0) return <TechnicalBuildersVisual />;
  if (index === 1) return <ProductDesignVisual />;
  return <GrowthOperatorsVisual />;
}

// ── Main component ────────────────────────────────────────────────────────────

export function CohortComposition() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      {segments.map((segment, index) => (
        <div
          key={segment.name}
          className="border border-border rounded-xl overflow-hidden bg-card"
        >
          {/* Visual zone */}
          <CardVisual index={index} />

          {/* Content zone */}
          <div className="p-5">
            <p className="text-3xl font-semibold text-brand leading-none mb-1.5">
              {segment.percentage}
            </p>
            <p className="text-sm font-semibold text-foreground mb-1">
              {segment.name}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {segment.description}
            </p>
            <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground/60 mt-2">
              {segment.role}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
