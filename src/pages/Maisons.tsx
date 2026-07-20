import { Link } from 'react-router-dom'
import { CATEGORIES, catLabel } from '../lib/products'
import { MAISONS, maisonHero, maisonCount } from '../lib/maisons'
import ProductImage from '../components/ProductImage'

/** The Houses (臻选之屋): browse by fictional maison, grouped under category. */
export default function Maisons() {
  return (
    <div className="pb-28">
      <header className="mx-auto max-w-6xl px-6 pt-8 lg:pt-12">
        <nav aria-label="Breadcrumb" className="text-[10px] text-fog">
          <Link to="/" className="hover:text-ivory">Home</Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          <span className="text-ivory">The Houses</span>
        </nav>
        <h1 className="font-lux mt-8 text-3xl leading-relaxed text-ivory lg:text-5xl">The Houses</h1>
        <p className="mt-5 max-w-md text-[11px] leading-loose text-fog">
          Every maison here is invented. None of them will ship you anything, but each does it in its own voice.
        </p>
      </header>

      {CATEGORIES.map((c) => {
        const houses = MAISONS.filter((m) => m.category === c.name)
        if (houses.length === 0) return null
        return (
          <section key={c.name} className="mt-20 lg:mt-28">
            <div className="mx-auto max-w-6xl px-6">
              {/* 全大写宽字距的小字是本站明令清掉的 eyebrow 签名；章节标题就该是个标题 */}
              <h2 className="font-lux text-lg text-ivory lg:text-2xl">{catLabel(c.name)}</h2>
            </div>
            <div className="mx-auto mt-8 grid max-w-6xl gap-x-8 gap-y-12 px-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
              {houses.map((m) => {
                const hero = maisonHero(m.id)
                return (
                  <Link key={m.id} to={`/maison/${m.id}`} className="group block">
                    {/* 3:4：全站藏品图统一的图录开本。这里原本是 4:3 横构图，
                        于是竖构图的商品照被拦腰切走上下（手柄和底座都没了，只剩中间一条） */}
                    <div className="overflow-hidden bg-panel">
                      {hero && (
                        <ProductImage
                          product={hero}
                          className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                          emojiClass="text-5xl"
                          plaque
                        />
                      )}
                    </div>
                    {/* flourish 从「标题上方的全大写小字」挪到名字下面、恢复正常大小写：
                        内容留着（它说明这家屋做什么），走的是那个 AI 排版签名 */}
                    <p className="font-lux mt-4 text-lg text-ivory">{m.name}</p>
                    <p className="mt-1 text-[10px] text-fog">{m.flourish}</p>
                    <p className="mt-2 max-w-xs text-[10px] leading-loose text-fog">{m.story}</p>
                    <p className="mt-3 text-[9px] tracking-wider text-fog">{maisonCount(m.id)} pieces</p>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
