import { useState } from 'react'
import type { SectionProps } from '../../types'
import Reveal from '../ui/Reveal'
import { Heading, Modal } from './shared'

const GOLD = '#d8b46a'

/** Red gift envelope (lì xì) with gold flap line and floral medallion. */
function GiftEnvelope({ className }: { className: string }) {
  return (
    <div
      className={`absolute h-[230px] w-[150px] rounded-[10px] shadow-[0_12px_24px_rgba(56,10,14,0.4)] ${className}`}
      style={{ background: 'linear-gradient(160deg, #a0232c, #7c1720 60%, #6a131b)' }}
      aria-hidden
    >
      <div
        className="absolute inset-x-0 top-0 h-[70px] rounded-t-[10px]"
        style={{
          background: 'linear-gradient(180deg, #8f1d26, #7a1820)',
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 50% 100%, 0 45%)',
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))',
        }}
      />
      <div
        className="absolute inset-[8px] rounded-[7px] border"
        style={{ borderColor: `${GOLD}88` }}
      />
      <div
        className="absolute left-1/2 top-[108px] flex h-[62px] w-[62px] -translate-x-1/2 items-center justify-center rounded-full"
        style={{
          border: `1.5px solid ${GOLD}`,
          color: GOLD,
          boxShadow: `0 0 0 4px #7c1720, 0 0 0 5px ${GOLD}66`,
        }}
      >
        <span className="text-[30px] leading-none">✿</span>
      </div>
      <span className="absolute -top-3 right-3 text-[16px]" style={{ color: GOLD }}>
        ✦
      </span>
    </div>
  )
}

export default function GiftBox({ data }: SectionProps) {
  const [open, setOpen] = useState(false)
  const gift = data.gift
  return (
    <section id="gift" className="relative px-4 pt-12 pb-10 text-center">
      <Reveal>
        <Heading>{gift.title}</Heading>
      </Reveal>
      <Reveal delay={100}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative mx-auto mt-8 block h-[290px] w-[300px] cursor-pointer"
          aria-label={`${gift.title} — ${gift.hint}`}
        >
          <GiftEnvelope className="left-[18px] top-[10px] -rotate-[14deg] transition-all duration-300 group-hover:-rotate-[19deg]" />
          <GiftEnvelope className="right-[14px] top-[40px] rotate-[12deg] transition-all duration-300 group-hover:rotate-[17deg]" />
        </button>
        <p className="mt-2 text-[14px] font-bold opacity-80">{gift.hint}</p>
      </Reveal>

      <Modal open={open} onClose={() => setOpen(false)} label={gift.title}>
        <Heading className="pr-6">{gift.title}</Heading>
        <div className="mt-6 space-y-6">
          {gift.qrCodes.map((qr) => (
            <div key={qr.label} className="flex flex-col items-center gap-2">
              <p className="text-[14px] uppercase tracking-wide">{qr.label}</p>
              <p className="text-[16px] font-bold">{qr.owner}</p>
              <img
                src={qr.image}
                alt={`Mã QR — ${qr.owner}`}
                className="h-[200px] w-[200px] rounded-[8px] border bg-white object-contain p-2"
                style={{ borderColor: 'rgba(81,20,25,0.2)' }}
              />
              <a
                href={qr.image}
                download
                className="rounded-full px-5 py-1.5 text-[13px] font-bold"
                style={{ backgroundColor: 'var(--color-primary)', color: '#ece4d8' }}
              >
                Lưu QR
              </a>
            </div>
          ))}
        </div>
      </Modal>
    </section>
  )
}
