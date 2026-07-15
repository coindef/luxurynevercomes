import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, catLabel, getProduct } from '../lib/products'
import { MARQUEE_CITIES, SEARCH_PLACEHOLDERS, SLOGAN, SUB_SLOGAN, pick } from '../lib/copy'
import { MAISONS } from '../lib/maisons'
import { yuan } from '../lib/format'
import { useRotating, useSeckillCountdown } from '../lib/hooks'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import EditorialImage from '../components/EditorialImage'

const WELCOME_KEY = 'flgj.welcomed'
const PAGE_SIZE = 24

/** Salon showcase: the dearest photographed piece per category, so the strip is all real photos. */
const SHOWCASE_IDS = [
  'lx-superyacht-76',
  'lx-himalaya-croc',
  'lx-lily-corner',
  'lx-emerald-garden',
  'lx-vintage-racer',
  'lx-bridal-couture',
]

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

/** Live subscription ticker, one quiet rotating line. `tone` styles it for light or dark ground. */
function Ticker({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
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
    <p className={`truncate text-[10px] leading-relaxed ${tone === 'light' ? 'text-white/60' : 'text-fog'}`}>
      <span key={line} className="float-up inline-block max-w-full truncate align-bottom">
        {line}
      </span>
    </p>
  )
}

/** Today's Salon: a tight showcase of photographed flagships. */
function SalonPrive() {
  const countdown = useSeckillCountdown()
  const items = SHOWCASE_IDS.map(getProduct).filter(Boolean)

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
        {items.map((p) => (
          <Link key={p!.id} to={`/product/${p!.id}`} className="group w-[82%] shrink-0 snap-center lg:w-auto">
            <div className="overflow-hidden bg-panel">
              <ProductImage
                product={p!}
                className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                emojiClass="text-8xl"
                plaque
              />
            </div>
            <div className="pt-5">
              <p className="font-lux text-[15px] leading-snug text-ivory">{p!.name}</p>
              <p className="font-price mt-2 text-[13px] text-ivory">{yuan(p!.price)}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-fog">Waitlist at position 847. The queue does not move.</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/** The Houses: a typographic directory of the fictional maisons (no image clutter). */
function HousesDirectory() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6 lg:mt-40">
      <div className="flex items-baseline justify-between">
        <h2 className="font-lux text-2xl text-ivory lg:text-4xl">The Houses</h2>
        <Link to="/maisons" className="quiet-link text-[11px] tracking-[0.2em] text-ivory">
          All 22
        </Link>
      </div>
      <p className="mt-4 max-w-md text-[11px] leading-loose text-fog">
        Twenty-two maisons, none of them real. Browse by house, the way you would a boutique arcade.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-hairline pt-8 lg:grid-cols-3 lg:gap-x-14">
        {MAISONS.map((m) => (
          <Link key={m.id} to={`/maison/${m.id}`} className="group block">
            <p className="text-[8px] uppercase tracking-[0.2em] text-fog">{m.flourish}</p>
            <p className="font-lux mt-1 text-[15px] leading-snug text-ivory transition-opacity group-hover:opacity-60">
              {m.name}
            </p>
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

      {/* Cinematic hero: an empty grand gallery, the showroom for a store that ships nothing.
          The photograph IS the design; headline and CTA overlaid so the fold communicates. */}
      <header className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-black">
        <img
          src="/img/ed-hero.jpg"
          alt="An empty baroque gallery, checkered marble receding to a distant door"
          className="absolute inset-0 h-full w-full object-cover [filter:grayscale(0.5)_contrast(1.05)_brightness(0.94)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/15" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-6 pb-14 lg:pb-20">
            <p className="tracking-maison text-[10px] text-white/60">Maison Zéro</p>
            <h1 className="font-lux mt-4 max-w-3xl text-[30px] leading-[1.25] text-white lg:text-[64px] lg:leading-[1.1]">
              {SLOGAN}
            </h1>
            <p className="mt-5 max-w-md text-[11px] leading-loose text-white/70 lg:text-[13px]">{SUB_SLOGAN}</p>
            <button
              onClick={() => toast("Searching won't ship it either. Though your taste, clearly, is impeccable.")}
              className="mt-8 flex w-full max-w-sm items-center gap-2 border-b border-white/40 pb-2 text-left text-[11px] text-white/70 transition-colors hover:border-white hover:text-white"
            >
              <span>⌕</span>
              <span key={placeholder} className="float-up truncate">
                {placeholder}
              </span>
            </button>
            <div className="mt-10 max-w-md">
              <Ticker tone="light" />
            </div>
          </div>
        </div>
      </header>

      <HousesDirectory />

      <SalonPrive />

      {/* One editorial break: an artisan's hands, the single human touch on the page */}
      <EditorialImage
        src="/img/ed-atelier.jpg"
        alt="An artisan's hands adjusting a movement in dim light"
        className="mt-24 h-[46vh] lg:mt-40 lg:h-[62vh]"
      />
      <section className="mx-auto mt-14 max-w-6xl px-6 lg:mt-20">
        <p className="font-lux max-w-xl text-lg leading-loose text-ivory lg:text-2xl">
          The bespoke atelier is open: something made to the millimetre for you, being earnestly not made.
        </p>
        <Link
          to={`/product/${SHOWCASE_IDS[1]}`}
          className="quiet-link mt-6 inline-block text-[11px] tracking-[0.2em] text-ivory"
        >
          Book the atelier
        </Link>
      </section>

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
