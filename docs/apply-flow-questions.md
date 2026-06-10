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

**Intro message:** "Hey there, builder! 👋 I'm here to learn about what you're creating. This will take about 5-7 minutes. Ready to dive in?" → button **Let's go! 🚀**

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
| `whatBuilding` | So, what are you building? Give me the quick pitch. | textarea | Yes |
| `whyMatters` | Why does this matter to *you* personally? What's driving you? | textarea | Yes |
| `currentApproach` | How are you approaching it right now? What's your current method or status? | textarea | Yes |
| `problemSolved` | What specific problem does this solve? | textarea | Yes |

> Transition: "Love the vision! Let me understand where you're at right now."

### Current stage

**`currentStage`** — "Where are you in the journey right now?" (select, required)

| Value | Label |
|---|---|
| `zero` | 💡 Zero — Just an idea |
| `between` | 🔨 Between — Actively building |
| `one` | 🚀 One — Have an MVP |

**`productLink`** — "Nice! Got a link to what you've built?" (url, optional) — **skipped when `currentStage` is `zero`**

> Transition: "Got it! A few questions about your team situation..."

### Team

**`hasCofounder`** — "Do you have a co-founder or team?" (select, required)

| Value | Label |
|---|---|
| `yes` | 👥 Yes, I have a team |
| `no` | 🦸 No, going solo |
| `looking` | 🔍 Looking for one |

**`openToConnect`** — "Would you be open to connecting with potential co-founders in the cohort?" (select, required)

| Value | Label |
|---|---|
| `yes` | 🤝 Yes, definitely! |
| `no` | ✓ No, I'm set |

> Transition: "Great! Now let's understand your skills and background."

### Technical profile

**`background`** — "How would you describe your background?" (select, required)

| Value | Label |
|---|---|
| `technical` | 💻 Technical |
| `non-technical` | 📊 Non-technical |
| `hybrid` | 🔀 Hybrid (bit of both) |

**`primarySkill`** — "What's your primary technical skill?" (select, required) — **skipped when `background` is `non-technical`**

| Value | Label |
|---|---|
| `frontend` | 🎨 Frontend |
| `backend` | ⚙️ Backend |
| `fullstack` | 🔧 Full-stack |
| `mobile` | 📱 Mobile |
| `other` | 🛠️ Other |

**`superpower`** — "What's your superpower? The thing you're really good at?" (select, required) — **skipped when `background` is `technical`**

| Value | Label |
|---|---|
| `design` | 🎨 Design |
| `marketing` | 📣 Marketing |
| `sales` | 💼 Sales |
| `domain` | 🎯 Domain expertise |
| `operations` | ⚙️ Operations |
| `other` | ✨ Something else |

> Transition: "Awesome! Now for the commitment side of things..."

### Commitment

**`hoursPerWeek`** — "Realistically, how many hours per week can you commit?" (select, required)

| Value | Label |
|---|---|
| `5-10` | ⏰ 5-10 hours |
| `10-20` | ⏰ 10-20 hours |
| `20-30` | 🔥 20-30 hours |
| `30+` | 💪 30+ hours |

**`investmentRange`** — "What amount are you willing to invest in this cohort?" (select, required)

| Value | Label |
|---|---|
| `500-1000` | 💵 $500 - $1,000 |
| `1000-2000` | 💵 $1,000 - $2,000 |
| `2000-3000` | 💰 $2,000 - $3,000 |
| `3000+` | 💎 $3,000+ |

> Transition: "Almost there! Let's talk about your goals and expectations."

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

**`wantsMentors`** — "Would you want mentors as advisors for your project beyond the cohort?" (select, required)

| Value | Label |
|---|---|
| `yes` | 🙌 Yes, definitely |
| `maybe` | 🤔 Maybe, depends |
| `no` | 🙅 No, not needed |

> Transition: "Perfect! A few more questions to help us understand you better."

### Strategic

**`triedBefore`** — "Have you tried building something before?" (select, required)

| Value | Label |
|---|---|
| `yes` | ✓ Yes |
| `no` | 🆕 No, this is my first |

**`whatHappened`** — "What happened with that project?" (textarea, optional) — **skipped unless `triedBefore` is `yes`**

**`biggestBlocker`** — "What's your biggest blocker right now?" (select, required)

| Value | Label |
|---|---|
| `technical` | 💻 Technical skills |
| `time` | ⏰ Time |
| `direction` | 🧭 Direction/clarity |
| `accountability` | ✅ Accountability |
| `funding` | 💰 Funding |
| `other` | ❓ Something else |

**`heardFrom`** — "How did you hear about 01X?" (select, required)

| Value | Label |
|---|---|
| `twitter` | 🐦 Twitter/X |
| `linkedin` | 💼 LinkedIn |
| `friend` | 👋 Friend referral |
| `search` | 🔍 Search/Google |
| `other` | 🌐 Other |

**`whyNow`** — "Why now? What changed that makes you ready to commit?" (textarea, required)

**`readyToCommit`** — "Have you set aside the time and resources to participate fully?" (select, required)

| Value | Label |
|---|---|
| `yes` | ✅ Yes, I'm ready |
| `working-on-it` | 🔄 Working on it |
| `no` | ❌ Not yet |

> Transition: "You're doing great! 🎉 Just a couple questions about how you like to work."

### Community

**`comfortablePublic`** — "Are you comfortable working in public? (Sharing progress, getting feedback)" (select, required)

| Value | Label |
|---|---|
| `yes` | 📢 Yes, that's the point! |
| `maybe` | 🤔 Maybe, still warming up |
| `no` | 🤫 Prefer to stay quiet |

**`willingToHelp`** — "Would you be willing to help other cohort members?" (select, required)

| Value | Label |
|---|---|
| `yes` | 🤝 Yes, that's the point! |
| `maybe` | 🤔 Maybe, when I can |
| `prefer-focus` | 🎯 Prefer to focus on my project |

> Transition: "Final stretch! Just two optional questions, then we're done."

### Closing (optional)

| ID | Question | Type | Required |
|---|---|---|---|
| `biggestFear` | What's one thing you're afraid might go wrong with your project? (Optional, but helps us understand where to support you) | textarea | No |
| `specificHelp` | If you could get one specific type of help, what would it be? | textarea | No |

**Submit message:** "Amazing work, {firstName}! 🎉 You've shared a lot, and I can tell you're serious about building something real. Ready to submit your application?" → button **Submit Application 🚀**

---

## Mentor application — `/mentors/apply`

**Intro message:** "Hey there! 👋 We're building a community of exceptional mentors for early-stage builders. This takes about 4–5 minutes. We'll ask about your background, how you like to work, and how much time you can give. Ready?" → button **Let's do it 🚀**

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

> Transition: "Love it. Tell me about how you mentor — your style matters as much as your skills."

### Mentoring style

**`mentoringApproach`** — "How would you describe your mentoring style?" (select, required)

| Value | Label |
|---|---|
| `coach` | 🧭 Coach — I ask questions and guide |
| `advisor` | 💡 Advisor — I share experience and perspective |
| `hands-on` | 🔧 Hands-on — I roll up my sleeves and dig in |
| `challenger` | 🔥 Challenger — I push hard and ask tough questions |

**`whyMentor`** — "Why do you want to mentor builders at 01X? What draws you to this?" (textarea, required)

**`idealMentee`** — "What type of builder do you work best with?" (select, required)

| Value | Label |
|---|---|
| `zero-idea` | 💡 Very early — still finding the idea |
| `building` | 🔨 Building — has an idea, executing |
| `launched` | 🚀 Launched — looking to grow |
| `any` | 🔄 Any stage — I adapt well |

> Transition: "Perfect. Let's talk about how much time you're looking to give."

### Availability

**`oneOnOneFrequency`** — "How often can you commit to 1:1 sessions with a mentee?" (select, required)

| Value | Label |
|---|---|
| `weekly` | 📅 Weekly 1:1s |
| `biweekly` | 📆 Bi-weekly 1:1s |
| `monthly` | 🗓️ Monthly 1:1s |

**`asyncFeedback`** — "Are you open to async feedback? (Slack messages, reviewing docs, quick voice notes)" (select, required)

| Value | Label |
|---|---|
| `yes` | ✅ Yes, happy to do async |
| `sometimes` | 🤔 Occasionally, when I can |
| `no` | 🙅 Prefer to keep it to scheduled sessions |

**`weekendSessions`** — "01X runs weekend sessions with the cohort. Can you occasionally join?" (select, required)

| Value | Label |
|---|---|
| `yes` | ✅ Yes, I can make weekends work |
| `sometimes` | 🤔 Sometimes — depends on the quarter |
| `no` | 🙅 Weekdays only for me |

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
| Cohort (member) | `/cohort/apply` | 30 | `productLink` (skipped at idea stage), `primarySkill` (technical/hybrid only), `superpower` (non-technical/hybrid only), `whatHappened` (only if built before) |
| Mentor | `/mentors/apply` | 19 | None |

Keep this file in sync when editing either `questions.ts` — it is hand-maintained, not generated.
