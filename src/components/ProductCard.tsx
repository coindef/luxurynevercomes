import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'
import { yuan } from '../lib/format'
import ProductImage from './ProductImage'

/** 编辑式商品卡：无边框无角标，图片裸排 + 小字说明（静奢） */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group mb-8 block break-inside-avoid">
      <div className="overflow-hidden">
        <ProductImage
          product={product}
          className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.03]"
          emojiClass="text-6xl"
          plaque
        />
      </div>
      <div className="pt-3 text-center">
        <p className="font-lux text-[13px] leading-snug text-ivory">
          {product.easterEgg && <span className="mr-1 text-gold">◆</span>}
          {product.name}
        </p>
        <p className="mt-1 line-clamp-1 text-[10px] leading-relaxed text-fog">{product.description}</p>
        <p className="font-price mt-1.5 text-xs text-ivory">{yuan(product.price)}</p>
        <p className="mt-0.5 text-[9px] tracking-wider text-fog/80">全球配额 3 件 · {product.sales}</p>
      </div>
    </Link>
  )
}
