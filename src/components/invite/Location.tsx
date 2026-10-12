import type { SectionProps } from '../../types'
import Reveal from '../ui/Reveal'
import { Heading } from './shared'

export default function Location({ data }: SectionProps) {
  const party = data.party
  return (
    <section id="location" className="relative px-4 py-12 text-center">
      <Reveal>
        <Heading>{party.locationTitle}</Heading>
        <p className="mt-3 text-[15px] font-bold">{party.venue}</p>
        <p className="mx-auto mt-1 max-w-[320px] text-[13px] leading-relaxed opacity-85">
          {party.address}
        </p>
      </Reveal>
      <Reveal delay={100}>
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(party.mapAddress)}&output=embed`}
          title={`Bản đồ: ${party.venue}`}
          loading="lazy"
          className="mt-5 h-[230px] w-full rounded-[10px] border-0 shadow-[0_6px_16px_rgba(81,20,25,0.15)]"
        />
        <a
          href={party.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-[15px] font-bold hover:opacity-75"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M3 11l18-8-8 18-2-8-8-2z" strokeLinejoin="round" />
          </svg>
          Chỉ đường
        </a>
      </Reveal>
    </section>
  )
}
