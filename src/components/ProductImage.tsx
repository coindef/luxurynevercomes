import { useState } from 'react'
import type { Product } from '../lib/types'
import { viewsOf } from '../lib/products'

/**
 * 图录编号：由 id 稳定哈希得出，同一件藏品永远是同一号。
 * （旧写法从 id 里抽数字，但 id 全是纯字母，于是每件都是「LOT №0」。）
 */
function lotNo(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return String((h % 899) + 100)
}

/** 商品图：真实照片裸排（不加任何框）；无图或加载失败才回退「拍卖图录展签」——丝绒渐变 + 细银线框 + emoji */
export default function ProductImage({
  product,
  className = '',
  emojiClass = 'text-5xl',
  plaque = false,
  view = 0,
  eager = false,
}: {
  product: Product
  className?: string
  emojiClass?: string
  /** 展签模式：兜底时附一行图录小字 */
  plaque?: boolean
  /** 第几个图录视角（0 = 主图）。越界就当没图，回退展签 */
  view?: number
  /** 首屏大图别偷懒加载 */
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  // 有没有图是 manifest 说了算，不靠 <img> 撞 404 去试（见 products.ts 的 viewsOf）
  const src = viewsOf(product)[view]
  const fallback = failed || !src

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${product.gradient} ${className}`}>
      {/* 细发丝线只属于兜底展签；真实照片一律裸排，不加边框 */}
      {fallback && <div className="pointer-events-none absolute inset-1.5 border border-black/[0.07]" />}
      <div className="flex flex-col items-center gap-2">
        {/* emoji 去色：全站只有一个颜色（绿），一格粉色小包会把冷调单色体系戳个洞。
            它是占位图，不是插画 */}
        <span className={`${emojiClass} opacity-45 grayscale`}>{product.emoji}</span>
        {plaque && fallback && (
          <span className="font-lux px-3 text-center text-[9px] leading-relaxed text-fog">
            {product.name}
            <br />
            LOT №{lotNo(product.id)}
          </span>
        )}
      </div>
      {src && !failed && (
        <img
          src={src}
          alt={product.name}
          loading={eager ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
