import type { FormEvent } from 'react'
import { useState } from 'react'
import type { SectionProps } from '../../types'
import { Heading, PillButton } from './shared'

interface FormState {
  name: string
  attending: 'yes' | 'no' | ''
  guests: number
  answers: Record<string, string>
}

const initialForm: FormState = { name: '', attending: '', guests: 1, answers: {} }

const inputClass =
  'w-full rounded-[8px] border bg-white/80 px-4 py-2.5 text-[15px] outline-none placeholder:text-[#511419]/45 focus:border-[#511419]'

function ChoiceGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex gap-2">
      {options.map((o) => {
        const selected = value === o.value
        return (
          <label
            key={o.value}
            className="flex-1 cursor-pointer rounded-[8px] border px-3 py-2 text-center text-[14px]"
            style={{
              borderColor: selected ? 'var(--color-primary)' : 'rgba(81,20,25,0.3)',
              backgroundColor: selected ? 'var(--color-primary)' : 'rgba(255,255,255,0.8)',
              color: selected ? '#ece4d8' : 'var(--color-primary)',
            }}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={selected}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        )
      })}
    </div>
  )
}

export default function RsvpForm({ data }: SectionProps) {
  const rsvp = data.rsvp
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const setAnswer = (id: string, v: string) =>
    setForm((f) => ({ ...f, answers: { ...f.answers, [id]: v } }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (submitting) return
    if (!form.name.trim()) return setError(rsvp.nameError)
    if (!form.attending) return setError(rsvp.attendError)
    setError('')
    if (!rsvp.endpoint) {
      console.warn('rsvp.endpoint is empty; RSVP submissions are not persisted')
      setSubmitted(true)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(rsvp.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: form.name.trim(),
          attending: form.attending,
          guests: form.attending === 'yes' ? form.guests : undefined,
          answers: rsvp.questions.map((q) => {
            const a = form.answers[q.id] ?? ''
            return {
              question: q.label,
              answer: q.type === 'choice' ? a : a === 'yes' ? 'Có' : a === 'no' ? 'Không' : '',
            }
          }),
        }),
      })
      const json = (await res.json()) as { ok?: boolean }
      if (!res.ok || !json.ok) throw new Error('submit failed')
      setSubmitted(true)
    } catch {
      setError(rsvp.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <Heading>{`Cảm ơn, ${form.name.trim()}!`}</Heading>
        <p className="mt-4 text-[15px]">
          {form.attending === 'yes'
            ? 'Rất mong được đón tiếp bạn trong ngày vui của chúng tôi.'
            : 'Cảm ơn bạn đã báo tin — chúng tôi sẽ nhớ đến bạn.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Heading className="pr-6">{rsvp.buttonLabel}</Heading>

      <div>
        <label htmlFor="rsvp-name" className="mb-1 block text-[14px]">
          Tên của bạn*
        </label>
        <input
          id="rsvp-name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={inputClass}
          style={{ borderColor: 'rgba(81,20,25,0.35)' }}
          placeholder="Nhập tên"
        />
      </div>

      <div>
        <span className="mb-2 block text-[14px]">{rsvp.attendLabel}</span>
        <ChoiceGroup
          name="attending"
          value={form.attending}
          onChange={(v) => setForm({ ...form, attending: v as FormState['attending'] })}
          options={[
            { value: 'yes', label: rsvp.acceptLabel },
            { value: 'no', label: rsvp.declineLabel },
          ]}
        />
      </div>

      {form.attending === 'yes' && (
        <div>
          <label htmlFor="rsvp-guests" className="mb-1 block text-[14px]">
            Số lượng khách
          </label>
          <select
            id="rsvp-guests"
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
            className={inputClass}
            style={{ borderColor: 'rgba(81,20,25,0.35)' }}
          >
            {Array.from({ length: rsvp.maxGuests }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {rsvp.questions.map((q) => (
        <div key={q.id}>
          <span className="mb-2 block text-[14px]">{q.label}</span>
          <ChoiceGroup
            name={q.id}
            value={form.answers[q.id] ?? ''}
            onChange={(v) => setAnswer(q.id, v)}
            options={
              q.type === 'choice'
                ? (q.options ?? []).map((o) => ({ value: o, label: o }))
                : [
                    { value: 'yes', label: 'Có' },
                    { value: 'no', label: 'Không' },
                  ]
            }
          />
        </div>
      ))}

      {error && (
        <p role="alert" className="text-[14px] text-red-700">
          {error}
        </p>
      )}

      <div className="flex justify-center pt-2">
        <PillButton type="submit" disabled={submitting}>
          {submitting ? 'Đang gửi...' : rsvp.buttonLabel}
        </PillButton>
      </div>
    </form>
  )
}
