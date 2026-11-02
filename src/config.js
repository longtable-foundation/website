// Site settings. Edit this file to swap placeholders for real values.
// A null or empty value renders as a placeholder on the site.

const cfg = {
  siteUrl: process.env.SITE_URL || '',

  // Path the site lives under. '/website' for https://longtable-foundation.github.io/website/,
  // '' for a custom domain. Set by the GitHub Pages workflow.
  basePath: (process.env.BASE_PATH || '').replace(/\/$/, ''),

  // Sign-up forms go to one Google Form. In the form: Send button > link icon is not it;
  // use the form's /formResponse URL, and each question's entry id from a prefilled link
  // (three dots > Get pre-filled link > fill every field > Get link).
  // Empty action = forms show a 'sign-ups open soon' note.
  googleForm: {
    action: process.env.GOOGLE_FORM_ACTION || '', // https://docs.google.com/forms/d/e/<FORM_ID>/formResponse
    fields: {
      type: '',          // 'Form' (short answer): follow, join or fund
      email: '',         // 'Work email'
      organization: '',  // 'Organization'
      role: '',          // 'I am a'
      memberClass: '',   // 'Member class'
      jurisdiction: '',  // 'Jurisdiction'
      message: '',       // 'Message' (paragraph)
      page: '',          // 'Page'
    },
  },

  // For local testing with server.js only: POST JSON here instead of the Google Form.
  formEndpoint: process.env.FORM_ENDPOINT || '',

  // Contact and links
  pressEmail: 'press@alpaca.markets',
  githubUrl: 'https://github.com/longtable-foundation',
  contributingUrl: 'https://github.com/longtable-foundation', // contribution guide

  // Proposal download (file lives in public/assets/)
  proposal: {
    href: '/assets/longtable-multimodal-clearing-proposal.pdf',
    pages: 45,
    date: 'Oct 2026',
    title: 'Multimodal Clearing: a technology layer for licensed clearinghouses',
  },

  // YouTube video IDs (the part after watch?v=). Empty = placeholder thumbnail.
  videos: {
    summitTalk: '',        // 7 min Alpaca Summit talk, homepage hero
    rollupInterview: '',   // The Rollup, live from DAS Asia 2026
    useCase01: '',
    useCase02: '',
    useCase03: '',
  },

  // Other external links. Empty = rendered without a link.
  links: {
    sifmaClip1: '',
    sifmaClip2: '',
    tabbArticle: '',
    taylorArticle: '',
  },

  // Founding signatories. logo: path under public/, or '' for a placeholder.
  // PLACEHOLDER LIST FROM THE MOCKUPS. While signatoriesConfirmed is false the site
  // shows unnamed 'To be announced' slots instead of these names.
  signatoriesConfirmed: false,
  signatories: [
    { name: 'Aave', logo: '' },
    { name: 'Bullish', logo: '' },
    { name: 'Equiniti', logo: '' },
    { name: 'Gauntlet', logo: '' },
    { name: 'ClearToken', logo: '' },
    { name: 'Across Networks', logo: '' },
  ],

  speaker: { name: 'Arush Sehgal', role: 'Head of Digital Assets, Alpaca' },

  // 3D explainers: 'original' (token yellow, cash green, share blue) or 'greyscale'
  animColor: 'original',
  // Black document bar above the header
  docBar: true,
};

// What the pages render: the real list once confirmed, otherwise unnamed slots.
cfg.publicSignatories = cfg.signatoriesConfirmed
  ? cfg.signatories
  : cfg.signatories.map(() => ({ name: 'To be announced', logo: '', tba: true }));

module.exports = cfg;
