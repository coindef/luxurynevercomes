import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { catLabel } from '../lib/products'
import { getMaison, productsOfMaison } from '../lib/maisons'
import ProductCard from '../components/ProductCard'

/** One house's collection. */
export default function Maison() {
  const { id } = useParams()
  const navigate = useNavigate()
  const maison = getMaison(id ?? '')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!maison) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-fog">
        <p className="font-lux text-sm text-ivory">This house is even less real than the others.</p>
        <Link to="/maisons" className="quiet-link text-xs text-ivory">
          Back to the houses
        </Link>
      </div>
    )
  }

  const items = productsOfMaison(maison.id)

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
        <button onClick={() => navigate('/maisons')} className="quiet-link text-[10px] tracking-[0.2em] text-fog">
          The Houses
        </button>
        <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-fog">{maison.flourish}</p>
        <h1 className="font-lux mt-2 text-3xl leading-relaxed text-ivory lg:text-5xl">{maison.name}</h1>
        <p className="mt-5 max-w-md text-[11px] leading-loose text-fog">{maison.story}</p>
        <p className="mt-6 text-[10px] tracking-wider text-fog">
          {catLabel(maison.category)} · {items.length} pieces
        </p>
      </header>

      <section className="mx-auto mt-14 max-w-6xl px-6 lg:mt-20">
        {/* 与目录页同一套网格。CSS 多列会把卡片劈到下一列去，且阅读顺序先竖后横 */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
