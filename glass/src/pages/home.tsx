import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { GlassButton } from '@/components/liquid-glass'
import { D, UC, cfg } from '@/data'
import { FigBenchmark, FigCapital, FigExec, FigItn, FigModalities, FigUnbundle, HeroFrame } from '@/figures/home-figs'
import { FoundationBody, OpenSourceBlock, ProposalCard, RoadmapBody } from '@/site/blocks'
import { column } from '@/site/chrome'
import { Pillar } from '@/site/frame'
import { Body, Cap, Eyebrow, H2, H3, Lead, LinkTile, Sec, TextLink, Tile, Video } from '@/site/ui'

function Hero() {
  return (
    <section>
      <div className={`${column} px-4 pt-14 pb-10 sm:px-8 sm:pt-20 sm:pb-14`}>
        <div className="flex flex-col gap-7">
          <Link
            to="/proposal/"
            className="press group inline-flex h-8 w-fit items-center gap-2 rounded-full border border-black/[0.06] bg-white pr-3 pl-1 text-ui text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:text-foreground"
          >
            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-micro text-foreground">LT-0001</span>
            {cfg.proposal.title.split(':')[0]} · {cfg.proposal.date}
            <ArrowRight className="size-3.5 motion-safe:transition-transform motion-safe:duration-150 motion-safe:group-hover:translate-x-0.5" />
          </Link>
          <h1 className="max-w-[16ch] font-display text-[46px] leading-[0.98] tracking-[-0.035em] text-balance sm:text-[72px] lg:text-[88px]">
            <span className="text-black/30">Multimodal clearing</span> is the missing infrastructure.
          </h1>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-[58ch] text-[17px] leading-relaxed text-muted-foreground text-pretty sm:text-[18px]">
              Longtable is a foundation that stewards open source infrastructure to support multimodal clearing of tokenized assets by licensed clearinghouses worldwide.
            </p>
            <GlassButton material="tinted" size="md" asChild className="shrink-0 border border-black/[0.06] bg-white text-neutral-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
              <Link to="/get-involved/#sign-up">Get progress updates</Link>
            </GlassButton>
          </div>
        </div>
      </div>
      <div className={`${column} px-3 pb-16 sm:px-6 sm:pb-24`}>
        <HeroFrame />
      </div>
    </section>
  )
}

export function Home() {
  const v = cfg.videos
  return (
    <>
      <Hero />

      <Sec id="executive-summary" no="§1" label="Executive summary">
        <H2 className="max-w-[24ch]">
          Atomic settlement undeniably reduces systemic risk for capital markets globally. <span className="text-muted-foreground">However, when it comes to trading, atomic settlement is not always desired.</span>
        </H2>
        <FigExec />
        <figure className="grid items-center gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:gap-8">
          <Video id={v.summitTalk as string} label="Alpaca Summit 2026 talk" badge="7 MIN" />
          <figcaption className="flex flex-col gap-2">
            <span className="font-mono text-micro tracking-wide text-faint">FIG. 0 · The Alpaca Summit · October 2026</span>
            <span className="text-[26px] leading-tight tracking-[-0.03em]">Multimodal Clearing</span>
            <span className="text-body-sm text-muted-foreground">
              {cfg.speaker.name}, {cfg.speaker.role}
            </span>
            {v.summitTalk && (
              <span className="text-body-sm">
                <TextLink href={`https://www.youtube.com/watch?v=${v.summitTalk}`}>Watch on YouTube ↗</TextLink>
              </span>
            )}
          </figcaption>
        </figure>
      </Sec>

      <Sec id="benchmark" no="§2" label="The benchmark">
        <H2>In US equities, 98% of trades are netted down</H2>
        <FigBenchmark />
        <Lead>
          This is achieved by venues and members subscribing to delayed settlement, netting, margin and risk management rules set by the clearinghouse (the NSCC) that essentially provides “slack” in the system to allow for liquidity to flow efficiently between clearing members and between venues.
        </Lead>
        <p className="max-w-[40ch] text-[24px] leading-snug tracking-[-0.03em] sm:text-[30px]">
          Today, tokenized equities settlement is scattered across venues, chains, and token standards with <mark className="rounded-md bg-token/70 px-1.5 text-foreground">no NSCC equivalent.</mark>
        </p>
      </Sec>

      <Sec id="multimodal-equities" no="§3" label="Multimodal equities">
        <H2>Multimodal equities require multimodal post-trade infra</H2>
        <Lead>Today, tokenized security markets operate across several representations of the same economic exposure.</Lead>
        <FigModalities />
        <FigUnbundle />
        <Cap no="FIG. 2">In DTCC terms: custody unbundled; clearing not yet rebuilt.</Cap>
      </Sec>

      <Sec id="pre-funding" no="§4" label="Pre-funding">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-5">
            <H2>Pre-funding was the solution, now it’s the problem</H2>
            <Body className="text-lead">
              Without centralized clearing, one can only settle against the other with capital-inefficient bilateral agreements. The market has solved this by requiring market makers to deploy capital to pre-fund liquidity on each venue.
            </Body>
            <p className="border-l-2 border-token pl-4 text-[17px] leading-relaxed text-foreground">
              These isolated onchain venues require a centralized clearing layer that provides post-trade settlement and multi-lateral netting in order for tradfi flows to actually move to blockchain rails.
            </p>
          </div>
          <Tile dark className="flex flex-col justify-between gap-8" >
            <Eyebrow className="text-white/50">Global capital markets</Eyebrow>
            <span className="font-display text-[80px] leading-none tracking-[-0.04em]">$300T</span>
            <p className="text-body-sm text-white/70">The fabled “trillions” in tokenized equities will not move onchain until we build post-trade settlement infrastructure.</p>
          </Tile>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <H3>Pre-funding parks capital on every venue</H3>
            <Body>
              Each venue settles atomically, so each one needs its own tokens and stablecoins before the first trade. Market makers pull cash, securities and tokens out of the accounts where they are productive and park them on every venue.
            </Body>
          </div>
          <div className="flex flex-col gap-3">
            <H3>A clearinghouse sends collateral back to work</H3>
            <Body>
              Venues settle post-trade against a clearinghouse that nets obligations across every venue and mitigates settlement failures. The inventory parked on each venue moves back to the accounts where it is productive, sized to net risk.
            </Body>
          </div>
        </div>
        <FigCapital />
      </Sec>

      <Sec id="implications" no="§5" label="Implications">
        <H2>Tokenized assets are not bearer assets like crypto tokens. They are a new modality for the same underlying asset.</H2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Not bearer assets', 'Under most regulatory regimes, bearer securities are prohibited for AML reasons and this remains true for tokenized equities, which makes them fundamentally different to crypto tokens.'],
            ['One security, many forms', 'The same security can be offered in multiple venues in different forms, creating new liquidity unification challenges across not just venues but also different token formats and blockchains. This is exactly what a clearinghouse solves.'],
            ['Market microstructure', 'Multimodality is the core change to market structure. It drives how order books or RFQs receive liquidity, how funds flow between counterparties and when, how financing works, and what licenses, regulation and infrastructure are required.'],
          ].map(([k, t]) => (
            <Tile key={k} className="flex flex-col gap-3">
              <Eyebrow>{k}</Eyebrow>
              <Body className="text-body-sm">{t}</Body>
            </Tile>
          ))}
        </div>
        <blockquote className="relative isolate overflow-hidden rounded-[28px] card-dark p-8 text-[24px] leading-[1.25] tracking-[-0.03em] text-white text-balance sm:p-12 sm:text-[34px]">
          <Pillar pillarRotation={64} fade={0.7} style={{ left: '45%', width: '55%' }} />
          There is no market utility today that can provide 24/7 continuous netting or a backstop for settlement across all modalities.
        </blockquote>
        <div className="grid gap-6 md:grid-cols-2">
          <Body>
            Tokenizing securities unlocks 24/7 global settlements on blockchain rails, but they trade in siloes: isolated venues or bilateral settlements. There is no global blockchain-compatible clearing solution that connects tradfi to defi or independent onchain venues like we have in tradfi today.
          </Body>
          <Body>
            Building multi-lateral token clearing in-house would take tradfi CCPs years, and each would only support their own local flavor of tokenized entitlements, leaving issuer-sponsored and linked-security tokens with no clearinghouse solution whatsoever.
          </Body>
        </div>
        <H3 className="mt-4">Implications on clearing</H3>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['1', 'In-kind convertibility', 'Unifying liquidity and prices requires instant and frictionless in-kind creation and redemption between tradfi and defi versions of assets. Alpaca’s ITN does this in a limited way today; it must scale beyond Alpaca to other broker-dealers and multiple onchain and offchain venues.'],
            ['2', 'Post-trade settlement', 'Delayed settlement is a feature, not a bug, and it creates the need for clearing. Self-clearing DEXs are a genuine innovation, but they are not a solution for multi-lateral netting between venues, or for clearing a traditional share against its tokenized version when the tradfi leg settles T+1.'],
          ].map(([n, t, d]) => (
            <Tile key={n} className="flex flex-col gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-foreground font-mono text-ui text-background">{n}</span>
              <span className="text-[17px] font-semibold tracking-[-0.01em]">{t}</span>
              <Body className="text-body-sm">{d}</Body>
            </Tile>
          ))}
        </div>
      </Sec>

      <Sec id="why-now" no="§6" label="Why now">
        <H2>Why now?</H2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['01', 'It is now Day 2 for tokenized stocks', 'Custody was the necessary first step. For bearer crypto tokens this is where the story ends, but tokenized equities are different. We are entering an era of onchain credit, and for tokenized equities that means post-trade settlement, which requires clearing.'],
            ['02', 'The need for clearing has not been well understood', 'Atomic settlement works when both legs are pre-funded. There is no concept of post-trade settlement on any tokenized equities trading venue today, so there was no need for a multimodal clearinghouse until tradfi institutional adoption entered the zeitgeist.'],
            ['03', 'Every new clearinghouse needs to beat the chicken & egg problem', 'Most fail due to not achieving critical mass. Alpaca’s ITN is the only example that has beaten the chicken & egg problem.'],
          ].map(([n, t, d]) => (
            <Tile key={n} className="flex flex-col gap-3">
              <span className="font-mono text-micro tracking-wide text-faint">{n}</span>
              <span className="text-[17px] font-semibold tracking-[-0.01em] text-balance">{t}</span>
              <Body className="text-body-sm">{d}</Body>
            </Tile>
          ))}
        </div>
        <H3 className="mt-4">The Alpaca MVP: ITN</H3>
        <Lead>
          Alpaca built <TextLink href="https://docs.alpaca.markets/us/docs/tokenization-guide-for-authorized-participant">ITN</TextLink> as an MVP for how post-trade settlement and clearing can work for tokenized equities. Participants can mint unsettled share positions at time T because Alpaca underwrites itself for potential T+1 failures, but only in a closed system where both the issuer and the minting participant custody the traditional asset at Alpaca. This is how the NSCC started: as a single-venue clearinghouse inside the NYSE.
        </Lead>
        <FigItn />
        <Cap no="FIG. 5">ITN works today inside Alpaca’s closed loop. Inventory custodied elsewhere, and issuers not on Alpaca, remain outside.</Cap>
        <H3 className="mt-4">Liquidity challenges remaining</H3>
        <Lead>While we have solved in-kind minting and redeeming within Alpaca’s closed system, the following challenges remain:</Lead>
        <div className="grid gap-4 md:grid-cols-2">
          <Tile className="flex flex-col gap-3">
            <Eyebrow>Problem 1</Eyebrow>
            <span className="text-[17px] font-semibold tracking-[-0.01em]">The open-loop problem</span>
            <Body className="text-body-sm">Mint where tradfi inventory is custodied away from Alpaca, or the issuer is not on Alpaca.</Body>
          </Tile>
          <Tile className="flex flex-col gap-3">
            <Eyebrow>Problem 2</Eyebrow>
            <span className="text-[17px] font-semibold tracking-[-0.01em]">The pre-funding problem</span>
            <Body className="text-body-sm">
              <b className="font-semibold text-foreground">RFQ variant.</b> Atomically mint primary issued tokens in response to RFQ taker orders and use the proceeds to settle with the issuer post-trade.
            </Body>
            <Body className="text-body-sm">
              <b className="font-semibold text-foreground">DRS variant.</b> Issuer-sponsored tokens are bottlenecked by DRS which settles T+N, solvable only with a time T backstop.
            </Body>
          </Tile>
        </div>
      </Sec>

      <Sec id="use-cases" no="§7" label="Use cases">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <H2>Six use cases</H2>
          <TextLink to="/use-cases/01/">All use cases →</TextLink>
        </div>
        <Lead>Without liquidity, trading venues cannot function. As tokenized equities trading grows, the need to solve the liquidity problem is becoming urgent.</Lead>
        <UseCaseGrid />
      </Sec>

      <Sec id="foundation" no="§8" label="The Foundation">
        <FoundationBody />
      </Sec>

      <Sec id="roadmap" no="§9" label="Roadmap">
        <RoadmapBody />
      </Sec>

      <OpenSourceBlock no="§10" />

      <Sec id="signatories" no="§11" label="Signatories">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <H2>Signatories</H2>
          <TextLink to="/signatories/">All signatories →</TextLink>
        </div>
        {!cfg.signatoriesConfirmed && (
          <Body>
            Founding signatories will be announced here. <TextLink to="/get-involved/#sign-up">Apply to join →</TextLink>
          </Body>
        )}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cfg.publicSignatories.map((g, i) => (
            <div key={i} className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[22px] bg-stage p-4 text-center">
              {g.logo ? <img src={g.logo} alt="" className="h-8" /> : <span className="h-8 w-16 rounded-lg border-[1.5px] border-dashed border-black/15" />}
              <span className="text-caption text-muted-foreground">{g.name}</span>
            </div>
          ))}
        </div>
      </Sec>

      <Sec id="participate" no="§12" label="Participate">
        <H2>Participate</H2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {D.INT.map((g) => (
            <LinkTile
              key={g.id}
              eyebrow={g.k}
              title={g.t}
              desc={g.d}
              href={g.id === 'build' ? cfg.githubUrl : undefined}
              to={g.id === 'build' ? undefined : '/get-involved/#sign-up'}
              className="min-h-[200px]"
            />
          ))}
          <ProposalCard className="min-h-[200px] sm:col-span-2 lg:col-span-1 lg:col-start-3 lg:row-span-2 lg:row-start-1" />
        </div>
      </Sec>
    </>
  )
}

export function UseCaseGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {UC.map((u) => (
        <LinkTile key={u.slug} to={`/use-cases/${u.slug}/`} eyebrow={u.s} title={u.t} desc={u.d} className="min-h-[300px]">
          <span className="flex flex-1 items-start justify-between gap-4">
            <span className="font-display text-[72px] leading-[0.85] tracking-[-0.04em] text-black/[0.12]">{u.n}</span>
            <span className="flex max-w-[60%] flex-wrap justify-end gap-1">
              {u.p.slice(0, 3).map((p) => (
                <span key={p} className="rounded-full bg-white/70 px-2.5 py-1 text-caption text-muted-foreground">
                  {p}
                </span>
              ))}
            </span>
          </span>
        </LinkTile>
      ))}
    </div>
  )
}