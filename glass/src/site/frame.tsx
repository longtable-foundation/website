import { BadgeCheck } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { GlassTabs } from '@/components/liquid-glass'

// The product-card language: a white device frame holding a quiet light card and a dark card.
// Colour is limited to one lime status accent; everything else is greys.

/** The white shell with its grey tray. Children sit in a two-up grid on wide screens. */
export function Frame({ children, head, className = '' }: { children: ReactNode; head?: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[34px] bg-white p-2 shadow-[0_1px_0_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.18)] sm:p-2.5 ${className}`}>
      {head && <div className="flex flex-wrap items-center justify-between gap-4 px-5 pt-5 pb-4 sm:px-7 sm:pt-6">{head}</div>}
      <div className="grid gap-2.5 rounded-[28px] bg-[#f0f0f0] p-2.5 lg:grid-cols-2">{children}</div>
    </div>
  )
}

export function LightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex min-w-0 flex-col gap-5 rounded-[22px] border border-black/[0.06] bg-[#f6f6f6] p-6 sm:p-7 ${className}`}>{children}</div>
}

export function DarkCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div data-theme="dark" className={`card-dark flex min-w-0 flex-col gap-5 rounded-[22px] p-6 text-white sm:p-7 ${className}`}>
      {children}
    </div>
  )
}

/** Two-tone heading: the lead-in in grey, the point in ink. */
export function Two({ lead, children, className = '', dark = false }: { lead?: ReactNode; children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <span className={`text-[24px] leading-[1.2] font-normal tracking-[-0.02em] text-balance sm:text-[28px] ${dark ? 'text-white' : 'text-foreground'} ${className}`}>
      {lead && <span className={dark ? 'text-white/45' : 'text-black/35'}>{lead} </span>}
      {children}
    </span>
  )
}

export function Chips({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <span className="flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span
          key={t}
          className={`inline-flex h-7 items-center rounded-full px-3 text-ui ${
            dark ? 'border border-white/10 bg-white/[0.04] text-white/70' : 'border border-black/[0.07] bg-white text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
          }`}
        >
          {t}
        </span>
      ))}
    </span>
  )
}

export function StatusPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-10 items-center gap-2 rounded-full border border-lime-300/10 bg-lime-300/[0.08] px-4 text-ui font-medium text-lime-300">
      <BadgeCheck className="size-4 fill-lime-300 text-[#0c0c0c]" />
      {children}
    </span>
  )
}

export function Kicker({ children }: { children: ReactNode }) {
  return <span className="text-ui font-medium text-[#5d8a1f]">{children}</span>
}

// ── Code ──

/** A tiny highlighter: comments, strings, keywords. Greys only, like the reference. */
function highlight(line: string) {
  const out: ReactNode[] = []
  const re = /(\/\/.*$|#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(interface|function|external|returns|memory|address|bytes32|uint256|uint64|uint32|int256|const|await|async|return|event|struct|true|false)\b/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index))
    const cls = m[1] ? 'text-white/30 italic' : m[2] ? 'text-white/55' : 'text-white'
    out.push(
      <span key={m.index} className={cls}>
        {m[0]}
      </span>,
    )
    last = m.index + m[0].length
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}

export function Code({ code, className = '' }: { code: string; className?: string }) {
  return (
    <pre className={`overflow-x-auto [scrollbar-color:rgba(255,255,255,0.14)_transparent] [scrollbar-width:thin] rounded-[18px] border border-white/[0.07] bg-black/30 p-5 font-mono text-[12.5px] leading-[1.75] text-white/60 ${className}`}>
      <code>
        {code.split('\n').map((l, i) => (
          <span key={i} className="block min-h-[1lh] whitespace-pre">
            {highlight(l)}
          </span>
        ))}
      </code>
    </pre>
  )
}

export function CodeTabs({ tabs, label }: { tabs: { id: string; label: string; code: string }[]; label: string }) {
  const [id, setId] = useState(tabs[0].id)
  const cur = tabs.find((t) => t.id === id)!
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex">
        <GlassTabs aria-label={label} size="sm" value={id} onValueChange={setId} options={tabs.map((t) => ({ value: t.id, label: t.label }))} />
      </div>
      <Code code={cur.code} />
    </div>
  )
}
