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
      toast('Quota met. The salon associate gives you the first genuine smile of the day.')
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
        <Link to="/" className="gold-cta mt-1 px-10 py-2.5 text-sm tracking-widest">
          Go browse ›
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-36 lg:mx-auto lg:max-w-2xl">
      <header className="sticky top-0 z-30 border-b border-hairline bg-ink/95 px-4 py-3.5 backdrop-blur">
        <h1 className="font-lux text-base text-ivory">The Reserve</h1>
      </header>

      {/* 配货进度 */}
      <div className="mx-4 mt-10 border border-hairline bg-panel p-5 lg:mt-14">
        <p className="text-[10px] leading-relaxed text-fog">
          {gap > 0 ? (
            <>
              Quota progress: select another <span className="font-price font-semibold text-ivory">{yuan(gap)}</span>{' '}
              of scarves or objets to unlock reservation rights for the flagship bag.
              <span className="mt-1 block text-[9px] text-fog">Quota here is also ¥0.00, so earn it to your heart's content.</span>
            </>
          ) : (
            <span className="font-semibold text-jade">Quota met. Reservation rights for the flagship bag are unlocked, with a complimentary canvas tote (which, like the main item, does not ship).</span>
          )}
        </p>
        <div className="mt-4 h-px w-full bg-hairline">
          <div
            className={`h-px transition-all duration-700 ${progress >= 1 ? 'bg-jade' : 'bg-ivory'}`}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* 藏品清单 */}
      <div className="mx-4 mt-10 space-y-4 lg:mt-14">
        {rows.map(({ item, product }) => (
          <div key={item.key} className="border border-hairline bg-panel p-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggle(item.key)}
                className={`flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] ${
                  unchecked.has(item.key) ? 'border-hairline text-transparent' : 'border-ivory text-ivory'
                }`}
              >
                ✓
              </button>
              <Link to={`/product/${product!.id}`} className="shrink-0">
                <ProductImage product={product!} className="h-16 w-16" emojiClass="text-3xl" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="font-lux truncate text-xs text-ivory">{product!.name}</p>
                <p className="mt-1 text-[9px] text-fog">Hand-delivered by white-glove butler, never arrives</p>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="font-price text-sm font-semibold text-ivory">{yuan(product!.price)}</span>
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
              <div className="mt-3.5 border-t border-hairline pt-3">
                <p className="text-[8px] text-fog">
                  <span className="tracking-widest">BESPOKE</span> file, {Object.keys(item.customization).length} items
                </p>
                {Object.entries(item.customization).map(([k, v]) => (
                  <p key={k} className="mt-1 truncate text-[9px] text-fog">
                    {k.split('·')[0].trim()}: {v}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mx-4 mt-14 pb-8 text-[9px] tracking-widest text-fog lg:mt-20">The more you reserve, the more you keep. Reserve it all, keep it all.</p>

      {/* 结算栏 */}
      <div className="fixed bottom-12 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink px-4 py-3 lg:bottom-0 lg:max-w-2xl">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-price truncate text-base font-semibold text-ivory">{yuan(subtotal)}</p>
            <p className="text-[9px] font-semibold text-jade">This order keeps {yuan(subtotal)}</p>
          </div>
          <button
            onClick={() => {
              if (checkedRows.length === 0) {
                toast('Check at least one favorite first.')
                return
              }
              navigate('/checkout', { state: { keys: checkedRows.map((r) => r.item.key) } })
            }}
            className="gold-cta shrink-0 px-10 py-2.5 text-sm tracking-widest"
          >
            Checkout ({checkedRows.reduce((s, r) => s + r.item.qty, 0)})
          </button>
        </div>
      </div>
    </div>
  )
}
