import { Check, X } from 'lucide-react'
import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'

import { GlassActionButton, GlassButton } from '@/components/liquid-glass'
import { cfg } from '@/data'

// Same transport as the static site (public/app.js): JSON to the local endpoint when one is
// set, otherwise a no-cors form POST to the Google Sheet's Apps Script web app.
async function send(data: Record<string, string>) {
  if (cfg.formEndpoint) {
    const r = await fetch(cfg.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) throw new Error(j.error || 'We could not save that. Try again in a minute.')
    return
  }
  if (cfg.sheetEndpoint) {
    const body = new URLSearchParams({ type: data.type || 'signup', email: data.email || '', organization: data.organization || '', page: data.page || '' })
    await fetch(cfg.sheetEndpoint, { method: 'POST', mode: 'no-cors', body })
    return
  }
  throw new Error('Sign-up is not open yet. Try again later.')
}

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

class FieldError extends Error {
  constructor(message: string, readonly field: 'email' | 'organization') {
    super(message)
  }
}

const field =
  'h-11 w-full rounded-xl border border-border-strong bg-surface px-3.5 text-body-sm text-foreground placeholder:text-faint transition-[border-color,box-shadow] duration-150 outline-none focus:border-foreground/40 focus:shadow-[0_0_0_4px_rgba(11,11,12,0.06)] aria-invalid:border-[#b4234a]'

type FormBoxProps = {
  type: 'signup' | 'proposal'
  id: string
  title: string
  desc: ReactNode
  button: string
  note: string
  doneTitle: string
  doneText: (email: string) => ReactNode
  resetLabel?: string
}

/** Work email + organization. The action button carries the send; the done pane replaces the form. */
export function FormBox({ type, id, title, desc, button, note, doneTitle, doneText, resetLabel = 'Use another email' }: FormBoxProps) {
  const form = useRef<HTMLFormElement>(null)
  const submit = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<{ text: string; field?: string } | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const [run, setRun] = useState(0)

  async function action() {
    setError(null)
    const f = form.current!
    const data: Record<string, string> = {}
    new FormData(f).forEach((v, k) => (data[k] = String(v).trim()))
    if (!emailOk(data.email || '')) throw new FieldError('Enter a work email like name@organization.com.', 'email')
    if (!data.organization) throw new FieldError('Enter your organization.', 'organization')
    if (data.website) return
    delete data.website
    data.type = type
    data.page = location.pathname
    await send(data)
    window.setTimeout(() => setSentTo(data.email), 700)
  }

  function onError(err: unknown) {
    if (err instanceof FieldError) {
      setError({ text: err.message, field: err.field })
      form.current?.querySelector<HTMLInputElement>(`input[name=${err.field}]`)?.focus()
    } else {
      setError({ text: err instanceof TypeError ? 'That did not go through. Check your connection and try again.' : (err as Error).message })
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    submit.current?.querySelector('button')?.click()
  }

  function reset() {
    form.current?.reset()
    setSentTo(null)
    setRun((n) => n + 1)
    requestAnimationFrame(() => form.current?.querySelector<HTMLInputElement>('input[name=email]')?.focus())
  }

  if (sentTo) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[28px] bg-stage p-7 sm:p-8" tabIndex={-1} ref={(el) => el?.focus()}>
        <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="size-5" />
        </span>
        <span className="font-display text-title">{doneTitle}</span>
        <p className="max-w-[52ch] text-body-sm text-muted-foreground">{doneText(sentTo)}</p>
        <button type="button" onClick={reset} className="press mt-1 h-9 rounded-full border border-border-strong bg-surface px-4 text-ui font-medium hover:bg-muted">
          {resetLabel}
        </button>
      </div>
    )
  }

  return (
    <form ref={form} id={id} noValidate onSubmit={onSubmit} onInput={() => error && setError(null)} className="flex flex-col gap-5 rounded-[28px] bg-stage p-7 sm:p-8">
      <input className="hidden" name="website" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className="flex flex-col gap-1.5">
        <span id={`${id}-t`} className="font-display text-title">
          {title}
        </span>
        <span className="text-body-sm text-muted-foreground">{desc}</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-micro tracking-wide text-faint uppercase">Work email</span>
          <input className={field} type="email" name="email" required placeholder="name@organization.com" autoComplete="email" aria-invalid={error?.field === 'email' || undefined} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-micro tracking-wide text-faint uppercase">Organization</span>
          <input className={field} name="organization" required autoComplete="organization" aria-invalid={error?.field === 'organization' || undefined} />
        </label>
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
        <div ref={submit}>
          <GlassActionButton
            resetKey={run}
            size="lg"
            material="tinted"
            className="bg-neutral-900 text-white"
            pendingLabel="Sending"
            successLabel="Sent"
            onAction={action}
            onActionError={onError}
          >
            {button}
          </GlassActionButton>
        </div>
        <span aria-live="polite" className={`text-caption ${error ? 'text-[#b4234a]' : 'text-muted-foreground'}`}>
          {error ? error.text : note}
        </span>
      </div>
    </form>
  )
}

export function ProposalForm({ id = 'proposal-form' }: { id?: string }) {
  return (
    <FormBox
      type="proposal"
      id={id}
      title="Get the proposal"
      desc={`${cfg.proposal.title}. PDF, ${cfg.proposal.pages} pages, ${cfg.proposal.date}. Leave your work email and organization and we will email it to you.`}
      button="Email me the proposal"
      note="We will also send you progress updates. Unsubscribe any time."
      doneTitle="Check your inbox"
      doneText={(email) => (
        <>
          The proposal is on its way to <b className="font-medium text-foreground">{email}</b>. It can take a few minutes. If it has not arrived, check your spam folder.
        </>
      )}
      resetLabel="Send to another email"
    />
  )
}

export function SignupForm() {
  return (
    <FormBox
      type="signup"
      id="pane-signup"
      title="Sign up"
      desc="Leave your work email and organization. We will send progress updates and contact you about joining, funding or contributing."
      button="Sign up"
      note="Updates cover milestones, publications and open calls for comment. Unsubscribe any time."
      doneTitle="You’re signed up"
      doneText={(email) => (
        <>
          Progress updates will go to <b className="font-medium text-foreground">{email}</b>. We will contact you there about joining, funding or contributing.
        </>
      )}
    />
  )
}

// ── The proposal dialog: every "Get the proposal" opens it. ──

const ProposalCtx = createContext<() => void>(() => {})
export const useProposal = () => useContext(ProposalCtx)

export function ProposalProvider({ children }: { children: ReactNode }) {
  const dlg = useRef<HTMLDialogElement>(null)
  const [mounted, setMounted] = useState(0)
  const open = () => {
    setMounted((n) => n + 1)
    dlg.current?.showModal()
  }
  useEffect(() => {
    const d = dlg.current
    if (!d) return
    const onClick = (e: MouseEvent) => e.target === d && d.close()
    d.addEventListener('click', onClick)
    return () => d.removeEventListener('click', onClick)
  }, [])
  return (
    <ProposalCtx.Provider value={open}>
      {children}
      <dialog
        ref={dlg}
        aria-labelledby="proposal-dialog-form-t"
        className="pdlg m-auto w-[min(620px,calc(100vw-2rem))] overflow-visible bg-transparent p-0 text-foreground backdrop:bg-transparent"
      >
        <div className="relative rounded-[32px] bg-background p-2 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.35)]">
          <button
            type="button"
            aria-label="Close"
            onClick={() => dlg.current?.close()}
            className="press absolute top-5 right-5 z-10 flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-black/5 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
          {mounted > 0 && <ProposalForm key={mounted} id="proposal-dialog-form" />}
        </div>
      </dialog>
    </ProposalCtx.Provider>
  )
}

export function ProposalLink({ className = '', children }: { className?: string; children: ReactNode }) {
  const open = useProposal()
  return (
    <button type="button" onClick={open} className={`cursor-pointer ${className}`}>
      {children}
    </button>
  )
}

/** The primary action on most pages: black tinted glass, PDF meta beside the label. */
export function ProposalButton({ label = 'Get the proposal', size = 'lg' as const }: { label?: string; size?: 'md' | 'lg' }) {
  const open = useProposal()
  return (
    <GlassButton material="tinted" size={size} onClick={open} className="bg-neutral-900 text-white">
      {label}
      <span className="font-mono text-micro tracking-wide text-white/55 uppercase max-sm:hidden">
        PDF · {cfg.proposal.pages} pp
      </span>
    </GlassButton>
  )
}
