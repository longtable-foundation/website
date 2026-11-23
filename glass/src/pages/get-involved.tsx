import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

import { GlassTabs } from '@/components/liquid-glass'
import { D, cfg } from '@/data'
import { ProposalCard } from '@/site/blocks'
import { SignupForm } from '@/site/forms'
import { Body, Eyebrow, LinkTile, PageHero, Sec } from '@/site/ui'

export function GetInvolved() {
  const [pick, setPick] = useState(D.INT[0].id)
  const opt = D.INT.find((x) => x.id === pick)!
  return (
    <>
      <PageHero eyebrow="§8 · Get involved" title="Get involved" lead="Follow our progress, join the initiative, help fund the Foundation or contribute open source code." />
      <Sec id="sign-up" no="§8.1" label="Sign up">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <div className="flex flex-col gap-5 rounded-[28px] bg-stage p-6 sm:p-8">
            <GlassTabs aria-label="Ways to get involved" size="md" value={pick} onValueChange={setPick} options={D.INT.map((x) => ({ value: x.id, label: x.k }))} />
            <div className="flex flex-col gap-2" aria-live="polite">
              <Eyebrow>{opt.k}</Eyebrow>
              <span className="font-display text-[28px] leading-tight">{opt.t}</span>
              <Body>{opt.d}</Body>
              {opt.id === 'build' && (
                <a href={cfg.githubUrl} target="_blank" rel="noopener" className="press mt-2 inline-flex h-10 w-fit items-center gap-2 rounded-full border border-border-strong bg-surface px-4 text-ui font-medium hover:bg-muted">
                  Open GitHub <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
            <p className="mt-auto border-t border-black/[0.07] pt-5 text-caption text-muted-foreground">One form covers all four. Leave your details and we will follow up on the path you pick.</p>
          </div>
          <SignupForm />
        </div>
      </Sec>
      <Sec no="§8.2" label="Read first">
        <div className="grid gap-4 md:grid-cols-2">
          <ProposalCard className="min-h-[240px]" />
          <LinkTile to="/use-cases/01/" eyebrow="§3 · Use cases" title="Six use cases, step by step" desc="Start with use case 01" className="min-h-[240px]" />
        </div>
      </Sec>
    </>
  )
}
