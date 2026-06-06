import type { ReactNode } from 'react';
import Link from 'next/link';
import type { IconName } from '@/components/Icons';

export type FAQItem = {
  id: string;
  icon: IconName;
  title: string;
  body: ReactNode;
};

export const FAQS: FAQItem[] = [
  {
    id: 'ai-usage',
    icon: 'brain-circuit',
    title: 'How is AI used effectively?',
    body: (
      <>
        <p>
          AI is embedded across every stage of how Digital Knight operates, not as a gimmick, but as
          a genuine multiplier for quality and speed. Different models and tools are selected for
          the specific strengths they bring to each part of the workflow.
        </p>
        <p>
          For strategy and research, AI handles deep analysis, market research synthesis,
          competitive landscape mapping, and data retrieval. But AI is the research assistant, not
          the strategist. The ideation, the refinements, and the strategic decisions that shape a
          project are a deliberate manual effort, considering all curated information before
          committing to a direction.
        </p>
        <p>
          For design and prototyping, AI generates rapid visual concepts that can be validated
          before a single line of code is written. The creative direction, layout choices, and brand
          alignment are hands-on decisions informed by research, not delegated to a model.
        </p>
        <p>
          For development,{' '}
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer">
            Claude Code
          </a>{' '}
          is the primary AI coding environment, providing intelligent code generation, refactoring,
          and architectural guidance within a terminal workflow. The architecture, code quality
          standards, and technical trade-offs remain deliberate engineering choices.
        </p>
        <p>
          Each model and tool is chosen for its optimal output in research and curation. The craft
          that turns that raw material into something considered and specific is always human.
        </p>
      </>
    ),
  },
  {
    id: 'benefits',
    icon: 'square-check-big',
    title: 'Benefits of working together?',
    body: (
      <>
        <p>
          Working with Digital Knight means working directly with the person who writes the code,
          shapes the strategy, and answers the phone. There is no account manager interpreting your
          vision for a developer you never speak to.
        </p>
        <p>
          <strong>Personalised accountability.</strong> Every project gets a dedicated progress
          board with real-time visibility into what is being worked on, what is completed, and what
          is coming next. Weekly demonstrations and refinements keep the work aligned with your
          expectations.
        </p>
        <p>
          <strong>Speed that does not sacrifice quality.</strong> A complete website from concept to
          live in a single day. A full SAP-integrated vendor portal prototype in four days. A
          world-class investment fund website delivered in under two months with multiple scope
          expansions included.
        </p>
        <p>
          <strong>Lower cost without lower standards.</strong> Operating as a focused personal
          agency means there are no layers of overhead, no outsourcing middlemen, and no inflated
          retainers padding the bill.
        </p>
        <p>
          <strong>A partner, not a vendor.</strong> The goal is a lasting digital partnership that
          evolves with your business, not a handoff and an invoice.
        </p>
      </>
    ),
  },
  {
    id: 'who',
    icon: 'chess-knight',
    title: 'Who works for Digital Knight?',
    body: (
      <>
        <p>
          Digital Knight is founded and operated by Spencer McKnight, a full stack developer and
          digital strategist based in Melbourne, Australia. Spencer holds a Bachelor of Business
          Information Technology (Professional) and has spent years building digital experiences
          across websites, mobile applications, and enterprise platforms.
        </p>
        <p>
          Before founding Digital Knight, Spencer worked as a Full Stack Developer at{' '}
          <a href="https://inlight.com.au" target="_blank" rel="noopener noreferrer">
            Inlight
          </a>
          , one of Melbourne's leading digital product agencies. That tenure involved shipping
          production code for clients including Chadstone, Nando's AU and NZ, Urban Rest, and AHM.
          He was awarded the Inlight Rising Star Award for accelerated growth and performance.
        </p>
        <p>
          Digital Knight is intentionally structured as a personal agency. With AI dramatically
          improving development pace and capability, a single experienced developer with the right
          tools and workflows can complete projects that would traditionally require a small team.
        </p>
        <p>
          For areas that require specialised expertise beyond web development and digital strategy,
          Digital Knight draws on a robust contact and expert network of designers, copywriters, and
          domain specialists who can be brought in to advise and contribute. If a project needs
          something outside the core skill set, the right person is a conversation away.{' '}
          <Link href="/contact">Get in touch</Link> to discuss what your project needs.
        </p>
      </>
    ),
  },
  {
    id: 'start',
    icon: 'send',
    title: 'How do I start a project?',
    body: (
      <>
        <p>
          Starting is straightforward. Visit the <Link href="/contact">contact page</Link>, fill in
          the details about what you are looking for, and submit. Once your information is received,
          you will be able to book a free 30-minute digital strategy consultation at a time that
          works for you.
        </p>
        <p>
          That first conversation is not a sales pitch. It is a genuine assessment of where your
          digital presence sits today, what opportunities exist, and whether Digital Knight is the
          right fit for what you need. Some consultations have led to full website rebuilds. Others
          have surfaced a single high-impact change that made the engagement worthwhile on its own.
        </p>
        <p>
          From there, Digital Knight will scope the project, define clear success criteria, and
          provide transparent estimates. You will have visibility into the project outline,
          timeline, and technology choices before any work begins.
        </p>
      </>
    ),
  },
  {
    id: 'ai-vs-automation',
    icon: 'bot',
    title: 'Difference between AI and automation?',
    body: (
      <>
        <p>
          These two terms get used interchangeably, but they solve different problems and
          understanding the distinction helps you invest in the right solution.
        </p>
        <p>
          <strong>Automation</strong> handles repetitive, rule-based tasks that follow a predictable
          pattern. When a form submission arrives on your website, automation can route that enquiry
          to the right inbox, create a record in your CRM, and trigger a confirmation email. The
          logic is predefined: if this happens, do that.
        </p>
        <p>
          <strong>AI</strong> learns, interprets, and makes decisions in situations where the rules
          are not fixed. A conversational agent on your website does not follow a script for every
          possible question a visitor might ask. It understands intent, draws from a knowledge base,
          and generates a relevant response.
        </p>
        <p>
          <strong>Where they work together</strong> is where the real value sits. An AI agent can
          qualify an incoming lead by understanding the conversation, and automation can then route
          that qualified lead into your pipeline, assign it to the right person, and schedule a
          follow-up.
        </p>
      </>
    ),
  },
  {
    id: 'modern-partner',
    icon: 'handshake',
    title: 'What makes us a modern digital partner?',
    body: (
      <>
        <p>
          Most agencies are still running the same playbook they established a decade ago. Large
          teams, layered communication, legacy frameworks, and a reluctance to adopt new tools until
          they have been safe for years.
        </p>
        <p>
          Digital Knight was built from the ground up for how digital work is done today. AI is not
          an add-on service or a marketing buzzword. It is the operating system of the entire
          practice. From deep research and competitive analysis through to design prototyping, code
          generation, and deployment, AI tools are integrated into every phase.
        </p>
        <p>
          The proof is in the work itself. A world-class investment fund website that increased
          engagement by 90% and tripled conversion to the application page. An enterprise SAP portal
          prototyped in days. These are documented outcomes from real client engagements.
        </p>
      </>
    ),
  },
  {
    id: 'tech-choices',
    icon: 'cpu',
    title: 'What are our preferred technologies?',
    body: (
      <>
        <p>
          Every technology in Digital Knight's stack is chosen for a specific reason, and every
          project gets the stack that best suits its goals.
        </p>
        <p>
          <strong>React and Next.js</strong> form the foundation.{' '}
          <a href="https://nextjs.org" target="_blank" rel="noopener noreferrer">
            Next.js
          </a>{' '}
          extends React into a full-stack framework with server-side rendering, static generation,
          API routes, and built-in optimisation for images, fonts, and page speed.
        </p>
        <p>
          <strong>Vercel</strong> handles hosting, deployment, and performance monitoring. Every
          code push triggers an automatic preview deployment that can be reviewed before going live.
        </p>
        <p>
          <strong>DatoCMS</strong> is the preferred headless content management system, giving
          non-technical team members a clean interface for managing content without touching code.
        </p>
        <p>
          <strong>Supabase</strong> provides database, authentication, and real-time capabilities.{' '}
          <strong>Resend</strong> handles transactional email delivery.
        </p>
        <p>
          For enterprise and business-critical integrations, Digital Knight has delivered production
          work with <strong>SAP BTP</strong>, <strong>Salesforce</strong>, <strong>HubSpot</strong>,
          and <strong>Microsoft 365</strong>. These are among the most widely adopted platforms in
          business today, and integration experience with them means your website or application
          connects cleanly to the systems your organisation already runs on.
        </p>
        <p>
          Alternative stacks are absolutely on the table when the project context calls for it.
          Technology serves the outcome, not the other way around.
        </p>
      </>
    ),
  },
  {
    id: 'website-value',
    icon: 'globe',
    title: "Isn't a website just a nice design?",
    body: (
      <>
        <p>
          Most people think of a website as the pages they see: the homepage, the product listings,
          the checkout flow. That is the frontend, and it matters. But it is only half of what a
          website can be.
        </p>
        <p>
          <strong>The frontend</strong> is the visible layer where your brand comes to life through
          design, typography, motion, and content. Good frontend development means fast page loads,
          intuitive navigation, responsive layouts across every device, and search engine
          optimisation that ensures the right people find you. A beautifully designed website that
          loads slowly or frustrates mobile users is leaving money on the table.
        </p>
        <p>
          <strong>The backend</strong> is where the business logic lives, and this is where most
          businesses are missing enormous value. Your website does not have to stop at what a
          visitor sees. It can connect directly to the systems your business already runs on and
          automate the obligations that consume your team's time.
        </p>
        <p>
          <strong>Taxation and compliance.</strong> A backend can pull transaction data from your
          accounting software, calculate GST or sales tax obligations, and prepare reporting
          summaries that are ready for your accountant or lodgement platform. Instead of reconciling
          spreadsheets at the end of each quarter, the data is structured and current.
        </p>
        <p>
          <strong>Payroll and HR.</strong> Timesheets, leave requests, and pay run summaries can
          flow through a single interface that connects to your payroll provider, reducing manual
          data entry and the errors that come with it.
        </p>
        <p>
          <strong>Order management and fulfilment.</strong> When a customer places an order, the
          backend can file it with your supplier, update inventory across sales channels, generate a
          shipping label, and send the customer a tracking notification without anyone touching it.
        </p>
        <p>
          <strong>Customer service and communication.</strong> Incoming enquiries can be routed
          intelligently, support tickets can be created and tracked, and transactional emails like
          confirmations, reminders, and follow-ups can be triggered automatically based on customer
          behaviour.
        </p>
        <p>
          <strong>Reporting and dashboards.</strong> Instead of logging into five different
          platforms to understand how your business is performing, a purpose-built dashboard brings
          the data that matters to one screen. Sales figures, website analytics, customer activity,
          operational metrics, all fed by live integrations rather than manual exports.
        </p>
        <p>
          A website built with this depth is not a brochure. It is the operating layer of your
          business, reducing the manual load on your team and surfacing the information you need to
          make decisions. When Digital Knight rebuilt the SOGIF investment fund website, engagement
          duration increased by 90% and users reaching the application page tripled. That is a
          digital system generating measurable commercial value across both sides of the stack.
        </p>
      </>
    ),
  },
];
