import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { lunarLabel } from '../../lib/lunar'
import { withBase } from '../../lib/withBase'

export const FLOWER = withBase('/images/themes/red/hoa.webp')

export const CREAM = '#ece4d8'
export const CARD_BG = 'linear-gradient(160deg, #5c171d 0%, #4e1318 55%, #43101a 100%)'
export const TITLE_FONT = '"Times New Roman", "EB Garamond", serif'
export const BODY_FONT = '"Times New Roman", "EB Garamond", serif'
export const NAME_FONT = '"Viaoda Libre", "Cormorant Garamond", serif'
export const SCRIPT_FONT = '"Alex Brush", cursive'

/** Small uppercase serif heading, dark red on paper or cream on a red card. */
export function Heading({
  children,
  tone = 'red',
  className = '',
}: {
  children: ReactNode
  tone?: 'red' | 'cream'
  className?: string
}) {
  return (
    <h2
      className={`text-center uppercase font-bold text-[19px] md:text-[21px] tracking-[0.03em] ${className}`}
      style={{ fontFamily: TITLE_FONT, color: tone === 'red' ? 'var(--color-primary)' : CREAM }}
    >
      {children}
    </h2>
  )
}

/** Line — fleuron — line divider. */
export function Ornament({
  color = 'currentColor',
  className = '',
}: {
  color?: string
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center gap-2 ${className}`}
      style={{ color }}
      aria-hidden
    >
      <span
        className="h-px w-12"
        style={{ background: `linear-gradient(to left, ${color}, transparent)` }}
      />
      <span className="text-[13px] leading-none opacity-80">❦</span>
      <span
        className="h-px w-12"
        style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
      />
    </div>
  )
}

/** Watercolour flower branch peeking in from a card edge. */
export function FlowerDeco({
  className = '',
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <img
      src={FLOWER}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={`pointer-events-none absolute w-auto max-w-none select-none ${className}`}
      style={style}
    />
  )
}

/** Deep red card with soft shadow — the template's main content container. */
export function RedCard({
  children,
  className = '',
  deco,
}: {
  children: ReactNode
  className?: string
  deco?: 'left' | 'right'
}) {
  return (
    <div className={`relative mx-2 ${className}`}>
      <div
        className="relative z-10 overflow-hidden rounded-[14px] px-5 py-8 text-center shadow-[0_10px_24px_rgba(56,10,14,0.35)]"
        style={{ background: CARD_BG, color: CREAM, fontFamily: BODY_FONT }}
      >
        {children}
      </div>
      {deco === 'right' && (
        <FlowerDeco
          className="-right-[46px] top-[36%] z-20 h-[190px] opacity-95"
          style={{ transform: 'rotate(-8deg)' }}
        />
      )}
      {deco === 'left' && (
        <FlowerDeco
          className="-left-[50px] top-[6%] z-20 h-[170px] opacity-95"
          style={{ transform: 'scaleX(-1) rotate(-10deg)' }}
        />
      )}
    </div>
  )
}

const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

export function dateParts(dateIso: string) {
  const [y, m, d] = dateIso.split('-').map(Number)
  return {
    year: y,
    month: m,
    day: d,
    weekday: WEEKDAYS[new Date(y, m - 1, d).getDay()],
  }
}

/** "VÀO LÚC 09:00 · THỨ BẢY / 03 | THÁNG 01 2026 / (TỨC NGÀY …)" block on red cards. */
export function DateBlock({
  dateIso,
  time,
  timePrefix,
}: {
  dateIso: string
  time: string
  timePrefix?: string
}) {
  const p = dateParts(dateIso)
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-8 text-[13px] uppercase tracking-wide opacity-90">
        <span>{timePrefix ? `${timePrefix} ${time}` : time}</span>
        <span>{p.weekday}</span>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <span className="text-[40px] leading-none">{String(p.day).padStart(2, '0')}</span>
        <span className="h-12 w-px" style={{ backgroundColor: 'rgba(236,228,216,0.5)' }} />
        <span className="flex flex-col items-start text-left">
          <span className="text-[13px] uppercase">Tháng {String(p.month).padStart(2, '0')}</span>
          <span className="text-[17px]">{p.year}</span>
        </span>
      </div>
      <p className="mt-4 text-[13px] uppercase tracking-[0.08em] opacity-75">
        ({`Tức ${lunarLabel(dateIso)}`})
      </p>
    </div>
  )
}

/** Cream month calendar with the wedding day marked by a heart (Monday-first). */
export function CalendarCard({ dateIso }: { dateIso: string }) {
  const { year, month, day } = dateParts(dateIso)
  const firstWeekday = (new Date(year, month - 1, 1).getDay() + 6) % 7 // 0 = Monday
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  return (
    <div
      className="rounded-[10px] px-4 pt-4 pb-5"
      style={{ backgroundColor: CREAM, color: 'var(--color-primary)' }}
    >
      <p className="text-center text-[28px] leading-tight" style={{ fontFamily: SCRIPT_FONT }}>
        Tháng {month} / {year}
      </p>
      <div
        className="mt-3 grid grid-cols-7 border-y pb-2 pt-2 text-[11px] opacity-80"
        style={{ borderColor: 'rgba(81,20,25,0.2)', borderBottomColor: 'var(--color-primary)' }}
      >
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-y-4 text-[14px]">
        {cells.map((d, i) =>
          d === null ? (
            <span key={`blank-${i}`} />
          ) : d === day ? (
            <span
              key={d}
              className="relative mx-auto flex h-7 w-7 items-center justify-center font-bold text-white"
            >
              <svg viewBox="0 0 24 24" className="absolute inset-0 h-full w-full" aria-hidden>
                <path
                  fill="var(--color-primary)"
                  d="M12 21s-7.5-4.6-9.6-9.1C.9 8.6 2.8 4.5 6.6 4.5c2.2 0 3.7 1.3 5.4 3.2 1.7-1.9 3.2-3.2 5.4-3.2 3.8 0 5.7 4.1 4.2 7.4C19.5 16.4 12 21 12 21z"
                />
              </svg>
              <span className="relative text-[12px]">{d}</span>
            </span>
          ) : (
            <span key={d}>{d}</span>
          ),
        )}
      </div>
    </div>
  )
}

/** Pill button: cream on red cards, deep red on paper. */
export function PillButton({
  children,
  onClick,
  tone = 'red',
  type = 'button',
  className = '',
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  tone?: 'red' | 'cream'
  type?: 'button' | 'submit'
  className?: string
  disabled?: boolean
}) {
  const red = tone === 'red'
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden rounded-full px-6 py-2.5 text-[14px] uppercase tracking-wide transition-transform hover:scale-[1.03] disabled:opacity-60 cursor-pointer ${className}`}
      style={{
        fontFamily: TITLE_FONT,
        fontWeight: 700,
        backgroundColor: red ? 'var(--color-primary)' : CREAM,
        color: red ? CREAM : 'var(--color-primary)',
        boxShadow: red ? '0 6px 16px rgba(81,20,25,0.35)' : 'none',
      }}
    >
      {children}
    </button>
  )
}

/** Centered dialog with backdrop, Escape to close and focus handoff. */
export function Modal({
  open,
  onClose,
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  label: string
  children: ReactNode
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  // Portal out of the card's isolated stacking context so the backdrop covers floating buttons
  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      onKeyDown={undefined}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="relative max-h-[88vh] w-full max-w-[400px] overflow-y-auto rounded-[14px] p-6 shadow-2xl outline-none"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-primary)',
          fontFamily: BODY_FONT,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[18px] hover:bg-black/5 cursor-pointer"
        >
          ✕
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
