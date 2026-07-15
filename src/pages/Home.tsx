import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, SALON_PRODUCTS, catLabel } from '../lib/products'
import { MARQUEE_CITIES, SEARCH_PLACEHOLDERS, SLOGAN, SUB_SLOGAN, pick } from '../lib/copy'
import { yuan } from '../lib/format'
import { useRotating, useSeckillCountdown } from '../lib/hooks'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import EditorialImage from '../components/EditorialImage'

const WELCOME_KEY = 'flgj.welcomed'
const PAGE_SIZE = 24

/** Black-card ritual (the only dark moment on the site; fixed hex, silver not gold foil). */
function BlackCardModal({ onClose }: { onClose: () => void }) {
  const [opened, setOpened] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-8">
      <div className="pop-in w-full max-w-80 bg-white">
        {opened ? (
          <div className="float-up p-10">
            <p className="font-price text-5xl font-normal text-ivory">∞</p>
            <p className="font-lux mt-6 text-sm leading-loose text-ivory">
              Esteemed patron: your black card is active.
              <br />
              Limit: none. Valid: forever.
            </p>
            <p className="mt-3 text-[10px] leading-relaxed text-fog">Accepted here. Not that checkout will need it.</p>
            <button onClick={onClose} className="gold-cta mt-8 w-full py-3.5 text-xs tracking-[0.2em]">
              Take it, look around
            </button>
          </div>
        ) : (
          <div className="p-10">
            <div className="mb-8 flex h-32 w-full flex-col justify-end bg-[#141414] p-4 text-left">
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#c9c9c9]">Carte Noire</p>
              <p className="font-price mt-1 text-[11px] text-[#8f8f8f]">**** **** **** 0000</p>
            </div>
            <p className="font-lux text-sm text-ivory">A black card, prepared for you</p>
            <button onClick={() => setOpened(true)} className="gold-cta mt-6 w-full py-3.5 text-xs tracking-[0.2em]">
              Activate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/** Subscription ticker: one quiet line. */
function Marquee() {
  const lines = useMemo(
    () =>
      Array.from({ length: 8 }, () => {
        const m = pick(MARQUEE_CITIES)
        const p = pick([...PRODUCTS])
        const sec = 2 + Math.floor(Math.random() * 9)
        return `A patron in ${m.city} claimed ${p.name} at ${m.spot}, ${sec}s ago`
      }),
    [],
  )
  const line = useRotating(lines, 3400)

  return (
    <p className="mt-20 text-[10px] leading-relaxed text-fog lg:mt-28">
      <span key={line} className="float-up inline-block">
        {line}
      </span>
    </p>
  )
}

/** Today's Salon. */
function SalonPrive() {
  const countdown = useSeckillCountdown()

  return (
    <section className="mt-24 lg:mt-40">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-lux text-2xl text-ivory lg:text-4xl">Today's Salon</h2>
        <p className="mt-4 max-w-md text-[11px] leading-loose text-fog">
          The booking window closes in <span className="font-price text-ivory">{countdown}</span>. Every refresh, we
          quietly reserve it for you again.
        </p>
      </div>
      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [-webkit-overflow-scrolling:touch] lg:mx-auto lg:mt-16 lg:grid lg:max-w-6xl lg:grid-cols-3 lg:gap-14 lg:overflow-visible">
        {SALON_PRODUCTS.slice(0, 6).map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="group w-[82%] shrink-0 snap-center lg:w-auto">
            <div className="overflow-hidden bg-panel">
              <ProductImage
                product={p}
                className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                emojiClass="text-8xl"
                plaque
              />
            </div>
            <div className="pt-5">
              <p className="font-lux text-[15px] leading-snug text-ivory">{p.name}</p>
              <p className="font-price mt-2 text-[13px] text-ivory">{yuan(p.price)}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-fog">Waitlist at position 847. The queue does not move.</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { saved } = useStore()
  const toast = useToast()
  const placeholder = useRotating(SEARCH_PLACEHOLDERS, 3600)
  const [category, setCategory] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!localStorage.getItem(WELCOME_KEY)) setShowWelcome(true)
  }, [])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [category])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setVisible((v) => v + PAGE_SIZE),
      { rootMargin: '400px' },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  const closeWelcome = () => {
    localStorage.setItem(WELCOME_KEY, '1')
    setShowWelcome(false)
  }

  const list = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS
  const shown = list.slice(0, visible)

  return (
    <div className="pb-28">
      {showWelcome && <BlackCardModal onClose={closeWelcome} />}

      {/* Cinematic hero: one image fills the view, text steps down into an editorial bar */}
      <header>
        <img
          src="/img/lx-loire-chateau.jpg"
          alt="A château reflected in its moat"
          className="h-[68vh] w-full object-cover lg:h-[86vh]"
        />
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="font-lux mt-14 max-w-2xl text-[26px] leading-relaxed text-ivory lg:mt-20 lg:text-5xl lg:leading-[1.35]">
            {SLOGAN}
          </h1>
          <p className="mt-6 max-w-md text-[11px] leading-loose text-fog">{SUB_SLOGAN}</p>
          <button
            onClick={() => toast("Searching won't ship it either. Though your taste, clearly, is impeccable.")}
            className="quiet-link mt-8 block text-left text-[11px] text-fog transition-opacity hover:text-ivory"
          >
            <span key={placeholder} className="float-up">
              {placeholder}
            </span>
          </button>
          <Marquee />
        </div>
      </header>

      <SalonPrive />

      {/* The Houses: entry to browse by fictional maison */}
      <section className="mx-auto mt-24 max-w-6xl px-6 lg:mt-40">
        <h2 className="font-lux text-2xl text-ivory lg:text-4xl">The Houses</h2>
        <p className="mt-4 max-w-md text-[11px] leading-loose text-fog">
          Twenty-two maisons, none of them real. Browse by house, the way you would a boutique arcade.
        </p>
        <Link to="/maisons" className="quiet-link mt-6 inline-block text-[11px] tracking-[0.2em] text-ivory">
          Enter the houses
        </Link>
      </section>

      {/* Bespoke atelier: one handwork photo and a whisper */}
      <EditorialImage
        src="/img/ed-atelier.jpg"
        alt="An artisan's hands adjusting a movement in dim light"
        className="h-[46vh] lg:h-[64vh]"
      />
      <section className="mx-auto mt-14 max-w-6xl px-6 lg:mt-20">
        <p className="font-lux max-w-xl text-lg leading-loose text-ivory lg:text-2xl">
          The bespoke atelier is open: something made to the millimetre for you, being earnestly not made.
        </p>
        <Link
          to={`/product/${SALON_PRODUCTS[0]?.id ?? ''}`}
          className="quiet-link mt-6 inline-block text-[11px] tracking-[0.2em] text-ivory"
        >
          Book the atelier
        </Link>
      </section>

      {/* An empty vitrine: whitespace is the luxury, there is not even a product here */}
      <EditorialImage
        src="/img/ed-vitrine.jpg"
        alt="An empty stone hall, nothing displayed between the columns"
        caption="Our showroom. Empty, since nothing ships anyway."
      />

      {/* The Collection */}
      <section className="mt-24 lg:mt-40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-lux text-2xl text-ivory lg:text-4xl">{category ? catLabel(category) : 'The Collection'}</h2>
          <p className="mt-4 text-[11px] text-fog">Everything you can't afford, affordable here.</p>
        </div>

        {/* Category filter: plain text links, horizontally scrollable (no wrap on mobile) */}
        <nav className="mt-10 border-y border-hairline">
          <div className="mx-auto flex max-w-6xl gap-x-8 overflow-x-auto px-6 py-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setCategory(null)}
              className={`shrink-0 text-[11px] tracking-[0.2em] transition-colors ${
                category === null ? 'text-ivory' : 'text-fog hover:text-ivory'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(category === c.name ? null : c.name)}
                className={`shrink-0 whitespace-nowrap text-[11px] tracking-[0.2em] transition-colors ${
                  category === c.name ? 'text-ivory' : 'text-fog hover:text-ivory'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="mx-auto mt-12 max-w-6xl px-6 lg:mt-16">
          <div className="columns-2 gap-5 lg:columns-3 lg:gap-14">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div ref={sentinelRef} />
          {visible >= list.length && (
            <p className="py-16 text-[10px] tracking-[0.2em] text-fog">You've reached the bottom. The bottom is gold too.</p>
          )}
        </div>
      </section>

      {/* Persistent ledger badge (mobile; healing green, the only colour on the site) */}
      {saved > 0 && (
        <Link
          to="/me"
          className="fixed bottom-20 right-3 z-30 border border-jade/40 bg-ink px-3 py-2 text-[10px] font-semibold text-jade lg:hidden"
        >
          Kept safe: {yuan(saved)}
        </Link>
      )}
    </div>
  )
}
