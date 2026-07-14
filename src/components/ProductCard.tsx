import { Link } from 'react-router-dom'
import type { Product } from '../lib/types'
import { yuan } from '../lib/format'
import ProductImage from './ProductImage'

/** 编辑式商品卡：无边框无角标，图片裸排，说明文字左对齐（静奢） */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group mb-12 block break-inside-avoid lg:mb-20">
      <div className="overflow-hidden bg-panel">
        <ProductImage
          product={product}
          className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03]"
          emojiClass="text-6xl"
          plaque
        />
      </div>
      <div className="pt-4">
        <p className="font-lux text-[13px] leading-snug text-ivory lg:text-[15px]">
          {product.easterEgg && <span className="mr-1 text-ivory">◆</span>}
          {product.name}
        </p>
        <p className="mt-1.5 line-clamp-1 text-[10px] leading-relaxed text-fog">{product.description}</p>
        <p className="font-price mt-2 text-[13px] text-ivory">{yuan(product.price)}</p>
        <p className="mt-1.5 text-[9px] leading-relaxed text-fog">全球配额 3 件，{product.sales}</p>
      </div>
    </Link>
  )
}
