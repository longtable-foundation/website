import { ArrowLeft, Play } from 'lucide-react'
import { Link } from 'react-router-dom'

import { GlassButton } from '@/components/liquid-glass'
import { UC, cfg } from '@/data'
import { GoalFigure, ProblemFigure } from '@/figures/usecase-figs'
import { column } from '@/site/chrome'
import { CodeTabs, DarkCard, Frame, Kicker, LightCard, Two } from '@/site/frame'
import { SOL_CLEARING, TS_RFQ } from '@/site/snippets'
import { ProposalButton, ProposalLink } from '@/site/forms'
import { Chip, Eyebrow, Go, Video } from '@/site/ui'

export function UseCasePage({ i }: { i: number }) {
  const u = UC[i]
  const k = i + 1
  const prev = i ? UC[i - 1] : null
  const next = i < UC.length - 1 ? UC[i + 1] : null
  const videoId = u.video ? (cfg.videos[u.video] as string) : null
  const qLink = u.qLink ? cfg.links[u.qLink] : ''

  return (
    <section>
      <div className={`${column} grid gap-10 px-5 pt-12 pb-20 sm:px-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14 lg:pt-16`}>
        <aside aria-label="Use cases" className="hidden flex-col gap-1 lg:sticky lg:top-24 lg:flex lg:self-start">
          <Eyebrow className="mb-2 px-3">§3 Use cases</Eyebrow>
          {UC.map((x, j) => (
            <Link
              key={x.slug}
              to={`/use-cases/${x.slug}/`}
              aria-current={j === i ? 'page' : undefined}
              className={`press flex gap-3 rounded-2xl px-3 py-2.5 text-ui ${j === i ? 'bg-stage text-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <span className="font-mono text-micro leading-5 text-faint">{x.n}</span>
              <span className="leading-5 font-medium">{x.t}</span>
            </Link>
          ))}
          <ProposalLink className="press group mt-4 flex flex-col items-start gap-1 rounded-2xl bg-neutral-900 p-4 text-left text-white">
            <Eyebrow className="text-white/50">In the proposal</Eyebrow>
            <span className="text-ui font-medium">pp. {u.pp} · PDF by email →</span>
          </ProposalLink>
        </aside>

        <div className="flex min-w-0 flex-col gap-12">
          <div className="flex flex-col gap-5">
            <Link to="/#use-cases" className="flex w-fit items-center gap-1.5 text-ui text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-3.5" />
              Use cases · {u.n} of 06
            </Link>
            <Eyebrow>
              §3.{k} · Use case {u.n} of 06 · {u.s}
            </Eyebrow>
            <h1 className="font-display text-[42px] leading-[1] tracking-[-0.03em] text-balance sm:text-[60px]">{u.t}</h1>
            <p className="max-w-[60ch] text-[19px] leading-relaxed text-muted-foreground">{u.d}</p>
            <div className="flex flex-wrap gap-1.5">
              {u.p.map((p) => (
                <Chip key={p}>{p}</Chip>
              ))}
            </div>
            <nav aria-label="Use cases" className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pt-2 lg:hidden">
              {UC.map((x, j) => (
                <Link
                  key={x.slug}
                  to={`/use-cases/${x.slug}/`}
                  aria-current={j === i ? 'page' : undefined}
                  className={`press flex h-9 shrink-0 items-center rounded-full px-3.5 font-mono text-ui ${j === i ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'}`}
                >
                  {x.n}
                </Link>
              ))}
            </nav>
          </div>

          {videoId ? (
            <Video id={videoId} label={`Use case ${u.n} bitesize explainer`} />
          ) : (
            u.video && (
              <div role="note" className="flex items-center gap-3 rounded-2xl bg-stage px-4 py-3 text-ui text-muted-foreground">
                <span aria-hidden className="flex size-7 items-center justify-center rounded-full bg-foreground/[0.06]">
                  <Play className="size-3 fill-current" />
                </span>
                Use case {u.n} bitesize explainer · video coming soon
              </div>
            )
          )}

          <div className="flex flex-col gap-5">
            <Eyebrow>§3.{k}.1 · Problem</Eyebrow>
            {u.quote ? (
              <blockquote className="flex flex-col gap-5 rounded-[28px] card-dark p-7 text-white sm:p-10">
                <p className="font-display text-[24px] leading-[1.25] tracking-[-0.01em] text-balance sm:text-[30px]">{u.prob}</p>
                {qLink ? (
                  <a href={qLink} target="_blank" rel="noopener" className="font-mono text-micro tracking-wide text-white/60 uppercase hover:text-white">
                    {u.qa} · Watch the clip ↗
                  </a>
                ) : (
                  <span className="font-mono text-micro tracking-wide text-white/60 uppercase">{u.qa}</span>
                )}
              </blockquote>
            ) : (
              <p className="max-w-[62ch] text-[22px] leading-[1.45] tracking-[-0.01em] text-foreground text-pretty">{u.prob}</p>
            )}
          </div>
          <ProblemFigure k={k} u={u} />

          <div className="flex flex-col gap-5">
            <Eyebrow>§3.{k}.2 · The goal</Eyebrow>
            {u.goal.map((g) => (
              <p key={g} className="max-w-[62ch] text-[20px] leading-[1.5] tracking-[-0.005em] text-foreground text-pretty">
                {g}
              </p>
            ))}
          </div>
          <GoalFigure k={k} u={u} />
          {u.n === '05' && (
            <Frame>
              <LightCard>
                <Kicker>In code</Kicker>
                <Two lead="Quote, mint at T,">settle from proceeds</Two>
                <p className="text-body-sm text-muted-foreground">
                  The solver quotes the taker, mints primary-issued tokens against the clearinghouse backstop, and pays the issuer post-trade from the proceeds. No inventory is pre-funded on the venue.
                </p>
              </LightCard>
              <DarkCard>
                <CodeTabs label="RFQ fill code" tabs={[{ id: 'ts', label: 'rfq-fill.ts', code: TS_RFQ }, { id: 'sol', label: 'Clearing.sol', code: SOL_CLEARING }]} />
              </DarkCard>
            </Frame>
          )}

          {u.mile && (
            <Link to="/roadmap/" className="group press flex flex-wrap items-center justify-between gap-5 rounded-[28px] bg-stage p-6 hover:bg-[#e6e6e9] sm:p-7">
              <span className="flex flex-col gap-1.5">
                <Eyebrow>{u.mile[0]}</Eyebrow>
                <span className="text-[19px] font-semibold tracking-[-0.02em]">{u.mile[1]}</span>
                <span className="text-body-sm text-muted-foreground">{u.mile[2]}</span>
              </span>
              <span className="flex items-center gap-3 text-ui text-muted-foreground">
                Roadmap <Go />
              </span>
            </Link>
          )}

          <div className="flex flex-wrap gap-3">
            <ProposalButton />
            <GlassButton material="tinted" size="lg" asChild className="border border-black/15 bg-white text-neutral-900">
              <Link to="/get-involved/">Get involved</Link>
            </GlassButton>
          </div>

          <nav aria-label="Previous and next" className="grid gap-3 border-t border-rail pt-8 sm:grid-cols-2">
            <Link to={prev ? `/use-cases/${prev.slug}/` : '/'} className="press flex flex-col gap-1.5 rounded-[22px] bg-stage p-5 hover:bg-[#e6e6e9]">
              <Eyebrow>← {prev ? `Previous · §3.${k - 1}` : 'Home'}</Eyebrow>
              <span className="text-body font-semibold">{prev ? `${prev.n} ${prev.t}` : 'Longtable Foundation'}</span>
            </Link>
            <Link to={next ? `/use-cases/${next.slug}/` : '/get-involved/'} className="press flex flex-col items-end gap-1.5 rounded-[22px] bg-stage p-5 text-right hover:bg-[#e6e6e9]">
              <Eyebrow>{next ? `Next · §3.${k + 1}` : 'Next'} →</Eyebrow>
              <span className="text-body font-semibold">{next ? `${next.n} ${next.t}` : 'Get involved'}</span>
            </Link>
          </nav>
        </div>
      </div>
    </section>
  )
}
