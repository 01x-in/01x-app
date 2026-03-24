"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqItems = [
  {
    question: "What are the session timings?",
    answer:
      "Sundays and Saturdays. Exact IST timings will be shared when the cohort is confirmed. Expect 1.5–2 hours each session.",
  },
  {
    question: "Is this online or in-person?",
    answer:
      "Online. All sessions happen over video. You can join from anywhere.",
  },
  {
    question: "What tools do we use?",
    answer:
      "Slack for async communication and Wednesday check-ins. Video calls for Sunday and Saturday sessions. Deliverables submitted via a shared workspace — details shared on Day 1.",
  },
  {
    question: "What if I miss a Sunday or Saturday session?",
    answer:
      "Sessions are not recorded for replay. If you miss one, your primary mentor will debrief you async — but you lose the live interaction and peer feedback. Missing more than 2 sessions in a phase puts your gate progression at risk.",
  },
  {
    question: "How does resubmission work?",
    answer:
      "You get one resubmission per deliverable. Your mentor gives feedback on Saturday with your grade. If you got an L2 or L3, you can resubmit by the following Wednesday with improvements. Graded again by your phase specialist.",
  },
  {
    question: "What if my idea changes mid-cohort?",
    answer:
      "It probably will. That\u2019s what Phase 1 is for. Pivoting during Clarity is expected. Pivoting during Build is expensive. Pivoting during Launch means you skipped the gates.",
  },
  {
    question: "Can I do this alongside a full-time job?",
    answer:
      "Yes. The rhythm is designed for working professionals. Sundays set direction, weeknights and Saturday mornings are where the work happens. But you will feel the squeeze. That\u2019s the point.",
  },
  {
    question: "Is the \u20B95,000 deposit part of the \u20B915,000 total?",
    answer:
      "Yes. Total cost is \u20B915,000. You pay \u20B95,000 when accepted (non-refundable, locks your seat). The remaining \u20B910,000 is due before Day 1.",
  },
  {
    question: "Can I join mid-cohort?",
    answer:
      "No. Everyone starts on Day 1. The intro weekend sets the foundation for the entire 100 days.",
  },
  {
    question: "How are primary mentors assigned?",
    answer:
      "Based on your background, your idea, and where you\u2019ll need the most support. You don\u2019t choose — we match. The goal is complementary pairing, not comfort.",
  },
  {
    question: "What happens in observer mode?",
    answer:
      "You attend all Sunday and Saturday sessions. You watch, listen, and learn from your peers. You don\u2019t submit deliverables or go through gates. Your primary mentor stays in touch async. You can re-enter a future cohort from the phase where you paused.",
  },
  {
    question: "What happens after Demo Day?",
    answer:
      "You have a launched product, real users, and a peer network. What you do next is up to you. Some will keep building. Some will realize they need to go back to Clarity on a different idea. Both are wins.",
  },
  {
    question: "How fast will I hear back after applying?",
    answer:
      "Applications are reviewed manually. Expect a response within 5–7 days. If you\u2019re accepted, you\u2019ll receive payment instructions and your seat is held for 48 hours.",
  },
  {
    question: "Is there a refund after Day 1?",
    answer:
      "No. Once the cohort starts, there are no refunds. You committed to 100 days. See it through.",
  },
];

export function CohortFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="divide-y divide-border">
      {faqItems.map((item, index) => (
        <div key={index}>
          <button
            onClick={() => toggle(index)}
            className="flex w-full items-center justify-between py-4 text-left"
          >
            <span className="font-medium text-foreground pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "grid transition-all duration-200 ease-in-out",
              openIndex === index
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
