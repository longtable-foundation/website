import { Link } from 'react-router-dom'

import { cfg } from '@/data'
import { Body, Eyebrow, Go, LinkTile, PageHero, Sec, Tile } from '@/site/ui'

export function Signatories() {
  return (
    <>
      <PageHero eyebrow="§7 · Signatories" title="Signatories" lead="Founding signatories of the Longtable Initiative statement of intent." />
      <Sec no="§7.1" label="Founding signatories">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {cfg.publicSignatories.map((g, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-[28px] bg-stage p-5">
              <div className="flex aspect-[16/9] items-center justify-center rounded-[20px] bg-surface">
                {g.logo ? <img src={g.logo} alt={`${g.name} logo`} className="h-10" /> : <span className="h-10 w-24 rounded-xl border-[1.5px] border-dashed border-black/15" />}
              </div>
              <div className="flex flex-col gap-0.5 px-1">
                <span className="text-body-sm font-semibold">{g.name}</span>
                <Eyebrow>{g.tba ? 'Announcement pending' : 'Founding signatory'}</Eyebrow>
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/get-involved/#sign-up"
          className="group press flex flex-wrap items-center justify-between gap-4 rounded-[28px] border-[1.5px] border-dashed border-black/20 p-6 hover:border-black/40 sm:p-7"
        >
          <span className="flex flex-col gap-1">
            <span className="text-[19px] font-semibold tracking-[-0.02em]">Your organization</span>
            <span className="text-body-sm text-muted-foreground">Membership is open to issuers, clearing members, venues, vaults, oracles and CSDs.</span>
          </span>
          <span className="flex items-center gap-3 text-ui font-medium">
            Become a signatory <Go />
          </span>
        </Link>
      </Sec>
      <Sec no="§7.2" label="Signing">
        <div className="grid gap-4 md:grid-cols-2">
          <Tile dark className="flex flex-col gap-4">
            <Eyebrow className="text-white/50">Statement of intent</Eyebrow>
            <span className="font-display text-[26px] leading-tight">Become a signatory</span>
            <Body className="text-white/70">Foundation membership must be open for any new issuers to join while keeping out bad actors.</Body>
            <Link to="/get-involved/#sign-up" className="press mt-2 inline-flex h-10 w-fit items-center rounded-full bg-white px-5 text-ui font-medium text-neutral-900 hover:bg-white/90">
              Request the statement of intent
            </Link>
          </Tile>
          <LinkTile to="/press/" eyebrow="Press" title="Covering the initiative?" desc="Media inquiries are handled by the Alpaca media team." />
        </div>
      </Sec>
    </>
  )
}
