import { ArrowRight, ArrowUpRight, Play } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { FrameSection } from './chrome'

export const Hex = ({ className = '' }: { className?: string }) => <span aria-hidden className={`hex ${className}`} />
export const Share = ({ className = '' }: { className?: string }) => <span aria-hidden className={`shr ${className}`} />
export const Coin = ({ className = '' }: { className?: string }) => (
  <span aria-hidden className={`coin ${className}`}>
    $
  </span>
)

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`font-mono text-micro tracking-[0.06em] text-faint uppercase ${className}`}>{children}</span>
}

/** Section heading. Cal Sans is kept for the h1; sections use the quieter sans, two-tone via `lead`. */
export function H2({ children, lead, className = '' }: { children: ReactNode; lead?: ReactNode; className?: string }) {
  return (
    <h2 className={`max-w-[30ch] text-[28px] leading-[1.15] font-normal tracking-[-0.03em] text-balance sm:text-[38px] ${className}`}>
      {lead && <span className="text-black/35">{lead} </span>}
      {children}
    </h2>
  )
}

export function H3({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h3 className={`text-[20px] leading-tight font-medium tracking-[-0.02em] ${className}`}>{children}</h3>
}

export function Lead({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`max-w-[68ch] text-lead text-muted-foreground text-pretty ${className}`}>{children}</p>
}

export function Body({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-body text-muted-foreground text-pretty ${className}`}>{children}</p>
}

/** A numbered section of a long page: label on the left rail, content to the right. */
export function Sec({ id, no, label, children, className = '' }: { id?: string; no?: string; label: string; children: ReactNode; className?: string }) {
  return (
    <FrameSection id={id} inner={`px-5 py-16 sm:px-10 sm:py-24 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-12">
        <div className="flex items-center gap-2 lg:sticky lg:top-24 lg:flex-col lg:items-start lg:gap-1 lg:self-start">
          {no && <span className="font-mono text-micro text-faint">{no}</span>}
          <span className="text-ui font-medium text-foreground">{label}</span>
        </div>
        <div className="flex min-w-0 flex-col gap-8">{children}</div>
      </div>
    </FrameSection>
  )
}

/** The page title block every inner page opens with. */
export function PageHero({ eyebrow, title, lead, children }: { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <section>
      <div className="relative mx-auto w-[calc(100%-2rem)] max-w-[1320px] border-x border-rail px-5 pt-20 pb-16 sm:w-[calc(100%-3rem)] sm:px-10 sm:pt-28 sm:pb-20">
        <div className="flex max-w-[880px] flex-col gap-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display text-[44px] leading-[1] tracking-[-0.03em] text-balance sm:text-[64px]">{title}</h1>
          {lead && <Lead className="text-[19px]">{lead}</Lead>}
          {children}
        </div>
      </div>
    </section>
  )
}

export function Tile({ children, className = '', dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <div className={`rounded-[28px] p-6 sm:p-8 ${dark ? 'card-dark text-white' : 'border border-black/[0.05] bg-stage'} ${className}`}>{children}</div>
}

export function Cap({ no, children }: { no: string; children: ReactNode }) {
  return (
    <p className="-mt-4 flex gap-3 text-caption text-muted-foreground">
      <span className="shrink-0 font-mono text-micro leading-[18px] tracking-wide whitespace-nowrap text-foreground">{no}</span>
      <span className="max-w-[80ch]">{children}</span>
    </p>
  )
}

export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex h-7 items-center rounded-full border border-border-strong bg-surface px-3 text-ui text-foreground ${className}`}>{children}</span>
}

/** The round arrow the tiles end with. */
export function Go({ external = false }: { external?: boolean }) {
  const I = external ? ArrowUpRight : ArrowRight
  return (
    <span
      aria-hidden
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground transition-[background-color,translate] duration-150 group-hover:bg-foreground/[0.11] motion-safe:group-hover:translate-x-0.5"
    >
      <I className="size-4" />
    </span>
  )
}

/** A tile that is a link: title, one line, the round arrow. */
export function LinkTile({ to, href, eyebrow, title, desc, className = '', children }: { to?: string; href?: string; eyebrow?: string; title: ReactNode; desc?: ReactNode; className?: string; children?: ReactNode }) {
  const inner = (
    <>
      {children}
      <span className="flex items-end justify-between gap-6">
        <span className="flex min-w-0 flex-col gap-1.5">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <span className="text-[19px] leading-tight font-semibold tracking-[-0.02em] text-foreground">{title}</span>
          {desc && <span className="max-w-[48ch] text-body-sm leading-snug text-muted-foreground">{desc}</span>}
        </span>
        <Go external={!!href} />
      </span>
    </>
  )
  const cls = `group press flex flex-col justify-end gap-6 rounded-[28px] bg-stage p-6 hover:bg-[#e6e6e9] sm:p-7 ${className}`
  return href ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      {inner}
    </a>
  ) : (
    <Link to={to!} className={cls}>
      {inner}
    </Link>
  )
}

export function TextLink({ to, href, children }: { to?: string; href?: string; children: ReactNode }) {
  const cls = 'font-medium text-foreground underline decoration-border-strong decoration-1 underline-offset-4 transition-colors duration-150 hover:decoration-foreground'
  return href ? (
    <a href={href} target="_blank" rel="noopener" className={cls}>
      {children}
    </a>
  ) : (
    <Link to={to!} className={cls}>
      {children}
    </Link>
  )
}

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`
const ytSrc = (id: string, start = 0) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1&playsinline=1&autoplay=1${start ? `&start=${start}` : ''}`

/** Click-to-play YouTube, or a quiet placeholder while the video is unpublished. */
export function Video({ id, label, badge, start = 0, className = '' }: { id?: string | null; label: string; badge?: string; start?: number; className?: string }) {
  const [playing, setPlaying] = useState<number | null>(null)
  const frame = `relative aspect-video w-full overflow-hidden rounded-[22px] bg-neutral-900 ${className}`
  if (!id) {
    return (
      <div role="img" aria-label={`${label}: video not yet published`} className={`${frame} flex items-center justify-center`}>
        <span className="flex size-14 items-center justify-center rounded-full bg-white/10 text-white/70">
          <Play className="size-5 fill-current" />
        </span>
        <span className="absolute bottom-4 left-5 font-mono text-micro tracking-wide text-white/55 uppercase">{label} · Video coming soon</span>
        {badge && <span className="absolute top-4 right-4 rounded-full bg-white/10 px-2.5 py-1 font-mono text-micro text-white/70">{badge}</span>}
      </div>
    )
  }
  if (playing === start) {
    return (
      <div className={frame}>
        <iframe
          className="absolute inset-0 size-full"
          src={ytSrc(id, start)}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    )
  }
  return (
    <button type="button" aria-label={`Play ${label}`} onClick={() => setPlaying(start)} className={`group ${frame} cursor-pointer`}>
      <img src={ytThumb(id)} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-90 transition-opacity duration-150 group-hover:opacity-100" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition-transform duration-150 motion-safe:group-hover:scale-105">
          <Play className="ml-0.5 size-5 fill-current" />
        </span>
      </span>
      {badge && <span className="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-1 font-mono text-micro tracking-wide text-white uppercase">{badge}</span>}
    </button>
  )
}
