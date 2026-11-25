import { ArrowRight, Loader } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { GlassButton, GlassTabs } from '@/components/liquid-glass'
import { D } from '@/data'
import { Chips, CodeTabs, DarkCard, Frame, Kicker, LightCard, StatusPill, Two } from '@/site/frame'
import { useProposal } from '@/site/forms'
import { SOL_CLEARING, TS_RFQ, cycleJson } from '@/site/snippets'
import { Coin, Eyebrow, Hex, Share } from '@/site/ui'

/** The white pill on dark cards, as in the reference: glossy, arrow at the end. */
export function WhitePill({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <GlassButton material="tinted" size="md" asChild className="border border-white/60 bg-gradient-to-b from-white to-neutral-200 text-neutral-900">
      <Link to={to}>
        {children}
        <ArrowRight />
      </Link>
    </GlassButton>
  )
}

// ── Hero: the protocol, as a card pair. ──

export function HeroFrame() {
  const open = useProposal()
  return (
    <Frame>
      <LightCard className="justify-between">
        <div className="flex flex-col gap-4">
          <Kicker>Open source · LT-0001</Kicker>
          <Two lead="One clearing layer for">every modality of the same share</Two>
          <p className="max-w-[46ch] text-body-sm text-muted-foreground">
            Netting, a backstop at time T and post-trade settlement for tokenized equities, onchain and offchain, run by licensed clearinghouses on an open standard.
          </p>
          <Chips items={['Multilateral netting', 'Backstop at T', 'Post-trade settlement', 'Margincoins', '24/7 cycles']} />
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-6">
          <button
            type="button"
            onClick={open}
            className="press inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-gradient-to-b from-[#2b2b2b] to-[#0c0c0c] px-5 text-ui font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_16px_-6px_rgba(0,0,0,0.5)]"
          >
            <Loader className="size-4 text-lime-300 motion-safe:animate-[spin_3s_linear_infinite]" />
            Read the proposal
          </button>
          <Link to="/use-cases/01/" className="text-ui font-medium underline decoration-black/25 underline-offset-4 hover:decoration-black">
            Six use cases
          </Link>
        </div>
      </LightCard>
      <DarkCard>
        <CodeTabs
          label="Example code"
          tabs={[
            { id: 'sol', label: 'Clearing.sol', code: SOL_CLEARING },
            { id: 'ts', label: 'rfq-fill.ts', code: TS_RFQ },
            { id: 'json', label: 'cycle.json', code: cycleJson(D.DUES) },
          ]}
        />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <StatusPill>Backstopped at T</StatusPill>
          <WhitePill to="/use-cases/05/">Atomic RFQ, settled post-trade</WhitePill>
        </div>
      </DarkCard>
    </Frame>
  )
}

export function Legend({ items, dark = false }: { items: [('hex' | 'share' | 'coin' | 'ch' | 'owed' | 'claim'), string][]; dark?: boolean }) {
  return (
    <span className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-micro tracking-wide uppercase ${dark ? 'text-white/50' : 'text-muted-foreground'}`}>
      {items.map(([k, t]) => (
        <span key={t} className="flex items-center gap-1.5">
          {k === 'hex' && <Hex className="!h-[13px] !w-3" />}
          {k === 'share' && <Share className="!h-2.5 !w-[15px] !rounded-[2px]" />}
          {k === 'coin' && <span className="size-3 rounded-full bg-white shadow-[inset_0_0_0_1.5px_rgba(0,0,0,0.55)]" />}
          {k === 'ch' && <span className="h-3 w-4 rounded-[3px] border-[1.5px] border-neutral-900 bg-token" />}
          {k === 'owed' && <span className="h-3 w-4 rounded-[3px] border-[1.5px] border-dashed border-neutral-900 bg-owed" />}
          {k === 'claim' && <span className="h-3 w-4 rounded-[3px] border-[1.5px] border-neutral-900 bg-white" />}
          {t}
        </span>
      ))}
    </span>
  )
}

// ── §1 ──

export function FigExec() {
  return (
    <Frame>
      <LightCard>
        <Eyebrow>Pre-funding</Eyebrow>
        <Two lead="Atomic settlement,">pre-positioned before the trade</Two>
        <p className="text-body text-muted-foreground">
          Atomic settlement requires participants to pre-position cash and securities before the trade. Pre-funding is balance sheet intensive and is rarely desired.
        </p>
        <span className="mt-auto">
          <Chips items={['Cash', 'Securities', 'Every venue', 'Before T']} />
        </span>
      </LightCard>
      <DarkCard>
        <span className="flex items-center gap-2 font-mono text-micro tracking-[0.06em] text-white/60 uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-lime-300" />
          Multimodal clearing
        </span>
        <Two dark lead="Liquidity that flows">across tradfi, defi and every venue</Two>
        <p className="text-body text-white/60">
          A new kind of clearing which we believe is the missing infrastructure to enable liquidity to flow freely across tradfi to defi and across different flavors of tokens and venues worldwide.
        </p>
        <span className="mt-auto">
          <Chips dark items={['Tradfi', 'Defi', 'Tokens', 'Venues', 'Worldwide']} />
        </span>
      </DarkCard>
    </Frame>
  )
}

// ── §3: four modalities, no common clearing. ──

const MODALITIES: [string, string][] = [
  ['Traditional share', 'Regulated securities custody'],
  ['Issuer-sponsored token', 'Issuer-authorized register'],
  ['Custodial token', 'Shares at a regulated custodian'],
  ['Linked security token', 'SPV holds the underlying'],
]

export function FigModalities() {
  const [pick, setPick] = useState('0')
  const m = MODALITIES[+pick]
  return (
    <figure className="flex flex-col gap-4">
      <Frame>
        <LightCard>
          <Eyebrow>One economic exposure</Eyebrow>
          <Two lead="The same underlying share,">four representations</Two>
          <p className="text-body-sm text-muted-foreground">
            These representations can trade on different venues and blockchain networks, but they do not share a common clearing mechanism. Bilateral agreements do not create general settlement interoperability.
          </p>
          <ul className="mt-auto flex flex-col divide-y divide-black/[0.06] rounded-2xl border border-black/[0.06] bg-white">
            {MODALITIES.map(([t, d], i) => (
              <li key={t} className={`flex items-center justify-between gap-4 px-4 py-3 ${String(i) === pick ? 'text-foreground' : 'text-muted-foreground'}`}>
                <span className="text-body-sm font-medium">{t}</span>
                <span className="text-caption">{d}</span>
              </li>
            ))}
          </ul>
        </LightCard>
        <DarkCard>
          <GlassTabs aria-label="Modality" size="sm" value={pick} onValueChange={setPick} options={['Share', 'Issuer', 'Custodial', 'Linked'].map((l, i) => ({ value: String(i), label: l }))} />
          <div className="hairgrid relative grid flex-1 grid-cols-4 overflow-hidden rounded-[18px] border border-white/[0.07]">
            {MODALITIES.map(([t], i) => (
              <div key={t} className={`relative flex min-h-[190px] flex-col items-center justify-center gap-3 border-white/[0.07] ${i ? 'border-l' : ''}`}>
                <span
                  aria-hidden
                  className={`size-[88px] rounded-full border transition-colors duration-300 ${String(i) === pick ? 'border-dashed border-lime-300/70' : 'border-white/10'}`}
                />
                <span
                  className={`absolute rounded-full border px-2.5 py-1 text-caption transition-colors duration-300 ${String(i) === pick ? 'border-lime-300/30 bg-black/60 text-lime-300' : 'border-white/10 bg-black/60 text-white/55'}`}
                >
                  {['Share', 'IST', 'Custodial', 'Linked'][i]}
                </span>
                {i > 0 && (
                  <span aria-hidden className="absolute top-1/2 left-0 -translate-1/2 bg-[#141414] px-0.5 text-[15px] leading-none text-white/40">
                    ≠
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-body-sm font-medium">{m[0]}</span>
            <span className="text-caption text-white/50">{m[1]}. Trades on its own venues, settles on its own rails.</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-ui text-white/60">
              <span aria-hidden className="size-1.5 rounded-full bg-white/40" />
              No common clearing mechanism
            </span>
            <WhitePill to="/use-cases/01/">Share-for-token interop</WhitePill>
          </div>
        </DarkCard>
      </Frame>
      <figcaption className="flex gap-3 px-1 text-caption text-muted-foreground">
        <span className="shrink-0 font-mono text-micro leading-[18px] tracking-wide whitespace-nowrap text-foreground">FIG. 1</span>
        Not automatically fungible: one economic exposure, four ways to hold it, and no clearinghouse that spans them.
      </figcaption>
    </figure>
  )
}

// ── §2 ──

export function FigBenchmark() {
  const stats: [string, string | null, string][] = [
    ['$100T', null, 'in assets custodied at the DTC, the DTCC’s depository subsidiary'],
    ['$4.6', 'Q', 'in trades cleared every year by the NSCC, its clearinghouse subsidiary'],
    ['2%', null, 'of trades result in settled movements. The other 98% are netted down.'],
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(([v, small, l]) => (
        <div key={v} className="flex flex-col justify-between gap-10 rounded-[28px] bg-stage p-6 sm:p-7">
          <span className="font-display text-[56px] leading-none tracking-[-0.03em] tabular-nums sm:text-[64px]">
            {v}
            {small && <span className="text-[0.55em] text-muted-foreground">{small}</span>}
          </span>
          <span className="text-body-sm text-muted-foreground">{l}</span>
        </div>
      ))}
    </div>
  )
}

// ── §3 ──

export function FigUnbundle() {
  return (
    <div className="flex flex-col gap-6 rounded-[28px] bg-stage p-6 sm:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-[22px] bg-surface p-5">
          <span className="flex flex-col gap-0.5">
            <span className="text-body-sm font-semibold">Traditional equities</span>
            <Eyebrow>DTCC · one CCP group</Eyebrow>
          </span>
          <div className="flex flex-col gap-2">
            <span className="flex h-14 items-center justify-center rounded-2xl bg-neutral-900 font-mono text-ui tracking-wide text-white">NSCC</span>
            <span className="flex h-14 items-center justify-center rounded-2xl bg-neutral-900 font-mono text-ui tracking-wide text-white">DTC</span>
          </div>
          <p className="text-body-sm text-muted-foreground">The clearinghouse requires tight integration to the assets in custody to provide multi-lateral netting and delayed settlement.</p>
        </div>
        <div className="flex flex-col gap-4 rounded-[22px] bg-surface p-5">
          <span className="flex flex-col gap-0.5">
            <span className="text-body-sm font-semibold">Tokenized equities</span>
            <Eyebrow>Unbundled</Eyebrow>
          </span>
          <div className="flex flex-col gap-2">
            <span className="flex h-14 items-center justify-center rounded-2xl border-[1.5px] border-dashed border-black/30 font-mono text-ui tracking-wide text-faint">No NSCC equivalent</span>
            <span className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-token font-mono text-ui tracking-wide text-neutral-900">
              Onchain
              <span className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="hex !h-[13px] !w-3 !bg-neutral-900" />
                ))}
              </span>
            </span>
          </div>
          <p className="text-body-sm text-muted-foreground">Custody and settlement now exist outside of the CCP’s custody, with cryptographically provable ownership.</p>
        </div>
      </div>
      <p className="max-w-[70ch] text-body text-foreground">In DTCC terms, the industry has unbundled the custody part (DTC) of the DTCC, but there is no clearinghouse (NSCC) solution yet.</p>
    </div>
  )
}

// ── §4: one stage, two states. ──

const VENUES = ['ATS', 'Onchain RFQ', 'DEX', 'Bridge']
const PRODUCTIVE: [string, string][] = [
  ['USD', 'in bank accounts'],
  ['Securities', 'at DTC & CSDs'],
  ['Tokenized securities', 'in Aave & Morpho vaults'],
]

export function FigCapital() {
  const [mode, setMode] = useState<'park' | 'clear'>('park')
  const park = mode === 'park'
  return (
    <figure className="flex flex-col gap-4">
      <div className="flex flex-col gap-6 rounded-[28px] bg-stage p-5 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GlassTabs
            aria-label="Capital"
            size="md"
            value={mode}
            onValueChange={setMode}
            options={[
              { value: 'park', label: 'Pre-funded' },
              { value: 'clear', label: 'Cleared' },
            ]}
          />
          <Eyebrow>Illustrative</Eyebrow>
        </div>

        <div className="flex flex-col gap-3">
          <Eyebrow>{park ? 'Venues · capital parked on each one' : 'Settle post-trade · nothing parked'}</Eyebrow>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {VENUES.map((v) => (
              <div
                key={v}
                className={`flex items-center justify-between gap-2 rounded-2xl px-4 py-3.5 transition-colors duration-300 ${park ? 'bg-surface' : 'border-[1.5px] border-dashed border-black/20 bg-transparent'}`}
              >
                <span className="text-body-sm font-medium">{v}</span>
                <span className="flex items-center gap-1">
                  {park ? (
                    <>
                      <Coin className="!size-[18px] !text-[9px]" />
                      <Hex className="!h-4 !w-3.5" />
                      <Hex className="!h-4 !w-3.5" />
                    </>
                  ) : (
                    <>
                      <span className="size-[18px] rounded-full border-[1.5px] border-dashed border-black/25" />
                      <span className="size-[18px] rounded-full border-[1.5px] border-dashed border-black/25" />
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {park ? (
          <Flow up label="Pulled out to pre-fund" />
        ) : (
          <div className="flex flex-col gap-3">
            <Flow label="" />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[20px] border-[1.5px] border-neutral-900 bg-token px-5 py-4">
              <span className="font-display text-[22px] leading-none">Clearinghouse</span>
              <span className="flex flex-wrap gap-1.5">
                {['Multilateral netting', 'Backstop', 'Post-trade settlement'].map((p) => (
                  <span key={p} className="rounded-full bg-neutral-900 px-3 py-1 text-caption font-medium text-white">
                    {p}
                  </span>
                ))}
              </span>
            </div>
            <Flow up soft label="" />
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Eyebrow>{park ? 'Where capital is productive' : 'Credited in place · sized to net risk'}</Eyebrow>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {PRODUCTIVE.map(([b, s]) => (
              <div
                key={b}
                className={`flex flex-col gap-0.5 rounded-2xl px-4 py-3.5 transition-colors duration-300 ${park ? 'border-[1.5px] border-dashed border-black/20' : 'bg-surface'}`}
              >
                <span className="text-body-sm font-semibold">{b}</span>
                <span className="text-caption text-muted-foreground">{s}</span>
              </div>
            ))}
          </div>
        </div>

        <p className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 text-body-sm ${park ? 'bg-white/70 text-foreground' : 'bg-neutral-900 text-white'}`}>
          <span aria-hidden className={`flex size-5 shrink-0 items-center justify-center rounded-full font-mono text-micro ${park ? 'bg-[#b4234a] text-white' : 'bg-cash text-neutral-900'}`}>
            {park ? '−' : '+'}
          </span>
          {park ? 'Positions don’t net across venues. Capital scales with the number of venues, not with the risk.' : 'Collateral stays where it is productive. Nothing sits idle on the venues.'}
        </p>
      </div>
      <figcaption className="flex gap-3 px-1 text-caption text-muted-foreground">
        <span className="shrink-0 font-mono text-micro leading-[18px] tracking-wide whitespace-nowrap text-foreground">{park ? 'FIG. 3' : 'FIG. 4'}</span>
        {park ? 'Capital scales with the number of venues, not with the risk.' : 'Collateral stays where it is productive. Nothing sits idle on the venues.'}
      </figcaption>
    </figure>
  )
}

function Flow({ up = false, soft = false, label }: { up?: boolean; soft?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <div aria-hidden className={`grid flex-1 grid-cols-4 ${soft ? 'opacity-40' : ''}`}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="flex justify-center text-[18px] leading-none text-neutral-900">
            {up ? '↑' : '↓'}
          </span>
        ))}
      </div>
      {label && <Eyebrow className="shrink-0">{label}</Eyebrow>}
    </div>
  )
}

// ── §6 ──

export function FigItn() {
  return (
    <div className="flex flex-col gap-6 rounded-[28px] bg-stage p-5 sm:p-8">
      <div className="flex items-center justify-between">
        <Eyebrow>Alpaca · closed system</Eyebrow>
        <Eyebrow>ITN MVP</Eyebrow>
      </div>
      <div className="flex flex-col gap-2.5 rounded-[22px] bg-surface p-4 sm:p-5">
        <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-3">
          <span className="flex h-12 items-center justify-center rounded-2xl border border-border-strong px-2 text-center text-ui font-medium sm:text-body-sm">Issuer</span>
          <span aria-hidden className="text-faint">↔</span>
          <span className="flex h-12 items-center justify-center rounded-2xl bg-neutral-900 text-body-sm font-semibold text-white">ITN</span>
          <span aria-hidden className="text-faint">↔</span>
          <span className="flex h-12 items-center justify-center rounded-2xl border border-border-strong px-2 text-center text-ui font-medium sm:text-body-sm">Minting participant</span>
        </div>
        <span className="flex h-11 items-center justify-center rounded-2xl bg-share/50 text-ui font-medium">Traditional asset custodied at Alpaca</span>
      </div>
      <div className="flex flex-col gap-2.5">
        <Eyebrow>Outside the loop</Eyebrow>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {['Inventory custodied away from Alpaca', 'Issuer not on Alpaca'].map((t) => (
            <span key={t} className="flex items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-black/20 px-4 py-3.5 text-body-sm">
              <span aria-hidden className="flex size-5 items-center justify-center rounded-full bg-black/10 text-micro">
                ✕
              </span>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
