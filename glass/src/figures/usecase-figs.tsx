import { useEffect, useState, type ReactNode } from 'react'

import { GlassTabs } from '@/components/liquid-glass'
import { D, type UseCase } from '@/data'
import { Cap, Coin, Eyebrow, Hex, Share } from '@/site/ui'
import { Legend } from './home-figs'
import { Stepper } from './stepper'

const Panel = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`overflow-x-auto rounded-[28px] bg-stage p-5 sm:p-7 ${className}`}>{children}</div>
)

// ── 3.1.1 Fast rail, slow rail ──

function Rails({ u }: { u: UseCase }) {
  return (
    <figure className="flex flex-col gap-8">
      <Panel>
        <div className="flex min-w-[620px] flex-col gap-3">
          <div className="grid grid-cols-[110px_1fr]">
            <span />
            <div className="grid grid-cols-4 font-mono text-micro tracking-wide text-faint">
              {['SAT', 'SUN', 'MON', 'TUE'].map((d) => (
                <span key={d} className="border-l border-black/10 pl-2">
                  {d}
                </span>
              ))}
            </div>
          </div>
          <div className="grid h-[72px] grid-cols-[110px_1fr] items-center">
            <span className="flex flex-col">
              <b className="font-mono text-micro tracking-wide">FAST RAIL</b>
              <span className="text-caption text-muted-foreground">Onchain</span>
            </span>
            <div className="relative h-full rounded-2xl bg-surface">
              <span className="absolute inset-x-4 top-1/2 h-px bg-black/20" />
              <span className="absolute top-1/2 left-[6%] flex -translate-1/2">
                <Hex />
              </span>
              <span className="absolute top-[calc(50%+8px)] left-[calc(6%+18px)] text-body-sm font-medium">GMEx minted at T, Saturday morning</span>
            </div>
          </div>
          <div className="grid h-[48px] grid-cols-[110px_1fr] items-center">
            <Eyebrow>Backstop</Eyebrow>
            <div className="relative h-full">
              <span className="absolute inset-y-1.5 right-[12%] left-[6%] flex items-center justify-center rounded-xl border-[1.5px] border-neutral-900 bg-token font-mono text-micro tracking-[0.06em]">
                CLEARINGHOUSE BACKSTOP · COVERS T → T+1
              </span>
            </div>
          </div>
          <div className="grid h-[80px] grid-cols-[110px_1fr] items-center">
            <span className="flex flex-col">
              <b className="font-mono text-micro tracking-wide">SLOW RAIL</b>
              <span className="text-caption text-muted-foreground">DTCC</span>
            </span>
            <div className="relative h-full rounded-2xl bg-surface">
              <span className="absolute inset-x-4 top-[40%] h-px bg-black/20" />
              <span className="absolute top-[calc(40%-12px)] left-0 flex h-6 w-1/2 items-center overflow-hidden rounded-l-2xl bg-[repeating-linear-gradient(135deg,#d6d6d6_0_6px,#efefef_6px_12px)] pl-3 font-mono text-[10px] tracking-wide whitespace-nowrap">
                CLOSED · LOANNET &amp; DTCC DARK ALL WEEKEND
              </span>
              <span className="absolute top-[40%] left-[88%] flex -translate-1/2">
                <Share />
              </span>
              <span className="absolute top-[calc(40%+14px)] right-4 text-body-sm font-medium">GME delivers T+1, Tuesday</span>
            </div>
          </div>
          <div className="pt-2">
            <Legend items={[['hex', 'Token'], ['share', 'Share'], ['ch', 'Clearinghouse backstop']]} />
          </div>
        </div>
      </Panel>
      <Cap no="FIG. 3.1.1">{u.cap1}</Cap>
    </figure>
  )
}

// ── 3.2.1 Bilateral mesh vs one ledger ──

function ring(n: number, c = 140, r = 108) {
  return Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    return { x: c + r * Math.cos(a), y: c + r * Math.sin(a), l: `C${i + 1}` }
  })
}

function Mesh({ n, hub }: { n: number; hub?: boolean }) {
  const V = ring(n)
  return (
    <svg viewBox="0 0 280 280" className="mx-auto w-full max-w-[300px]" role="img" aria-label={hub ? `${n} agents, one clearinghouse ledger` : `${n} agents, ${n * (n - 1)} bilateral sub-accounts`}>
      {hub
        ? V.map((v) => <line key={v.l} x1={140} y1={140} x2={v.x} y2={v.y} stroke="#0b0b0c" strokeOpacity={0.35} strokeWidth={1.2} />)
        : V.flatMap((a, i) => V.slice(i + 1).map((b) => <line key={a.l + b.l} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#0b0b0c" strokeOpacity={0.3} strokeWidth={1.2} />))}
      {hub && (
        <g>
          <rect x={86} y={118} width={108} height={44} rx={12} fill="#f8d028" stroke="#0b0b0c" strokeWidth={1.5} />
          <text x={140} y={137} textAnchor="middle" fontSize={11.5} fontWeight={600} fontFamily="Geist, sans-serif">
            Clearinghouse
          </text>
          <text x={140} y={151} textAnchor="middle" fontSize={8} letterSpacing={0.6} fontFamily="Geist Mono, monospace" fill="#3a3a3a">
            ONE LEDGER
          </text>
        </g>
      )}
      {V.map((v) => (
        <g key={v.l}>
          <circle cx={v.x} cy={v.y} r={15} fill="#fff" stroke="#0b0b0c" strokeWidth={1.3} />
          <text x={v.x} y={v.y + 3.5} textAnchor="middle" fontSize={10} fontFamily="Geist Mono, monospace">
            {v.l}
          </text>
        </g>
      ))}
    </svg>
  )
}

const NS = ['3', '4', '5', '6', '7', '8'] as const

function MeshFig({ u }: { u: UseCase }) {
  const [pick, setN] = useState<(typeof NS)[number]>('5')
  const n = Number(pick)
  return (
    <figure className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 rounded-[28px] bg-stage p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-body-sm font-semibold">Settlement agents on one ATS</span>
          <GlassTabs aria-label="Number of settlement agents" size="md" value={pick} onValueChange={setN} options={NS.map((v) => ({ value: v, label: `n = ${v}` }))} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5">
            <span className="flex items-baseline justify-between">
              <Eyebrow>Bilateral</Eyebrow>
              <span className="font-display text-[34px] leading-none tabular-nums">
                {n * (n - 1)} <span className="font-sans text-caption text-muted-foreground">sub-accounts</span>
              </span>
            </span>
            <Mesh n={n} />
          </div>
          <div className="flex flex-col gap-3 rounded-[22px] bg-surface p-5">
            <span className="flex items-baseline justify-between">
              <Eyebrow>Cleared · one ledger</Eyebrow>
              <span className="font-display text-[34px] leading-none tabular-nums">
                {n} <span className="font-sans text-caption text-muted-foreground">accounts</span>
              </span>
            </span>
            <Mesh n={n} hub />
          </div>
        </div>
      </div>
      <Cap no="FIG. 3.2.1">{u.cap1?.replace('Drag to change', 'Pick')}</Cap>
    </figure>
  )
}

// ── 3.4.1 / 3.4.2 DRS ──

function Drs({ u, after }: { u: UseCase; after?: boolean }) {
  const rows = after
    ? [
        ['DRS triggered', 'Title leaves Cede & Co'],
        ['Clearinghouse underwrites instantly', ''],
        ['Mint at time T', 'On the clearinghouse’s backstop'],
        ['DRS completes…', 'Whenever'],
      ]
    : [
        ['DRS triggered', 'Title leaves Cede & Co'],
        ['DRS black box', 'DTCC hours only · SLA in days'],
        ['Token mint', 'Waits… and waits'],
      ]
  const h = 60
  return (
    <figure className="flex flex-col gap-8">
      <Panel>
        <div className="flex min-w-[620px] flex-col gap-3">
          <div className="grid grid-cols-[200px_1fr] gap-4">
            <div className="flex flex-col">
              {rows.map(([b, s]) => (
                <div key={b} style={{ height: h }} className="flex flex-col justify-center">
                  <span className="text-body-sm font-semibold">{b}</span>
                  {s && <span className="text-caption text-muted-foreground">{s}</span>}
                </div>
              ))}
            </div>
            <div className="relative rounded-2xl bg-surface" style={{ height: rows.length * h }}>
              <span className="absolute inset-y-0 left-6 border-l border-dashed border-black/30" />
              {after ? (
                <>
                  <span className="absolute top-3 left-[18px] w-4 rounded-md border-[1.5px] border-neutral-900 bg-token" style={{ height: h * 2.6 }} />
                  <span className="absolute left-6 size-2.5 -translate-1/2 rounded-full bg-neutral-900" style={{ top: h * 0.5 }} />
                  <span className="absolute left-6 size-2.5 -translate-1/2 bg-neutral-900" style={{ top: h * 1.5 }} />
                  <span className="absolute left-6 -translate-1/2 rounded-full bg-neutral-900 px-2 py-1 font-mono text-[10px] text-token" style={{ top: h * 2.5 }}>
                    MINT
                  </span>
                  <span
                    className="absolute left-6 flex w-[78%] items-center rounded-lg border-[1.5px] border-dashed border-neutral-900 bg-share/30 pl-6 font-mono text-micro tracking-[0.06em] whitespace-nowrap"
                    style={{ top: h * 3.5 - 15, height: 30 }}
                  >
                    POST-TRADE IMPLEMENTATION DETAIL
                  </span>
                </>
              ) : (
                <>
                  <span className="absolute left-6 flex -translate-1/2" style={{ top: h * 0.5 }}>
                    <Share />
                  </span>
                  <span className="absolute left-6 w-[78%] rounded-md bg-[repeating-linear-gradient(90deg,#111_0_36px,#d9d9d9_36px_108px)]" style={{ top: h * 1.5 - 12, height: 24 }} />
                  <span className="absolute left-6 w-[80%] border-t-[1.5px] border-dotted border-black/40" style={{ top: h * 2.5 }} />
                  <span className="absolute left-[calc(24px+80%)] -translate-1/2 rounded-full bg-neutral-900 px-2 py-1 font-mono text-[10px] text-token" style={{ top: h * 2.5 }}>
                    MINT
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="grid grid-cols-[200px_1fr] gap-4">
            <span />
            <div className="flex justify-between pl-4 font-mono text-micro tracking-wide text-faint">
              <span>T</span>
              <span>DAYS LATER →</span>
            </div>
          </div>
          <div className="pt-2">
            <Legend items={after ? [['ch', 'Clearinghouse underwrites at T'], ['hex', 'Token mint'], ['owed', 'Share settles post-trade']] : [['share', 'Share title'], ['hex', 'Token mint']]} />
          </div>
        </div>
      </Panel>
      <Cap no={after ? 'FIG. 3.4.2' : 'FIG. 3.4.1'}>{after ? u.cap2 : u.cap1}</Cap>
    </figure>
  )
}

// ── 3.1.2 Inter-agency ──

const Num = ({ n }: { n: string }) => <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 font-mono text-[10px] text-white">{n}</span>

function InterAgency({ u }: { u: UseCase }) {
  return (
    <figure className="flex flex-col gap-8">
      <Panel>
        <div className="flex min-w-[640px] flex-col items-stretch gap-0">
          <div className="grid grid-cols-4 gap-2">
            {['NSCC', 'OCC', 'FICC', 'CFTC licensed DCOs'].map((a) => (
              <span key={a} className="flex h-11 items-center justify-center rounded-xl border border-border-strong bg-surface font-mono text-micro tracking-wide">
                {a}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="mx-auto h-4 w-px bg-black/25" />
            ))}
          </div>
          <div className="flex flex-col items-center gap-0.5 rounded-2xl bg-neutral-900 px-5 py-3.5 text-white">
            <b className="font-mono text-micro tracking-[0.06em]">INTER-AGENCY AGREEMENT · SHARED CREDITS</b>
            <span className="text-caption text-white/65">Members of one agency can use their credits in another.</span>
          </div>
          <div className="grid grid-cols-[1fr_72px_1.2fr_72px_1fr]">
            <span />
            <span />
            <span className="flex flex-col items-center py-1">
              <span className="h-3 w-px bg-black/25" />
              <Num n="01" />
              <span className="h-3 w-px bg-black/25" />
            </span>
          </div>
          <div className="grid grid-cols-[1fr_72px_1.2fr_72px_1fr] items-stretch">
            <div className="flex flex-col justify-center gap-0.5 rounded-2xl border border-border-strong bg-surface px-4 py-4 text-center">
              <Eyebrow>Clearing member</Eyebrow>
              <b className="text-body font-semibold">Broker A</b>
            </div>
            <span className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 top-1/2 h-px bg-black/25" />
              <span className="relative">
                <Num n="03" />
              </span>
            </span>
            <div className="flex flex-col justify-center gap-0.5 rounded-2xl border-[1.5px] border-neutral-900 bg-token px-4 py-4 text-center">
              <b className="font-display text-[20px] leading-tight">Clearinghouse</b>
              <span className="font-mono text-[10px] tracking-wide">UNDERWRITES THE MINT AT T</span>
            </div>
            <span className="relative flex items-center justify-center">
              <span className="absolute inset-x-0 top-1/2 h-px bg-black/25" />
              <span className="relative">
                <Num n="02" />
              </span>
            </span>
            <div className="flex flex-col justify-center gap-0.5 rounded-2xl border border-border-strong bg-surface px-4 py-4 text-center">
              <Eyebrow>Clearing member</Eyebrow>
              <b className="text-body font-semibold">Broker B</b>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_72px_1.2fr_72px_1fr]">
            <span />
            <span />
            <span className="flex flex-col items-center py-1">
              <span className="h-3 w-px bg-black/25" />
              <Num n="05" />
              <span className="h-3 w-px bg-black/25" />
            </span>
            <span />
            <span className="flex flex-col items-center py-1">
              <span className="h-3 w-px bg-black/25" />
              <Num n="04" />
              <span className="h-3 w-px bg-black/25" />
            </span>
          </div>
          <div className="grid grid-cols-[1fr_72px_1.2fr_72px_1fr]">
            <span />
            <span />
            <div className="flex flex-col gap-0.5 rounded-2xl border-[1.5px] border-neutral-900 bg-token/40 px-4 py-3 text-center">
              <Eyebrow>Backstop</Eyebrow>
              <b className="text-body-sm font-semibold">Lines of credit</b>
            </div>
            <span />
            <div className="flex flex-col gap-0.5 rounded-2xl border-[1.5px] border-dashed border-neutral-900 bg-owed/30 px-4 py-3 text-center">
              <Eyebrow>Fail obligation</Eyebrow>
              <b className="text-body-sm font-semibold">DTC box</b>
            </div>
          </div>
          <div className="pt-5">
            <Legend items={[['ch', 'Clearinghouse'], ['claim', 'Backstop'], ['owed', 'Fail obligation (owed share)']]} />
          </div>
        </div>
      </Panel>
      <Cap no="FIG. 3.1.2">{u.cap2}</Cap>
      <ol className="flex flex-col gap-2">
        {D.GOAL1.map((t, i) => (
          <li key={i} className="flex items-start gap-4 rounded-2xl bg-stage px-5 py-4">
            <Num n={String(i + 1).padStart(2, '0')} />
            <span className="text-body text-foreground">{t}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}

// ── 3.2.2 Net dues ──

function useCycle() {
  const [h, setH] = useState(() => new Date().getUTCHours())
  useEffect(() => {
    const id = setInterval(() => setH(new Date().getUTCHours()), 30_000)
    return () => clearInterval(id)
  }, [])
  const cyc = Math.floor(h / 8) + 1
  return { cyc, close: `${String((cyc * 8) % 24).padStart(2, '0')}:00` }
}

function Dues({ u }: { u: UseCase }) {
  const { cyc, close } = useCycle()
  return (
    <figure className="flex flex-col gap-8">
      <div className="overflow-hidden rounded-[28px] bg-neutral-950 text-white">
        <div className="flex flex-wrap justify-between gap-2 border-b border-white/10 px-5 py-4 font-mono text-micro tracking-wide text-white/60 sm:px-7">
          <span>NET DUES · CYCLE {cyc} OF 3</span>
          <span>PUBLISHED {close} UTC · ILLUSTRATIVE</span>
        </div>
        <div className="flex flex-col px-5 py-3 sm:px-7">
          <div className="grid grid-cols-[48px_1fr_92px] gap-4 py-2 font-mono text-micro tracking-wide text-white/40">
            <span>AGENT</span>
            <span className="flex justify-between">
              <span>← PAYS</span>
              <span>RECEIVES →</span>
            </span>
            <span className="text-right">NET</span>
          </div>
          {D.DUES.map(([c, a, l, w, k]) => (
            <div key={c} className="grid grid-cols-[48px_1fr_92px] items-center gap-4 border-t border-white/[0.07] py-3.5">
              <span className="font-mono text-ui">{c}</span>
              <span className="relative h-5">
                <span className="absolute inset-y-0 left-1/2 w-px bg-white/25" />
                <i
                  className={`absolute inset-y-0.5 rounded-md ${k === 'r' ? 'bg-cash' : k === 'p' ? 'border-2 border-cash' : 'border border-dashed border-white/50'}`}
                  style={{ left: `${l}%`, width: `${w}%` }}
                />
              </span>
              <span className="text-right text-ui text-white/80">{a}</span>
            </div>
          ))}
        </div>
      </div>
      <Cap no="FIG. 3.2.2">{u.cap2}</Cap>
    </figure>
  )
}

// ── 3.3.2 Post-trade settled ──

function Flow3({ u }: { u: UseCase }) {
  const Claim = () => <span className="h-5 w-7 rounded-md border-[1.5px] border-neutral-900 bg-white" />
  const steps: [string, ReactNode, string, string][] = [
    [
      '01 · AT T',
      <>
        <Claim />
        <Coin />
      </>,
      'Trade at T: claim delivered',
      'Cash proceeds in',
    ],
    [
      '02 · THROUGH THE CYCLE',
      <>
        <Claim />
        <span className="rounded-full bg-neutral-900 px-2 py-0.5 font-mono text-[10px] text-white">NET</span>
        <Claim />
      </>,
      'Net through cycle',
      'Obligations offset',
    ],
    [
      '03 · CYCLE END',
      <>
        <Coin />
        <span className="font-mono text-ui">→</span>
        <Share className="!h-[18px] !w-[26px]" />
      </>,
      'Settle with proceeds',
      'Claim redeems for netted shares',
    ],
  ]
  return (
    <figure className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-[28px] bg-stage p-5 sm:p-7">
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map(([k, ic, b, d]) => (
            <div key={k} className="flex flex-col gap-3 rounded-[22px] bg-surface p-5">
              <Eyebrow>{k}</Eyebrow>
              <span className="flex h-8 items-center gap-2">{ic}</span>
              <span className="flex flex-col gap-0.5">
                <b className="text-body-sm font-semibold">{b}</b>
                <span className="text-caption text-muted-foreground">{d}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center rounded-2xl border-[1.5px] border-neutral-900 bg-token px-4 py-3 font-mono text-micro tracking-[0.06em]">OPEN SOURCE SOLVER · BACKED BY A CLEARINGHOUSE</div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.07] pt-4">
          <span className="flex items-center gap-2 text-body-sm font-semibold">
            <span className="flex size-5 items-center justify-center rounded-full bg-cash font-mono text-micro">+</span>
            Positive working capital
          </span>
          <Legend items={[['claim', 'Claim'], ['coin', 'Stablecoin'], ['share', 'Share'], ['ch', 'Clearinghouse']]} />
        </div>
      </div>
      <Cap no="FIG. 3.3.2">{u.cap2}</Cap>
    </figure>
  )
}

export function ProblemFigure({ k, u }: { k: number; u: UseCase }) {
  switch (k) {
    case 1:
      return <Rails u={u} />
    case 2:
      return <MeshFig u={u} />
    case 3:
      return <Stepper scene="prefund" fig="FIG. 3.3.1" title="Without clearing, market makers pre-fund every venue" />
    case 4:
      return <Drs u={u} />
    case 5:
      return <Stepper scene="rfq" fig="FIG. 3.5.1" title="How an atomic onchain trade settles post-trade" skip={1} />
    case 6:
      return <Stepper scene="bridge" fig="FIG. 3.6.1" title="Cross-chain clearing, with Across" />
  }
  return null
}

export function GoalFigure({ k, u }: { k: number; u: UseCase }) {
  switch (k) {
    case 1:
      return <InterAgency u={u} />
    case 2:
      return <Dues u={u} />
    case 3:
      return <Flow3 u={u} />
    case 4:
      return <Drs u={u} after />
  }
  return null
}
