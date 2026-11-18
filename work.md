Digital Knight case studies, in the order they appear on the site.

# SOGIF.au

Modernising website technology, making it easier to inform investors and stay focused on what matters.

public/images/sogif

At a glance
90% increase in engagement duration in first month of launch
58s -> 1 min 50s

3.2x Higher ratio of users using the application page
1.18% -> 5.02%

Case Study:

Context
The Strategic Opportunities (Growth & Income) Fund, SOGIF, approached Digital Knight with a goal to modernise the design appeal and architecture of its website.
SOGIF first launched on a practical website template, allowing a convenient and cost-effective start to their digital presence.
As the fund matured, the team wanted the website to better reflect the strength of the brand and its forward-looking investment approach.

Success Criteria
Create a website experience that evokes the feeling of modern strategy embodied by SOGIF's investing practices.
High degree of usability, contrast and navigation comprehension for 40+ audiences.
Similar content structure to reduce content compliance risk.

Outcomes
The entire website was delivered in less than two months, adhering to a tight schedule and completing multiple rounds of change requests increasing scope.
All conversion metrics improved considerably, and clients remain satisfied with their product.
Their google search profile became much more detailed, showing each page and pulling data into AI agents.
As such, an ongoing retainer is established for digital partnership. Using the new website as a base, new automations are in development for their business processes, and AI integrations are being actively discussed.

Stack
| Technology | Use Case |
| --------------------------------- | -------------------------------------------- |
| Next.js (App Router) | Full-stack React framework, SSR/SSG, routing |
| React 19 | UI component library and rendering |
| TypeScript | Type safety and developer experience |
| Tailwind CSS | Utility-first CSS styling framework |
| GraphQL + native fetch | DatoCMS API via Next.js Data Cache |
| Framer Motion | Interaction animations (parallax, menu) |
| Recharts | Data visualisation (performance charts) |
| Swiper | Carousel / slider UI |
| next-sitemap | Automatic sitemap generation |
| papaparse | CSV parsing (performance data ingestion) |
| Vitest | Unit testing framework |
| Vercel Analytics / Speed Insights | Performance monitoring and Core Web Vitals |

# Fundstate.com.au

An audit trail for unlisted funds. Digital Knight's own venture, founded and built by Spencer McKnight.

public/images/fundstate

At a glance
0 tax file numbers stored (removed before a file is saved)
6 services in the whole stack, every record stored in Sydney
42 published pages on the rules for unlisted funds, each citing primary sources
No customer figures yet (pilot phase, November 2026)

Case Study:

Context
About one in four SMSFs hold an unlisted trust. Those funds report by PDF and portal, and every 30 June someone has to prove each unit's value and its source.
The ATO wrote to funds with unchanged unlisted values and expects auditors to see objective evidence of market value. Accountants still rekey figures into BGL and Class.
Spencer founded Fundstate and built it end to end: business case, compliance rules, product design, brand and code.

Features
Statement reading: AI reads forwarded statements, each figure tied to the words on its source page. Schema check, exact decimal arithmetic check, second-model re-read of unsure fields, a person decides differences. A figure without a source can't render.
Redaction: TFNs and bank details found and painted out on arrival, page re-read to prove it, unprovable files refused. Cloudflare worker stores nothing; data in Sydney; hash-chained audit log; RLS with a pgTAP test per rule.
Evidence Pack: one page per fund at 30 June with value, unit price and date, source page and valuation basis, each line beside the rule that asks for it. Unchanged values flagged. BGL and Class files in pilot.
SEO: research showed demand on documents and dates. Answer-first guides, answers, glossary, news, free tools and BGL vs Class, each with primary sources, author and real update dates. AI crawlers allowed, Markdown copies, one page list feeds sitemap, llms.txt and menus.
Conversion: homepage shows one statement travelling to a finished year; any window opens the real app as a no-email demo that saves nothing. One green Get started with Google beside it. Free to the auditor, A$80 a year to send figures on, prices on the buttons.
Architecture: rules written where AI agents read them first (requirements, design system, 60+ decision records). Custom lint rules for advice words, colours and data access. Every screen runs on sample data; services behind ports; the AI model is a setting.

Stack
| Technology | Use Case |
| --------------------------------- | -------------------------------------------- |
| Next.js 16 (App Router) | Site and app in one codebase |
| React 19 + TypeScript | Strict typing, Zod schemas shared across forms, actions, AI output and API |
| Tailwind CSS v4 + Base UI | Owned components on design tokens |
| Supabase (Sydney) | Postgres, RLS with pgTAP, auth, storage, queues, realtime |
| AI SDK + Vercel AI Gateway | Statement extraction with zero retention, in-app assistant |
| unpdf, pdf-lib + canvas | PDF reading, redaction, page images |
| Cloudflare Email Workers | Receiving forwarded statements without storing them |
| Stripe | Checkout, plans, credits, GST tax invoices |
| Resend + React Email | Transactional email, mailing list |
| Content Collections + MDX | Written pages with sources and dates |
| Vitest, Playwright + Biome | Unit, end to end and custom lint rules |
| Vercel (Sydney) | Hosting, pipeline worker, firewall, analytics |

# FTRGTR.com

A sample pack store you can play. Client: Adyn Young, Melbourne session guitarist and sound designer.

public/images/ftrgtr

At a glance
Lighthouse at launch: 99 performance, 100 accessibility, 100 best practices, 100 SEO, 3/3 agentic browsing
No conversion figures yet (launched November 2026)

Case Study:

Context
FTRGTR, short for Future Guitar, is Adyn's first sample pack: 60 sounds across six folders, all made with guitar.
The pack needed somewhere to be heard, bought and downloaded, and his session clients needed a way to book him on the same site.
Digital Knight designed and built everything from the identity through to the checkout.

Features
Hero sampler: pick a sound per folder, eight slices, pitch, speed and warp in real time (Web Audio, WebAssembly time-stretch). The only place the pack can be heard.
Identity: colour chapters from his Ableton session, wide heavy type, purple for buying, teal for live.
Store: full pack sleeve, lucky dip reels, free sample gumball machine. AUD in Australia, USD elsewhere.
Paths to cart: header buy on desktop, bottom strap on phones, fly-to-cart, upgrade offer in the cart, recent purchase note from real orders only.
Bookings: Google Calendar availability, Stripe deposit, balance invoice drafted the morning after, free pack with every booking.
Architecture: one typed catalogue drives copy, prices, structured data and llms.txt. Server-side pricing, private file storage, cookie-free funnel analytics.

Stack
| Technology | Use Case |
| --------------------------------- | -------------------------------------------- |
| Next.js (App Router) | Full-stack React framework, every page built once per market |
| React 19 + TypeScript | UI and strict typing across catalogue, content and commerce |
| CSS Modules + design tokens | Colour chapters, type scale and motion from one token file |
| Web Audio + Signalsmith Stretch | Real-time pitch and time-stretch in the hero sampler |
| Zustand | Cart state shared by header, mobile strap and drawer |
| Stripe | Hosted checkout in AUD and USD, booking deposits, balance invoices |
| Supabase | Orders, subscribers and bookings |
| Cloudflare R2 | Private storage for the pack files, signed downloads |
| Resend | Receipts, free sample delivery and booking emails |
| Google Calendar API | Session availability and confirmed bookings |
| Vercel | Hosting, market routing, scheduled jobs, analytics |

# DyFlex.com.au | Hancock Iron Ore (HIO) Service Portal

Building a seamless React, SAP-integrated system for HIO vendors

public/images/dyflex

Case Study:
Context
DyFlex is an SAP implementation solutions company, that operates all throughout Australia on high profile clients. Hancock Iron Ore is one of their trusted relations. I was brought on as a Next.js principal developer and project lead for a vendor portal integration. The exact details of this portal, we would not like to expose. The key, is that a variety of SAP systems (Cloud Foundry, S4, BTP) were required to integrate with a beautiful, responsive front-end system for use by their vendors Australia-wide.

Success Criteria
UI Matches proposed design
Business logic definition to retain all intended user stories
High level of external API integration
Performant, scalable, accessible, usable web experience

Outcomes
With a proposed timeframe of 8 weeks, Digital Knight was able to complete a pixel-perfect UI prototype in 4 working days utilising a complex FigmaMCP, context and claude AI development workflow. This was presented to establish client confidence in DyFlex's digital development process. This workflow was then composed into a pathway future Next.js developers can take to build modern Next.js SAP integrations.
Following this, SAP API data flows were clearly visualised by Digital Knight to boost the success of the SAP developers and future integrations. The following integrations proceeded smoothly. The overall success combinated with speed allowed every party throughout the internal, user and client testing to calibrate the application and resulted in a successful outcome for all.

Stack
| Technology | Use Case |
| --------------------------------- | -------------------------------------------- |
| Next.js | Full-stack framework with App Router, hybrid SSR/client rendering, and standalone deployment |
| React | Component-based UI with Server Components and client interactivity |
| TypeScript | Strict type safety across the entire codebase |
| MUI + Emotion | Enterprise component library with custom design tokens and CSS-in-JS theming |
| Redux Toolkit | Centralised global state management |
| SAP BTP Cloud Foundry | Enterprise cloud hosting with multi-target application deployment |
| SAP App Router + XSUAA | OAuth2 authentication gateway with role-based access control |
| SAP OData V4 | Backend integration with S/4HANA Purchase Order and Service Entry Sheet APIs |
| Jest + React Testing Library | Unit and component testing with DOM assertions |

# PropertyInvesting.com

Strategic digital analysis, resetting the trajectory for a dedicated online community

public/images/propertyinvesting

At a glance
Identified bot traffic cause and remediation strategy
Analysed historic journey and analytics to provide strategic suggestions
Provided 3 mockups for alternative directions for the website
Technical and pricing guidelines for future website redesign

Case Study:
Context
PropertyInvesting.com is a historical pillar of the property investing world. Created by Steve McKnight, it was one of the first idea entrants into the positive cashflow property world in Australia and America. After 20 years of successful business, their digital space was feeling resistant to change, was getting expensive, and had a problem with fake traffic clogging their servers.
Digital Knight was hired as a consultant to provide advice as to the future path forward for PropertyInvesting.com.

Success Criteria
Identify the current challenges and growth stagnation vectors
Suggest pathways to improve community growth and administrator experience
Reduce maintenance, server and hosting costs for the website
Provide design guidance as to future iterations

Outcomes
Digital Knight was able to identify the cause of extreme traffic, up to 97% of traffic was direct URL hits by bots. Similarly, these bots were posting much spam to the forum.
Additionally, we were able to suggest a path forward that would foster a 90% reduction in ongoing yearly costs.
Finally, a set of mockup designs were curated at no additional cost, leveraging intelligent AI prototyping, to guide conversation for future journeys for their digital experience to take.
The consultation work here and client satisfaction lead to our website rebuild for Steve McKnight's world-class fund, SOGIF.au

Stack
| Technology | Use Case |
| --------------------------------- | -------------------------------------------- |
| Google Analytics | Understanding website traffic for strategic direction |
| WordPress | Analysing legacy WordPress instance for security breaches |
| Claude AI | Prototype development |
| Notion | Scoping and estimation documentation |

# SteveMcKnight.com

From idea to finished showcase website in a single day

public/images/stevemcknight.com

At a glance
Creation of a beautiful functional website in 1 day
Able to provide free of charge, free maintenance forever
Contextualised AI designing identity-driven websites quickly

Case Study:
Context
Steve McKnight approached me to revamp his personal website, which was not quite showcasing his true digitally modern identity.
Digital Knight scoped the project, and with a loosely defined preferable outcome, we generated our own success criteria and were able to surmise that this project would be a fast, effective build. As such, we offered services for free to establish a working relationship.

Success Criteria
Extremely simple technical stack
Branded with Steve's story, content language and identity
Directs to books and current ventures
Further reading to understand Steve's philosophy and thoughts

Outcomes
We were able to create a free-forever website architecture, simplifying the build process in order to provide a premium journey with unprecidented ease.
Frontier AI was utilised without hallucinations, and preserving Steve's ideals.
We ingested the entire old website's content and some of his personal thoughts, curated a new design language, and output an excellent outcome. The result is linked with analytics, submits to his email, and fully device responsive. It also has an excellent loading time.

Stack
| Technology | Use Case |
| --------------------------------- | -------------------------------------------- |
| HTML | Hand-authored static page markup |
| Vanilla JavaScript (ES modules) | Client interactivity — theme toggle, shared behavior |
| Plain CSS + custom properties | Styling and design tokens, mobile-first responsive |
| Google Fonts | Typography (Cormorant Garamond, DM Sans) |
| Google Analytics (gtag) | Traffic and visitor tracking |
| Vercel | Static hosting / CDN and deployment |
| Markdown | Content source and voice reference |
