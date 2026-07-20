import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { catLabel } from '../lib/products'
import { getMaison, productsOfMaison } from '../lib/maisons'
import ProductCard from '../components/ProductCard'

/** One house's collection. */
export default function Maison() {
  const { id } = useParams()
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
      <header className="mx-auto max-w-6xl px-6 pt-8 lg:pt-12">
        {/* 面包屑，与目录页/详情页同一套（真店近乎人人都有，斜杠分隔）。
            原本是个孤零零的返回按钮，读者无从知道自己在哪一层 */}
        <nav aria-label="Breadcrumb" className="text-[10px] text-fog">
          <Link to="/" className="hover:text-ivory">
            Home
          </Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          <Link to="/maisons" className="hover:text-ivory">
            The Houses
          </Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          <span className="text-ivory">{maison.name}</span>
        </nav>
        <h1 className="font-lux mt-8 text-3xl leading-relaxed text-ivory lg:text-5xl">{maison.name}</h1>
        {/* flourish 挪到名字下面、正常大小写：留内容，去掉 eyebrow 那个 AI 排版签名 */}
        <p className="mt-2 text-[11px] text-fog">{maison.flourish}</p>
        <p className="mt-5 max-w-md text-[11px] leading-loose text-fog">{maison.story}</p>
        <p className="mt-6 text-[10px] text-fog">
          {catLabel(maison.category)}, {items.length} pieces
        </p>
      </header>

      <section className="mx-auto mt-14 max-w-6xl px-6 lg:mt-20">
        {/* 与目录页同一套网格。CSS 多列会把卡片劈到下一列去，且阅读顺序先竖后横 */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
