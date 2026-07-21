import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { maisonOf } from '../lib/maisons'
import { useStore } from '../lib/store'
import ProductImage from '../components/ProductImage'
import type { Product } from '../lib/types'

/**
 * 展柜：你「拥有」的一切，按私人博物馆的方式挂墙。
 * 藏家有包房、表房、私人美术馆——这里当然也给一间，藏品照例都不在场。
 * 数据全部派生自订单（OrderItem 内嵌完整 Product 快照），零新增存储。
 * 同一件的不同定制各占一席：刻的字是全流程唯一真实之物，不许合并丢失。
 */
interface Piece {
  product: Product
  acquiredAt: number
  engraving?: string
}

export default function Vitrine() {
  const { orders } = useStore()

  const pieces = useMemo(() => {
    const seen = new Map<string, Piece>()
    // 从最早的订单起收：Acquired 日期取首次入藏
    for (const o of [...orders].sort((a, b) => a.createdAt - b.createdAt)) {
      for (const it of o.items) {
        const custom = it.customization ? Object.values(it.customization).join(', ') : ''
        const key = `${it.product.id}|${custom}`
        if (!seen.has(key)) {
          seen.set(key, { product: it.product, acquiredAt: o.createdAt, engraving: custom || undefined })
        }
      }
    }
    return [...seen.values()].reverse()
  }, [orders])

  if (pieces.length === 0) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-5 px-10 pb-20 text-center">
        <p className="font-lux max-w-sm text-sm leading-loose text-fog">
          The vitrine is empty, which curators call potential. Your first acquisition hangs here the moment you make it.
        </p>
        <Link to="/collection" className="gold-cta mt-1 px-10 py-2.5 text-sm tracking-widest">
          Acquire something ›
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-28 lg:mx-auto lg:max-w-6xl">
      <header className="px-6 pt-8 lg:pt-12">
        <nav aria-label="Breadcrumb" className="text-[10px] text-fog">
          <Link to="/" className="hover:text-ivory">Home</Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          <span className="text-ivory">The Vitrine</span>
        </nav>
        <h1 className="font-lux mt-8 text-3xl leading-relaxed text-ivory lg:text-4xl">The Vitrine</h1>
        <p className="mt-3 max-w-md text-[11px] leading-loose text-fog">
          {pieces.length === 1 ? 'One piece' : `${pieces.length} pieces`} in the private collection. On view: nowhere,
          permanently.
        </p>
      </header>

      <section className="mt-12 px-6 lg:mt-16">
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
          {pieces.map((pc) => (
            <Link key={pc.product.id + (pc.engraving ?? '')} to={`/product/${pc.product.id}`} className="group block">
              <div className="overflow-hidden bg-panel">
                <ProductImage
                  product={pc.product}
                  className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  emojiClass="text-5xl"
                  plaque
                />
              </div>
              {/* 馆签：裸排左对齐（真实照片不加框，细银线框只属于兜底展签） */}
              <div className="pt-4">
                <p className="truncate text-[10px] text-fog">{maisonOf(pc.product).name}</p>
                <p className="font-lux mt-1 text-[13px] leading-snug text-ivory">{pc.product.name}</p>
                <p className="mt-1.5 text-[9px] text-fog">
                  Acquired {new Date(pc.acquiredAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
                {pc.engraving && (
                  <p className="mt-1 truncate text-[9px] italic text-ivory">
                    Bespoke: {pc.engraving.split(', ').map((v) => v.split('·')[0].trim()).join(', ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-20 px-6 text-[9px] leading-loose text-fog lg:mt-28">
        Admission by appointment. The appointment is with yourself, and you are always free.
      </p>
    </div>
  )
}
