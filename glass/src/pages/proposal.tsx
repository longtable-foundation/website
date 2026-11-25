import { cfg } from '@/data'
import { ProposalForm } from '@/site/forms'
import { PageHero, Sec } from '@/site/ui'

export function Proposal() {
  return (
    <>
      <PageHero
        eyebrow="LT-0001 · Proposal"
        title={cfg.proposal.title}
        lead={`The external proposal: the need for multimodal clearing, the six use cases and the roadmap. ${cfg.proposal.pages} pages, ${cfg.proposal.date}.`}
      />
      <Sec no="PDF" label="By email">
        <div className="max-w-[640px]">
          <ProposalForm id="proposal-page-form" />
        </div>
      </Sec>
    </>
  )
}
