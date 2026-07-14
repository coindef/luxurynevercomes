import { useState } from 'react'
import type { Product } from '../lib/types'

/** 商品图：真实照片；加载失败回退「拍卖图录展签」——分类丝绒渐变 + 细金线框 + emoji */
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
      <div className="pointer-events-none absolute inset-1.5 border border-gold/30" />
      <div className="flex flex-col items-center gap-1.5">
        <span className={`${emojiClass} drop-shadow-md`}>{product.emoji}</span>
        {plaque && fallback && (
          <span className="font-lux px-3 text-center text-[9px] leading-relaxed text-ivory/60">
            {product.name} · LOT №{product.id.replace(/\D/g, '') || '0'}
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
