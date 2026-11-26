import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

import { cfg } from '@/data'
import { ProposalLink } from './forms'

// Site chrome is deliberately plain: the glass belongs to the figures, not the frame.
// The frame is lines: rails at the column edges, full-bleed dividers, a rivet where they cross.

export const column = 'relative mx-auto w-[calc(100%-2rem)] max-w-[1320px] border-x border-rail sm:w-[calc(100%-3rem)]'

const rivetAt: Record<'tl' | 'tr' | 'bl' | 'br', CSSProperties> = {
  tl: { left: -0.5, top: -0.5, translate: '-50% -50%' },
  tr: { right: -0.5, top: -0.5, translate: '50% -50%' },
  bl: { left: -0.5, bottom: -0.5, translate: '-50% 50%' },
  br: { right: -0.5, bottom: -0.5, translate: '50% 50%' },
}

export function Rivets({ at = ['tl', 'tr'] }: { at?: (keyof typeof rivetAt)[] }) {
  return (
    <>
      {at.map((k) => (
        <i key={k} aria-hidden className="rivet" style={rivetAt[k]} />
      ))}
    </>
  )
}

/** A full-bleed divider with the column inside it and rivets where the rails meet it. */
export function FrameSection({ children, id, className = '', inner = '' }: { children: ReactNode; id?: string; className?: string; inner?: string }) {
  return (
    <section id={id} className={`border-t border-rail ${className}`}>
      <div className={`${column} ${inner}`}>
        <Rivets />
        {children}
      </div>
    </section>
  )
}

/** The Longtable mark: a long table, a top and two legs. */
export function Mark({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <rect x="6" y="10" width="20" height="4" rx="1" fill="var(--mark-ink, var(--background))" />
      <rect x="9" y="14" width="2.5" height="8" fill="var(--mark-ink, var(--background))" />
      <rect x="20.5" y="14" width="2.5" height="8" fill="var(--mark-ink, var(--background))" />
    </svg>
  )
}

export function GitHubMark({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

const NAV: [string, string][] = [
  ['Foundation', '/foundation/'],
  ['Roadmap', '/roadmap/'],
  ['Use cases', '/use-cases/01/'],
  ['Signatories', '/signatories/'],
  ['Press', '/press/'],
]

function isActive(pathname: string, to: string) {
  return to.startsWith('/use-cases') ? pathname.startsWith('/use-cases') : pathname.replace(/\/?$/, '/') === to
}

/** True while the header sits over the home page's dark hero band (`#hero-dark`). */
function useOverDark(pathname: string) {
  const [over, setOver] = useState(false)
  useEffect(() => {
    const check = () => {
      const el = document.getElementById('hero-dark')
      setOver(!!el && el.getBoundingClientRect().bottom > 64)
    }
    check()
    const raf = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [pathname])
  return over
}

export function Header() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  const dark = useOverDark(pathname) && !open

  return (
    <header data-theme={dark ? 'dark' : undefined} className={`sticky top-0 z-40 transition-colors duration-300 ${dark ? 'bg-[#070707] text-white' : 'bg-background'}`}>
      <div className={`${column} ${dark ? 'border-white/[0.06]' : ''} flex h-16 items-center justify-between gap-4 px-4 sm:px-6`}>
        <Link to="/" aria-label="Longtable Foundation home" className="press flex items-center gap-2.5 rounded-full">
          <Mark className={`size-7 ${dark ? 'text-white [--mark-ink:#070707]' : 'text-foreground'}`} />
          <span className="flex items-baseline gap-1.5">
            <span className="font-display text-[19px] leading-none tracking-[-0.01em]">Longtable</span>
            <span className={`hidden font-mono text-micro tracking-wide uppercase sm:inline ${dark ? 'text-white/45' : 'text-faint'}`}>Foundation</span>
          </span>
        </Link>

        <nav aria-label="Main" className={`absolute left-1/2 hidden -translate-x-1/2 items-center rounded-full border p-1 transition-colors duration-300 lg:flex ${dark ? 'border-white/10 bg-white/[0.05] backdrop-blur' : 'border-border bg-surface'}`}>
          {NAV.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              aria-current={isActive(pathname, to) ? 'page' : undefined}
              className={`press flex h-8 items-center rounded-full px-3.5 text-ui font-medium ${
                isActive(pathname, to)
                  ? dark
                    ? 'bg-white/10 text-white'
                    : 'bg-muted text-foreground'
                  : dark
                    ? 'text-white/60 hover:text-white'
                    : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={cfg.githubUrl}
            target="_blank"
            rel="noopener"
            aria-label="Longtable on GitHub"
            className={`press hidden size-9 items-center justify-center rounded-full sm:flex ${dark ? 'text-white/60 hover:bg-white/10 hover:text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
          >
            <GitHubMark />
          </a>
          <Link
            to="/get-involved/"
            className={`press hidden h-9 items-center rounded-full px-4 text-ui font-medium sm:flex ${dark ? 'bg-white text-neutral-900 hover:bg-white/85' : 'bg-foreground text-background hover:bg-foreground/85'}`}
          >
            Get involved
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mnav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className={`press flex size-9 items-center justify-center rounded-full lg:hidden ${dark ? 'text-white hover:bg-white/10' : 'text-foreground hover:bg-muted'}`}
          >
            {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
          </button>
        </div>
      </div>
      <div className={`border-b ${dark ? 'border-white/[0.06]' : 'border-rail'}`} />

      {open && (
        <nav id="mnav" aria-label="Main" className="border-b border-rail bg-background lg:hidden">
          <div className={`${column} flex flex-col gap-1 px-4 py-4 sm:px-6`}>
            {NAV.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                aria-current={isActive(pathname, to) ? 'page' : undefined}
                className={`press flex h-11 items-center rounded-2xl px-4 text-body font-medium ${isActive(pathname, to) ? 'bg-muted' : 'hover:bg-muted'}`}
              >
                {label}
              </Link>
            ))}
            <a href={cfg.githubUrl} target="_blank" rel="noopener" className="press flex h-11 items-center justify-between rounded-2xl px-4 text-body font-medium hover:bg-muted">
              GitHub <ArrowUpRight className="size-4 text-faint" />
            </a>
            <Link to="/get-involved/" className="press mt-2 flex h-11 items-center justify-center rounded-full bg-foreground text-body font-medium text-background">
              Get involved
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}

const footLink = 'text-body-sm text-muted-foreground hover:text-foreground transition-colors duration-150'

export function Footer() {
  return (
    <footer className="border-t border-rail">
      <div className={`${column} px-6 pt-14 pb-10 sm:px-10`}>
        <Rivets />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2.5">
              <Mark className="size-7" />
              <span className="font-display text-[19px] leading-none">Longtable</span>
            </span>
            <p className="max-w-[32ch] text-body-sm text-muted-foreground">An open source foundation for multimodal clearing. Incubated by Alpaca.</p>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-micro tracking-wide text-faint uppercase">Foundation</span>
            <Link className={footLink} to="/foundation/">Structure</Link>
            <Link className={footLink} to="/roadmap/">Roadmap</Link>
            <Link className={footLink} to="/signatories/">Signatories</Link>
            <Link className={footLink} to="/foundation/#incubation">Incubation</Link>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-micro tracking-wide text-faint uppercase">Resources</span>
            <Link className={footLink} to="/use-cases/01/">Use cases</Link>
            <ProposalLink className={`${footLink} text-left`}>Proposal (PDF)</ProposalLink>
            <Link className={footLink} to="/press/#talks">Talks &amp; interviews</Link>
            <a className={footLink} href={cfg.githubUrl} target="_blank" rel="noopener">GitHub ↗</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-micro tracking-wide text-faint uppercase">Press</span>
            <span className="text-body-sm text-muted-foreground">Media inquiries are handled by the Alpaca media team.</span>
            <a className="text-body-sm font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground" href={`mailto:${cfg.pressEmail}`}>
              {cfg.pressEmail}
            </a>
            <Link className={footLink} to="/press/">Press page →</Link>
          </div>
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-rail pt-6 font-mono text-micro tracking-wide text-faint uppercase">
          <span>© 2026 Longtable Foundation</span>
          <span>Incubated by Alpaca</span>
        </div>
      </div>
    </footer>
  )
}
