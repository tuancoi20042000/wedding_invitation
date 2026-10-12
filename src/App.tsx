import { useEffect, useState } from 'react'
import Album from './components/invite/Album'
import DressCode from './components/invite/DressCode'
import GiftBox from './components/invite/GiftBox'
import Guestbook from './components/invite/Guestbook'
import Intro from './components/invite/Intro'
import Location from './components/invite/Location'
import PartyInfo from './components/invite/PartyInfo'
import SaveTheDate from './components/invite/SaveTheDate'
import { BODY_FONT } from './components/invite/shared'
import Timeline from './components/invite/Timeline'
import WeddingInfo from './components/invite/WeddingInfo'
import MusicPlayer from './components/MusicPlayer'
import { invitation } from './config/invitation'
import { withBase } from './lib/withBase'

const PAPER = withBase('/images/themes/red/paper.webp')

export default function App() {
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (opened) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [opened])

  const { groom, bride } = invitation.couple

  return (
    <main className="min-h-screen w-full" style={{ backgroundColor: '#f1e8dc' }}>
      <div
        className="relative isolate mx-auto w-full max-w-[720px] overflow-x-clip md:shadow-[0_0_40px_rgba(81,20,25,0.12)]"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-primary)',
          fontFamily: BODY_FONT,
        }}
      >
        {/* Paper texture multiplied over the whole card */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            backgroundImage: `url("${PAPER}")`,
            backgroundSize: '512px 512px',
            mixBlendMode: 'multiply',
            opacity: 0.5,
          }}
        />

        <SaveTheDate data={invitation} />
        <WeddingInfo data={invitation} />
        <Album data={invitation} />
        <PartyInfo data={invitation} />
        <Location data={invitation} />
        <DressCode data={invitation} />
        <Timeline data={invitation} />
        <Guestbook data={invitation} />
        <GiftBox data={invitation} />

        <p className="px-6 pb-10 text-center text-[14px]">{invitation.thankYou}</p>
        <footer
          className="border-t py-4 text-center text-[12px] opacity-70"
          style={{ borderColor: 'rgba(81,20,25,0.15)' }}
        >
          ♡ {groom.shortName} &amp; {bride.shortName}
        </footer>
      </div>

      <Intro data={invitation} open={opened} onOpen={() => setOpened(true)} />
      {opened && <MusicPlayer src={invitation.music.src} autoPlaySignal={opened} />}
    </main>
  )
}
