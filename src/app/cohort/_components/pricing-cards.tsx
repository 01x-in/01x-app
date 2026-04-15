import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// ── Types & Data ──────────────────────────────────────────────────────────────

type PaymentStep = {
  amount: string;
  label: string;
  description: string;
  tag: string;
  prominent: boolean;
};

const steps: PaymentStep[] = [
  {
    amount: "₹5,000",
    label: "Deposit",
    description:
      "Locks your seat on acceptance. Non-refundable. This is the commitment filter.",
    tag: "On acceptance",
    prominent: true,
  },
  {
    amount: "₹10,000",
    label: "Before Day 1",
    description:
      "Due before the intro weekend. No installments. No exceptions.",
    tag: "Before Day 1",
    prominent: false,
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function PricingCards() {
  return (
    <div className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-2">
      {steps.map((step) => (
        <div
          key={step.label}
          className={cn(
            "border rounded-xl overflow-hidden bg-card",
            step.prominent ? "border-border/80" : "border-border"
          )}
        >
          <div className="p-5">
            {/* Amount */}
            <p className="text-2xl font-semibold text-foreground leading-none mb-1">
              {step.amount}
            </p>

            {/* Label */}
            <p className="text-xs font-medium text-muted-foreground mb-3">
              {step.label}
            </p>

            {/* Divider */}
            <Separator />

            {/* Description */}
            <p className="text-xs text-muted-foreground leading-relaxed mt-3">
              {step.description}
            </p>

            {/* Timing tag */}
            <span
              className={cn(
                "inline-block text-[9px] font-medium tracking-widest uppercase px-2 py-0.5 rounded mt-3",
                step.prominent
                  ? "bg-[#d7ff00]/10 text-[#d7ff00]"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step.tag}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
