import { Link } from 'react-router-dom'

import { GlassButton } from '@/components/liquid-glass'
import { PageHero } from '@/site/ui'

export function NotFound() {
  return (
    <PageHero eyebrow="404 · Not found" title="This page does not exist." lead="The link may be old or mistyped.">
      <div className="mt-2 flex flex-wrap gap-3">
        <GlassButton material="tinted" size="lg" asChild className="bg-neutral-900 text-white">
          <Link to="/">Go to the home page</Link>
        </GlassButton>
        <GlassButton material="tinted" size="lg" asChild className="border border-black/15 bg-white text-neutral-900">
          <Link to="/use-cases/01/">Read the use cases</Link>
        </GlassButton>
      </div>
    </PageHero>
  )
}
