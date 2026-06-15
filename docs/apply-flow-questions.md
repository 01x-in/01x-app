# Apply Flow Questions

Documentation of every question and answer choice in the two conversational application flows:

- **Cohort (member) application** — `/cohort/apply` (there is no `/apply` route; this is the member journey)
  - Source: [src/app/cohort/apply/lib/questions.ts](../src/app/cohort/apply/lib/questions.ts)
  - Submits to `POST /api/apply` → `applications` table
- **Mentor application** — `/mentors/apply`
  - Source: [src/app/mentors/apply/lib/questions.ts](../src/app/mentors/apply/lib/questions.ts)
  - Submits to `POST /api/mentor/apply` → `mentor_applications` table

Both flows use the `ConversationalFlow` chat UI. Section-transition messages ("celebrations") and the intro/submit confirmations are not answers — they only advance the chat. Skip logic is noted per question.

---

## Cohort (member) application — `/cohort/apply`

**Intro message:** "Hey there, builder! 👋 I'm here to learn about what you're creating. This will take about 2-3 minutes. Ready to dive in?" → button **Let's go! 🚀**

### Demographics

| ID | Question | Type | Required | Answer choices / input |
|---|---|---|---|---|
| `fullName` | What's your full name? | text | Yes | Free text |
| `email` | Great to meet you, {firstName}! What's your email address? | email | Yes | Free text, validated against email regex |
| `location` | Where are you based? (City/Country) | text | Yes | Free text, e.g. "San Francisco, USA" |
| `linkedinUrl` | Got a LinkedIn or portfolio URL? (Optional, but helps us learn more about you) | text | No | Free text with `https://linkedin.com/in/` prefix |

> Transition: "Nice to meet you! Let's talk about what you're building. 🚀"

### Product vision

| ID | Question | Type | Required |
|---|---|---|---|
| `whatBuilding` | Give us your quick pitch! What are you building, and what problem does it solve? | textarea | Yes |

> Transition: "Love the vision! Let me understand where you're at right now."

### Current stage

**`currentStage`** — "Where are you in the journey right now?" (select, required)

| Value | Label |
|---|---|
| `zero` | 💡 Zero — Just an idea |
| `between` | 🔨 Between — Actively building |
| `one` | 🚀 One — Have an MVP |

**`productLink`** — "Nice! Got a link to what you've built?" (url, optional) — **skipped when `currentStage` is `zero`**

> Transition: "Got it! One more thing about your skillset."

### Skillset

**`superpower`** — "What's your superpower? The thing you're really good at?" (select, required)

| Value | Label |
|---|---|
| `engineering` | 💻 Engineering |
| `product` | 📦 Product |
| `design` | 🎨 Design |
| `growth` | 📣 Growth & Marketing |

> Transition: "Awesome! Now let's talk about your goals."

### Expectations

**`primaryGoal`** — "What's your primary goal for joining 01X?" (select, required)

| Value | Label |
|---|---|
| `ship-mvp` | 🚢 Ship my MVP |
| `find-cofounder` | 🤝 Find a co-founder |
| `learn-build` | 📚 Learn to build |
| `get-feedback` | 💬 Get feedback |
| `accountability` | ✅ Accountability |
| `network` | 🌐 Build my network |

**`successLooksLike`** — "By the end of 12 weeks, what does success look like for you?" (textarea, required)

> Transition: "Almost there! Just a couple optional questions to wrap up."

### Closing (optional)

| ID | Question | Type | Required |
|---|---|---|---|
| `biggestFear` | What's one thing you're afraid might go wrong with your project? (Optional, but helps us understand where to support you) | textarea | No |
| `specificHelp` | If you could get one specific type of help, what would it be? | textarea | No |

**Submit message:** "Amazing work, {firstName}! 🎉 You've shared a lot, and I can tell you're serious about building something real. Ready to submit your application?" → button **Submit Application 🚀**

---

## Mentor application — `/mentors/apply`

**Intro message:** "Hey there! 👋 We're building a community of exceptional mentors for early-stage builders. This takes about 3–4 minutes. We'll ask about your background and expertise. Ready?" → button **Let's do it 🚀**

### Profile

| ID | Question | Type | Required | Notes |
|---|---|---|---|---|
| `fullName` | What's your full name? | text | Yes | |
| `email` | Nice to meet you, {firstName}! What's your email address? | email | Yes | Email regex validation |
| `title` | What's your current role or title? | text | Yes | e.g. "Founder, Head of Product at Acme" |
| `location` | Where are you based? | text | Yes | e.g. "London, UK" |
| `linkedinUrl` | LinkedIn or portfolio URL? (This will be shown on your public profile) | url | No | |
| `twitterUrl` | Twitter/X handle? (Optional) | url | No | |

> Transition: "Great to meet you! Now let's understand your expertise. 🎯"

### Expertise

**`domains`** — "What's your primary domain of expertise?" (select, required)

| Value | Label |
|---|---|
| `Product` | 📦 Product |
| `Engineering` | 💻 Engineering |
| `Design` | 🎨 Design |
| `Growth` | 📈 Growth & Marketing |
| `Founder` | 🏗️ Founder / Operator |
| `AI` | 🤖 AI & ML |

**`yearsExperience`** — "How many years of hands-on experience do you have in this domain?" (select, required)

| Value | Label |
|---|---|
| `2-4` | 📌 2–4 years |
| `5-8` | 🔥 5–8 years |
| `9-14` | ⚡ 9–14 years |
| `15+` | 🏆 15+ years |

**`bioShort`** — "Give us a one-to-two sentence bio. This will appear on your public mentor card." (textarea, required)

**`biggestWin`** — "What's one thing you've built, shipped, or achieved that you're genuinely proud of?" (textarea, required)

**`bestAt`** — "Where do you add the most value when working with early-stage builders?" (select, required)

| Value | Label |
|---|---|
| `idea-validation` | 🔍 Idea validation & problem clarity |
| `product-strategy` | 🗺️ Product strategy & roadmap |
| `technical-direction` | ⚙️ Technical direction & architecture |
| `growth-gtm` | 📣 Growth, GTM & distribution |
| `fundraising` | 💰 Fundraising & investor narrative |
| `hiring-team` | 👥 Hiring & building early team |

> Transition: "Almost there! 🎉 A couple of final questions to help us set up your profile."

### Closing

**`heardAboutUs`** — "How did you hear about 01X?" (select, required)

| Value | Label |
|---|---|
| `twitter` | 🐦 Twitter / X |
| `linkedin` | 💼 LinkedIn |
| `referral` | 👋 Someone referred me |
| `cohort-member` | 🤝 A current cohort member |
| `other` | 🌐 Other |

**`anythingElse`** — "Anything else you'd like us to know? Any constraints, questions, or context?" (textarea, optional)

**Submit message:** "You're all set, {firstName}! 🙌 We'll review your application and reach out within a few days. We keep the mentor community intentionally small — so if you're a fit, you'll know soon. Ready to submit?" → button **Submit Application 🚀**

---

## Summary

| Flow | Route | Questions (excl. intro/submit/transitions) | Conditional questions |
|---|---|---|---|
| Cohort (member) | `/cohort/apply` | 12 | `productLink` (skipped at idea stage) |
| Mentor | `/mentors/apply` | 13 | None |

Keep this file in sync when editing either `questions.ts` — it is hand-maintained, not generated.
