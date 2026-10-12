import type { ReactNode } from 'react'
import type { SectionProps } from '../../types'
import Reveal from '../ui/Reveal'
import { Heading, RedCard } from './shared'

const GOLD = '#d9b77a'

// Small line icons chosen by keywords in the schedule label
const ICONS: { match: RegExp; icon: ReactNode }[] = [
  {
    match: /bánh|nâng ly/i,
    icon: <path d="M5 20h14M6 20v-6h12v6M8 14v-3h8v3M12 11V8m0-3c-1 1-1 2 0 3 1-1 1-2 0-3z" />,
  },
  {
    match: /tiệc|cơm/i,
    icon: (
      <>
        <circle cx="12" cy="13" r="6" />
        <circle cx="12" cy="13" r="3" />
        <path d="M3 6v6M3 9h1M21 6v14M5 6v3" />
      </>
    ),
  },
  {
    match: /lễ|nghi thức/i,
    icon: (
      <>
        <circle cx="9" cy="14" r="5" />
        <circle cx="15" cy="14" r="5" />
        <path d="M10 6l2-3 2 3-2 2z" />
      </>
    ),
  },
]

function iconFor(label: string) {
  const hit = ICONS.find((i) => i.match.test(label))
  if (!hit) return null
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-7 w-7"
      fill="none"
      stroke={GOLD}
      strokeWidth="1.4"
      aria-hidden
    >
      {hit.icon}
    </svg>
  )
}

export default function Timeline({ data }: SectionProps) {
  const items = data.party.schedule
  return (
    <section id="timeline" className="relative py-4">
      <Reveal>
        <RedCard deco="right">
          <Heading tone="cream">{data.timelineTitle}</Heading>
          <ol className="mx-auto mt-6 grid max-w-[320px] grid-cols-[32px_56px_20px_1fr] items-center gap-x-3">
            {items.map((item, i) => (
              <li key={item.id} className="contents">
                <span className="flex justify-center">{iconFor(item.label)}</span>
                <span className="text-right text-[17px]">{item.time}</span>
                <span className="relative flex h-14 items-center justify-center" aria-hidden>
                  <span
                    className={`absolute left-1/2 w-px -translate-x-1/2 ${i === 0 ? 'top-1/2' : 'top-0'} ${
                      i === items.length - 1 ? 'bottom-1/2' : 'bottom-0'
                    }`}
                    style={{ backgroundColor: 'rgba(236,228,216,0.5)' }}
                  />
                  <span
                    className="relative h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: '#ece4d8' }}
                  />
                </span>
                <span className="text-left text-[14px] opacity-90">{item.label}</span>
              </li>
            ))}
          </ol>
        </RedCard>
      </Reveal>
    </section>
  )
}
