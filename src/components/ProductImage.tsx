import { useState } from 'react'
import type { Product } from '../lib/types'

/**
 * 图录编号：由 id 稳定哈希得出，同一件藏品永远是同一号。
 * （旧写法从 id 里抽数字，但 id 全是纯字母，于是每件都是「LOT №0」。）
 */
function lotNo(id: string): string {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return String((h % 899) + 100)
}

/** 商品图：真实照片裸排（不加任何框）；加载失败才回退「拍卖图录展签」——丝绒渐变 + 细银线框 + emoji */
export default function ProductImage({
  product,
  className = '',
  emojiClass = 'text-5xl',
  plaque = false,
}: {
  product: Product
  className?: string
  emojiClass?: string
  /** 展签模式：兜底时附一行图录小字 */
  plaque?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const fallback = failed || !product.image

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${product.gradient} ${className}`}
    >
      {/* 细银线框只属于兜底展签；真实照片一律裸排，不加边框 */}
      {fallback && <div className="pointer-events-none absolute inset-1.5 border border-white/20" />}
      <div className="flex flex-col items-center gap-1.5">
        <span className={`${emojiClass} drop-shadow-md`}>{product.emoji}</span>
        {plaque && fallback && (
          <span className="font-lux px-3 text-center text-[9px] leading-relaxed text-[#e8e8e8]/75">
            {product.name}
            <br />
            LOT №{lotNo(product.id)}
          </span>
        )}
      </div>
      {product.image && !failed && (
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
