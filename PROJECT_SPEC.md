# Build a Greenfield Internship Progress Dashboard

You are building this project completely from scratch.

There is no existing website to preserve, no existing component library to follow, and no existing visual design to imitate.

You should act as a senior frontend engineer, product designer, interaction designer, and design engineer.

## First: use the available design skill

Use the installed **Garden `web-design-engineer` skill** as a core part of this task.

Do not treat it as optional advice. Apply its design-engineering principles throughout the project.

Before writing the UI, actually reason through the design problem using the skill's methodology.

You are free to determine:

* visual direction
* typography
* color system
* spacing
* layout
* information hierarchy
* component architecture
* interaction patterns
* animation
* transitions
* visualization style
* responsive behavior
* visual storytelling
* overall art direction

Do not ask me to define these unless something is genuinely ambiguous about the product requirements below.

Do not default to a generic AI-generated dashboard aesthetic.

The result should feel intentionally designed by a strong product/design engineer.

---

# Context

My name is Sidhant.

I am an Undergraduate Intern on the DIX team at Dell Technologies.

My internship started on July 6, 2026.

I am approximately 2.5 months into the internship.

I want to build a private internal website that I can show to my manager and mentor.

This is NOT intended to be:

* a public portfolio
* a resume
* a personal branding website
* a job application
* a marketing landing page

It is an internal engineering progress experience.

The purpose is to give my manager or mentor a quick but deep understanding of what I have been doing throughout my internship.

The site should make my progress easy to understand while also giving enough depth and evidence for someone who wants to explore the work.

---

# What the visitor should understand

When my manager or mentor visits the site, they should be able to understand:

* what I have been working on
* what projects I have contributed to
* what I have completed
* what I am currently working on
* how my work has evolved over time
* what I learned
* what technologies and engineering practices I have worked with
* what Jira work I have contributed to
* what changed since their previous visit
* examples/evidence of the work where appropriate

The experience should communicate progression rather than simply displaying a list of tasks.

Think of it as an evolving engineering journal / progress system rather than a static portfolio.

---

# My projects

I have worked across three main areas.

## 1. Service Tag Validator

Technologies:

* C#
* .NET
* Angular

This became its own project after being split from the mHub solution.

Important work included:

* Lender Management Page
* User Management Page
* Service Tag Deletion Page
* backend work
* end-to-end deletion API
* backup/history logic
* preserving previous records when users delete or update data

Relevant Jira work includes:

* MHUB-652 — SvcTagValidator UI: Lender Management Page
* MHUB-837 — SvcTagValidator UI: User Management Page
* MHUB-826 — API & UI: Delete ServiceTag
* MHUB-836 — Delete History Not Working
* MHUB-869 — Split ServiceTagValidator from MHUB solution

---

# 2. mHub

Technologies:

* C#
* .NET
* Angular
* CI/CD
* testing

Important work included:

* CI/CD setup and deployment
* Google UCP backend pipeline work
* test cases
* code coverage improvements
* UAT support
* debugging and application support
* infrastructure/deployment-related work

Relevant Jira work includes:

* MHUB-906 — UI: Fix User Role for Tracking
* MHUB-891 — Investigate TeraData Data Issue for Missing ServiceTags
* MHUB-886 — MS Activation Validation Removal from Sold & UnSold
* MHUB-880 — Increase Delete SvcTag to 50K / Test performance / Log Delete Records
* MHUB-870 — ReadMe Doc for all Projects
* MHUB-864 — Remove GPG App from Code, CI/CD Deployment, PCF
* MHUB-863 — Splunk Job Failure for Google UCP
* MHUB-862 — CI/CD JOB Issue(sast:checkmarx)
* MHUB-860 — Unit Test / Code Coverage > 80
* MHUB-858 — UAT Test Support
* MHUB-849 — CI/CD: Add Missing Jobs / ServiceNow
* MHUB-848 — CI/CD Setup & Deployment

---

# 3. Sally

Sally is the AI-related area I have worked on.

Technologies include:

* Python
* AI agents
* agent workflows
* AI Advisor
* FRAT/PAM Agent

## AI Advisor

Relevant work includes:

* optimizing API calls
* response-time improvements
* pooling/threading techniques
* summary-generation optimization
* workflow fine tuning

Relevant Jira work:

* DTXSEA-236 — Optimize Jet API Calls in AI Advisor Using Salesforce Composite API
* DTXSEA-230 — Reduced latency and optimize flow for summary generation
* DTXSEA-193 — Resolved workflow fine tuning: thank you + follow up attachment email

## FRAT/PAM Agent

I spent part of my second month understanding, developing, testing, debugging, and supporting this area.

Relevant Jira work:

* DTXSEA-248 — User change to ODW FRAI agent
* DTXSEA-240 — A2A connection to ODW Assistant / AskDell
* DTXSEA-238 — Prompt update for resolved status workflow
* DTXSEA-259 — Add ASK Dell response to Filter 3 declined cases
* DTXSEA-262 — Deploy Stage

Ignore:

* DTXSEA-267 — Monitor resolution of a case by Ops and send the response to BBY

Do not include DTXSEA-267 as part of the project story.

---

# Internship progression

The internship has roughly progressed like this.

## First two weeks

I got hands-on with:

* mHub
* Service Tag Validator
* C#
* .NET

The main goal was understanding the existing systems and becoming productive in the codebase.

## First month

I worked substantially on Service Tag Validator.

I:

* developed the Lender Management Page
* developed the User Management Page
* developed the Service Tag Deletion Page
* worked on the ServiceTag backend
* created the end-to-end deletion API
* implemented backup/history behavior so previous records were preserved
* worked on CI/CD pipelines
* helped create the Google UCP mHub backend CI/CD pipeline
* wrote test cases for Google UCP and existing lenders
* helped increase code coverage from approximately 65% to 79%
* worked on AI Advisor response-time optimization using pooling/threading techniques

## Second month

There was comparatively less feature development.

I spent more time:

* understanding the FRAT/PAM Agent
* development
* testing
* bug fixing
* application support
* understanding AI-agent workflows

## Current period

The current focus should remain editable.

Do not invent current work.

The application should make it easy for me to update the current focus later.

---

# Progress data

I have approximately 26 assigned Jira items relevant to the internship when excluding DTXSEA-267.

Do NOT represent all assigned items as completed.

The website must distinguish between things such as:

* assigned
* in progress
* completed
* blocked
* planned
* support
* investigation

Where exact status or story-point information is unavailable, do not invent it.

I have roughly completed 10–15 stories and approximately 25 Jira points, but these values should initially be treated as editable estimates rather than authoritative facts.

The site should make these values easy to replace later.

---

# Evidence and artifacts

I may eventually provide:

* Jira links
* merge request links
* screenshots
* architecture diagrams
* workflow diagrams
* demo videos
* code-related visuals
* a demo video from the first month
* other internal-safe artifacts

The website should support these naturally.

Do not invent URLs or artifacts.

If an artifact is not provided, create an appropriate placeholder/data structure so I can add it later.

---

# "Since your last visit"

This is an important part of the experience.

I expect to update the website approximately weekly or every two weeks.

A returning manager should be able to quickly understand:

> What changed since I last looked at this?

The application should therefore support update entries containing things such as:

* date
* what changed
* project
* work completed
* new learning
* current focus
* important Jira items
* new artifacts
* notable milestones

This should feel like a meaningful product feature rather than a generic "updates" list.

---

# Historical progression

The site should communicate the evolution of the internship.

A visitor should be able to move through time and understand how my work changed:

learning the codebase
→ building features
→ backend/API work
→ testing
→ CI/CD
→ performance work
→ AI-agent development
→ debugging/support
→ current focus

Do not simply create a chronological text list.

Use the design skill to determine a compelling way to communicate this progression.

---

# Technical expectations

Build this as a modern frontend application.

Use:

* React
* Vite
* JavaScript or TypeScript
* npm

Use whatever additional lightweight frontend libraries are genuinely useful for the experience.

Do not introduce unnecessary infrastructure.

There should be:

* no backend
* no database
* no authentication
* no Jira API
* no external data service
* no server dependency required for normal usage

The canonical content should live in a local JSON file, for example:

`src/data/internship.json`

The application should consume that data rather than hardcoding internship content throughout components.

Structure the data so it is easy for me to update later.

---

# Editing workflow

I want to eventually be able to update things such as:

* story status
* story points
* current focus
* progress
* notes
* timeline entries
* "Since your last visit" updates
* learnings
* artifacts

Design the data model with this future workflow in mind.

A lightweight local editing mode is acceptable if useful.

If implemented, it should not require a backend.

For example, local edits could be stored temporarily and exported back into JSON.

Do not over-engineer this.

---

# Important design freedom

Do NOT assume I want:

* cards everywhere
* a standard dashboard
* a sidebar
* a hero section
* a conventional portfolio layout
* a conventional timeline
* charts just because this is a progress dashboard
* generic statistics cards
* generic glassmorphism
* generic gradients
* generic AI visuals
* excessive rounded containers
* meaningless animations

Those are implementation decisions.

You decide what the strongest experience should be.

Use the Garden `web-design-engineer` skill to determine the appropriate visual and interaction language.

The design should emerge from the purpose and information rather than from a predefined template.

---

# Quality bar

I want the result to feel like a real product.

Not:

"an AI generated website that happens to contain my internship information."

Instead:

"a carefully art-directed internal engineering product that happens to document my internship."

It should have:

* strong visual hierarchy
* excellent typography
* intentional composition
* meaningful interactions
* clear information architecture
* thoughtful motion
* strong responsive behavior
* polished details
* excellent empty/loading states where relevant
* good accessibility
* good performance

The visual identity should feel distinctive and memorable without sacrificing clarity.

There should be at least one memorable interaction or visualization that makes the site feel substantially more sophisticated than a normal dashboard.

---

# Implementation process

Do not immediately start generating random components.

Follow this process:

## Phase 1 — Understand

Understand the purpose, audience, information, and constraints.

## Phase 2 — Design

Use the Garden `web-design-engineer` skill.

Determine the design direction yourself.

Think through:

* information hierarchy
* visual language
* typography
* layout
* interaction
* motion
* storytelling
* responsive behavior

## Phase 3 — Architecture

Determine a clean React architecture and data model.

Keep content separate from presentation.

## Phase 4 — Build

Implement the complete experience.

Do not stop after creating a landing page or a few placeholder cards.

Build the actual working application.

## Phase 5 — Review

Run the application.

Inspect it as a real user.

Look specifically for:

* generic AI-generated patterns
* weak hierarchy
* excessive repetition
* poor spacing
* unnecessary components
* weak interactions
* visual inconsistencies
* mobile issues
* accessibility issues
* performance issues

## Phase 6 — Refine

Fix the weaknesses you find.

Do not settle for the first implementation.

---

# npm / project setup

Start from an empty directory.

Create the project using npm and Vite.

Use commands appropriate for the current environment.

The final project should be runnable with:

`npm install`

and:

`npm run dev`

and should produce a production build with:

`npm run build`

Make sure the project actually builds successfully.

---

# Final instruction

Take ownership of the design.

I am intentionally NOT specifying the visual style, colors, layout, component structure, or interaction design.

Those decisions are part of your job.

Use the Garden `web-design-engineer` skill deeply.

Do not make the site look like a generic AI dashboard.

Do not invent internship facts.

Do not invent metrics.

Do not mark work completed unless the provided information supports it.

Build a polished, distinctive, internal engineering progress experience that makes my internship journey immediately understandable to my manager and mentor while remaining interesting enough that they want to explore it.

Start by inspecting the available environment and then build the project from scratch.
