import { ArrowRight, FileText } from 'lucide-react'

import { GlassBadge } from '@/components/liquid-glass'
import { D, cfg } from '@/data'
import { useProposal } from './forms'
import { Cap, Eyebrow, H2, Sec, Tile } from './ui'

export function FoundationBody({ heading = true }: { heading?: boolean }) {
  return (
    <>
      {heading && <H2>A Foundation and a global network of clearinghouses</H2>}
      <div className="grid gap-4 md:grid-cols-2">
        <Tile className="flex flex-col gap-4">
          <Eyebrow>The Foundation</Eyebrow>
          <span className="font-display text-[26px] leading-tight">Sets the open standard</span>
          <p className="text-body text-muted-foreground">
            Sets and maintains the open source protocol standards agreed upon by token issuers, tokenization agents, venues, clearing members, other protocols and CSDs.
          </p>
          <ul className="mt-auto flex flex-col gap-2 border-t border-black/[0.07] pt-4 text-body-sm">
            {['Legally independent', 'Funded by member dues', 'Holds the protocol IP under an irrevocable open source license'].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-foreground" />
                {t}
              </li>
            ))}
          </ul>
        </Tile>
        <Tile dark className="flex flex-col gap-4">
          <Eyebrow className="text-white/50">Global network of clearinghouses</Eyebrow>
          <span className="font-display text-[26px] leading-tight">Settlement Finality</span>
          <p className="text-body text-white/70">
            Clearinghouses worldwide mitigate settlement failures of tokenized RWAs onchain and offchain, allowing minting at time T on their backstop.
          </p>
          <ul className="mt-auto flex flex-col gap-2 border-t border-white/10 pt-4 text-body-sm text-white/85">
            {[
              'Certify that an implementation conforms to the protocol standard',
              'Admit members, a credit decision based on each rulebook’s financial and operational requirements',
              'Certification is a precondition of membership and does not by itself grant a backstop',
            ].map((t) => (
              <li key={t} className="flex gap-2.5">
                <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-token" />
                {t}
              </li>
            ))}
          </ul>
        </Tile>
      </div>

      <Tile className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>Clearinghouses worldwide</Eyebrow>
          <div className="flex gap-1.5">
            {['US', 'EU', 'UK', '…'].map((j) => (
              <span key={j} className="flex h-7 min-w-10 items-center justify-center rounded-full border border-border-strong bg-surface px-2.5 font-mono text-micro">
                {j}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded-[20px] border border-black/[0.08] bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/[0.07] px-5 py-3.5">
            <span className="flex flex-wrap items-center gap-2.5 text-body-sm font-semibold">
              Multimodal clearing
              <span className="rounded-full bg-token px-2 py-0.5 font-mono text-micro font-medium tracking-wide">OPEN SOURCE TECHNOLOGY</span>
            </span>
            <span className="font-mono text-micro tracking-wide text-faint">REFERENCE IMPLEMENTATION · ALPACA</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5">
            {D.TL.map((c, i) => (
              <div key={c.t} className={`flex flex-col gap-1 p-5 ${i ? 'border-t border-black/[0.07] sm:border-t-0 lg:border-l' : ''} ${i % 2 ? 'sm:border-l' : ''} ${i > 1 ? 'sm:border-t lg:border-t-0' : ''}`}>
                <span className="text-body-sm font-semibold">{c.t}</span>
                <span className="text-caption text-muted-foreground">{c.d}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[18px] bg-neutral-900 px-5 py-4 text-white">
          <span className="text-body-sm font-semibold">Post-trade settlement of tokenized equities</span>
          <span className="font-mono text-micro tracking-wide text-white/55">ONCHAIN AND OFFCHAIN</span>
        </div>
      </Tile>
      <Cap no="FIG. 6">One technology layer for clearinghouses. Member classes: issuers, clearing members, venues, vaults, oracles, CSDs.</Cap>
    </>
  )
}

export function RoadmapBody({ heading = true }: { heading?: boolean }) {
  return (
    <>
      {heading && <H2>Five phases, from a reference implementation to clearinghouses worldwide</H2>}
      <ol className="flex flex-col gap-3">
        {D.PH.map((p) => (
          <li key={p.n} className={`grid items-center gap-x-6 gap-y-3 rounded-[24px] p-5 sm:grid-cols-[110px_minmax(0,1fr)_150px_auto] sm:p-6 ${p.now ? 'bg-neutral-900 text-white' : 'bg-stage'}`}>
            <span className={`font-mono text-micro tracking-wide ${p.now ? 'text-white/55' : 'text-faint'}`}>PHASE {p.n}</span>
            <span className="flex flex-col gap-1">
              <span className="text-[17px] font-semibold tracking-[-0.01em]">{p.t}</span>
              <span className={`text-body-sm ${p.now ? 'text-white/70' : 'text-muted-foreground'}`}>{p.d}</span>
              {p.m && <span className="mt-1 font-mono text-micro tracking-wide text-token">◆ MILESTONE · {p.m}</span>}
            </span>
            <span className={`text-ui ${p.now ? 'text-white/70' : 'text-muted-foreground'}`}>{p.g}</span>
            <span className="justify-self-start sm:justify-self-end">
              {p.now ? (
                <GlassBadge className="bg-token text-neutral-900">Now</GlassBadge>
              ) : (
                <span className="inline-flex h-7 items-center rounded-full border border-border-strong px-3 font-mono text-micro text-faint">TBD</span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </>
  )
}

export function OpenSourceBlock({ no }: { no?: string }) {
  return (
    <Sec id="open-source" no={no} label="Open source">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
        <div className="flex flex-col items-start gap-5">
          <H2>A protocol participants can build their business on</H2>
          <p className="text-body text-muted-foreground">
            Members contribute this software under the irrevocable license so participants can trust that it is a protocol they can build their business on without fear of it being taken away.
          </p>
          <a href={cfg.githubUrl} target="_blank" rel="noopener" className="press inline-flex h-10 items-center gap-2 rounded-full border border-border-strong bg-surface px-4 font-mono text-ui hover:bg-muted">
            {cfg.githubUrl.replace(/^https?:\/\//, '')} ↗
          </a>
        </div>
        <div className="overflow-hidden rounded-[28px] bg-stage">
          <div className="flex justify-between px-6 pt-5 pb-3">
            <Eyebrow>Template contracts · examples</Eyebrow>
            <Eyebrow>Status</Eyebrow>
          </div>
          <ul className="px-3 pb-3">
            {D.TC.map((t) => (
              <li key={t} className="flex items-center justify-between rounded-2xl px-3 py-2.5 text-body-sm odd:bg-white/60">
                <span>{t}</span>
                <span className="font-mono text-micro text-faint">planned</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Sec>
  )
}

export function ProposalCard({ className = '' }: { className?: string }) {
  const open = useProposal()
  return (
    <button type="button" onClick={open} className={`group press flex cursor-pointer flex-col justify-between gap-10 rounded-[28px] bg-neutral-900 p-6 text-left text-white sm:p-7 ${className}`}>
      <span className="flex items-start justify-between gap-4">
        <Eyebrow className="text-white/50">LT-0001 · External proposal</Eyebrow>
        <FileText className="size-5 text-white/40" />
      </span>
      <span className="flex flex-col gap-4">
        <span className="font-display text-[24px] leading-tight tracking-[-0.01em] text-balance">{cfg.proposal.title}</span>
        <span className="flex items-end justify-between gap-4">
          <span className="font-mono text-micro tracking-wide text-white/55 uppercase">
            PDF · {cfg.proposal.pages} pages · {cfg.proposal.date}
          </span>
          <span className="flex items-center gap-3 text-ui text-white/80">
            Get it by email
            <span aria-hidden className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-[background-color,translate] duration-150 group-hover:bg-white/20 motion-safe:group-hover:translate-x-0.5">
              <ArrowRight className="size-4" />
            </span>
          </span>
        </span>
      </span>
    </button>
  )
}
