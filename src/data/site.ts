// Central content and settings for the DeepTek site.
// Edit copy here rather than inside page templates where possible.

export const site = {
  name: 'DeepTek',
  legalName: 'DeepTek', // Replace with the registered trade name once licensed.
  tagline: 'IT solutions, digital marketing and AI automation for UAE businesses.',
  description:
    'DeepTek helps businesses across the UAE build reliable technology, grow with measurable digital marketing and save time with practical AI automation.',
  // Placeholder domain until ownership is verified (deeptek.com is the alternative).
  url: 'https://deeptek.ae',
  email: 'hello@deeptek.ae', // Placeholder inbox. Update once the domain is live.
  location: 'United Arab Emirates',
  locale: 'en_AE',
  social: {
    linkedin: '', // e.g. https://www.linkedin.com/company/deeptek
    instagram: '',
    x: '',
  },
} as const;

export const nav = [
  { href: '/solutions/', label: 'Solutions' },
  { href: '/work/', label: 'Work' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;

export type Service = {
  id: string;
  pillar: 'IT Solutions' | 'Digital Marketing' | 'AI Automation';
  title: string;
  summary: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: 'infrastructure',
    pillar: 'IT Solutions',
    title: 'Cloud and IT infrastructure',
    summary:
      'Networks, devices, Microsoft 365 or Google Workspace and cloud hosting set up properly, documented and supported.',
    points: ['Office and remote setup', 'Cloud migration', 'Managed support'],
  },
  {
    id: 'software',
    pillar: 'IT Solutions',
    title: 'Websites and custom software',
    summary:
      'Fast, accessible websites, portals and internal tools built on modern stacks, bilingual where you need it.',
    points: ['Marketing websites', 'Web apps and portals', 'Integrations and APIs'],
  },
  {
    id: 'security',
    pillar: 'IT Solutions',
    title: 'Cybersecurity and compliance',
    summary:
      'Practical security baselines, backups and access control aligned with UAE data protection requirements.',
    points: ['Security reviews', 'Backup and recovery', 'Policy and training'],
  },
  {
    id: 'growth',
    pillar: 'Digital Marketing',
    title: 'SEO and performance marketing',
    summary:
      'Search, paid social and Google Ads campaigns planned around revenue, with reporting you can actually read.',
    points: ['Technical and local SEO', 'Google and Meta Ads', 'Conversion tracking'],
  },
  {
    id: 'brand',
    pillar: 'Digital Marketing',
    title: 'Content and social',
    summary:
      'Consistent content in English and Arabic that explains what you do and why customers should choose you.',
    points: ['Content strategy', 'Social media management', 'Email campaigns'],
  },
  {
    id: 'automation',
    pillar: 'AI Automation',
    title: 'AI automation and assistants',
    summary:
      'Automate repetitive work: lead handling, document processing, reporting and customer replies, with people kept in control.',
    points: ['Workflow automation', 'AI assistants and chat', 'Data and reporting'],
  },
];

export const pillars = [
  {
    id: 'it',
    index: '01',
    title: 'IT Solutions',
    lead: 'Dependable technology that your team does not have to think about.',
    body: 'We design, set up and look after the systems a growing company runs on, from laptops and email to cloud hosting, websites and custom software. Everything is documented, secured and handed over in plain language.',
    offerings: [
      'IT setup for new offices and remote teams',
      'Microsoft 365 and Google Workspace administration',
      'Cloud hosting and migration',
      'Websites, web apps and customer portals',
      'Systems integration and APIs',
      'Security baselines, backups and access control',
      'Ongoing managed support',
    ],
    outcomes: ['Fewer outages and support tickets', 'Clear ownership of accounts and data', 'Systems ready to scale'],
  },
  {
    id: 'marketing',
    index: '02',
    title: 'Digital Marketing',
    lead: 'Marketing measured by enquiries and revenue, not just reach.',
    body: 'We build the foundations first: a site that converts, clean tracking and a clear message. Then we grow traffic through search, paid campaigns and content, and report on what is working every month.',
    offerings: [
      'Brand messaging and positioning',
      'Technical, on-page and local SEO',
      'Google Ads and Meta Ads management',
      'Social media and content production',
      'Email marketing and automation',
      'Analytics, tracking and dashboards',
      'Landing page and conversion optimisation',
    ],
    outcomes: ['More qualified enquiries', 'Lower cost per lead', 'Reporting tied to business goals'],
  },
  {
    id: 'ai',
    index: '03',
    title: 'AI Automation',
    lead: 'Hand the repetitive work to software and give your team their time back.',
    body: 'We find the tasks that eat your team’s week, then automate them with proven tools and AI models. Every automation is tested, monitored and designed so a person can review important decisions.',
    offerings: [
      'Process review and automation roadmap',
      'Lead capture, routing and follow-up',
      'Document and invoice processing',
      'AI assistants for websites and WhatsApp',
      'Internal knowledge assistants',
      'Automated reporting',
      'CRM and ERP integrations',
    ],
    outcomes: ['Hours saved every week', 'Faster response to customers', 'Fewer manual errors'],
  },
] as const;

export const process = [
  {
    step: '01',
    title: 'Understand',
    body: 'We start with a short discovery: your goals, your current tools and where time or money is being lost. You get a written summary, whether or not we work together.',
  },
  {
    step: '02',
    title: 'Plan',
    body: 'We propose a scoped plan with clear deliverables, timelines and a fixed or capped price. No long contracts to get started.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'We deliver in short stages so you see progress early. Each stage is reviewed with you before we move on.',
  },
  {
    step: '04',
    title: 'Run and improve',
    body: 'After launch we support, measure and refine. Monthly reports show what changed and what we recommend next.',
  },
] as const;

export type Project = {
  slug: string;
  title: string;
  sector: string;
  services: string[];
  summary: string;
  outcome: string;
  scene: 'inbox' | 'fleet' | 'growth' | 'flow';
};

// Sample engagements that illustrate the kind of work DeepTek does.
// Replace with real client case studies (with permission) as projects launch.
export const projects: Project[] = [
  {
    slug: 'clinic-automation',
    title: 'Patient enquiries, answered in minutes',
    sector: 'Healthcare',
    services: ['AI Automation', 'Web'],
    summary:
      'A multi-branch clinic receiving enquiries across web, phone and WhatsApp, with no single place to track them.',
    outcome: 'One inbox, automatic triage and booking links sent instantly, with staff approving every reply.',
    scene: 'inbox',
  },
  {
    slug: 'trading-it',
    title: 'IT foundations for a growing trading company',
    sector: 'Trade and logistics',
    services: ['IT Solutions', 'Security'],
    summary:
      'A team of forty working from shared passwords, personal email accounts and an unmanaged office network.',
    outcome: 'Managed devices, company accounts with multi-factor sign-in, daily backups and a documented setup.',
    scene: 'fleet',
  },
  {
    slug: 'realestate-growth',
    title: 'Search-led growth for a property brokerage',
    sector: 'Real estate',
    services: ['Digital Marketing', 'Web'],
    summary:
      'A brokerage relying on listing portals, paying more each quarter for leads it did not own.',
    outcome: 'A fast bilingual site, local SEO and tracked campaigns that bring enquiries directly.',
    scene: 'growth',
  },
  {
    slug: 'finance-reporting',
    title: 'Month-end reporting without the spreadsheets',
    sector: 'Professional services',
    services: ['AI Automation', 'Data'],
    summary: 'A finance team spending three days a month copying figures between systems.',
    outcome: 'Automated data collection and a live dashboard, with exceptions flagged for review.',
    scene: 'flow',
  },
];

export const values = [
  {
    title: 'Clarity',
    body: 'Plain language, written scopes and fixed prices wherever possible. You always know what you are paying for.',
  },
  {
    title: 'Ownership',
    body: 'Your accounts, your data and your code stay in your name. We document everything and hand it over.',
  },
  {
    title: 'Security by default',
    body: 'Multi-factor sign-in, least-privilege access and backups are part of every setup, not an upsell.',
  },
  {
    title: 'Measured results',
    body: 'We agree on what success looks like before we start, and report against it honestly.',
  },
] as const;

export const faqs = [
  {
    q: 'Do you work with small businesses and startups?',
    a: 'Yes. Many of our services are designed for companies setting up or scaling in the UAE. We scope work in small stages so you can start with what matters most.',
  },
  {
    q: 'Can you work in Arabic as well as English?',
    a: 'Yes. We can deliver bilingual websites and content, including right-to-left layouts.',
  },
  {
    q: 'How is pricing structured?',
    a: 'Projects are quoted at a fixed or capped price after a free discovery call. Ongoing support and marketing are billed monthly with no long lock-in.',
  },
  {
    q: 'Is AI automation safe for customer data?',
    a: 'We choose tools that meet your data requirements, keep sensitive data out of public models where needed, and design automations so a person approves important actions.',
  },
] as const;
