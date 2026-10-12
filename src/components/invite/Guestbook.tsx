import type { FormEvent } from 'react'
import { useState } from 'react'
import { uuid } from '../../lib/uuid'
import type { SectionProps } from '../../types'
import Reveal from '../ui/Reveal'
import { FlowerDeco, Heading, PillButton } from './shared'

interface Wish {
  id: string
  name: string
  wish: string
  at: Date | null
}

const fieldClass =
  'w-full rounded-[8px] border bg-white/70 px-4 py-3 text-[15px] outline-none placeholder:text-[#511419]/55 focus:bg-white'

function formatTime(d: Date) {
  return `${d.toLocaleTimeString('vi-VN', { hour12: false })} ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

// Wishes live in memory only (reset on reload) — wire `submit` to a backend to persist them.
export default function Guestbook({ data }: SectionProps) {
  const gb = data.guestbook
  const [wishes, setWishes] = useState<Wish[]>(() =>
    gb.seedWishes.map((w) => ({ id: uuid(), at: null, ...w })),
  )
  const [name, setName] = useState('')
  const [wish, setWish] = useState('')
  const [error, setError] = useState('')

  const suggest = () => {
    const pool = gb.suggestions.filter((s) => s !== wish)
    if (pool.length) setWish(pool[Math.floor(Math.random() * pool.length)])
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !wish.trim()) {
      setError(gb.formError)
      return
    }
    setError('')
    setWishes((w) => [{ id: uuid(), name: name.trim(), wish: wish.trim(), at: new Date() }, ...w])
    setName('')
    setWish('')
  }

  return (
    <section id="guestbook" className="relative px-4 py-12">
      <Reveal>
        <div className="relative -mx-2">
          <form
            onSubmit={submit}
            className="relative z-10 rounded-[14px] px-8 pt-8 pb-10 shadow-[0_10px_26px_rgba(81,20,25,0.18)]"
            style={{
              backgroundColor: 'rgba(255,250,243,0.96)',
              border: '1px solid rgba(81,20,25,0.12)',
            }}
          >
            <Heading>{gb.title}</Heading>
            <div className="mt-6 space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={gb.namePlaceholder}
                aria-label={gb.namePlaceholder}
                className={fieldClass}
                style={{ borderColor: 'var(--color-primary)' }}
              />
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder={gb.wishPlaceholder}
                aria-label={gb.wishPlaceholder}
                rows={2}
                className={`${fieldClass} resize-none`}
                style={{ borderColor: 'var(--color-primary)' }}
              />
            </div>
            {error && (
              <p role="alert" className="mt-2 text-[13px] text-red-700">
                {error}
              </p>
            )}
            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={suggest}
                title="Gợi ý lời chúc"
                aria-label="Gợi ý lời chúc"
                className="flex h-9 w-9 items-center justify-center rounded-[8px] text-[16px] hover:opacity-80 cursor-pointer"
                style={{ backgroundColor: 'rgba(81,20,25,0.1)' }}
              >
                🪄
              </button>
              <PillButton type="submit">{gb.submitLabel}</PillButton>
            </div>
          </form>
          <FlowerDeco
            className="-left-12 -bottom-16 z-0 h-[150px]"
            style={{ transform: 'scaleX(-1) rotate(160deg)' }}
          />
        </div>
      </Reveal>

      {wishes.length > 0 && (
        <ul className="mt-14 max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {wishes.map((w) => (
            <li
              key={w.id}
              className="rounded-[10px] px-4 py-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(81,20,25,0.25)',
              }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-bold [overflow-wrap:anywhere]">{w.name}</span>
                {w.at && (
                  <span className="shrink-0 text-[12px] opacity-70">{formatTime(w.at)}</span>
                )}
              </div>
              <p className="mt-2 text-[15px] leading-relaxed [overflow-wrap:anywhere]">{w.wish}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
