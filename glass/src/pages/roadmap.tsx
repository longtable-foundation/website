import { Link } from 'react-router-dom'

import { GlassButton } from '@/components/liquid-glass'
import { RoadmapBody } from '@/site/blocks'
import { ProposalButton } from '@/site/forms'
import { PageHero, Sec } from '@/site/ui'

export function Roadmap() {
  return (
    <>
      <PageHero eyebrow="§5 · Roadmap" title="Roadmap" lead="Five phases, from an open source reference implementation to licensed clearinghouses worldwide." />
      <Sec id="phases" no="§5.1" label="Phases">
        <RoadmapBody heading={false} />
      </Sec>
      <Sec no="§5.2" label="Next">
        <div className="flex flex-wrap gap-3">
          <ProposalButton />
          <GlassButton material="tinted" size="lg" asChild className="border border-black/15 bg-white text-neutral-900">
            <Link to="/use-cases/01/">Read the use cases</Link>
          </GlassButton>
          <GlassButton material="tinted" size="lg" asChild className="border border-black/15 bg-white text-neutral-900">
            <Link to="/get-involved/">Get involved</Link>
          </GlassButton>
        </div>
      </Sec>
    </>
  )
}
