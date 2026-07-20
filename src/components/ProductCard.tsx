import { useState } from 'react'
import { useMoney } from '../lib/currency'
import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'
import { viewsOf } from '../lib/products'
import { maisonOf } from '../lib/maisons'
import { colourwayOf, materialOf } from '../lib/spec'
import ProductImage from './ProductImage'

/**
 * 编辑式商品卡：无边框无角标，图片裸排，说明文字左对齐（静奢）。
 * 间距由外层网格的 gap 决定，卡片自己不留 margin。
 *
 * 有第二个视角时，hover 缓慢交叉淡入到另一角度（图录翻页的感觉，不是弹跳）。
 * 第二张图**只在真的 hover 过之后才挂载**：触屏设备没有 hover，不该为它付流量；
 * 等 onLoad 之后才允许淡入，否则首次 hover 会「啪」地跳出来，而不是淡进来。
 */
export default function ProductCard({ product }: { product: Product }) {
  const money = useMoney()
  const maison = maisonOf(product)
  const alt = viewsOf(product)[1]
  const [seen, setSeen] = useState(false) // 第一次 hover 后就一直挂着，来回 hover 都有动画
  const [ready, setReady] = useState(false)
  const [hover, setHover] = useState(false)

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => {
        setSeen(true)
        setHover(true)
      }}
      onMouseLeave={() => setHover(false)}
    >
      <div className="overflow-hidden bg-panel">
        <div className="relative transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.03]">
          <ProductImage product={product} className="aspect-[3/4] w-full" emojiClass="text-5xl" plaque />
          {alt && seen && (
            <img
              src={alt}
              alt=""
              aria-hidden="true"
              loading="lazy"
              onLoad={() => setReady(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 [transition-timing-function:var(--ease-out-quart)] ${
                hover && ready ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
      </div>
      <div className="pt-4">
        {/* 真店的卡片下面只有三行：品牌 → 品名 → 价格，没别的
            （Net-a-Porter 的类名就叫 __designer / __name / __p）。
            我们的「品牌」是那家虚构的屋——它同时把每张卡片区分开了 */}
        <p className="truncate text-[10px] leading-relaxed text-fog">{maison.name}</p>
        {/* 固定两行高：品名有一行的也有两行的，不占住高度的话，
            同一排的价格就各在各的高度上，网格立刻显得没对齐（leading-snug = 1.375em/行） */}
        <p className="font-lux mt-1 line-clamp-2 min-h-[2.75em] text-[13px] leading-snug text-ivory lg:text-[15px]">
          {product.easterEgg && <span className="mr-1 text-ivory">◆</span>}
          {product.name}
        </p>
        <p className="font-price mt-1.5 text-[13px] text-ivory">{money(product.price)}</p>
        {/* Hermès / Cartier 在价格下面放的是这件商品**自己**的材质与色号，不是通用文案 */}
        <p className="mt-1.5 truncate text-[9px] leading-relaxed text-fog">
          {product.quota ? 'By quota only' : `${materialOf(product)}, ${colourwayOf(product)}`}
        </p>
      </div>
    </Link>
  )
}
