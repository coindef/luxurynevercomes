import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'
import { yuan } from '../lib/format'
import ProductImage from './ProductImage'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="mb-3 block break-inside-avoid overflow-hidden border border-hairline bg-panel transition-colors hover:border-gold/40"
    >
      <div className="relative">
        <ProductImage product={product} className="h-44 w-full" emojiClass="text-6xl" plaque />
        <span className="absolute left-0 top-3 z-10 border-y border-r border-gold/50 bg-ink/80 px-2 py-0.5 text-[9px] tracking-widest text-gold">
          全球配额 3 件
        </span>
      </div>
      <div className="p-3">
        <p className="font-lux line-clamp-2 text-[13px] leading-snug text-ivory">
          {product.easterEgg && <span className="mr-1 text-gold">◆</span>}
          {product.name}
        </p>
        <p className="mt-1.5 line-clamp-1 text-[10px] leading-relaxed text-fog">{product.description}</p>
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className="font-price text-[15px] font-semibold text-gold">{yuan(product.price)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          {product.originalPrice && (
            <span className="font-price text-[10px] text-fog line-through">{yuan(product.originalPrice)}</span>
          )}
          <span className="text-[9px] text-fog">{product.sales}</span>
        </div>
      </div>
    </Link>
  )
}
