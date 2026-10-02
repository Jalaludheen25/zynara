// All website copy, taken verbatim from the original Zynara Tech website.
// Keep this file the single source of truth for content.

export const company = {
  name: 'Zynara Tech',
  location: 'Dubai, UAE',
  locationFull: 'Dubai, United Arab Emirates',
  tagline: 'A UAE technology company building thoughtful digital products around real life.',
  email: 'hello@zynaratech.co',
  privacyEmail: 'privacy@zynaratech.co',
  legalEmail: 'legal@zynaratech.co',
  vaqtoUrl: 'https://vaqto.co',
  vaqtoDomain: 'vaqto.co',
  // Dubai city coordinates & timezone, used for the location visuals.
  coordinates: '25.2048° N · 55.2708° E',
  timeZone: 'Asia/Dubai',
} as const

export const meta = {
  title: 'Zynara Tech | Technology designed around everyday life',
  description:
    'Zynara Tech is a UAE technology company creating thoughtful digital products, including Vaqto.',
} as const

export type NavItem = { label: string; href: string; external?: boolean }

export const nav: NavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Vaqto', href: '/vaqto' },
  { label: 'Contact', href: '/contact' },
]

export const footerColumns: { label: string; links: NavItem[] }[] = [
  {
    label: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'Product',
    links: [
      { label: 'About Vaqto', href: '/vaqto' },
      { label: 'Visit vaqto.co', href: company.vaqtoUrl, external: true },
    ],
  },
  {
    label: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/*                                    Home                                    */
/* -------------------------------------------------------------------------- */

export const home = {
  hero: {
    kicker: 'Zynara Tech · Dubai, UAE',
    titleLines: ['Technology that', 'gives time back.'],
    copy: 'Zynara Tech is a UAE technology company creating thoughtful digital products that make everyday services easier to discover, understand and use.',
    primaryCta: { label: 'Meet Vaqto', href: '/vaqto' },
    secondaryCta: { label: 'Why we build', href: '/about' },
    foot: ['Product-led', 'Human-first', 'Trust by design'],
    imageAlt: 'Abstract illuminated route moving through a modern city',
  },
  purpose: {
    eyebrow: 'Our purpose',
    title: 'Less friction in the moments that shape a day.',
    copy: 'Technology should help life move more smoothly. We start with a real everyday problem, understand the decisions around it, and design a clearer path from need to action.',
  },
  principles: {
    eyebrow: 'How we think',
    title: 'Built around people. Measured by usefulness.',
    intro:
      'Our principles keep the company focused on what matters publicly: the value a product creates, the confidence it earns and the experience it delivers.',
    items: [
      {
        title: 'Useful over complicated',
        copy: 'We focus on clear outcomes people can understand and use—not technology for its own sake.',
      },
      {
        title: 'Confidence through clarity',
        copy: 'Good information, thoughtful design and simple choices turn everyday uncertainty into confident action.',
      },
      {
        title: 'Trust built in',
        copy: 'Privacy, responsible data use and transparent experiences are foundations, not finishing touches.',
      },
    ],
  },
  product: {
    tag: 'Zynara Tech product',
    tagIndex: '01',
    eyebrow: 'Introducing Vaqto',
    title: 'Your car wash and car care, better timed.',
    copy: 'Vaqto helps car owners discover nearby car-wash and car-care options, compare useful details, plan with more confidence and book at participating locations.',
    list: [
      'Discover what is nearby',
      'Compare services and useful details',
      'Plan before setting out',
      'Book where available',
    ],
    primaryCta: { label: 'Explore the product', href: '/vaqto' },
    secondaryCta: { label: 'Visit vaqto.co', href: company.vaqtoUrl },
    imageAlt: 'Car owner using a phone beside a vehicle at a modern car-wash facility',
  },
  standard: {
    eyebrow: 'Our standard',
    title: 'Thoughtful on the surface. Disciplined underneath.',
    intro:
      'A useful product must feel simple to the person using it. That simplicity depends on careful choices about information, experience and trust.',
    items: [
      {
        title: 'Real-life relevance',
        copy: 'Designed around how people actually decide, move and manage their time.',
      },
      {
        title: 'Clarity by design',
        copy: 'Complexity is organised behind a simple, focused customer experience.',
      },
      {
        title: 'Responsible foundations',
        copy: 'Privacy, safety and transparency are considered from the beginning.',
      },
    ],
  },
  contact: {
    eyebrow: 'Start a conversation',
    title: 'Interested in Zynara Tech or Vaqto?',
    copy: 'For company, partnership and general enquiries, connect with our team in Dubai.',
  },
} as const

/* -------------------------------------------------------------------------- */
/*                                    About                                   */
/* -------------------------------------------------------------------------- */

export const about = {
  hero: {
    kicker: 'About Zynara Tech',
    titleLines: ['We build around', 'real life.'],
    copy: 'Zynara Tech is the UAE technology company behind Vaqto. We turn everyday friction into focused digital experiences that help people make clearer choices.',
    imageAlt: 'Connected places across a modern UAE-inspired urban landscape',
  },
  vision: {
    eyebrow: 'Our vision',
    title: 'Everyday services that feel easier to navigate.',
  },
  mission: {
    eyebrow: 'Our mission',
    title:
      'Build focused digital products that replace uncertainty with clarity, convenience and confidence.',
  },
  values: {
    eyebrow: 'What guides us',
    title: 'Principles we can build on.',
    intro:
      'Our public promise is intentionally straightforward. We aim to solve worthwhile problems, explain value clearly and earn trust through the experience itself.',
    items: [
      {
        title: 'Human-first',
        copy: 'Begin with the person, the moment and the decision—not the feature list.',
      },
      {
        title: 'Region-aware',
        copy: 'Build with a practical understanding of life, movement and expectations in the UAE.',
      },
      {
        title: 'Clear by default',
        copy: 'Make information easier to understand and next steps easier to choose.',
      },
      {
        title: 'Responsible from day one',
        copy: 'Treat privacy, security and trust as part of the product experience.',
      },
    ],
  },
  origin: {
    eyebrow: 'Our home',
    titleLines: ['Built in Dubai.', 'Grounded in the region.'],
    copy: 'Dubai is a city shaped by movement, ambition and high expectations for service. It is the right place to build practical technology for modern everyday life.',
    list: ['UAE-based company', 'Product-led approach', 'Designed for real regional needs'],
  },
  next: {
    eyebrow: 'Our product',
    title: 'See how our thinking comes to life in Vaqto.',
    cta: { label: 'Meet Vaqto', href: '/vaqto' },
  },
} as const

/* -------------------------------------------------------------------------- */
/*                                    Vaqto                                   */
/* -------------------------------------------------------------------------- */

export const vaqto = {
  hero: {
    kicker: 'A Zynara Tech product',
    titleLines: ['A clearer way to', 'care for your car.'],
    copy: 'Vaqto brings car wash and car care together, helping car owners move from “Where should I go?” to a more informed, better-timed choice.',
    primaryCta: { label: 'Visit Vaqto', href: company.vaqtoUrl },
    secondaryCta: { label: 'See the journey', href: '#journey' },
    imageAlt: 'Car owner planning a vehicle service using a smartphone',
  },
  problem: {
    eyebrow: 'The everyday problem',
    title: 'Car care often starts with uncertainty.',
    questions: [
      'Which option is nearby?',
      'What services are available?',
      'Is the timing right?',
      'Can I plan ahead?',
    ],
    answer:
      'Vaqto is designed to bring the information and actions around these questions into one clear journey.',
  },
  journey: {
    eyebrow: 'The Vaqto journey',
    title: 'Discover. Compare. Plan. Book.',
    intro:
      'The experience is built around what car owners need to decide—not around the complexity behind the platform.',
    steps: [
      {
        title: 'Discover',
        copy: 'Find nearby car-wash and car-care options in one focused experience.',
      },
      {
        title: 'Compare',
        copy: 'Understand services, hours, amenities and other useful details.',
      },
      {
        title: 'Plan',
        copy: 'Consider location, route and available timing guidance before you go.',
      },
      {
        title: 'Book',
        copy: 'Reserve a service at participating locations where booking is available.',
      },
    ],
  },
  route: {
    eyebrow: 'Useful along the way',
    title: 'More context for the route ahead.',
    copy: 'Where information is available, Vaqto can also help car owners see nearby fuel stations and relevant amenities—including car-wash availability—and explore what may fit their route.',
    note: 'Information and guidance may vary by location and availability. Vaqto does not imply a partnership unless a location is clearly identified as participating.',
    imageAlt: 'A route connecting useful locations across a city',
  },
  audience: {
    eyebrow: 'Designed for the ecosystem',
    title: 'A clearer experience for everyone involved.',
    items: [
      { label: 'For car owners', title: 'Find and plan with greater confidence.' },
      { label: 'For service providers', title: 'Be easier to find, understand and choose.' },
      { label: 'For organisations', title: 'Bring structure and visibility to vehicle-care needs.' },
    ],
  },
  next: {
    eyebrow: 'Explore Vaqto',
    title: 'Your car wash and car care, better timed.',
    cta: { label: 'Go to vaqto.co', href: company.vaqtoUrl },
  },
} as const

/* -------------------------------------------------------------------------- */
/*                                   Contact                                  */
/* -------------------------------------------------------------------------- */

// The original site's contact section, plus the enquiry addresses published
// on its Privacy and Terms pages.
export const contact = {
  eyebrow: home.contact.eyebrow,
  title: home.contact.title,
  copy: home.contact.copy,
  channels: [
    {
      label: 'Company, partnership and general enquiries',
      value: company.email,
      href: `mailto:${company.email}`,
    },
    {
      label: 'Privacy enquiries',
      value: company.privacyEmail,
      href: `mailto:${company.privacyEmail}`,
    },
    {
      label: 'Questions about these website terms',
      value: company.legalEmail,
      href: `mailto:${company.legalEmail}`,
    },
    {
      label: 'The Vaqto platform, bookings and related services',
      value: company.vaqtoDomain,
      href: company.vaqtoUrl,
      external: true,
    },
  ],
  enquiryTypes: ['Company', 'Partnership', 'General'],
} as const

/* -------------------------------------------------------------------------- */
/*                                    Legal                                   */
/* -------------------------------------------------------------------------- */

export type LegalSection = { title: string; body: string; email?: string; after?: string }

export type LegalDoc = {
  eyebrow: string
  title: string
  updated: string
  intro: string
  sections: LegalSection[]
}

export const privacy: LegalDoc = {
  eyebrow: 'Legal',
  title: 'Website Privacy Notice',
  updated: 'Draft for legal review · September 2026',
  intro:
    'This notice explains how Zynara Tech may handle personal information when you visit this corporate website or contact us. It does not replace the separate privacy notice applicable to the Vaqto application and services.',
  sections: [
    {
      title: 'Information we may receive',
      body: 'We may receive information you choose to provide when contacting us, such as your name, contact details, organisation and the contents of your enquiry. The website may also generate limited technical information required for security, performance and basic analytics, depending on the tools enabled at launch.',
    },
    {
      title: 'How we use information',
      body: 'We may use information to respond to enquiries, operate and secure the website, understand website performance, maintain business records and meet applicable legal obligations.',
    },
    {
      title: 'Sharing and international processing',
      body: 'Information may be processed by service providers supporting hosting, security, communications and analytics, subject to appropriate contractual and legal safeguards. We do not sell personal information.',
    },
    {
      title: 'Retention and your choices',
      body: 'We retain information only as long as reasonably necessary for the relevant purpose or legal requirement. Subject to applicable UAE law, you may ask about, correct or request deletion of personal information by contacting us.',
    },
    {
      title: 'Contact',
      body: 'Privacy enquiries may be sent to',
      email: company.privacyEmail,
      after:
        'The final published notice must be completed after the website’s hosting, analytics, cookie and contact-form configuration is confirmed.',
    },
  ],
}

export const terms: LegalDoc = {
  eyebrow: 'Legal',
  title: 'Website Terms of Use',
  updated: 'Draft for legal review · September 2026',
  intro:
    'These terms apply to your use of the Zynara Tech corporate website. The Vaqto platform, bookings and related services are governed by separate Vaqto terms made available through vaqto.co and the Vaqto application.',
  sections: [
    {
      title: 'Website purpose',
      body: 'This website provides general information about Zynara Tech and its product, Vaqto. Content may be updated as the company and its publicly available services develop.',
    },
    {
      title: 'No service commitment',
      body: 'Information on this corporate website is not an offer, guarantee or commitment to provide a particular product, feature, partnership or service. Availability may differ by location and may change.',
    },
    {
      title: 'Intellectual property',
      body: 'The website, branding, text, visual assets and other materials are owned by or licensed to Zynara Tech. They may not be copied, modified or commercially reused without permission, except where applicable law allows.',
    },
    {
      title: 'Third-party links',
      body: 'Links to Vaqto or other third-party websites are provided for convenience. Separate terms and privacy practices may apply to those destinations.',
    },
    {
      title: 'Contact',
      body: 'Questions about these website terms may be sent to',
      email: company.legalEmail,
      after:
        'The final version should be reviewed against Zynara Tech’s incorporation details and approved UAE governing-law wording before public launch.',
    },
  ],
}

export const notFound = {
  code: '404',
  title: 'This page could not be found.',
} as const
