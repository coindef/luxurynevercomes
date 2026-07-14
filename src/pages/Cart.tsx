import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProduct } from '../lib/products'
import { EMPTY_CART } from '../lib/copy'
import { yuan } from '../lib/format'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'

/** 配货门槛：满额解锁主袋认购资格（当然，配货也是 ¥0.00） */
const PEIHUO_THRESHOLD = 1_000_000

export default function Cart() {
  const { cart, setQty, removeFromCart } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const [unchecked, setUnchecked] = useState<Set<string>>(new Set())
  const prevSubtotal = useRef(0)

  const rows = cart
    .map((item) => ({ item, product: getProduct(item.productId) }))
    .filter((r) => r.product !== undefined)

  const checkedRows = rows.filter((r) => !unchecked.has(r.item.key))
  const subtotal = checkedRows.reduce((s, r) => s + r.product!.price * r.item.qty, 0)
  const progress = Math.min(subtotal / PEIHUO_THRESHOLD, 1)
  const gap = PEIHUO_THRESHOLD - subtotal

  useEffect(() => {
    if (prevSubtotal.current < PEIHUO_THRESHOLD && subtotal >= PEIHUO_THRESHOLD && prevSubtotal.current > 0) {
      toast('配货达成。柜姐对您露出了今天第一个真诚的微笑。')
    }
    prevSubtotal.current = subtotal
  }, [subtotal, toast])

  const toggle = (key: string) => {
    setUnchecked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  if (rows.length === 0) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-10 pb-20 text-center">
        <span className="text-5xl">🗝️</span>
        <p className="font-lux text-sm leading-relaxed text-fog">{EMPTY_CART}</p>
        <Link to="/" className="gold-cta mt-1 border border-gold px-8 py-2 text-sm tracking-widest text-gold">
          去逛逛 ›
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-36 lg:mx-auto lg:max-w-2xl">
      <header className="sticky top-0 z-30 border-b border-hairline bg-ink/95 px-4 py-3.5 backdrop-blur">
        <h1 className="font-lux text-base text-ivory">
          珍藏夹 <span className="tracking-maison ml-1 text-[9px] font-normal text-gold">La Collection</span>
        </h1>
      </header>

      {/* 配货进度 */}
      <div className="mx-4 mt-4 border border-hairline bg-panel p-3.5">
        <p className="text-[10px] leading-relaxed text-fog">
          {gap > 0 ? (
            <>
              配货进度：再选购 <span className="font-price font-semibold text-gold">{yuan(gap)}</span>{' '}
              的丝巾或摆件，即可解锁主袋认购资格。
              <span className="mt-0.5 block text-[9px] text-fog/70">本店配货同样 ¥0.00，请配个痛快。</span>
            </>
          ) : (
            <span className="font-semibold text-jade">配货达成 · 主袋认购资格已解锁 · 附赠帆布托特袋一只（与主商品一同不发货）</span>
          )}
        </p>
        <div className="mt-2.5 h-px w-full bg-hairline">
          <div
            className={`h-px transition-all duration-700 ${progress >= 1 ? 'bg-jade' : 'bg-gold'}`}
            style={{ width: `${progress * 100}%`, boxShadow: '0 0 6px currentColor' }}
          />
        </div>
      </div>

      {/* 藏品清单 */}
      <div className="mx-4 mt-4 space-y-3">
        {rows.map(({ item, product }) => (
          <div key={item.key} className="border border-hairline bg-panel p-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggle(item.key)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] ${
                  unchecked.has(item.key) ? 'border-hairline text-transparent' : 'border-gold text-gold'
                }`}
              >
                ✓
              </button>
              <Link to={`/product/${product!.id}`} className="shrink-0">
                <ProductImage product={product!} className="h-16 w-16" emojiClass="text-3xl" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="font-lux truncate text-xs text-ivory">{product!.name}</p>
                <p className="mt-0.5 text-[9px] text-fog">白手套管家亲送 · 永不达</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="font-price text-sm font-semibold text-gold">{yuan(product!.price)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => (item.qty <= 1 ? removeFromCart(item.key) : setQty(item.key, item.qty - 1))}
                      className="flex h-6 w-6 items-center justify-center border border-hairline text-fog"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-xs text-ivory">{item.qty}</span>
                    <button
                      onClick={() => setQty(item.key, item.qty + 1)}
                      className="flex h-6 w-6 items-center justify-center border border-hairline text-fog"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {item.customization && Object.keys(item.customization).length > 0 && (
              <div className="mt-2.5 border-t border-hairline pt-2">
                <p className="text-[8px] tracking-widest text-gold">BESPOKE · 定制档案 {Object.keys(item.customization).length} 项</p>
                {Object.entries(item.customization).map(([k, v]) => (
                  <p key={k} className="mt-0.5 truncate text-[9px] text-fog">
                    {k.split('·')[0].trim()} — {v}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="py-5 text-center text-[9px] tracking-widest text-fog/70">多买多守，全买全守</p>

      {/* 结算栏 */}
      <div className="fixed bottom-12 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink px-4 py-3 lg:bottom-0 lg:max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-price truncate text-base font-semibold text-gold">{yuan(subtotal)}</p>
            <p className="text-[9px] font-semibold text-jade">这一单，守住 {yuan(subtotal)}</p>
          </div>
          <button
            onClick={() => {
              if (checkedRows.length === 0) {
                toast('先勾选一件心头好。')
                return
              }
              navigate('/checkout', { state: { keys: checkedRows.map((r) => r.item.key) } })
            }}
            className="gold-cta shrink-0 border border-gold px-8 py-2.5 text-sm tracking-widest text-goldlit"
          >
            去结算 ({checkedRows.reduce((s, r) => s + r.item.qty, 0)})
          </button>
        </div>
      </div>
    </div>
  )
}
