import { ArrowLeft, ArrowRight, Maximize2, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { GlassButtonGroup, GlassButtonGroupItem } from '@/components/liquid-glass'

// The 3D scenes are the static site's own modules (public/anim), loaded at runtime from the
// shared public folder so both sites play the exact same explainers.

type Beat = { t: number; label: string; cue: string }
type Def = { beats: Beat[]; duration: number; statement?: { text: string; from: number; to?: number } }
type Stage = {
  load(b: unknown): Def
  playTo(t: number): void
  seek(t: number): void
  start(): void
  stop(): void
  dispose(): void
  onTime(fn: (t: number, playing: boolean) => void): void
  readonly t: number
  readonly playing: boolean
  readonly running: boolean
}

const FILES = { prefund: 'scene-prefund.js', rfq: 'scene-rfq.js', clearing: 'scene-clearing.js', bridge: 'scene-bridge.js' } as const
const LEG: Record<keyof typeof FILES, ('token' | 'cash' | 'share' | 'owed' | 'msg')[]> = {
  prefund: ['token', 'cash'],
  rfq: ['token', 'cash', 'share', 'owed', 'msg'],
  clearing: ['token', 'cash'],
  bridge: ['token', 'share', 'owed', 'msg'],
}
const NAMES = { token: 'Token', cash: 'Stablecoin', share: 'Share', owed: 'Owed share', msg: 'Message' }
const pad = (x: number) => String(x).padStart(2, '0')
const BASE = import.meta.env.BASE_URL

// Only one scene renders at a time: the one in view that was touched last.
let active: Ctl | null = null
const all = new Set<Ctl>()
type Ctl = { vis: boolean; stage: Stage | null }
const syncAll = () =>
  all.forEach((c) => {
    if (!c.stage) return
    if (c.vis && (!active || active === c || !active.vis)) active = c
    const run = c.vis && active === c
    if (run && !c.stage.running) c.stage.start()
    if (!run && c.stage.running) c.stage.stop()
  })

function Sym({ k }: { k: keyof typeof NAMES }) {
  if (k === 'token') return <span className="hex !h-3.5 !w-3" />
  if (k === 'cash') return <span className="size-3 rounded-full bg-cash" />
  if (k === 'share') return <span className="shr !h-2.5 !w-4 !rounded-[2px]" />
  if (k === 'owed') return <span className="h-2.5 w-4 rounded-[2px] border-[1.5px] border-dashed border-share" />
  return <span className="h-2 w-4 rounded-full bg-[#f2f0ea]" />
}

export function Stepper({ scene, fig, title, skip = 0 }: { scene: keyof typeof FILES; fig: string; title: string; skip?: number }) {
  const root = useRef<HTMLDivElement>(null)
  const stageEl = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const gl = useRef<HTMLDivElement>(null)
  const lab = useRef<HTMLDivElement>(null)
  const ctl = useRef<Ctl>({ vis: false, stage: null })
  const defRef = useRef<Def | null>(null)
  const skipRef = useRef(0)
  const [def, setDef] = useState<Def | null>(null)
  const [failed, setFailed] = useState(false)
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  const [t, setT] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [touched, setTouched] = useState(false)
  const [compact, setCompact] = useState(false)

  const beats = def ? def.beats.slice(skipRef.current) : []
  const n = beats.length
  const bStart = (i: number) => defRef.current!.beats[i + skipRef.current].t
  const bEnd = (i: number) => {
    const b = defRef.current!.beats
    const j = i + skipRef.current
    return j + 1 < b.length ? b[j + 1].t : defRef.current!.duration
  }

  useEffect(() => {
    const c = ctl.current
    all.add(c)
    const el = stageEl.current!
    const fit = () => {
      const cw = el.clientWidth || 928
      const ch = el.clientHeight || (cw * 9) / 16
      const s = Math.min(cw / 1920, ch / 1080)
      canvas.current!.style.transform = `translate(${(cw - 1920 * s) / 2}px,${(ch - 1080 * s) / 2}px) scale(${s})`
      setCompact((root.current?.clientWidth ?? 900) < 600)
    }
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    fit()
    const onFs = () => setTimeout(fit, 60)
    document.addEventListener('fullscreenchange', onFs)

    let cancelled = false
    let initing = false
    const init = async () => {
      if (c.stage || initing) return
      initing = true
      try {
        const pr = Math.min(1, Math.max(0.4, ((el.clientWidth || 928) * (window.devicePixelRatio || 1)) / 1920))
        const m = await import(/* @vite-ignore */ `${BASE}anim/stage3d.js`)
        if (cancelled) return
        const stage: Stage = m.createStage(gl.current, lab.current, { pixelRatio: pr })
        let last = 0
        let lastPlaying = false
        stage.onTime((time, p) => {
          const now = performance.now()
          if (now - last > 80 || p !== lastPlaying) {
            last = now
            lastPlaying = p
            setT(time)
            setPlaying(p)
          }
        })
        const mod = await import(/* @vite-ignore */ `${BASE}anim/${FILES[scene]}`)
        if (cancelled) return stage.dispose()
        const d = stage.load(mod.default)
        skipRef.current = Math.max(0, Math.min(skip, d.beats.length - 1))
        defRef.current = d
        c.stage = stage
        if (c.vis && (!active || active === c || !active.vis)) {
          active = c
          stage.seek(bStart(0))
          stage.playTo(bEnd(0))
        } else stage.seek(bEnd(0))
        stage.start()
        setDef(d)
        setTimeout(syncAll, 450)
      } catch (err) {
        console.error('Longtable stepper: ' + err)
        setFailed(true)
      }
    }
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting === c.vis) return
          c.vis = e.isIntersecting
          if (c.vis) init()
          syncAll()
        }),
      { rootMargin: '-8% 0px -8% 0px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('fullscreenchange', onFs)
      all.delete(c)
      if (active === c) active = null
      c.stage?.dispose()
      c.stage = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, skip])

  const go = useCallback((i: number) => {
    const c = ctl.current
    const d = defRef.current
    if (!d || !c.stage) return
    const count = d.beats.length - skipRef.current
    i = Math.max(0, Math.min(count - 1, i))
    active = c
    syncAll()
    c.stage.seek(bStart(i))
    c.stage.playTo(bEnd(i))
    stepRef.current = i
    setStep(i)
    setTouched(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const next = useCallback(() => {
    const c = ctl.current
    const d = defRef.current
    if (!d || !c.stage) return
    const count = d.beats.length - skipRef.current
    if (stepRef.current < count - 1) return go(stepRef.current + 1)
    if (c.stage.playing) {
      active = c
      syncAll()
      c.stage.seek(d.duration)
      return
    }
    go(0)
  }, [go])
  const back = useCallback(() => go(stepRef.current - 1), [go])

  // Click or swipe the scene.
  const px = useRef<{ x: number; y: number } | null>(null)
  const onUp = (e: React.PointerEvent) => {
    if (!px.current) return
    const dx = e.clientX - px.current.x
    const dy = e.clientY - px.current.y
    px.current = null
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) dx < 0 ? next() : back()
    else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) next()
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      back()
    }
  }

  const cur = beats[step]
  const st = def?.statement
  const stmtOn = !!(st && t >= st.from && t < (st.to ?? 1e9))
  const last = step >= n - 1
  const nextLabel = !def ? 'Next step' : !last ? 'Next step' : playing ? 'Skip to end' : 'Start over'

  return (
    <div
      ref={root}
      tabIndex={0}
      role="group"
      aria-label={`${fig}: ${title}. Use the left and right arrow keys to step through.`}
      onKeyDown={onKey}
      className="flex flex-col overflow-hidden rounded-[28px] card-dark text-white outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-3 sm:px-6">
        <span className="flex min-w-0 items-baseline gap-2.5">
          <span className="shrink-0 font-mono text-micro tracking-wide text-white/45">{fig}</span>
          <span className="truncate text-body-sm font-semibold">{title}</span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className="font-mono text-micro tracking-wide text-white/60">
            STEP {def ? pad(step + 1) : '--'} / {def ? pad(n) : '--'}
          </span>
          <button
            type="button"
            aria-label="Full screen"
            onClick={(e) => {
              e.stopPropagation()
              if (document.fullscreenElement) document.exitFullscreen()
              else stageEl.current?.requestFullscreen?.().catch(() => {})
            }}
            className="press flex size-8 items-center justify-center rounded-full bg-white/[0.08] text-white/80 hover:bg-white/15"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </span>
      </div>

      <div
        ref={stageEl}
        className="stp-stage relative aspect-video w-full cursor-pointer touch-pan-y overflow-hidden bg-night select-none"
        onPointerDown={(e) => (px.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={onUp}
      >
        <div ref={canvas} className="stp-canvas">
          <div ref={gl} className="absolute inset-0" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_46%,rgba(5,5,5,0)_52%,rgba(5,5,5,.6)_100%)]" />
          <div ref={lab} className="pointer-events-none absolute inset-0 overflow-hidden" />
          <div
            className="pointer-events-none absolute right-[120px] bottom-[96px] left-[120px] font-display text-[72px] leading-[1.05] tracking-[-0.02em] text-[#f2f0ea] text-balance transition-opacity duration-300"
            style={{ opacity: stmtOn ? 1 : 0 }}
          >
            {st?.text}
          </div>
        </div>
        {!def && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-micro tracking-[0.08em] text-white/50 uppercase">
            {failed ? 'This 3D scene could not load. Reload the page, or try another browser.' : <span className="motion-safe:animate-pulse">Loading 3D scene…</span>}
          </div>
        )}
        {def && !touched && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3.5 py-2 font-mono text-micro tracking-wide whitespace-nowrap text-white/85">
            Click or swipe to step through →
          </div>
        )}
      </div>

      {def && (
        <div className="flex gap-1 px-5 pt-4 sm:px-6">
          {beats.map((b, j) => {
            const a = bStart(j)
            const z = bEnd(j)
            const p = j < step ? 1 : j > step ? 0 : Math.max(0, Math.min(1, (t - a) / Math.max(0.001, z - a)))
            return (
              <button key={j} type="button" title={b.label} onClick={() => go(j)} className="group flex min-w-0 flex-1 cursor-pointer flex-col gap-2 py-1.5 text-left">
                <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                  <i className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${(p * 100).toFixed(1)}%` }} />
                </span>
                {!compact && (
                  <span className={`truncate font-mono text-[10.5px] tracking-wide ${j === step ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                    {pad(j + 1)} {b.label}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4 px-5 pt-3 pb-5 sm:px-6 sm:pb-6">
        <div aria-live="polite" className="flex min-h-[84px] min-w-0 flex-[1_1_320px] flex-col gap-2">
          <span className="font-mono text-micro tracking-wide text-white/45 uppercase">
            Step {def ? pad(step + 1) : '--'} · {failed ? 'Unavailable' : (cur?.label ?? 'Loading')}
          </span>
          <p className={`max-w-[64ch] text-white/85 text-pretty ${compact ? 'text-body' : 'text-[17px] leading-relaxed'}`}>
            {failed ? 'The step-through could not start in this browser. Reload the page to try again.' : (cur?.cue ?? 'Loading the scene…')}
          </p>
        </div>
        <GlassButtonGroup aria-label="Step through" size="lg">
          <GlassButtonGroupItem aria-label="Previous step" onClick={back} className="px-0">
            <ArrowLeft />
          </GlassButtonGroupItem>
          <GlassButtonGroupItem onClick={next}>
            {nextLabel}
            {last && !playing ? <RotateCcw /> : <ArrowRight />}
          </GlassButtonGroupItem>
        </GlassButtonGroup>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 px-5 py-3.5 sm:px-6">
        {LEG[scene].map((k) => (
          <span key={k} className="flex items-center gap-2 font-mono text-micro tracking-wide text-white/65">
            <span className="flex w-5 justify-center">
              <Sym k={k} />
            </span>
            {NAMES[k]}
          </span>
        ))}
        {!compact && <span className="ml-auto font-mono text-micro text-white/35">← → keys · click or swipe the scene</span>}
      </div>
    </div>
  )
}
