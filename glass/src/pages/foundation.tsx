import { D, cfg } from '@/data'
import { FoundationBody, OpenSourceBlock } from '@/site/blocks'
import { Body, Eyebrow, H2, LinkTile, PageHero, Sec, TextLink, Tile } from '@/site/ui'

const KV: [string, string][] = [
  ['Incubator', 'Alpaca'],
  ['Reference impl.', 'Alpaca'],
  ['Phase 1 backstop', 'Alpaca'],
  ['Legal status', 'Legally independent'],
  ['Funding', 'Member dues'],
  ['Protocol IP', 'Irrevocable open source license'],
  ['Governance', 'To be announced'],
]

const WHY: [string, string, string][] = [
  ['01', 'It is now Day 2 for tokenized stocks', 'Custody was the foundation and was the necessary first step for the industry. For bearer crypto tokens this is where the story ends, but tokenized equities are different. We are now entering a new era of “onchain credit”, which for tokenized equities means post-trade settlement, which requires clearing.'],
  ['02', 'The need for clearing has not been well understood', 'Crypto is typically instantly and atomically settled, and atomic settlement works fine when both legs of the trade are pre-funded. There is no concept of post-trade settlement on any tokenized equities trading venue today, so there was no need for a multimodal clearinghouse until tradfi institutional adoption entered the zeitgeist.'],
  ['03', 'Every new clearinghouse needs to beat the chicken & egg problem', 'Most fail due to not achieving critical mass. Alpaca’s ITN is the only example that has beaten the chicken & egg problem.'],
]

export function Foundation() {
  return (
    <>
      <PageHero
        eyebrow="§4 · The Foundation"
        title="The Foundation"
        lead="A legally independent foundation that sets the open standard, and a global network of clearinghouses that mitigate settlement failures of tokenized equities onchain and offchain."
      />
      <Sec id="structure" no="§4.1" label="Structure">
        <FoundationBody heading={false} />
      </Sec>
      <OpenSourceBlock no="§4.2" />
      <Sec id="why-now" no="§4.3" label="Why now">
        <div className="grid gap-4 md:grid-cols-3">
          {WHY.map(([n, t, d]) => (
            <Tile key={n} className="flex flex-col gap-3">
              <span className="font-display text-[40px] leading-none text-black/15">{n}</span>
              <span className="text-[17px] font-semibold tracking-[-0.01em] text-balance">{t}</span>
              <Body className="text-body-sm">{d}</Body>
            </Tile>
          ))}
        </div>
      </Sec>
      <Sec id="incubation" no="§4.4" label="Incubation">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-12">
          <div className="flex flex-col gap-5">
            <H2>Incubated by Alpaca</H2>
            <Body>Today, Alpaca has built an internal clearinghouse, ITN (Instant Tokenization Network), as an MVP of how post-trade settlement and clearing can work for tokenized equities.</Body>
            <Body>ITN can be considered the world’s first ever implementation of tokenized stocks clearing, but it only works where both issuer and minting participant custody the traditional asset at Alpaca. A closed system.</Body>
            <p className="border-l-2 border-token pl-4 font-display text-[22px] leading-snug">Interestingly, this is exactly how the NSCC started, as a single-venue clearinghouse inside the NYSE.</p>
          </div>
          <div className="overflow-hidden rounded-[28px] bg-stage">
            <div className="px-6 pt-5 pb-3">
              <Eyebrow>Foundation · at a glance</Eyebrow>
            </div>
            <dl className="px-3 pb-3">
              {KV.map(([a, b]) => (
                <div key={a} className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3 text-body-sm odd:bg-white/60">
                  <dt className="text-muted-foreground">{a}</dt>
                  <dd className="text-right font-medium">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Sec>
      <Sec id="membership" no="§4.5" label="Membership">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <ol className="flex flex-col gap-2">
            {[
              'All ITN issuers are invited as Longtable Foundation members to come to an agreement on token minting standards.',
              'Members may donate open source software to the Foundation under an irrevocable license.',
              'Foundation membership must be open for any new issuers to join while keeping out bad actors.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-4 rounded-2xl bg-stage px-5 py-4">
                <span className="font-mono text-ui text-faint">0{i + 1}</span>
                <span className="text-body">{t}</span>
              </li>
            ))}
          </ol>
          <Tile className="flex flex-col gap-4">
            <Eyebrow>Member classes</Eyebrow>
            <div className="flex flex-wrap gap-1.5">
              {D.MCL.map((m) => (
                <span key={m} className="rounded-full bg-surface px-3 py-1.5 text-ui font-medium">
                  {m}s
                </span>
              ))}
            </div>
            <span className="mt-auto text-body-sm">
              <TextLink to="/get-involved/#sign-up">Apply to join →</TextLink>
            </span>
          </Tile>
        </div>
      </Sec>
      <Sec id="contact" no="§4.6" label="Next">
        <div className="grid gap-4 md:grid-cols-3">
          <LinkTile to="/roadmap/" eyebrow="§5 · Roadmap" title="Five phases, from a reference implementation to clearinghouses worldwide" className="min-h-[220px]" />
          <LinkTile to="/get-involved/" eyebrow="Partnerships" title="Join, fund or contribute" desc="Get involved" className="min-h-[220px]" />
          <LinkTile to="/press/" eyebrow="Press" title="Alpaca media team" desc={cfg.pressEmail} className="min-h-[220px]" />
        </div>
      </Sec>
    </>
  )
}
