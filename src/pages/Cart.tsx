import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProduct } from '../lib/products'
import { EMPTY_CART } from '../lib/copy'
import { yuan } from '../lib/format'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'
import { IconKey } from '../components/icons'

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
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-5 px-10 pb-20 text-center">
        <IconKey size={44} className="text-fog" />
        <p className="font-lux text-sm leading-relaxed text-fog">{EMPTY_CART}</p>
        <Link to="/" className="gold-cta mt-1 px-10 py-2.5 text-sm tracking-widest">
          Go browse ›
        </Link>
      </div>
    )
  }

  const goCheckout = () => {
    if (checkedRows.length === 0) {
      toast('Check at least one favorite first.')
      return
    }
    navigate('/checkout', { state: { keys: checkedRows.map((r) => r.item.key) } })
  }
  const checkedCount = checkedRows.reduce((s, r) => s + r.item.qty, 0)

  return (
    <div className="pb-36 lg:mx-auto lg:max-w-3xl lg:pb-24">
      {/* 编辑式页头：与目录/详情同一套。此前是 app 式贴顶小条 + 一路镶边的面板盒——
          全站的分隔语言是发丝线，盒子是那个被清过的装饰 */}
      <header className="px-6 pt-8 lg:px-0 lg:pt-12">
        <nav aria-label="Breadcrumb" className="text-[10px] text-fog">
          <Link to="/" className="hover:text-ivory">Home</Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          <span className="text-ivory">The Reserve</span>
        </nav>
        <h1 className="font-lux mt-8 text-3xl leading-relaxed text-ivory lg:text-4xl">The Reserve</h1>
        <p className="mt-3 text-[11px] leading-relaxed text-fog">
          {rows.length === 1 ? 'One piece, held' : `${rows.length} pieces, held`} under your name. Held is the safest
          place anything has ever been.
        </p>
      </header>

      {/* 配货进度：文字 + 一根极细进度线（与详情页配货块同语言），不装盒 */}
      <section className="mx-6 mt-12 border-t border-hairline pt-8 lg:mx-0 lg:mt-16">
        <p className="max-w-md text-[10px] leading-relaxed text-fog">
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
      </section>

      {/* 藏品清单：发丝线行，不再一件一个镶边盒 */}
      <section className="mx-6 mt-12 lg:mx-0 lg:mt-16">
        {rows.map(({ item, product }) => (
          <div key={item.key} className="border-t border-hairline py-5 last:border-b">
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggle(item.key)}
                aria-label={unchecked.has(item.key) ? 'Include this piece' : 'Set this piece aside'}
                className={`flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] ${
                  unchecked.has(item.key) ? 'border-hairline text-transparent' : 'border-ivory text-ivory'
                }`}
              >
                ✓
              </button>
              <Link to={`/product/${product!.id}`} className="shrink-0">
                <ProductImage product={product!} className="aspect-[3/4] w-14 shrink-0" emojiClass="text-2xl" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="font-lux truncate text-xs text-ivory">{product!.name}</p>
                <p className="mt-1 text-[9px] text-fog">Hand-delivered by white-glove butler, never arrives</p>
                {item.customization && Object.keys(item.customization).length > 0 && (
                  <p className="mt-1 truncate text-[9px] text-fog">
                    <span className="tracking-widest">BESPOKE</span>{' '}
                    {Object.entries(item.customization)
                      .map(([k, v]) => `${k.split('·')[0].trim()}: ${v.split('·')[0].trim()}`)
                      .join(', ')}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="font-price text-sm font-semibold text-ivory">{yuan(product!.price)}</p>
                <div className="mt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => (item.qty <= 1 ? removeFromCart(item.key) : setQty(item.key, item.qty - 1))}
                    aria-label="One fewer"
                    className="flex h-6 w-6 items-center justify-center border border-hairline text-fog"
                  >
                    −
                  </button>
                  <span className="w-5 text-center text-xs text-ivory">{item.qty}</span>
                  <button
                    onClick={() => setQty(item.key, item.qty + 1)}
                    aria-label="One more"
                    className="flex h-6 w-6 items-center justify-center border border-hairline text-fog"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <p className="mx-6 mt-10 text-[9px] tracking-widest text-fog lg:mx-0 lg:mt-12">The more you reserve, the more you keep. Reserve it all, keep it all.</p>

      {/* 结算：桌面收进版心（编辑页面不悬浮工具条），手机保留吸底（离拇指近是 app 的好习惯） */}
      <div className="mx-6 mt-12 hidden items-center justify-between gap-3 border-t border-hairline pt-6 lg:mx-0 lg:flex">
        <div className="min-w-0">
          <p className="font-price truncate text-lg font-semibold text-ivory">{yuan(subtotal)}</p>
          <p className="text-[9px] font-semibold text-jade">This order keeps {yuan(subtotal)}</p>
        </div>
        <button onClick={goCheckout} className="gold-cta shrink-0 px-10 py-2.5 text-sm tracking-widest">
          Checkout ({checkedCount})
        </button>
      </div>
      <div className="fixed bottom-12 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink px-6 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-price truncate text-base font-semibold text-ivory">{yuan(subtotal)}</p>
            <p className="text-[9px] font-semibold text-jade">This order keeps {yuan(subtotal)}</p>
          </div>
          <button onClick={goCheckout} className="gold-cta shrink-0 px-10 py-2.5 text-sm tracking-widest">
            Checkout ({checkedCount})
          </button>
        </div>
      </div>
    </div>
  )
}
