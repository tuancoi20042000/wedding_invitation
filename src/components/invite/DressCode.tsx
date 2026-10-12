import type { SectionProps } from '../../types'
import Reveal from '../ui/Reveal'
import { Heading } from './shared'

export default function DressCode({ data }: SectionProps) {
  const dress = data.dressCode
  if (!dress) return null
  return (
    <section id="dress-code" className="relative px-4 pt-4 pb-14 text-center">
      <Reveal>
        <Heading>{dress.title}</Heading>
        <p className="mt-2 text-[14px] opacity-85">{dress.subtitle}</p>
        <div className="mt-5 flex justify-center gap-4">
          {dress.colors.map((c) => (
            <span
              key={c}
              title={c}
              className="h-10 w-10 rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.18)]"
              style={{ backgroundColor: c, border: '1px solid rgba(81,20,25,0.15)' }}
            />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
