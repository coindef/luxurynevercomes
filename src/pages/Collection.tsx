import { useEffect, useRef, useState } from 'react'
import { CATEGORIES, PRODUCTS, catLabel } from '../lib/products'
import ProductCard from '../components/ProductCard'

const PAGE_SIZE = 24

/** The full catalogue: category filter + infinite-scroll grid. */
export default function Collection() {
  const [category, setCategory] = useState<string | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

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

  const list = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS
  const shown = list.slice(0, visible)

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
        <h1 className="font-lux text-3xl leading-relaxed text-ivory lg:text-5xl">
          {category ? catLabel(category) : 'The Collection'}
        </h1>
        <p className="mt-4 text-[11px] text-fog">
          {list.length.toLocaleString('en-US')} pieces. Everything you can't afford, affordable here.
        </p>
      </header>

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
    </div>
  )
}
