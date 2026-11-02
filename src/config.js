// Site settings. Edit this file to swap placeholders for real values.
// A null or empty value renders as a placeholder on the site.

const cfg = {
  siteUrl: process.env.SITE_URL || '',

  // Path the site lives under. '/website' for https://longtable-foundation.github.io/website/,
  // '' for a custom domain. Set by the GitHub Pages workflow.
  basePath: (process.env.BASE_PATH || '').replace(/\/$/, ''),

  // Sign-up forms (work email + organization) are added as rows to the Google Sheet
  // "Longtable newsletter capture database" through a small Apps Script web app.
  // Paste tools/google-sheet-capture.gs into the sheet (Extensions > Apps Script), deploy it
  // as a web app (Execute as: Me, Who has access: Anyone) and put its /exec URL here.
  // Empty = forms show a 'sign-ups open soon' note.
  sheetEndpoint: process.env.SHEET_ENDPOINT || 'https://script.google.com/macros/s/AKfycbwbK4TRBqpcMdvHg72OtgWCHFOUBL-TBFzYr39Rmf9LoG-vQQDJmvoP7xfQvYc3Ick/exec',

  // For local testing with server.js only: POST JSON here instead of the Google Form.
  formEndpoint: process.env.FORM_ENDPOINT || '',

  // Contact and links
  pressEmail: 'press@alpaca.markets',
  githubUrl: 'https://github.com/longtable-foundation',
  contributingUrl: 'https://github.com/longtable-foundation', // contribution guide

  // The proposal PDF is never in this repo. Readers ask for it with work email + organization,
  // and the Apps Script (tools/google-sheet-capture.gs) emails it from Google Drive.
  proposal: {
    href: '/proposal/',
    pages: 45,
    date: 'Oct 2026',
    title: 'Multimodal Clearing: a technology layer for licensed clearinghouses',
  },

  // YouTube video IDs (the part after watch?v=). Empty = placeholder thumbnail.
  videos: {
    summitTalk: '',        // 7 min Alpaca Summit talk, homepage hero
    rollupInterview: '2peRyv_iX5A',   // The Rollup, live from DAS Asia 2026
    // SIFMA Ops 2026 full panel — clips use start offsets (seconds) into this video
    sifmaPanel: 'mX1syigQ0iY',
    sifmaClip1Start: 460,   // ~7:40 · transfer-agent / “nobody wants to pre-fund”
    sifmaClip2Start: 1922,  // ~32:02 · ITN / deep liquidity as TradFi
    useCase01: '',
    useCase02: '',
    useCase03: '',
  },

  // Other external links. Empty = rendered without a link.
  links: {
    sifmaClip1: 'https://www.youtube.com/watch?v=mX1syigQ0iY&t=460s',
    sifmaClip2: 'https://www.youtube.com/watch?v=mX1syigQ0iY&t=1922s',
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
