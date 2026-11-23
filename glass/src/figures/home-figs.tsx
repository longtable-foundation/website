import { useState, type CSSProperties } from 'react'

import { GlassCard, GlassTabs } from '@/components/liquid-glass'
import { Coin, Eyebrow, Hex, Share } from '@/site/ui'

// ── Hero: four modalities of one share, as glass over the assets they represent. ──

type Shape = { k: 'hex' | 'share' | 'coin'; x: string; y: string; s: number; dx?: number; dy?: number; dr?: number; t?: number; d?: number }

const FIELD: Shape[] = [
  { k: 'hex', x: '6%', y: '12%', s: 120, dx: 30, dy: 24, dr: 14, t: 16 },
  { k: 'share', x: '22%', y: '58%', s: 150, dx: -26, dy: -20, dr: -6, t: 18, d: -4 },
  { k: 'coin', x: '38%', y: '6%', s: 96, dx: 22, dy: 30, t: 14, d: -2 },
  { k: 'hex', x: '52%', y: '62%', s: 140, dx: -30, dy: -22, dr: -12, t: 17, d: -6 },
  { k: 'share', x: '66%', y: '10%', s: 130, dx: 28, dy: 26, dr: 8, t: 19, d: -3 },
  { k: 'coin', x: '84%', y: '54%', s: 120, dx: -24, dy: -28, t: 15, d: -8 },
  { k: 'hex', x: '90%', y: '4%', s: 80, dx: -18, dy: 22, dr: 20, t: 13, d: -5 },
  { k: 'coin', x: '2%', y: '70%', s: 70, dx: 20, dy: -16, t: 12, d: -1 },
]

function FieldShape({ k, x, y, s, dx = 20, dy = -16, dr = 0, t = 14, d = 0 }: Shape) {
  const style = { left: x, top: y, width: s, height: k === 'share' ? s * 0.66 : k === 'hex' ? s * 1.12 : s, '--dx': `${dx}px`, '--dy': `${dy}px`, '--dr': `${dr}deg`, '--t': `${t}s`, '--d': `${d}s` } as CSSProperties
  const look =
    k === 'hex'
      ? 'bg-token [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]'
      : k === 'share'
        ? 'rounded-[18px] bg-share'
        : 'rounded-full bg-cash'
  return <span aria-hidden className={`drift absolute ${look}`} style={style} />
}

const MODALITIES = [
  { t: 'Traditional share', d: 'Regulated securities custody', icon: <Share className="!h-[22px] !w-8" /> },
  { t: 'Issuer-sponsored token', d: 'Issuer-authorized register', icon: <Hex className="!h-[26px] !w-6" /> },
  {
    t: 'Custodial token',
    d: 'Shares at a regulated custodian',
    icon: (
      <span className="flex items-center gap-1">
        <Hex />
        <Share />
      </span>
    ),
  },
  {
    t: 'Linked security token',
    d: 'SPV holds the underlying',
    icon: (
      <span className="flex size-8 items-center justify-center rounded-lg border-[1.5px] border-dashed border-black/45">
        <Hex className="!h-[17px] !w-[15px]" />
      </span>
    ),
  },
]

export function HeroStage() {
  return (
    <figure className="flex flex-col gap-4">
      <div className="relative isolate overflow-hidden rounded-[32px] bg-stage px-4 py-12 sm:px-8 sm:py-20">
        <div aria-hidden className="absolute inset-0 -z-10">
          {FIELD.map((s, i) => (
            <FieldShape key={i} {...s} />
          ))}
        </div>
        <div className="mx-auto flex max-w-[1040px] flex-col items-center gap-6">
          <span className="rounded-full bg-neutral-900 px-4 py-2 font-mono text-micro tracking-wide text-white uppercase">One economic exposure · the same underlying share</span>
          <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-8">
            {MODALITIES.map((m, i) => (
              <div key={m.t} className="relative">
                {i > 0 && (
                  <span aria-hidden className="absolute top-1/2 -left-4 z-10 hidden -translate-1/2 font-sans text-[26px] leading-none font-light text-neutral-900 lg:block">
                    ≠
                  </span>
                )}
                <GlassCard live className="flex h-full min-h-[168px] flex-col justify-between gap-6 p-4 sm:p-5">
                  <span className="flex h-8 items-center">{m.icon}</span>
                  <span className="flex flex-col gap-1">
                    <span className="text-[15px] leading-tight font-semibold tracking-[-0.01em] text-neutral-900 sm:text-[17px]">{m.t}</span>
                    <span className="text-caption text-neutral-700 sm:text-body-sm">{m.d}</span>
                  </span>
                </GlassCard>
              </div>
            ))}
          </div>
          <span className="rounded-full border border-dashed border-black/40 bg-white/70 px-4 py-2 text-center font-mono text-micro tracking-wide text-neutral-800 uppercase">
            No common clearing mechanism · not automatically fungible
          </span>
        </div>
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-1 text-caption text-muted-foreground">
        <span className="flex gap-3">
          <span className="shrink-0 font-mono text-micro leading-[18px] tracking-wide whitespace-nowrap text-foreground">FIG. 1</span>
          <span className="max-w-[80ch]">
            These representations can trade on different venues and blockchain networks, but they do not share a common clearing mechanism. Bilateral agreements do not create general settlement interoperability.
          </span>
        </span>
        <Legend items={[['hex', 'Token'], ['share', 'Share'], ['coin', 'Stablecoin']]} />
      </figcaption>
    </figure>
  )
}

export function Legend({ items }: { items: [('hex' | 'share' | 'coin' | 'ch' | 'owed' | 'claim'), string][] }) {
  return (
    <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-micro tracking-wide text-muted-foreground uppercase">
      {items.map(([k, t]) => (
        <span key={t} className="flex items-center gap-1.5">
          {k === 'hex' && <Hex className="!h-[13px] !w-3" />}
          {k === 'share' && <Share className="!h-2.5 !w-[15px] !rounded-[2px]" />}
          {k === 'coin' && <span className="size-3 rounded-full bg-cash" />}
          {k === 'ch' && <span className="h-3 w-4 rounded-[3px] border-[1.5px] border-neutral-900 bg-token" />}
          {k === 'owed' && <span className="h-3 w-4 rounded-[3px] border-[1.5px] border-dashed border-neutral-900 bg-owed/40" />}
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
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-4 rounded-[28px] bg-stage p-6 sm:p-8">
        <Eyebrow>Pre-funding</Eyebrow>
        <p className="text-[17px] leading-relaxed text-foreground">
          Atomic settlement requires participants to pre-position cash and securities before the trade. Pre-funding is balance sheet intensive and is rarely desired.
        </p>
      </div>
      <div className="flex flex-col gap-4 rounded-[28px] bg-neutral-900 p-6 text-white sm:p-8">
        <span className="flex items-center gap-2 font-mono text-micro tracking-[0.06em] text-white uppercase">
          <span aria-hidden className="size-2 rounded-full bg-token" />
          Multimodal clearing
        </span>
        <p className="text-[17px] leading-relaxed text-white/90">
          A new kind of clearing which we believe is the missing infrastructure to enable liquidity to flow freely across tradfi to defi and across different flavors of tokens and venues worldwide.
        </p>
      </div>
    </div>
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
