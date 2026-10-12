import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import useLightbox from '../../hooks/useLightbox'
import type { SectionProps } from '../../types'
import Reveal from '../ui/Reveal'
import { Heading } from './shared'

const VISIBLE = 6

export default function Album({ data }: SectionProps) {
  const images = data.gallery.images
  const { index, open, close, next, prev } = useLightbox(images.length)
  const active = index === null ? null : images[index]
  const closeRef = useRef<HTMLButtonElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (index === null) triggerRef.current?.focus()
    else closeRef.current?.focus()
  }, [index])

  if (images.length === 0) return null

  return (
    <section id="album" className="relative px-4 py-12">
      <Reveal>
        <Heading>{data.gallery.title}</Heading>
      </Reveal>
      <Reveal delay={100}>
        <div className="mt-7 grid grid-cols-2 gap-3">
          {images.slice(0, VISIBLE).map((image, i) => (
            <button
              key={image.url}
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget
                open(i)
              }}
              className="group relative aspect-[3/4] overflow-hidden rounded-[12px] border border-white shadow-[0_6px_16px_rgba(81,20,25,0.18)] cursor-zoom-in"
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {i === VISIBLE - 1 && images.length > VISIBLE && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-[34px] text-white">
                  +{images.length - VISIBLE}
                </span>
              )}
            </button>
          ))}
        </div>
      </Reveal>

      {active &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Xem ảnh"
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') close()
              if (e.key === 'ArrowRight') next()
              if (e.key === 'ArrowLeft') prev()
            }}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Đóng"
              className="absolute right-4 top-4 h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={prev}
              aria-label="Ảnh trước"
              className="absolute left-2 h-12 w-12 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 cursor-pointer"
            >
              ‹
            </button>
            <img
              src={active.url}
              alt={active.alt}
              className="max-h-[85vh] max-w-full rounded-[8px] object-contain"
            />
            <button
              type="button"
              onClick={next}
              aria-label="Ảnh sau"
              className="absolute right-2 h-12 w-12 rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 cursor-pointer"
            >
              ›
            </button>
            <div className="absolute bottom-4 text-sm text-white/70">
              {(index ?? 0) + 1} / {images.length}
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
