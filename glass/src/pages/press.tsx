import { Check, Copy } from 'lucide-react'
import { useRef, useState } from 'react'

import { GlassButton } from '@/components/liquid-glass'
import { D, cfg } from '@/data'
import { Body, Eyebrow, Go, PageHero, Sec, TextLink, Tile, Video } from '@/site/ui'

const secs = (ts: string) => {
  const [m, s] = ts.split(':').map(Number)
  return m * 60 + s
}
const yt = (id: string, start = 0) => `https://www.youtube.com/watch?v=${encodeURIComponent(id)}${start ? `&t=${start}s` : ''}`

function Chapters() {
  const id = cfg.videos.rollupInterview as string
  const [ch, setCh] = useState(4)
  const start = secs(D.CH[ch][0])
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-4">
        <Video key={start} id={id} label="The Rollup interview" start={start} badge={`Starts at ${D.CH[ch][0]} · ${D.CH[ch][1]}`} />
        <div className="flex flex-col gap-2 px-1">
          <Eyebrow>The Rollup · Live from DAS Asia 2026</Eyebrow>
          <span className="font-display text-[26px] leading-tight">Introducing “Multimodal” Equities</span>
          <Body className="text-body-sm">
            Equities now exist in many forms simultaneously, only a multimodal clearinghouse can solve liquidity across all modalities while preserving capital efficiency.
          </Body>
          {id && (
            <span className="text-body-sm">
              <TextLink href={yt(id, start)}>Watch on YouTube ↗</TextLink>
            </span>
          )}
        </div>
      </div>
      <div className="flex max-h-[520px] flex-col overflow-hidden rounded-[28px] bg-stage">
        <div className="flex justify-between px-6 pt-5 pb-3">
          <Eyebrow>Chapters</Eyebrow>
          <Eyebrow>Pick one</Eyebrow>
        </div>
        <div className="flex flex-col gap-0.5 overflow-y-auto px-3 pb-3">
          {D.CH.map(([ts, t], i) => (
            <button
              key={ts}
              type="button"
              aria-pressed={i === ch}
              onClick={() => setCh(i)}
              className={`press flex cursor-pointer items-baseline gap-3 rounded-2xl px-3 py-2.5 text-left text-body-sm ${i === ch ? 'bg-surface font-medium text-foreground' : 'text-muted-foreground hover:bg-white/60 hover:text-foreground'}`}
            >
              <span className="w-11 shrink-0 font-mono text-micro text-faint">{ts}</span>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Boilerplate() {
  const [copied, setCopied] = useState(false)
  const t = useRef<number>(0)
  const copy = () => {
    const ok = () => {
      setCopied(true)
      clearTimeout(t.current)
      t.current = window.setTimeout(() => setCopied(false), 1800)
    }
    if (navigator.clipboard) navigator.clipboard.writeText(D.BOILER).then(ok, ok)
    else ok()
  }
  return (
    <Tile className="flex flex-col items-start gap-5">
      <Eyebrow>About the Longtable Foundation</Eyebrow>
      <p className="max-w-[72ch] text-[17px] leading-relaxed text-foreground">{D.BOILER}</p>
      <GlassButton material="tinted" size="md" onClick={copy} className="bg-neutral-900 text-white" icon={copied ? <Check /> : <Copy />}>
        {copied ? 'Copied' : 'Copy boilerplate'}
      </GlassButton>
    </Tile>
  )
}

export function Press() {
  const v = cfg.videos
  const sifma = v.sifmaPanel as string
  return (
    <>
      <PageHero eyebrow="Appendix B · Press" title="Press" lead="Media inquiries are handled by the Alpaca media team.">
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Tile className="flex flex-col gap-2 !p-6">
            <Eyebrow>Media contact</Eyebrow>
            <span className="text-body-sm font-semibold">Alpaca media team</span>
            <span className="text-body-sm">
              <TextLink href={`mailto:${cfg.pressEmail}`}>{cfg.pressEmail}</TextLink>
            </span>
          </Tile>
          <Tile className="flex flex-col gap-2 !p-6">
            <Eyebrow>Press kit</Eyebrow>
            <span className="text-body-sm font-semibold">Logos, boilerplate, Open Graph image</span>
            <a className="text-body-sm font-medium underline decoration-border-strong underline-offset-4 hover:decoration-foreground" href={`${import.meta.env.BASE_URL}assets/longtable-press-kit.zip`} download>
              Download ZIP ↓
            </a>
          </Tile>
          <Tile className="flex flex-col gap-2 !p-6">
            <Eyebrow>Speaker</Eyebrow>
            <span className="text-body-sm font-semibold">{cfg.speaker.name}</span>
            <span className="text-body-sm text-muted-foreground">{cfg.speaker.role}</span>
          </Tile>
        </div>
      </PageHero>

      <Sec id="talks" no="B.1" label="Talks & interviews">
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:items-center">
          <Video id={v.summitTalk as string} label="Summit talk" badge="7 MIN" />
          <div className="flex flex-col gap-2">
            <Eyebrow>The Alpaca Summit · October 2026</Eyebrow>
            <span className="font-display text-[26px] leading-tight">Multimodal Clearing</span>
            <span className="text-body-sm text-muted-foreground">
              {cfg.speaker.name}, {cfg.speaker.role}
            </span>
          </div>
        </div>

        <Chapters />

        <blockquote className="flex flex-col gap-4 rounded-[28px] card-dark p-7 text-white sm:p-10">
          <Eyebrow className="text-white/50">SIFMA Ops 2026</Eyebrow>
          <p className="font-display text-[26px] leading-[1.2] tracking-[-0.01em] text-balance sm:text-[34px]">
            “Crypto technology allows pre-funded trades to settle atomically… but that’s not how trading works in the real world. Nobody wants to pre-fund their trades.”
          </p>
        </blockquote>
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ['Clip [1]', 'Prefunding vs atomic settlement', v.sifmaClip1Start as number, cfg.links.sifmaClip1, 'CLIP 1'],
            ['Clip [2]', 'ITN and deep liquidity as TradFi', v.sifmaClip2Start as number, cfg.links.sifmaClip2, 'CLIP 2'],
          ].map(([k, t, s, link, badge]) => (
            <figure key={k as string} className="flex flex-col gap-3">
              <Video id={sifma} label={`${k} · ${t}`} start={s as number} badge={badge as string} />
              <figcaption className="flex flex-col gap-1 px-1">
                <Eyebrow>{k}</Eyebrow>
                <span className="text-body font-semibold">{t}</span>
                <span className="text-body-sm text-muted-foreground">{cfg.speaker.name} at SIFMA Ops 2026</span>
                {link && (
                  <span className="text-body-sm">
                    <TextLink href={link as string}>Open on YouTube ↗</TextLink>
                  </span>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      </Sec>

      <Sec no="B.2" label="Boilerplate">
        <Boilerplate />
      </Sec>

      <Sec no="B.3" label="Further reading">
        <div className="flex flex-col gap-3">
          {[
            [cfg.links.tabbArticle, 'Equity Tokens Need Netting Not Instant Settlement', 'Larry Tabb, Bloomberg Intelligence · May 20, 2026'],
            [cfg.links.taylorArticle, 'Netting is All You Need', 'Simon Taylor, Tempo Blockchain · Aug 7, 2026'],
          ].map(([h, t, b]) => {
            const inner = (
              <>
                <span className="flex flex-col gap-1">
                  <span className="text-body font-semibold">{t}</span>
                  <span className="text-body-sm text-muted-foreground">{b}</span>
                </span>
                {h && <Go external />}
              </>
            )
            return h ? (
              <a key={t} href={h} target="_blank" rel="noopener" className="group press flex items-center justify-between gap-4 rounded-[22px] bg-stage px-6 py-5 hover:bg-[#e6e6e9]">
                {inner}
              </a>
            ) : (
              <div key={t} className="flex items-center justify-between gap-4 rounded-[22px] bg-stage px-6 py-5">
                {inner}
              </div>
            )
          })}
        </div>
      </Sec>
    </>
  )
}
