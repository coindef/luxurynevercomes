import { useRef, useState } from 'react'
import type { Product } from '../lib/types'
import { captionOf, viewsOf } from '../lib/products'
import ProductImage from './ProductImage'

/**
 * 图录画廊：一件藏品的 2-3 个视角（全貌 / 另一角度 / 细节，随分类而定）。
 *
 * 主图区就是个原生 scroll-snap 横向容器——手机上白拿一个跟手的滑动，
 * 不用写手势代码，也不用引轮播库。缩略图既是导航也是当前位置指示器
 * （所以不另加圆点：一个功能一套控件就够了）。
 *
 * 只有一个视角（或没有照片）时，整套控件消失，退回单图/展签——
 * 一件藏品只有一张照片时，底下摆一排「1/1」的缩略图只是噪音。
 */
export default function ProductGallery({ product }: { product: Product }) {
  const views = viewsOf(product)
  const [active, setActive] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)

  const go = (i: number) => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
    setActive(i)
  }

  const single = views.length <= 1
  // 3:4 = 生成图的原始开本（525×700）。原本写死高度、宽度随栏宽走，
  // 于是容器比例随视口浮动，object-cover 就按当时的宽高比随手裁一刀
  const mainClass = 'aspect-[3/4] w-full'

  if (single) {
    return <ProductImage product={product} className={mainClass} emojiClass="emoji-float text-[96px]" plaque eager />
  }

  return (
    <div>
      <div
        ref={scroller}
        tabIndex={0}
        role="group"
        aria-label={`${product.name}, ${views.length} catalogue views`}
        onScroll={() => {
          const el = scroller.current
          if (el) setActive(Math.round(el.scrollLeft / el.clientWidth))
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(Math.min(views.length - 1, active + 1))
          if (e.key === 'ArrowLeft') go(Math.max(0, active - 1))
        }}
        className="flex snap-x snap-mandatory overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {views.map((_, i) => (
          <ProductImage
            key={i}
            product={product}
            view={i}
            eager={i === 0}
            className={`${mainClass} shrink-0 snap-center`}
            emojiClass="emoji-float text-[96px]"
          />
        ))}
      </div>

      {/* 缩略图：真实照片裸排不加框，当前项靠不透明度区分——留白即奢侈，选中态不靠描边 */}
      <div className="flex items-start gap-3 px-6 pt-4 lg:px-0">
        {views.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-current={i === active}
            aria-label={`View ${i + 1}: ${captionOf(product, i)}`}
            className="group shrink-0"
          >
            {/* 变淡的只能是图。整个按钮一起 opacity-40 的话，小字会被压到 ~1.9:1——
                对比度是硬红线，而且本站明令禁止在文字上叠透明度。选中态靠图，可读性靠文字自己的颜色 */}
            <ProductImage
              product={product}
              view={i}
              className={`aspect-[3/4] w-11 transition-opacity duration-500 [transition-timing-function:var(--ease-out-quart)] lg:w-12 ${
                i === active ? 'opacity-100' : 'opacity-45 group-hover:opacity-75'
              }`}
              emojiClass="text-lg"
            />
            <span
              className={`mt-1.5 block text-left text-[9px] leading-none ${i === active ? 'text-ivory' : 'text-fog'}`}
            >
              {captionOf(product, i)}
            </span>
          </button>
        ))}
      </div>

      {/* 本店签名：反承诺放最小字号（法务小字层级） */}
      <p className="px-6 pt-4 text-[8px] leading-relaxed text-fog lg:px-0">
        Photographed from {views.length === 3 ? 'three angles' : 'two angles'}. Undeliverable from all of them.
      </p>
    </div>
  )
}
