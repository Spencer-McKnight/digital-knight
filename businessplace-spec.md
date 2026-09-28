# BusinessPlace — Product Spec

Welcome to BusinessPlace! This is a fresh, modern project that is bringing success to personal businesses.

This is an authenticated, custom supabase integrated designed dashboard experience that combines necessary modules like a business building block theme.

Each module assembled on the pricing page will adapt the pricing accordingly through suitable price points.

Each module provides its own distinct business function.

## Problem Statement

Businesses all over the world require some generic and applicable portion of business. These are the basic business functions. Then, most businesses need the same few features. It's like SAP, but not bogged down by boilerplate and integrated with so many modern applications.

## Solution Concept

Create a minimal visual-load, accessible and high contrast management system. Break free from the convention associated to a dashboard. Consider what each page or ui piece, including the home pages and modular controls, should be specifically suited to that area. Not a generic application of standard elements for all use cases. Each input should be maximally usable and dynamically considered.

## Target Audience

This application is a product intended to help business owners succeed, unifying and fixating business practices into a dashboard thats pricing finally makes sense.
It's for ambitious business owners, those who want natural and seamless efficient control of their business.

A lot of the time, I actually want to target younger, newer and perhaps greener digital business owners.

## Features

- **Authentication**
  Fundamentally user-based ownership of each feature.

- **AI Interface**
  Deepseek-integrated AI model chatbot that has the capabilities to creatively manage every aspect of the product, answer questions about it, respond to clients. AI can be globally switched on or off, privacy too, etc.

- **Client Memory (AI substrate)**
  A per-client memory file the AI maintains automatically: preferences, past friction, payment behaviour, email tone, project history — read by every AI action from drafting replies to composing proposals. This is the retention moat: the longer someone uses BusinessPlace, the more the AI genuinely knows their business.

- **Business Health Home (briefing, not dashboard)**
  The home page is a daily generated briefing rather than a widget grid: three things that need you today, one metric that moved, one suggested next step. For greener owners it doubles as mentorship by teaching what to pay attention to, and a scrolling briefing is mobile-first by nature.

- **Branding Panel**
  Persists your brand (logo, colours, name, ABN, etc etc) through all other features/dashboards/generated artifacts.

- **Time Tracking**
  Timing, free or manual modes, client tracking via client objects in portal.

- **Invoice Generation**
  Includes all necessary details, branding, summaries, variable input etc.

- **Cash Flow Pulse + AI Receivables Agent**
  Projects the next 90 days of cash from invoices, retainers and recurring costs, and lets the AI autonomously chase overdue invoices with polite branded follow-ups at day 7/15/30, escalating tone, all logged in the client portal. This upgrades invoicing from a document generator into a money-collecting employee — the single most validated pain point in the market.

- **Price Confidence Engine**
  Watches tracked time against what was invoiced to surface effective hourly rate per client, flag loss-making clients, and suggest rate cards when quoting new work ("similar projects took you 34 hrs; at your target rate quote $X"). Greener owners chronically underprice, and owning both the time and invoice data makes this uniquely possible here.

- **Client Portal**
  With external no-login linking to provide to clients. Email inbox viewability and management.

- **Deal Threads (unified engagement object)**
  Every engagement is a single thread object that morphs through its lifecycle: pitch becomes scope, scope becomes contract line items, line items become invoice rows, all visible to the client at one no-login portal link. This is the data-model spine of the product — time tracking, documentation and presentations all attach to a Deal Thread rather than living as disconnected modules.

- **Project Planner**
  AI-integrated project planner that asks the necessary questions that lead to composed flow within this application.

- **Documentation Planning and Creation**
  Flows which necessitate documentation i.e. Digital Project: Contract, Pitch, Scope, Project Plan linkage, Infrastructure, etc.

- **Branded Presentation Creator**
  Creates slides based on current project planner status, user input and objectives, and with knowledge of contract, pitch, scope, etc. Utilises a modular block-like interacting system to compose consistently professional, adaptable webpage that, when scrolling, switches 'slides'.

- **Organic or Paid Growth Pipeline**
  Generates advertising concepts, feeds them to an AI video generator with images co-ordinated from an image generator, selects appropriate platforms, posts to those platforms accounts OR pays for relevant advertising services.

- **Proof-of-Work Public Pages**
  A generated, branded public micro-page per business (or per project, client-permissioned): live testimonial capture after invoice payment, portfolio cards pulled from completed Deal Threads, and a booking/enquiry CTA. Every public page carries a "Powered by BusinessPlace" mark, extending the Growth Pipeline into organic credibility and turning users into an acquisition channel.

- **Compliance & Admin Autopilot (region-aware)**
  Extends the branding panel's ABN into real admin cover: quarterly tax set-aside estimates, GST/BAS or VAT reminders, invoice fields auto-adjusted to local legal requirements, and renewal nudges for insurance and registrations. The i18n-first content abstraction makes region packs a natural fit, and compliance packs are a clean modular price point.

## Functional Requirements

- Utilises a strong core technology for this application. This will be the core success vectors for the project. Scalability, performance optimisation, query time reduction, caching, all of the above.
- Allow members of the same workspace technology.
- Supabase DB which was created and managed through supabase CLI, considering best practice for each portion.
- Abstraction is your ideal. Every piece of content should live in one area in preparation of internationalisation. Each CSS variable, colour, border styling, logo, icon and such should all be appropriately abstracted to a global level.
- Settings panel. Composable modular global settings area that allows for tabular control of both each module, key accessibility features like language and colours, preferences.
- I want next steps, onboarding, tutorial available or dismissable in a non-invasive element.
- **Module Marketplace + Trial Slots in the Pricing Composer.** Every account gets one free rotating trial slot to run any module for 30 days, and the pricing composer shows real projected ROI per module ("users with Time Tracking + Invoicing recover an average of X hrs/month"). With ~40% of businesses feeling they overspend on SaaS blindly, transparent evidence-based module pricing becomes a marketing weapon rather than just billing.

## Non-Functional Requirements

- Absolute intuitive accessibility should be built in at a foundational, reusable level.
- Mobile-considered development. I expect mobile and tablet-size device use to skyrocket in relation to simplified business ownership. Therefore, the UI of each piece should be developed mobile-first. Multiple things should be available or selectable or detectable within view so as to not induce too much scrolling. Save vertical space. This will also mean that the desktop view is simplified to not be overstimulating.
- It should scale to desktop, but the UI need not change to desktop, it can rely on mobile paradigms.
- Best modern performance optimisations for next.js adjacent rendering opportunities.
- Favour minimalism without needless content, everything in the UI has a place as to not be too overstimulating.
- Accessibility as a core value.

## Best Practices

- Abstraction of variables: all content displayed anywhere should be captured in constants for future translation efforts.
- Abstraction of styles: colour choices and css reusables, constants should be used to preserve design language easily.

## Other Driving Considerations

- Consider a comprehensive technical stack with maps, interactions, performance, ui, etc. We want to leverage what's already been made to make this app better.
- Suggested build order: Deal Threads first as the architectural spine, then Cash Flow Pulse and the Business Health Home as the personality-defining differentiators, with Client Memory as the long-term moat.

## Agent Role

- You are an exceptional creative UI/UX developer and system architect.
- Research and select the best stack for this project, favoring ease of development, performance, interaction and use case matching to the criteria. Spend a moderate amount of time considering the ideal technical stack, then stick with your decisions for productivity's sake.
- You can trust your ideas and follow through with them. After researching, you are allowed to be decisive and roll into the next idea.
- You have the compute tokens and context to follow through on each task to completion.
- Overall, this is an unpolished idea with grand ideas. Please extrapolate, innovate, be creative, and make something you'd play when you were still learning about this great world. Nothing is set in stone; if your idea diverges from spec, you have permission to curate the superior idea.
- Fill memory.md with your decisions and plans, updating it as they evolve throughout the build.
