'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'motion/react'
import { company, contact } from '@/content/site'
import { RollText } from '@/components/ui/Button'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { ArrowRight, Check } from '@/components/ui/icons'

type EnquiryType = (typeof contact.enquiryTypes)[number]

const ease = [0.19, 1, 0.22, 1] as const

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  textarea,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  autoComplete?: string
  textarea?: boolean
}) {
  const id = useId()
  const shared =
    'peer block w-full border-0 border-b border-ink/15 bg-transparent px-0 pt-7 pb-3 text-[1.05rem] text-ink placeholder-transparent transition-colors outline-none focus:border-transparent'
  return (
    <div className="group relative">
      {textarea ? (
        <textarea id={id} name={name} required={required} rows={5} placeholder={label} className={`${shared} resize-none`} />
      ) : (
        <input id={id} name={name} type={type} required={required} autoComplete={autoComplete} placeholder={label} className={shared} />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-7 left-0 origin-left text-[1.05rem] text-muted transition-all duration-500 ease-[var(--ease-expo)] peer-focus:top-0 peer-focus:scale-[0.78] peer-focus:text-indigo peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.78]"
      >
        {label}
        {!required && <span className="ml-2 text-xs text-muted/70">(optional)</span>}
      </label>
      <span
        aria-hidden="true"
        className="bg-brand absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 transition-transform duration-700 ease-[var(--ease-expo)] peer-focus:scale-x-100"
      />
    </div>
  )
}

/**
 * Prepares an enquiry and opens it in the visitor's own email app, addressed
 * to the Zynara Tech team. Nothing is stored or sent by this website.
 */
export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [type, setType] = useState<EnquiryType>(contact.enquiryTypes[0])
  const [sent, setSent] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return
    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const body = [
      `Name: ${name}`,
      `Email: ${String(data.get('email') ?? '').trim()}`,
      data.get('organisation') ? `Organisation: ${String(data.get('organisation')).trim()}` : null,
      `Enquiry type: ${type}`,
      '',
      String(data.get('message') ?? '').trim(),
    ]
      .filter((line) => line !== null)
      .join('\n')
    const subject = `${type} enquiry — ${name}`
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="relative overflow-hidden rounded-[30px] border border-ink/8 bg-white p-6 shadow-[0_40px_80px_-40px_rgb(8_13_27_/_0.25)] sm:p-10 lg:p-12">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <m.div
              key="sent"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease }}
              className="flex min-h-[420px] flex-col justify-center"
              role="status"
            >
              <span className="bg-brand grid size-14 place-items-center rounded-full text-white">
                <Check className="size-6" />
              </span>
              <p className="mt-8 font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight font-medium tracking-[-0.04em] text-ink">
                Your email app should now be open with your enquiry ready to send.
              </p>
              <p className="mt-5 text-muted">
                Nothing opened? Write to us directly at{' '}
                <a href={`mailto:${company.email}`} className="link-line text-ink">
                  {company.email}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => {
                  formRef.current?.reset()
                  setSent(false)
                }}
                className="mt-10 self-start text-sm font-medium text-indigo underline-offset-4 hover:underline"
              >
                Start over
              </button>
            </m.div>
          ) : (
            <m.form
              key="form"
              ref={formRef}
              onSubmit={submit}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.8, ease }}
              className="flex flex-col gap-8"
              noValidate={false}
            >
              <fieldset>
                <legend className="mono-label text-muted">Enquiry</legend>
                <div className="mt-4 flex flex-wrap gap-2">
                  {contact.enquiryTypes.map((option) => {
                    const selected = option === type
                    return (
                      <label
                        key={option}
                        className={`relative inline-flex h-11 cursor-pointer items-center rounded-full border px-5 text-sm font-medium transition-colors duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-cyan ${
                          selected ? 'border-ink bg-ink text-white' : 'border-ink/15 text-ink hover:border-ink/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="type"
                          value={option}
                          checked={selected}
                          onChange={() => setType(option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="Name" name="name" required autoComplete="name" />
                <Field label="Email" name="email" type="email" required autoComplete="email" />
              </div>
              <Field label="Organisation" name="organisation" autoComplete="organization" />
              <Field label="Your enquiry" name="message" required textarea />

              <div className="flex flex-col gap-6 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-sm leading-relaxed text-muted">
                  Opens in your email app. See our{' '}
                  <TransitionLink href="/privacy" className="link-line text-ink">
                    Website Privacy Notice
                  </TransitionLink>
                  .
                </p>
                <button type="submit" className="btn btn-dark self-start sm:self-auto">
                  <RollText>Compose email</RollText>
                  <span className="btn-icon" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </button>
              </div>
            </m.form>
          )}
        </AnimatePresence>
      </div>
    </LazyMotion>
  )
}
