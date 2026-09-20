# Complete Redesign — Internship Engineering Progress Experience

You are working inside an existing React/Vite project that was previously generated using an AI website-building tool.

The existing implementation is **not the desired final product**.

I have already pushed the current version to Git, so you may make substantial changes to the project.

Your task is to perform a **complete product, UX, visual, and frontend restructuring** of the existing application.

This is NOT a request to cosmetically improve the existing UI.

Treat the existing application as **reference material and raw implementation material**, not as the design foundation.

The final result should feel like a new, deliberately designed product.

---

# 1. PRIMARY OBJECTIVE

Build a polished internal engineering progress experience for an undergraduate intern at Dell Technologies.

The purpose is to allow a manager or mentor to quickly understand:

* what I have worked on
* what I contributed
* what I completed
* what I am currently working on
* how my work evolved over time
* what I learned
* what technologies and engineering practices I used
* what Jira work I contributed to
* what changed since the manager's previous visit
* what evidence/artifacts exist for the work

The experience should communicate **progression, learning, contribution, and engineering growth**.

It should NOT feel like a static portfolio.

It should NOT feel like a resume.

It should NOT feel like a generic dashboard.

It should feel like a carefully designed **internal engineering progress product**.

---

# 2. USE THE EXISTING PROJECT CORRECTLY

Before modifying anything, inspect the existing repository thoroughly.

Understand:

* current framework
* current dependencies
* routing
* components
* styling
* data structures
* state management
* existing interactions
* responsive behavior
* current pages
* current visual language
* existing assets
* existing functionality
* existing content
* existing technical decisions

Create an internal mental model of the existing application.

Then classify the existing implementation into:

## KEEP

Things that are genuinely useful and worth preserving.

## REWRITE

Things whose underlying purpose is useful but whose implementation should be replaced.

## REMOVE

Things that add little or create unnecessary complexity.

## REPLACE

Existing architecture, UI patterns, interactions, or components that are fundamentally unsuitable for the new experience.

Do NOT preserve an existing component merely because it already exists.

Do NOT preserve the existing visual design merely because it already exists.

Do NOT layer more components onto a weak architecture just to avoid rewriting it.

If the current implementation is poorly structured, replace it.

---

# 3. IMPORTANT — DO NOT START CODING IMMEDIATELY

Follow this process.

Do not immediately generate components.

Do not immediately rewrite the existing UI.

Do not make random visual changes.

First understand the existing project and the product requirements.

---

# PHASE 1 — EXISTING PROJECT AUDIT

Inspect the existing repository.

Determine:

1. What is good?
2. What is weak?
3. What should be preserved?
4. What should be rewritten?
5. What should be removed?
6. What functionality already works?
7. What functionality is missing?
8. What visual problems exist?
9. What UX problems exist?
10. What architectural problems exist?
11. What dependencies are unnecessary?
12. What parts of the existing application would constrain a better redesign?

Do not modify files during this phase.

Produce a concise but useful audit.

---

# PHASE 2 — PRODUCT UNDERSTANDING

Read the complete project requirements provided with this task.

Understand:

* audience
* purpose
* content
* internship progression
* projects
* Jira information
* evidence
* update workflow
* technical constraints
* future editing requirements
* design freedom
* quality expectations

Do not invent facts.

Do not invent metrics.

Do not turn estimates into authoritative facts.

Do not invent Jira statuses.

Do not invent URLs.

Do not invent artifacts.

Where information is unavailable, design the application so the information can be added later.

---

# PHASE 3 — DESIGN

Use the installed Garden `web-design-engineer` skill deeply.

Treat it as a required part of the design process.

Do NOT use Garden merely as a collection of styling suggestions.

Use its design-engineering methodology to determine the actual product experience.

Before implementation, determine:

## Visual direction

Create a distinctive visual identity appropriate for an internal engineering product.

Do not default to:

* generic SaaS
* generic AI dashboard
* generic portfolio
* generic admin panel
* excessive glassmorphism
* purple/blue AI gradients
* excessive rounded cards
* card grids everywhere
* generic statistics cards
* meaningless charts
* meaningless animations

The design must emerge from the product's purpose and information.

## Typography

Choose typography deliberately.

Typography should create hierarchy, personality, readability, and visual rhythm.

## Color

Create a purposeful color system.

Color should communicate hierarchy and state rather than exist merely for decoration.

## Layout

Determine the strongest composition for the content.

Do not assume the application needs:

* a sidebar
* a hero
* a dashboard grid
* a conventional timeline
* a traditional navbar

These are implementation decisions.

Choose the structure that best communicates the internship story.

## Information hierarchy

A manager should be able to understand the most important information very quickly.

But the application should also reward deeper exploration.

Design for both:

### Quick scan

"What has this intern been doing?"

and:

### Deep exploration

"Show me the details and evidence behind this work."

---

# PHASE 4 — PRODUCT EXPERIENCE

The central design concept should be **progression**.

The site should communicate movement from:

learning the codebase

→ building features

→ backend/API work

→ testing

→ CI/CD

→ performance work

→ AI-agent development

→ debugging/support

→ current focus

Do NOT simply display these as a chronological list.

Create a meaningful visual or interactive representation of the progression.

The application should contain at least one memorable interaction or visualization that makes the experience feel substantially more sophisticated than a normal dashboard.

The interaction must have a purpose.

Do not add animation simply to demonstrate animation.

---

# 5. "SINCE YOUR LAST VISIT"

This is one of the most important product features.

The site will be updated approximately weekly or every two weeks.

A returning manager should immediately understand:

"What changed since I last looked?"

Design this as a meaningful product experience.

Updates may contain:

* date
* project
* change
* completed work
* learning
* current focus
* important Jira items
* artifacts
* milestones

Do not make this feel like a generic notification feed.

It should communicate meaningful progress.

---

# 6. PROJECT EXPERIENCE

The three primary areas are:

## Service Tag Validator

Technologies:

* C#
* .NET
* Angular

Important work:

* Lender Management Page
* User Management Page
* Service Tag Deletion Page
* backend work
* end-to-end deletion API
* backup/history logic
* preserving previous records when users delete or update data

Relevant Jira:

* MHUB-652
* MHUB-837
* MHUB-826
* MHUB-836
* MHUB-869

---

## mHub

Technologies:

* C#
* .NET
* Angular
* CI/CD
* testing

Important work:

* CI/CD setup
* deployment
* Google UCP backend pipeline
* test cases
* code coverage improvements
* UAT support
* debugging
* application support
* infrastructure/deployment work

Relevant Jira:

* MHUB-906
* MHUB-891
* MHUB-886
* MHUB-880
* MHUB-870
* MHUB-864
* MHUB-863
* MHUB-862
* MHUB-860
* MHUB-858
* MHUB-849
* MHUB-848

---

## Sally

AI-related work.

Technologies include:

* Python
* AI agents
* agent workflows
* AI Advisor
* FRAT/PAM Agent

### AI Advisor

Work included:

* API call optimization
* response-time improvements
* pooling/threading techniques
* summary-generation optimization
* workflow fine tuning

Jira:

* DTXSEA-236
* DTXSEA-230
* DTXSEA-193

### FRAT/PAM Agent

Work included:

* understanding
* development
* testing
* debugging
* application support
* AI-agent workflow understanding

Jira:

* DTXSEA-248
* DTXSEA-240
* DTXSEA-238
* DTXSEA-259
* DTXSEA-262

DO NOT include:

DTXSEA-267.

It is explicitly excluded from the project story.

---

# 7. INTERNSHIP PROGRESSION

The progression currently includes:

## First two weeks

* mHub
* Service Tag Validator
* C#
* .NET
* understanding existing systems
* becoming productive in the codebase

## First month

Service Tag Validator work including:

* Lender Management Page
* User Management Page
* Service Tag Deletion Page
* ServiceTag backend
* end-to-end deletion API
* backup/history behavior
* CI/CD pipelines
* Google UCP mHub backend CI/CD
* test cases
* code coverage improvement
* AI Advisor response-time optimization

## Second month

More time spent on:

* FRAT/PAM Agent
* development
* testing
* bug fixing
* application support
* AI-agent workflows

## Current period

Current focus must remain editable.

DO NOT invent current work.

The architecture should make current focus easy to update later.

---

# 8. DATA ARCHITECTURE

The application must remain frontend-only.

Use:

* React
* Vite
* TypeScript
* npm

No backend.

No database.

No authentication.

No Jira API.

No external data service.

No server dependency for normal usage.

Canonical content should live in:

`src/data/internship.json`

Keep content separate from presentation.

The data model should support:

* projects
* technologies
* Jira items
* statuses
* progress
* timeline entries
* learnings
* current focus
* updates
* artifacts
* milestones
* notes

Support statuses such as:

* assigned
* in progress
* completed
* blocked
* planned
* support
* investigation

Do not invent status values for items where the status is unknown.

---

# 9. EDITABILITY

Design the architecture so I can later update:

* story status
* story points
* current focus
* progress
* notes
* timeline
* updates
* learnings
* artifacts

Do not over-engineer this.

A lightweight local editing mode may be implemented if it genuinely improves the product.

A backend is NOT required.

---

# 10. METRICS

I currently have approximately 26 relevant Jira items after excluding DTXSEA-267.

Do NOT represent all of them as completed.

I have roughly completed 10–15 stories and approximately 25 Jira points.

These are estimates and must initially be treated as editable rather than authoritative.

Do not invent additional metrics.

Do not manufacture percentages.

Do not create fake productivity statistics.

---

# 11. EVIDENCE / ARTIFACTS

The application should be ready to eventually support:

* Jira links
* merge request links
* screenshots
* architecture diagrams
* workflow diagrams
* demo videos
* code-related visuals
* the first-month demo video
* other internal-safe artifacts

Do not invent URLs.

Do not invent artifacts.

If an artifact does not yet exist, create a meaningful empty/placeholder state so it can be added later.

---

# 12. TECHNICAL ARCHITECTURE

Prefer a clean, understandable React architecture.

Use TypeScript.

Keep content separate from UI.

Avoid unnecessary dependencies.

Do not add infrastructure merely because it is technically possible.

Use lightweight libraries only where they materially improve the experience.

The final project must run with:

`npm install`

and:

`npm run dev`

and must produce a production build with:

`npm run build`

The build must actually succeed.

---

# 13. RESPONSIVE DESIGN

Do not design desktop first and then merely shrink it.

Treat mobile as a first-class experience.

Consider:

* information density
* navigation
* typography
* interaction targets
* charts/visualizations
* project exploration
* timeline/progression
* artifact viewing
* update reading
* motion

The mobile version should feel intentionally designed.

---

# 14. ACCESSIBILITY

The final application should have:

* semantic HTML
* keyboard navigation
* visible focus states
* sufficient contrast
* accessible interactive elements
* meaningful labels
* reduced-motion consideration
* sensible heading hierarchy

Accessibility should be part of the implementation rather than a final afterthought.

---

# 15. PERFORMANCE

Keep the application lightweight.

Avoid:

* unnecessary dependencies
* enormous libraries for simple functionality
* excessive animation
* unnecessary network requests
* unnecessary assets

Prefer local/static data.

---

# 16. VISUAL QUALITY BAR

The final experience should feel like:

"a carefully art-directed internal engineering product that happens to document an internship."

NOT:

"an AI-generated dashboard containing internship information."

The result should demonstrate:

* strong visual hierarchy
* excellent typography
* intentional composition
* meaningful interactions
* thoughtful motion
* clear information architecture
* strong responsive behavior
* polished details
* good accessibility
* good performance
* distinctive visual identity

Avoid visual repetition.

Avoid cards simply because cards are easy to generate.

Avoid generic dashboard patterns.

Avoid decorative elements that do not communicate information.

---

# 17. IMPLEMENTATION PROCESS

Follow this exact process.

## Step 1 — Audit

Inspect the existing application.

Do not modify files.

Produce the KEEP / REWRITE / REMOVE / REPLACE assessment.

## Step 2 — Design

Use Garden `web-design-engineer`.

Determine the new design direction.

Do not implement yet.

## Step 3 — Architecture

Determine:

* information architecture
* routes
* components
* data model
* state model
* interaction model
* responsive behavior
* visualization
* animation

Do not implement yet.

## Step 4 — Implementation

Now rebuild the application.

You are allowed to substantially restructure the project.

Do not preserve weak existing architecture for the sake of backwards compatibility.

Reuse code only when it is genuinely useful.

## Step 5 — Verification

Run:

`npm run build`

Then run the development server.

Inspect the actual application.

Do not assume that code correctness means visual correctness.

## Step 6 — Visual critique

Critically review the rendered application.

Look for:

* generic AI patterns
* weak hierarchy
* excessive cards
* repetitive layouts
* weak typography
* poor spacing
* weak storytelling
* unnecessary visual noise
* meaningless animations
* poor mobile behavior
* inconsistent components
* accessibility problems

## Step 7 — Refinement

Fix the highest-impact problems.

Do not settle for the first implementation.

Do not merely report problems.

Actually fix them.

---

# 18. IMPORTANT BEHAVIOR

Do not ask me to choose the color palette.

Do not ask me to choose typography.

Do not ask me whether I want a sidebar.

Do not ask me whether I want cards.

Do not ask me to design the page for you.

Those decisions are part of your responsibility as the design engineer.

Only ask questions when a requirement is genuinely ambiguous or impossible to infer.

Take ownership of the design.

---

# 19. IMPORTANT DATA RULES

Never invent:

* internship facts
* Jira statuses
* Jira URLs
* story points
* completed work
* metrics
* artifacts
* dates
* current work
* performance numbers

If something is unknown:

represent it as unknown/editable.

Accuracy is more important than making the dashboard appear complete.

---

# 20. FINAL ACCEPTANCE CRITERIA

Before declaring the project finished, verify:

### Product

* The purpose is immediately understandable.
* A manager can quickly understand my progression.
* A manager can explore deeper details.
* Projects are understandable.
* Progression is meaningful.
* "Since your last visit" is useful.
* Current focus is editable.
* Evidence/artifacts have a clear place.

### Design

* It does not look like the previous ODE application.
* It does not look like a generic AI dashboard.
* Typography is intentional.
* Layout is intentional.
* Visual hierarchy is strong.
* Motion has purpose.
* There is at least one memorable interaction or visualization.
* The interface has a distinctive identity.

### Engineering

* TypeScript is used appropriately.
* Data is separated from presentation.
* No unnecessary backend exists.
* No database exists.
* No unnecessary external services exist.
* The application runs locally.
* `npm run build` succeeds.
* Responsive behavior works.
* Accessibility basics are implemented.

### Accuracy

* No invented internship facts.
* No invented metrics.
* No invented Jira information.
* DTXSEA-267 is excluded.
* Unknown information remains editable/unknown.

---

# FINAL INSTRUCTION

Take ownership of this redesign.

Do not think of this as:

"fixing an old AI-generated website."

Think of it as:

**designing and engineering a new internal product using the existing application as raw material.**

The existing implementation has already demonstrated one possible solution.

Your job is to produce a substantially better one.

Use the Garden `web-design-engineer` skill deeply.

Be critical of the existing implementation.

Be deliberate about design.

Be conservative about facts.

Be ambitious about the user experience.

Do not settle for the first acceptable UI.

Build something that makes a manager immediately understand the journey from:

learning → contribution → engineering depth → ownership → AI/advanced work → current growth.

Start with the existing project audit.

Do NOT modify files until the audit, design direction, and architecture are understood.
