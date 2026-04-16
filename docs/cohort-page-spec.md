# 01x Cohort Page — Claude Code Implementation Spec

## Meta

- **Task:** Create a new cohort details page at `src/app/cohort/page.tsx`
- **Route:** `/cohort` (App Router, file-based routing)
- **Type:** Public page (no auth required, no Clerk middleware match)
- **Consumer:** This file is consumed by Claude Code (Opus). It contains both content copy and implementation directives.

---

## Stack Context

Read these files before writing any code:

| What | Where |
|---|---|
| Global CSS + theme vars | `src/app/globals.css` — dark/light oklch tokens, `.section-full`, `.container-narrow`, `.container-wide` |
| Layout + fonts | `src/app/layout.tsx` — Inter (400/500/600) + JetBrains Mono, ClerkProvider + ThemeProvider |
| Navbar component | `src/components/navbar.tsx` — use `variant="pages"` for this page |
| Footer component | `src/components/footer.tsx` — use `<Footer className="mt-24" />` |
| shadcn config | `components.json` — new-york style, neutral base, cssVariables: true, lucide icons |
| UI primitives | `src/components/ui/` — Button, Badge, Card, Separator, etc. |
| Utility | `src/lib/utils.ts` — `cn()` for class merging |
| Brand color | `#d7ff00` (lime green) — used for accent, logo, CTA highlights |
| Deployment | Cloudflare Workers via OpenNext — no Node.js APIs, edge-compatible only |

### Design System Rules

1. **Use existing shadcn/ui components.** Do not create new UI primitives. Available: Button, Badge, Card, Separator, Dialog, Tooltip, Input.
2. **Use existing CSS utility classes.** The repo uses `.section-full`, `.section-padding`, `.container-narrow` (max-w-2xl), `.container-wide` (max-w-5xl).
3. **Follow the dark theme.** The site defaults to system theme with dark mode. All colors must use CSS variables (`text-foreground`, `text-muted-foreground`, `bg-background`, `bg-card`, `border`, etc). Never hardcode hex colors except `#d7ff00` for brand accent.
4. **Typography:** Headlines are `font-semibold` (600). Body is weight 400. Small labels are weight 500 with `tracking-wide`. Font is Inter via `--font-inter`.
5. **Spacing pattern:** Follow existing pages — `pt-24` for content below fixed navbar, sections use `space-y-` or gap utilities, not arbitrary pixel values.
6. **No scroll-snap on this page.** The main landing page (`src/app/page.tsx`) uses `.scroll-snap-container`. This cohort page should NOT — it's a standard scrolling long-form page like `/mentors`, `/projects`, `/privacy`, `/terms`.
7. **Icons:** Use `lucide-react` only. Already in deps.
8. **No GSAP on this page.** GSAP is used for the logo animation only.
9. **Mobile-first.** Most applicants will see this on mobile via a shared link. All sections must work on small screens.

### Page Structure Pattern

Follow the pattern used by `src/app/mentors/page.tsx` and `src/app/projects/page.tsx`:

```tsx
<>
  <Navbar variant="pages" />
  <main className="min-h-screen flex flex-col bg-background pt-24">
    <div className="container-wide flex-1 pb-16">
      {/* Content sections */}
    </div>
    <Footer className="mt-24" />
  </main>
</>
```

This is a **server component** (no "use client" needed) — it's static content, no interactivity except the FAQ accordion.

---

## Content Sections

### HERO

```
headline: "100 days. Zero to One."
subtext: |
  14 weeks. 4 phases. 3 gates you have to earn your way through.

  This is not a course. There are no videos. No "community access." No passive learning.

  You enter with an idea. You leave with a launched product and real users — or you know exactly why you didn't.

  8-12 builders per cohort. Seats are limited because attention is limited.
```

**UI directive:** Use `container-narrow` for hero text. Headline should be `text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight`. Subtext paragraphs as `text-lg md:text-xl text-muted-foreground leading-relaxed`. Match the hero pattern from `src/app/page.tsx` but without the Badge/CTA buttons — just text. Add bottom margin before next section (`mb-16 md:mb-24`).

---

### SECTION 1: The 100-Day Structure

**UI directive:** Use `container-wide`. Section heading: `text-3xl md:text-4xl font-semibold mb-12`. Each phase block should be a bordered card-like element. Consider using a vertical timeline or stacked cards with a left accent border in `#d7ff00` for the gate callouts.

#### Block: Intro Weekend
```
label: "Days 1–2 — Intro Weekend (Saturday–Sunday)"
body: "You meet your cohort. You meet your mentors. You pressure-test your idea in front of the room. By Sunday night, you have a direction and your first deliverable. No warm-up week. You start moving on Day 1."
```

#### Block: Phase 1 — Clarity
```
label: "Weeks 1–2 — Clarity"
body: "You think you know the problem. Prove it. Talk to real people. Validate your assumptions. Write a problem statement that survives scrutiny."
gate: "Gate 1: Validated problem + 3 user conversations. No gate, no building."
```

#### Block: Phase 2 — Build
```
label: "Weeks 3–8 — Build"
body: "Build the thing. Not a pitch deck. Not a prototype in Figma. A working product. By Week 6, you put it in front of 10 strangers and watch what happens."
gate: "Gate 2: Working MVP + guerrilla test results from 10 real users. No gate, no users."
```

#### Block: Phase 3 — Users
```
label: "Weeks 9–11 — Users"
body: "Building was the easy part. Now find 20 people who come back. Run feedback loops. Fix what matters. Ignore what doesn't. Learn the difference."
gate: "Gate 3: 20 active users + retention signal. No gate, no launch."
```

#### Block: Phase 4 — Launch
```
label: "Weeks 12–14 — Launch"
body: "You go public. Twice. First launch to learn, second launch to land. The cohort ends with Demo Day — you stand up and show what you shipped."
```

**Gate callout styling:** Gates should be visually distinct from the body text. Use a `border-l-2 border-[#d7ff00] pl-4` pattern with `text-sm font-medium text-muted-foreground italic` or similar. They are the structural spine of the page — make them feel like checkpoints.

---

### SECTION 2: What You'll Ship in 100 Days

```
heading: "What you'll ship in 100 days"
intro: "This is not a list of things you'll 'learn about.' These are artifacts you will have built and own when you walk out."
```

**Items:**
- A validated problem statement backed by real user conversations
- A working MVP that solves a real problem for real people
- Guerrilla test results from 10 users with documented patterns
- 20 active users who chose to use your product
- A feedback synthesis — what you changed, what you ignored, and why
- Launch assets — landing page, positioning, distribution channels mapped
- Two public launches with documented results
- A Demo Day presentation of your shipped product
- A peer network of 8-12 builders who watched you ship

```
closing: "If you do the work, you leave with all of this. If you don't, you'll know exactly where you stalled."
```

**UI directive:** Use green checkmarks (`text-green-600` / `dark:text-green-400`) consistent with the "Is this for you?" section on the main page (`src/app/page.tsx`, section `#for-you`). Each item as a `flex gap-3` row with `<span className="text-green-600 shrink-0">✓</span>`.

---

### SECTION 3: The Weekly Rhythm

```
heading: "The weekly rhythm"
intro: "Every week. Same beat. No ambiguity."
```

**Days:**

| Day | Label | Body |
|---|---|---|
| Sunday | Direction | Mentor-led session. Framework, context, hard questions. You set your weekly goal. You get your deliverable assignment. |
| Monday–Tuesday | Build | *(no body — just the label)* |
| Wednesday | Async check-in | Three questions. What did you ship since Sunday? What's blocking you? What's the plan for Thursday–Friday? Your mentor reads it and responds. This catches blockers 3 days before Saturday, not after. |
| Thursday–Friday | Build | Complete your deliverable. |
| Saturday | Review | Office hours with mentors. Your deliverable gets graded. Your peer reviews your work. No hiding. You leave knowing exactly where you stand. |

**UI directive:** Render as a compact vertical list. Each day as a row: day label in `font-medium text-foreground` (fixed width or grid column), description in `text-muted-foreground`. Use the `→` arrow pattern seen throughout the existing site for the day label prefix. For days with no body text (Mon-Tue), just show the label. Consider a subtle `border-l` timeline or simple stacked rows with separator.

---

### SECTION 4: Deliverables Are Graded

```
heading: "Deliverables are graded. Every week."
intro: "Every Sunday produces a mandatory deliverable due by Friday. Graded on three levels:"
```

**Grades:**

| Level | Label | Description |
|---|---|---|
| L1 | Ship-grade | Complete, clear, demonstrates real understanding and effort. This is the standard. |
| L2 | Draft-grade | Good attempt. Gaps remain. Shows engagement but needs refinement. |
| L3 | Incomplete | Didn't show up meaningfully. This is the signal that you're falling behind. |

```
closing: "You get one resubmission per deliverable. The system rewards effort. It does not reward coasting."
```

**UI directive:** Render as three stacked cards or a three-column grid on desktop. L1 should feel prominent (maybe `border-[#d7ff00]` accent). L3 should feel like a warning (maybe `border-destructive/50` or `text-muted-foreground` diminished). Use the existing `Card` component from `src/components/ui/card.tsx` or simple bordered divs. Keep it compact.

---

### SECTION 5: Two Mentors

```
heading: "Two mentors. Not optional."
```

**Primary mentor:**
"is with you from Day 1 to Day 100. They know your product, your blockers, your tendencies. They read your Wednesday check-ins. They attend your Saturday reviews. They carry context so you don't have to re-explain yourself every week."

**Phase specialist:**
"rotates as you progress. Product thinker during Clarity. Execution-focused builder during Build. UX and user psychology during Users. Growth operator during Launch. The right expertise at the right moment."

```
closing: "Mentors are builders, not lecturers. They've shipped products, made hard calls under uncertainty, and know the difference between real progress and motion."
```

**UI directive:** Two-column grid on desktop (`grid md:grid-cols-2 gap-8`), stacked on mobile. Each mentor type as a card or bordered block with the label bolded. Follow the card pattern from the Mentorship section on the main page.

---

### SECTION 6: Cohort Composition

```
heading: "Cohort composition is deliberate"
intro: "Each cohort is mixed by design:"
```

**Segments:**
- ~40% — Technical builders who can code their MVP. They are the engine.
- ~30% — Product and design thinkers who challenge the "what" and "why." They keep builders honest.
- ~20% — Growth and business operators who solve distribution. They prevent "build it and they will come."
- ~10% — Domain experts with deep vertical knowledge. They ground ideas in reality.

```
closing: "You're paired with someone from a different segment for weekly peer review. The engineer reviews the product person's positioning. The product person reviews the engineer's UX. You will see your blind spots."
```

**UI directive:** Use percentage as a prominent element (large text or badge). Each segment as a row with percentage, label, and description. Match the `→` arrow list pattern used in existing sections.

---

### SECTION 7: Observer Mode

```
heading: "What if you're not ready"
body: |
  If you don't pass a gate, you get one extra week in that phase. If you're still not there, you move to observer mode — you attend sessions, learn from your peers, but you don't launch something that isn't ready.

  No shame in it. Observer mode exists because shipping garbage helps no one. You'll know exactly where you stalled and what to fix next.
```

**UI directive:** This is a short section. Render as a callout block — consider `rounded-xl border border-dashed bg-muted/20 p-6` pattern used in the projects page (`src/app/me/projects/page.tsx` info callout at bottom).

---

### SECTION 8: Pricing

```
price_headline: "₹15,000 for 100 days."
price_body: "That's ₹150 per day of structured mentorship, graded deliverables, peer review, and accountability. There is no cheaper way to get two dedicated mentors, a curated peer cohort, and a system that forces you to ship."
```

**Payment structure:**
1. ₹5,000 deposit when your application is accepted. — "This locks your seat. Non-refundable. This is the commitment filter."
2. ₹10,000 before Day 1 — the intro weekend. — "Pay before you start."

```
closing: "This is not a subscription. Not a paywall. It's a filter."
```

**UI directive:** Give this section visual weight. The price headline should be large (`text-3xl md:text-4xl font-semibold`). The payment steps as a two-step numbered list with clear structure. Consider a subtle background shift or a card with slightly different `bg-card` or `bg-muted/10` to make pricing feel anchored. Do NOT make it look like a SaaS pricing table — keep it editorial and direct.

---

### SECTION 9: FAQ

```
heading: "FAQ"
```

**Questions and Answers:**

1. **What are the session timings?** — Sundays and Saturdays. Exact IST timings will be shared when the cohort is confirmed. Expect 1.5–2 hours each session.
2. **Is this online or in-person?** — Online. All sessions happen over video. You can join from anywhere.
3. **What tools do we use?** — Slack for async communication and Wednesday check-ins. Video calls for Sunday and Saturday sessions. Deliverables submitted via a shared workspace — details shared on Day 1.
4. **What if I miss a Sunday or Saturday session?** — Sessions are not recorded for replay. If you miss one, your primary mentor will debrief you async — but you lose the live interaction and peer feedback. Missing more than 2 sessions in a phase puts your gate progression at risk.
5. **How does resubmission work?** — You get one resubmission per deliverable. Your mentor gives feedback on Saturday with your grade. If you got an L2 or L3, you can resubmit by the following Wednesday with improvements. Graded again by your phase specialist.
6. **What if my idea changes mid-cohort?** — It probably will. That's what Phase 1 is for. Pivoting during Clarity is expected. Pivoting during Build is expensive. Pivoting during Launch means you skipped the gates.
7. **Can I do this alongside a full-time job?** — Yes. The rhythm is designed for working professionals. Sundays set direction, weeknights and Saturday mornings are where the work happens. But you will feel the squeeze. That's the point.
8. **Is the ₹5,000 deposit part of the ₹15,000 total?** — Yes. Total cost is ₹15,000. You pay ₹5,000 when accepted (non-refundable, locks your seat). The remaining ₹10,000 is due before Day 1.
9. **Can I join mid-cohort?** — No. Everyone starts on Day 1. The intro weekend sets the foundation for the entire 100 days.
10. **How are primary mentors assigned?** — Based on your background, your idea, and where you'll need the most support. You don't choose — we match. The goal is complementary pairing, not comfort.
11. **What happens in observer mode?** — You attend all Sunday and Saturday sessions. You watch, listen, and learn from your peers. You don't submit deliverables or go through gates. Your primary mentor stays in touch async. You can re-enter a future cohort from the phase where you paused.
12. **What happens after Demo Day?** — You have a launched product, real users, and a peer network. What you do next is up to you. Some will keep building. Some will realize they need to go back to Clarity on a different idea. Both are wins.
13. **How fast will I hear back after applying?** — Applications are reviewed manually. Expect a response within 5–7 days. If you're accepted, you'll receive payment instructions and your seat is held for 48 hours.
14. **Is there a refund after Day 1?** — No. Once the cohort starts, there are no refunds. You committed to 100 days. See it through.

**UI directive:** Implement as an accordion/collapsible pattern. This is the ONE place on the page where progressive disclosure makes sense. Use a simple custom accordion with `useState` (this will need `"use client"` — extract as a `<CohortFAQ />` client component, keep the rest of the page as a server component). Style: question as `font-medium text-foreground`, answer as `text-muted-foreground text-sm leading-relaxed`. Use `ChevronDown` from lucide-react for the toggle icon. Match the minimal aesthetic — no heavy borders, just a bottom border between items.

---

### CTA (Bottom of page)

```
button_text: "Apply Now"
button_link: "/cohort/apply"
```

**UI directive:** Use `<Button size="lg" asChild><Link href="/apply">Apply for the next cohort</Link></Button>`. Center it. Add a short line above: "Cohorts are limited. Applications are reviewed manually." in `text-muted-foreground`. Consider also placing a secondary CTA after the Pricing section. Match the CTA section pattern from `src/app/page.tsx` section `#cta`.

---

## File Structure

Create these files:

```
src/app/cohort/page.tsx          — Main page (server component)
src/app/cohort/_components/      — Page-specific client components
src/app/cohort/_components/cohort-faq.tsx  — FAQ accordion (client component)
```

Do NOT create new files in `src/components/ui/`. Use what exists.

## Checklist Before Shipping

- [ ] Page renders at `/cohort`
- [ ] Navbar shows with `variant="pages"` (Home, cross-link, Apply CTA)
- [ ] All 9 content sections render in order
- [ ] FAQ accordion works (expand/collapse)
- [ ] Gate callouts are visually distinct with `#d7ff00` accent
- [ ] Pricing section has visual weight
- [ ] CTA button links to `/apply`
- [ ] Footer renders at bottom
- [ ] Dark mode works (all colors via CSS variables)
- [ ] Mobile layout works (test at 375px width)
- [ ] No hydration errors (server component where possible, client only for FAQ)
- [ ] No new npm dependencies added
