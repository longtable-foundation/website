// Copy for the site, taken from the external proposal and the approved mockups.

const UC = [
  { n: '01', slug: '01', t: 'The Saturday-morning mint', s: 'Share-for-token CSD interop', video: 'useCase01', pp: '21–22',
    p: ['Clearing members', 'CSDs', 'Market makers', 'Stablecoin LoCs', 'Tokenization agents'],
    d: 'A market maker wants to mint a token on Saturday morning while the DTCC is closed. A clearinghouse backstop covers the gap from T to T+1.',
    prob: 'A market maker holds GME inventory at ABN AMRO and wants to mint a GMEx token on Alpaca’s ITN on Saturday morning. The DTCC is closed; no locate, no borrow because LoanNet is offline. RWAs settle at tradfi speed while tokens settle at blockchain speed, and nothing bridges the gap.',
    goal: ['A clearinghouse where both Alpaca and ABN AMRO are clearing members can depend on its backstop to execute a Saturday morning mint, with limits set by the clearinghouse.'],
    cap1: 'Fast rail and slow rail. The backstop is the clearing member’s pledged collateral plus a deposit sized to overnight gap risk.',
    cap2: 'The clearinghouse has an inter-agency agreement with the NSCC, OCC, FICC and various CFTC licensed DCOs in order to share credits between the agencies. This allows members of one to use their credits in another.' },
  { n: '02', slug: '02', t: 'Many-to-many settlement', s: 'Multilateral netting', video: 'useCase02', pp: '23–24',
    p: ['Trading venues', 'Clearing members'],
    d: 'Bilateral settlement between n agents needs n(n−1) sub-accounts. A clearinghouse replaces them with one ledger and net dues published every cycle.',
    prob: 'Three clearing members act as settlement agents on a tokenized equities ATS. For C1 to settle with C3, C1 needs a sub-account at C3, and at C2, and C2 at C1, and so on. The complexity grows with every additional agent.',
    goal: ['Centralized clearing solves a classic many-to-many problem and allows for continuous multilateral netting. A clearinghouse mitigates settlement failures for each member on a delayed cycle, everyone receives their dues from the onchain ledger published each cycle, and anything unsettled rolls to the next one.'],
    cap1: 'Sub-accounts needed for every settlement agent to settle with every other, compared with one ledger at a clearinghouse. Drag to change the number of agents.',
    cap2: 'One ledger, one account per agent. Net dues are published every cycle and anything unsettled rolls over to the next one.' },
  { n: '03', slug: '03', t: 'Pre-funded venues become post-trade settled', s: 'Pre-funding', video: 'useCase03', pp: '25–26',
    p: ['Trading venues', 'Market makers', 'Tokenization agents', 'RFQ intent protocols'],
    d: 'Market makers no longer pre-fund inventory on every venue. Cash proceeds pay for the post-trade settlement of the share.',
    prob: 'Even token-only venues have a pre-funding problem. Pre-funded ATSs with matching engines require market makers to buy tokens before quoting the offer side: no serious institution will pre-fund the entire global equity markets at scale. Onchain RFQ protocols (LI.FI, 0x, CowSwap, 1inch Fusion) settle atomically, but the solver must deliver the token at trade time.',
    goal: ['With post-trade settlement: negative working capital becomes positive: cash proceeds pay for the post-trade settlement of the share. An open source solver, built with token issuers and backed by a clearinghouse, backstops freshly minted tokens against RFQ taker orders.', 'With netting: obligations are created at trade time, netting through the cycle and the balance of shares are settled at cycle-end.'],
    cap2: 'Post-trade settled: proceeds fund settlement.' },
  { n: '04', slug: '04', t: 'Demoting DRS', s: 'Issuer-sponsored tokens', video: null, pp: '27–28',
    p: ['Transfer agents', 'CSDs', 'Clearing members'],
    d: 'The clearinghouse underwrites issuance the instant DRS is triggered, so tokens mint at time T and DRS becomes a post-trade detail.',
    prob: 'Issuer-sponsored tokens are bottlenecked by DRS: title must move from Cede & Co to the transfer agent through a system controlled by DTCC. Instant tradfi↔defi bridging is practically impossible for ISTs today.',
    goal: ['With a clearinghouse: the clearinghouse, holding a DTC account, underwrites the issuance the instant DRS is triggered, so the tokenization agent mints at time T on the backstop. In reverse, any clearing member credits the share position instantly on redemption. DRS is demoted from critical bottleneck to a post-trade implementation detail that completes whenever the DTCC decides to.'],
    cap1: 'Today, DRS sits on the critical path: DTCC hours only, with an SLA in days.',
    cap2: 'With a clearinghouse, DRS is demoted to a post-trade implementation detail.' },
  { n: '05', slug: '05', t: 'Post-trade settlement for atomic onchain RFQ', s: 'Atomic RFQ', video: null, pp: '17–18, 40',
    p: ['RFQ intent protocols', 'Tokenization agents', 'Clearing members'],
    d: 'Atomically mint primary issued tokens in response to RFQ taker orders and use the proceeds to settle with the issuer post-trade.',
    prob: '“Crypto technology allows pre-funded trades to settle atomically, meaning both the delivery and the payment settle at the same time and if one leg fails the whole trade rolls back. That’s what makes it atomic… but that’s not how trading works in the real world. Nobody wants to pre-fund their trades.”',
    quote: true, qa: 'SIFMA Ops 2026 · clip [1]', qLink: 'sifmaClip1',
    goal: ['This concept does not exist for bearer crypto assets, but since RWAs are not bearer assets we can mint them at time T, backstopped until the underlying settles post-trade.', 'Pre-funding is no longer necessary with a backstop, and inventory can be settled from a third party custodian to the tokenization agent post-trade, turning a closed-loop book-entry system into an industry-wide open one.'],
    mile: ['Roadmap · Phase 1', 'MVP goes live', 'Milestone: open source smart contracts published'] },
  { n: '06', slug: '06', t: 'Cross-chain bridging', s: 'Bridging', video: null, pp: '41',
    p: ['Bridge protocols', 'Tokenization agents', 'Clearing members'],
    d: 'The receiving token is minted at time T on a backstop and settled post-trade, built on the atomic RFQ work.',
    prob: 'Each venue settles atomically, so each one needs its own tokens and stablecoins before the first trade. Bridges are no different: a relayer can only fill if it already holds the token on the destination chain, so it pre-funds inventory on both sides of the bridge.',
    goal: ['Bridging, in partnership with Across Networks and Paxos Transit to start with. Bridging will be built on our atomic RFQ work, where the receiving token will be minted and settled post-trade.'],
    mile: ['Roadmap · Phase 2', 'Cross-chain clearing', 'Bridging built on the atomic RFQ work'] },
];

const GOAL1 = [
  'ABN AMRO uses its credits at the NSCC, OCC, FICC or a DCO, shared under the inter-agency agreement.',
  'The clearinghouse underwrites the mint at time T for a fee of notional.',
  'ABN AMRO and the clearinghouse generate a revenue-share on the locate.',
  'Alpaca credits the share position based on the clearinghouse’s backstop and creates a fail obligation at DTC box.',
  'If ABN falls below maintenance margin, the clearinghouse automatically draws down on lines of credit to backstop the defaulting party, giving time to resolve the contractual pledges offline.',
];

const PH = [
  { n: '1', t: 'MVP goes live', d: 'Atomic Longtable RFQ smart contract, with issuers minting on a backstop provided by Alpaca.', m: 'Open source smart contracts published', g: 'Onchain', now: true },
  { n: '2', t: 'Cross-chain clearing', d: 'Bridging with Across Networks and Paxos Transit, built on the atomic RFQ work.', g: 'Onchain' },
  { n: '3', t: 'Onchain clearinghouse', d: 'Aave, Gauntlet Aera and Steakhouse vaults as portfolio margin accounts. Introduces margincoins.', g: 'Onchain' },
  { n: '4', t: 'Partner with a clearinghouse in the US', d: 'Expand the partner’s clearing agency license to cover multimodal clearing.', g: 'Regulated clearing' },
  { n: '5', t: 'Full novation via licensed CCPs', d: 'Outside the US: ADGM, EU, UK.', g: 'Regulated clearing' },
];

const TL = [
  { t: 'Netting', d: 'Multilateral netting on a 24/7 settlement cycle' },
  { t: 'Balance calculation', d: 'Net dues, margin and limits per member' },
  { t: 'Minting', d: 'Mint at time T with token issuers' },
  { t: 'Margincoins', d: 'Portfolio-backed collateral across venues' },
  { t: 'Integrations', d: 'Onchain lending, RFQ and bridge protocols' },
];

const NT = [
  { u: 'NSCC · equities', w: 'US cash equity settlement obligations', r: '98% reduction', x: '$519T of obligations settled as $9T in one year.' },
  { u: 'CHIPS · USD payments', w: 'High-value dollar payments', r: '26:1 liquidity efficiency', x: '$2T settled daily on roughly $96B of funding.' },
  { u: 'CLS · FX', w: 'Payment legs in 18 currencies', r: '>96% funding reduction', x: 'On over $8T settled daily.' },
];

const TC = ['1inch Fusion solver', 'LI.FI solver', 'Across solver', '0x solver', 'CoW Swap solver', 'Aave v4 vault adapter', 'Gauntlet Aera vault adapter', 'Morpho vault adapter'];

const MCL = ['Issuer', 'Clearing member', 'Venue', 'Vault', 'Oracle', 'CSD'];

const INT = [
  { id: 'follow', k: 'Follow', t: 'Get progress updates', d: 'Milestones, publications and open calls for comment.', c: 'Get updates' },
  { id: 'join', k: 'Join', t: 'Join the initiative', d: 'Membership is open to issuers, clearing members, venues, vaults, oracles and CSDs.', c: 'Apply' },
  { id: 'fund', k: 'Fund', t: 'Help fund the Foundation', d: 'Support the open standard and its reference implementation.', c: 'Talk to us' },
  { id: 'build', k: 'Build', t: 'Contribute open source code', d: 'Template contracts and adapters under an irrevocable open source license.', c: 'GitHub' },
];

const CH = [
  ['00:00', 'Intro'],
  ['02:03', 'ITN Hit $5B In Flows Already'],
  ['05:21', 'Why Tokenized Spot Is Harder Than Perps'],
  ['07:24', 'TradFi Market Makers Cannot Naked Short'],
  ['09:13', 'Multimodal Equities Era Has Begun'],
  ['11:46', 'Transfer Agent Is The Source Of Truth'],
  ['13:53', 'Token Is The Share Is A False Narrative'],
  ['17:29', 'AMC Weekend Price Dislocation Explained'],
  ['19:35', 'Market Makers Beg For Weekend Minting'],
  ['23:37', 'Multilateral Clearing The Next Frontier'],
  ['28:53', 'NSCC Clears 4.6 Quadrillion Annually'],
  ['30:02', 'Digital Assets Operates On Debit Cards'],
  ['33:09', 'Retail Gets ITN Access Via Facilitating AP'],
  ['36:03', 'Banks Forced Into 24/7 By Their Executives'],
  ['38:07', 'OKX Partners With NYSE Parent On 24/7'],
];

const DUES = [['C1', 'Receives', 50, 19, 'r'], ['C2', 'Pays', 38, 12, 'p'], ['C3', 'Receives', 50, 7, 'r'], ['C4', 'Pays', 34, 16, 'p'], ['C5', 'Rolls over', 50, 10, 'o']];

const BOILER = 'The Longtable Foundation is a foundation and a global network of clearinghouses that use open source technology for post-trade settlement of tokenized equities, onchain and offchain. The Foundation sets and maintains the open source protocol standards agreed upon by token issuers, tokenization agents, venues, clearing members, other protocols and CSDs. Longtable is incubated by Alpaca.';

const ROLES = ['Issuer', 'Clearing member', 'Venue', 'Vault or oracle', 'CSD', 'Media', 'Other'];

module.exports = { UC, GOAL1, PH, TL, NT, TC, MCL, INT, CH, DUES, BOILER, ROLES };
