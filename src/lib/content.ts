/**
 * Single source of truth for all marketing copy.
 * Keep voice consistent: clear first, premium second, no hype.
 */

export const BRAND = {
  name: 'SpeakToText',
  tagline: 'Stop typing. Start speaking.',
  heroHeadline: 'Stop wasting time typing.',
  heroSubcopy:
    'SpeakToText turns your voice into clean text in any app. Hold a key, say what you want, then let go. Your words appear where your cursor is.',
  subTagline:
    'Turn your voice into polished text anywhere you write.',
  platform: 'Windows'
} as const;

export const NAV_LINKS = [
  { label: 'Apps', href: '#anywhere' },
  { label: 'Demos', href: '#demos' },
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' }
] as const;

export const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Hold your hotkey',
    body: 'SpeakToText listens only while you hold your push-to-talk key. Never always-on.'
  },
  {
    step: '02',
    title: 'Speak naturally',
    body: 'Say the rough version out loud. No need to pause, punctuate, or self-edit.'
  },
  {
    step: '03',
    title: 'Release to write',
    body: 'Your polished text appears in the active app, exactly where your cursor is.'
  }
] as const;

export const DEMO_TABS = [
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    title: 'Turn a loose thought into a structured prompt.',
    caption:
      'A planning idea becomes a clean prompt with context, requirements, and tone.',
    resultLabel: 'Structured prompt',
    beforeText:
      'i need a prompt for chatgpt to help me plan the launch for speak to text like what should we do first what content we need what should be on the landing page and maybe seo and short videos but keep it simple useful and not corporate',
    afterTitle: 'Create a simple launch plan for SpeakToText.',
    afterBlocks: [
      'Context: SpeakToText is a Windows desktop app that turns spoken thoughts into polished writing anywhere the cursor is active.',
      'Include: first launch priorities, landing page improvements, SEO content ideas, short video ideas, and organic distribution steps.',
      'Tone: clear, practical, and not corporate.'
    ]
  },
  {
    id: 'claude',
    label: 'Claude',
    title: 'Shape messy strategy into a clear brief.',
    caption:
      'A fast spoken decision becomes a brief Claude can answer without guessing.',
    resultLabel: 'Clear brief',
    beforeText:
      'help me think through this demo section because i dont want random screenshots i want people to see spoken text become polished but still understand it fast and it needs to feel premium simple and not overwhelming',
    afterTitle: 'Review the demo section for a premium voice-to-text website.',
    afterBlocks: [
      'Goal: show visitors how spoken thoughts become polished writing inside real apps.',
      'Direction: avoid a wall of screenshots, keep the experience easy to scan, show before and after clearly, and preserve the original meaning.',
      'Recommendation: use one focused demo stage with app-specific examples and smooth GSAP transitions.'
    ]
  },
  {
    id: 'gmail',
    label: 'Gmail',
    title: 'Speak the reply. Send the email.',
    caption:
      'A quick verbal reply becomes an email that sounds calm and ready.',
    resultLabel: 'Ready email',
    beforeText:
      'reply to maya and say thursday works and i will send the notes before the call also tell her the pricing page is almost done but i want to check the mobile version one more time before we share it with the team',
    afterTitle: 'Subject: Thursday works',
    afterBlocks: [
      'Hi Maya,',
      'Thursday works for me. I will send the notes before the call so you have time to review them.',
      'The pricing page is almost done as well. I just want to check the mobile version one more time before we share it with the team.',
      'Best,'
    ]
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    title: 'Turn a walking thought into a polished post.',
    caption:
      'A half-formed idea becomes a readable post without losing the point.',
    resultLabel: 'Polished post',
    beforeText:
      'write a linkedin post about how typing slows people down because ideas happen while walking working or thinking and voice should help but normal dictation is messy so the real value is polished output',
    afterTitle: 'Typing is not always the fastest way to think.',
    afterBlocks: [
      'Most good ideas happen while you are walking, working, planning, or moving between tasks.',
      'Normal dictation can capture the words, but it still leaves cleanup behind.',
      'The real shift is this: voice should not just capture words. It should turn spoken thoughts into usable writing.',
      'Clean emails. Better prompts. Clear notes. Faster drafts.'
    ]
  },
  {
    id: 'docs',
    label: 'Docs',
    title: 'Capture notes before the thread disappears.',
    caption:
      'A fast spoken recap becomes clean notes your future self can use.',
    resultLabel: 'Clean notes',
    beforeText:
      'meeting notes from today we talked about launch page polish the demos need real examples not just pretty design pricing still needs checkout and seo later needs pages for voice to text windows dictation and alternatives but dont overload the page now',
    afterTitle: 'Meeting Notes',
    afterBlocks: [
      'Focus: improve the launch page without making it feel heavy or overloaded.',
      'Key decisions: show practical before-and-after examples, use real writing, and keep the page clean while the main sections are still being polished.',
      'Open items: confirm the pricing checkout link and plan SEO pages for voice-to-text, Windows dictation, and alternative workflows.',
      'Next step: prototype this section with real HTML text and restrained GSAP transitions.'
    ]
  }
] as const;

export const BEFORE_AFTER = {
  raw: 'write me something for my website about how this app helps people stop typing and maybe make it sound premium but simple',
  polished: `Write a premium, clear landing-page section for a Windows voice-to-text app. Explain how it helps users stop typing, speak naturally, and instantly turn their voice into polished text anywhere they write.`
} as const;

export const ANYWHERE_APPS = [
  { name: 'ChatGPT', hint: 'Prompts' },
  { name: 'Claude', hint: 'Thinking' },
  { name: 'Gmail', hint: 'Replies' },
  { name: 'LinkedIn', hint: 'Posts' },
  { name: 'Word', hint: 'Docs' },
  { name: 'Notion', hint: 'Notes' },
  { name: 'Slack', hint: 'Chat' },
  { name: 'Any form', hint: 'Wherever a cursor blinks' }
] as const;

export const FEATURE_STORY = [
  {
    title: 'Unlimited voice-to-text',
    body: 'Speak full thoughts, long drafts, and daily messages without watching a limit.'
  },
  {
    title: 'Clean writing instantly',
    body: 'Grammar, punctuation, spacing, and repeated words are cleaned up before your text lands.'
  },
  {
    title: 'Ready for any format',
    body: 'Turn the same thought into an email, prompt, note, reply, draft, or post.'
  },
  {
    title: 'Saved transcriptions',
    body: 'Your recent transcriptions stay easy to find, reuse, and recover when you need them.'
  },
  {
    title: 'Private by design',
    body: 'You control when listening starts, and your words stay yours.'
  }
] as const;

export const PRICING_FEATURES = [
  'Works in any app',
  'Private by default',
  'Transcript history',
  'Unlimited transcription',
  'Polished writing output'
] as const;

export const PRICING = {
  monthly: {
    id: 'monthly',
    label: 'Monthly',
    originalPrice: 10,
    price: 7,
    cadence: 'per month',
    discountLabel: '30% off, limited time',
    cta: 'Start Premium',
    features: PRICING_FEATURES
  },
  yearly: {
    id: 'yearly',
    label: 'Annual',
    originalPrice: 120,
    price: 60,
    cadence: 'per year',
    badge: 'Best value',
    discountLabel: '50% off, limited time',
    perMonthEquivalent: 5,
    cta: 'Start Premium',
    features: PRICING_FEATURES
  }
} as const;

export type TestimonialPlatform =
  | 'x'
  | 'linkedin'
  | 'reddit'
  | 'discord'
  | 'slack'
  | 'youtube'
  | 'producthunt'
  | 'appstore'
  | 'gmail'
  | 'medium';

export type Testimonial = {
  platform: TestimonialPlatform;
  name: string;
  handle?: string;
  role?: string;
  avatar: string;
  quote: string;
  stars?: number; // 1-5, used where the platform shows ratings
  timestamp: string;
  meta?: Record<string, string | number>;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    platform: 'x',
    name: 'Maya Rao',
    handle: '@mayabuilds',
    avatar: 'M',
    quote:
      'I wrote three investor updates this morning without touching the keyboard. It feels illegal. The output sounds like me on my best day.',
    timestamp: '2h',
    meta: { likes: 1284, reposts: 207, replies: 42 }
  },
  {
    platform: 'linkedin',
    name: 'Daniel Kim',
    role: 'Lead Engineer, Fintech',
    handle: 'daniel-kim-eng',
    avatar: 'D',
    quote:
      'I dictate prompts into Claude all day. SpeakToText is the first tool that actually puts structured text back, not a raw dump of my mumbling. 5/5.',
    stars: 5,
    timestamp: '1d',
    meta: { reactions: 312, comments: 48 }
  },
  {
    platform: 'reddit',
    name: 'priya_s',
    handle: 'u/priya_s',
    avatar: 'P',
    quote:
      'Cut my inbox time in half. I hold Alt, think out loud, release, and a polished reply appears in Gmail. My thumbs are not sore anymore.',
    timestamp: '6h',
    meta: { subreddit: 'r/productivity', upvotes: 2400, comments: 187 }
  },
  {
    platform: 'discord',
    name: 'alex_t',
    handle: 'alex_t#4201',
    avatar: 'A',
    quote:
      'The privacy piece is what sold me. Push-to-talk means the mic is OFF unless I explicitly press. Finally a voice tool I trust on my work laptop.',
    timestamp: 'Today at 9:14 AM',
    meta: { server: 'Indie Makers', channel: '#tools-i-love' }
  },
  {
    platform: 'slack',
    name: 'Jordan Mendez',
    role: 'Content lead',
    avatar: 'J',
    quote:
      'Every LinkedIn post I ship now starts as a walking monologue. Release the hotkey, the polished version is ready to publish.',
    timestamp: '11:47 AM',
    meta: { channel: '#marketing', reactions: '🔥 12  🎯 8  ⚡ 5' }
  },
  {
    platform: 'youtube',
    name: 'Nadia E.',
    handle: '@nadia-writes',
    avatar: 'N',
    quote:
      'I write long-form docs with my voice now. Three pages in fifteen minutes. Grammar clean, tone consistent, zero copy-paste.',
    timestamp: '3 days ago',
    meta: { likes: 847, video: 'SpeakToText review (90 days in)' }
  },
  {
    platform: 'producthunt',
    name: 'Rishi P.',
    role: 'Indie dev',
    avatar: 'R',
    quote:
      'Using it for 3 weeks. It replaced 4 other tools in my stack. The polished output is why I stay. Everything else transcribes, only this rewrites.',
    stars: 4,
    timestamp: '#1 of the day',
    meta: { upvotes: 1820 }
  },
  {
    platform: 'appstore',
    name: 'Olivia C.',
    avatar: 'O',
    quote:
      'Works almost everywhere. A handful of native apps need work, but for AI tools + email + docs, it is flawless. Waiting on Mac.',
    stars: 4,
    timestamp: 'Dec 14',
    meta: { title: 'A rare premium utility' }
  },
  {
    platform: 'gmail',
    name: 'Thomas Weber',
    role: 'CTO',
    avatar: 'T',
    quote:
      'Replied to this email using SpeakToText. If you cannot tell, that is the point. The polish step is what everyone else is missing.',
    timestamp: 'Wed 4:12 PM',
    meta: { subject: 'Re: intro to the team' }
  },
  {
    platform: 'medium',
    name: 'Sarah Chen',
    role: 'Writes about dev tools',
    avatar: 'S',
    quote:
      'I stopped editing. I just speak a rough version, release, and the structured paragraph lands in my draft. This is the first voice tool that respects long-form writing.',
    stars: 5,
    timestamp: '6 min read',
    meta: { claps: 2200, responses: 34 }
  }
];

export const TRUST_POINTS = [
  'No credit card required',
  '7-day Premium trial included',
  'Free quotas refresh daily'
] as const;

export const FAQS = [
  {
    q: 'Does SpeakToText work in ChatGPT and Claude?',
    a: 'Yes. SpeakToText writes wherever your cursor is active, including AI chat tools like ChatGPT and Claude.'
  },
  {
    q: 'Does it work in Gmail and email clients?',
    a: 'Yes. Place your cursor in the email body, hold your hotkey, speak, release, and the polished email appears there.'
  },
  {
    q: 'Is it always listening?',
    a: 'No. The workflow is push-to-talk. It captures only while you hold the hotkey and stops the moment you release.'
  },
  {
    q: 'What happens when I release the hotkey?',
    a: 'SpeakToText turns what you said into polished text and inserts it at the active cursor location.'
  },
  {
    q: 'Can I recover previous text?',
    a: 'Yes. SpeakToText includes a transcript history so you can recover and reuse previous outputs.'
  },
  {
    q: 'Is this just normal dictation?',
    a: 'No. The goal is not only to transcribe your voice, but to turn rough speech into cleaner, more polished writing.'
  },
  {
    q: 'Is it only for Windows?',
    a: 'The founder launch is for Windows. Other platforms are being evaluated based on founder-tier demand.'
  },
  {
    q: 'Does it work in every app?',
    a: 'It is designed for any place where you can type. If a text field accepts a cursor, SpeakToText can write there.'
  }
] as const;
