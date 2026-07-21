import { useEffect, useMemo, useRef, useState } from 'react'
import { useMoney } from '../lib/currency'
import { Link, useLocation } from 'react-router-dom'
import type { CustomGroup, Order, OrderItem } from '../lib/types'
import { getProduct } from '../lib/products'
import { customFor } from '../lib/bespoke'
import { BESPOKE, SOOTHING_BY_URGE, SOOTHING_GENERIC, URGE_CHIPS, pick } from '../lib/copy'
import { orderNo } from '../lib/format'
import { useCountUp } from '../lib/hooks'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'
import { IconReceipt } from '../components/icons'

const ADDRESSES = ['Hillside villa (the one in your heart)', 'Yacht berth No. 3 (a conceptual berth)', 'Just deliver it to my heart']
const DELIVERY = [
  { name: 'Hand-delivered by white-glove butler', note: 'never arrives', fee: '¥0' },
  { name: 'Direct by private jet', note: 'awaiting good weather', fee: '+¥0' },
]

// 银箔碎屑，不是彩色 emoji（🥂/✨ 满色，戳穿冷调单色）。设计文档写的就是「银箔彩带」。
// 深色浮层上的箔色用银不用金：#c9c9c9 / #e8e8e8（见 CLAUDE.md）
const CONFETTI_FOIL = ['#e8e8e8', '#c9c9c9', '#f4f4f4']

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        color: CONFETTI_FOIL[i % CONFETTI_FOIL.length],
        left: Math.random() * 90 + 5,
        delay: Math.random() * 1.2,
        w: 3 + Math.random() * 3,
        h: 8 + Math.random() * 8,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, width: p.w, height: p.h, background: p.color }}
        />
      ))}
    </div>
  )
}

function SavedFlip({ total }: { total: number }) {
  const money = useMoney()
  const [flipped, setFlipped] = useState(false)
  const counted = useCountUp(flipped ? total : 0, 1600)

  useEffect(() => {
    const id = setTimeout(() => setFlipped(true), 1000)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="text-center">
      {flipped ? (
        <p className="font-price float-up text-3xl font-bold text-jade">
          +{money(counted)}
          <span className="mt-1.5 block text-[10px] font-normal tracking-widest text-jade/90">Deposited to your down-payment book</span>
        </p>
      ) : (
        <p className="font-price text-3xl font-bold text-fog">-{money(0)}</p>
      )}
    </div>
  )
}

/** 小票上的定制块：加价与减免互相抵消，像极了生活 */
function ReceiptBespoke({ item }: { item: OrderItem }) {
  const money = useMoney()
  if (!item.customization) return null
  // 必须和详情页用同一个查找（customFor = 子品类优先）。
  // 这里曾经直接查 CATEGORY_CUSTOM[分类]，于是 978/1009 件商品的定制在小票上
  // 一条都对不上 label，加价全部解析成 0——
  // 「加价合计 +¥0.00 / 减免 -¥0.00 /（这一行抵消了上一行，像极了生活）」抵消了个寂寞。
  // 全站的签名笑点就这么在线上死了 97%。
  const groups: CustomGroup[] = customFor(item.product)
  const rows = Object.entries(item.customization).map(([label, v]) => {
    const g = groups.find((x) => x.label === label)
    const surcharge = g?.type === 'text' ? (g.choices?.[0]?.surcharge ?? 0) : (g?.choices?.find((c) => c.name === v)?.surcharge ?? 0)
    return { label: label.split('·')[0].trim(), v, surcharge }
  })
  const total = rows.reduce((s, r) => s + r.surcharge, 0)

  return (
    <div className="mt-1 border-l border-hairline pl-2 text-[9px] leading-relaxed text-fog">
      <p className="tracking-widest text-ivory">{BESPOKE.receiptHeader}</p>
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-2">
          <span className="truncate">
            {r.label}: {r.v.length > 10 ? `${r.v.slice(0, 10)}…` : r.v}
          </span>
          <span className="font-price shrink-0">+{money(r.surcharge)}</span>
        </div>
      ))}
      <div className="flex justify-between"><span>Bespoke surcharge total</span><span className="font-price">+{money(total)}</span></div>
      <div className="flex justify-between"><span>Bespoke surcharge waiver</span><span className="font-price">-{money(total)}</span></div>
      <p className="text-fog">(This line cancels the one above, much like life.)</p>
    </div>
  )
}

function SuccessView({ order }: { order: Order }) {
  const money = useMoney()
  const soothing = useMemo(
    () => (order.urge && SOOTHING_BY_URGE[order.urge]) || pick(SOOTHING_GENERIC),
    [order.urge],
  )
  const hasBespoke = order.items.some((i) => i.customization && Object.keys(i.customization).length > 0)

  return (
    <div className="relative min-h-dvh pb-24 lg:mx-auto lg:max-w-xl">
      <Confetti />
      <div className="px-6 pt-20 text-center">
        <div className="pop-in mx-auto flex h-16 w-16 items-center justify-center border border-hairline text-2xl text-jade">
          ✓
        </div>
        <h1 className="font-lux mt-8 text-lg text-ivory">Payment successful. Paid {money(0)}</h1>
        <p className="mt-2.5 text-[10px] tracking-wider text-fog">The money didn't move. The prestige arrived.</p>
        <div className="mt-10">
          <SavedFlip total={order.total} />
        </div>
      </div>

      {/* 小票 */}
      <div className="mx-6 mt-20 border border-dashed border-hairline bg-panel p-5 text-[10px] leading-relaxed text-fog lg:mt-28">
        <p className="font-price">{orderNo(order.createdAt)}</p>
        <div className="my-3 border-t border-dashed border-hairline" />
        {order.items.map((it) => (
          <div key={it.product.id + JSON.stringify(it.customization ?? {})} className="py-1">
            <div className="flex justify-between gap-2">
              <span className="font-lux truncate text-ivory/90">
                <span className="grayscale">{it.product.emoji}</span> {it.product.name}
              </span>
              <span className="shrink-0">×{it.qty}</span>
            </div>
            <ReceiptBespoke item={it} />
          </div>
        ))}
        <div className="my-3 border-t border-dashed border-hairline" />
        {/* 收银机严肃地算出「找零 0.00」——全店最干的一次复述 */}
        <div className="flex justify-between"><span>Total</span><span className="font-price">{money(order.total)}</span></div>
        <div className="flex justify-between"><span>Paid</span><span className="font-price">{money(0)}</span></div>
        <div className="flex justify-between"><span>Change due</span><span className="font-price">{money(0)}</span></div>
        <div className="my-3 border-t border-dashed border-hairline" />
        <div className="flex justify-between gap-3">
          <span className="shrink-0">Delivery method</span>
          <span className="text-right">{order.delivery ?? 'Hand-delivered by white-glove butler'} (never arrives)</span>
        </div>
        {order.giftWrap && (
          <div className="mt-1 flex justify-between">
            <span>Gift wrapping</span>
            <span>House box, ribbon, wax seal, complimentary</span>
          </div>
        )}
        <div className="mt-1 flex justify-between gap-3">
          <span className="shrink-0">Estimated delivery</span>
          <span className="text-right">
            {order.delivery?.includes('jet')
              ? 'Awaiting good weather (the standard for good weather is set by the captain)'
              : 'The butler has departed and will remain departed'}
          </span>
        </div>
        <div className="my-3 border-t border-dashed border-hairline" />
        <p>Prepared for Client No. 1 of 1. All our attention, undivided by arithmetic.</p>
      </div>

      {hasBespoke && (
        <p className="font-lux mx-6 mt-10 text-[10px] leading-relaxed text-ivory">{BESPOKE.successLine}</p>
      )}

      {/* 安抚语（治愈绿） */}
      <div className="mx-6 mt-10 border-l border-hairline pl-5">
        {order.urge && <p className="mb-2 text-[9px] tracking-wider text-jade/70">The order placed for "{order.urge}"</p>}
        <p className="font-lux text-xs leading-relaxed text-jade">{soothing}</p>
      </div>

      <div className="mx-6 mt-16 flex gap-3 lg:mt-24">
        <Link
          to="/orders"
          className="flex-1 border border-hairline py-2.5 text-center text-xs tracking-widest text-fog hover:border-ivory hover:text-ivory"
        >
          View butler updates (he will not come)
        </Link>
        <Link
          to="/"
          className="gold-cta flex-1 py-3 text-center text-xs font-semibold tracking-widest"
        >
          Get rich again
        </Link>
      </div>
    </div>
  )
}

export default function Checkout() {
  const money = useMoney()
  const { cart, removeFromCart, placeOrder } = useStore()
  const location = useLocation()
  const toast = useToast()
  const [address, setAddress] = useState(ADDRESSES[2])
  const [deliveryIdx, setDelivery] = useState(0)
  const [giftWrap, setGiftWrap] = useState(false)
  const [urge, setUrge] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const payTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const doneRef = useRef(false)

  const stateKeys = (location.state as { keys?: string[] } | null)?.keys
  const lines = cart
    .filter((i) => !stateKeys || stateKeys.includes(i.key))
    .flatMap((i) => {
      const product = getProduct(i.productId)
      return product ? [{ key: i.key, product, qty: i.qty, customization: i.customization }] : []
    })

  const subtotal = lines.reduce((s, r) => s + r.product.price * r.qty, 0)
  const originalTotal = lines.reduce((s, r) => s + (r.product.originalPrice ?? r.product.price) * r.qty, 0)
  const priveOff = originalTotal - subtotal

  // 「按什么都行，一切都会成功」必须是真的：点浮层或敲任意键都立即放行。
  // 等待拉长到 2.8s，让那句话来得及被读到、被相信、被验证
  const finalize = () => {
    if (payTimer.current) clearTimeout(payTimer.current)
    payTimer.current = null
    if (doneRef.current) return
    doneRef.current = true
    const items: OrderItem[] = lines.map((r) => ({ product: r.product, qty: r.qty, customization: r.customization }))
    const created = placeOrder(items, subtotal, { urge: urge ?? undefined, giftWrap, delivery: DELIVERY[deliveryIdx].name })
    lines.forEach((r) => removeFromCart(r.key))
    setPaying(false)
    setOrder(created)
  }
  const pay = () => {
    doneRef.current = false
    setPaying(true)
    payTimer.current = setTimeout(finalize, 2800)
  }

  useEffect(() => {
    if (!paying) return
    const h = () => finalize()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paying])

  if (order) return <SuccessView order={order} />

  if (lines.length === 0) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 pb-20 text-fog">
        <IconReceipt size={40} className="text-fog" />
        <p className="font-lux text-sm">Nothing to check out. Prestige is free, come anytime.</p>
        <Link to="/" className="quiet-link text-sm text-ivory">Back to the hall ›</Link>
      </div>
    )
  }


  return (
    <div className="pb-32 lg:mx-auto lg:max-w-3xl lg:pb-24">
      {/* 编辑式页头：与目录/详情同一套（面包屑 + 大衬线标题），不再是 app 式的贴顶小条 */}
      <header className="px-6 pt-8 lg:px-0 lg:pt-12">
        <nav aria-label="Breadcrumb" className="text-[10px] text-fog">
          <Link to="/" className="hover:text-ivory">Home</Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          <Link to="/cart" className="hover:text-ivory">The Reserve</Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          <span className="text-ivory">Confirm</span>
        </nav>
        <h1 className="font-lux mt-8 text-3xl leading-relaxed text-ivory lg:text-4xl">Confirm the order</h1>
        <p className="mt-3 text-[11px] leading-relaxed text-fog">
          {(() => { const n = lines.reduce((sum, r) => sum + r.qty, 0); return n === 1 ? 'One piece' : `${n} pieces` })()}, one signature, no money. The usual.
        </p>
      </header>

      {/* 收货地址 */}
      <section className="mx-6 mt-12 border-t border-hairline pt-8 lg:mx-0 lg:mt-16">
        <h2 className="font-lux text-xs text-ivory">Deliver to</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {ADDRESSES.map((a) => (
            <button
              key={a}
              onClick={() => setAddress(a)}
              className={`border px-2.5 py-1.5 text-[10px] ${
                address === a ? 'border-ivory text-ivory' : 'border-hairline text-fog'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      {/* 配送方式 */}
      <section className="mx-6 mt-12 border-t border-hairline pt-8 lg:mx-0 lg:mt-16">
        <h2 className="font-lux text-xs text-ivory">Delivery</h2>
        <div className="mt-4 space-y-2">
          {DELIVERY.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setDelivery(i)}
              className={`flex w-full items-center justify-between border px-3 py-2 text-[10px] ${
                deliveryIdx === i ? 'border-ivory text-ivory' : 'border-hairline text-fog'
              }`}
            >
              <span>
                {d.name} <span className="text-fog">, {d.note}</span>
              </span>
              <span className="font-price font-semibold text-ivory">{d.fee.startsWith('+') ? '+' : ''}{money(0)}</span>
            </button>
          ))}
        </div>
        {/* 礼品包装：Cartier 的折叠区里真有一栏 Gift Wrapping，且免费。这里当然也免费，也不送达 */}
        <button
          onClick={() => setGiftWrap(!giftWrap)}
          className="mt-3 flex w-full items-center justify-between px-1 text-[10px] text-fog"
        >
          <span>
            <span className={`mr-2 inline-flex h-3.5 w-3.5 items-center justify-center border align-[-2px] text-[9px] ${giftWrap ? 'border-ivory text-ivory' : 'border-hairline text-transparent'}`}>✓</span>
            Gift wrapping <span>, house box, hand-tied ribbon, wax seal</span>
          </span>
          <span className="font-price font-semibold text-ivory">{money(0)}</span>
        </button>
      </section>

      {/* 藏品清单 */}
      <section className="mx-6 mt-12 border-t border-hairline pt-8 lg:mx-0 lg:mt-16">
        <h2 className="font-lux text-xs text-ivory">The pieces</h2>
        {lines.map((r) => (
          <div key={r.key} className="mt-4 flex items-start gap-3 border-b border-hairline pb-4 last:border-b-0 last:pb-0">
            <ProductImage product={r.product} className="aspect-[3/4] w-10 shrink-0" emojiClass="text-lg" />
            <div className="min-w-0 flex-1">
              <p className="font-lux truncate text-xs text-ivory/90">{r.product.name}</p>
              {r.customization && Object.keys(r.customization).length > 0 ? (
                <p className="mt-1 truncate text-[9px] text-fog">
                  <span className="tracking-widest">BESPOKE</span> {Object.values(r.customization).join(' / ')}
                </p>
              ) : (
                <p className="mt-1 text-[9px] text-fog">{BESPOKE.skipLine}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[9px] text-fog">×{r.qty}</p>
              <p className="font-price text-xs font-semibold text-ivory">{money(r.product.price * r.qty)}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 心动来源（温柔一问） */}
      <section className="mx-6 mt-12 border-t border-hairline pt-8 lg:mx-0 lg:mt-16">
        <h2 className="font-lux text-xs text-ivory">You want it tonight because</h2>
        <p className="mt-1 text-[9px] text-fog">(you needn't say)</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {URGE_CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setUrge(urge === c ? null : c)
                if (urge !== c) toast('Noted. All good taste.')
              }}
              className={`border px-2.5 py-1.5 text-[10px] ${
                urge === c ? 'border-jade text-jade' : 'border-hairline text-fog'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* 礼遇明细 */}
      <section className="mx-6 mt-12 border-t border-hairline pt-8 text-[10px] lg:mx-0 lg:mt-16">
        <div className="flex justify-between py-1 text-fog">
          <span>Collection total</span>
          <span className="font-price line-through">{money(originalTotal)}</span>
        </div>
        <div className="flex justify-between py-1 text-fog">
          <span>Private client courtesy</span>
          <span className="font-price">-{money(priveOff)}</span>
        </div>
        {subtotal >= 1_000_000 && (
          <div className="flex justify-between gap-4 py-1 text-fog">
            <span className="shrink-0">Gift for orders over ¥1,000,000</span>
            <span className="text-right">One canvas tote, packed inside the main order and sharing its itinerary</span>
          </div>
        )}
        <div className="flex justify-between py-1 text-fog">
          <span>Black-card credit (unlimited balance, not that you'll ever use it)</span>
          <span className="font-price">-{money(subtotal)}</span>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-hairline pt-4">
          <span className="font-lux text-ivory">Amount paid</span>
          <span className="font-price text-xl font-bold text-ivory">{money(0)}</span>
        </div>
      </section>

      {/* 支付：手机吸底（app 的好习惯），桌面收进版心（编辑页面不悬浮工具条） */}
      <div className="mx-6 mt-12 hidden lg:mx-0 lg:block">
        <button onClick={pay} className="gold-cta w-full py-3.5 text-center text-sm font-semibold tracking-widest">
          Pay {money(0)}
          <span className="ml-2 text-[10px] font-normal text-[#7fd4ab]">This one keeps {money(subtotal)}</span>
        </button>
      </div>
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink px-6 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <button
          onClick={pay}
          className="gold-cta w-full py-3.5 text-center text-sm font-semibold tracking-widest"
        >
          Pay {money(0)}
          <span className="ml-2 text-[10px] font-normal text-[#7fd4ab]">This one keeps {money(subtotal)}</span>
        </button>
      </div>

      {/* 白手套核验弹层：真的按什么都行 */}
      {paying && (
        <div onClick={finalize} className="fixed inset-0 z-50 flex cursor-pointer items-end justify-center bg-black/70">
          <div className="w-full max-w-[480px] border-t border-hairline bg-panel p-12 text-center float-up">
            {/* 白手套核验：亮出屋徽（衬线 Z），像支付面板亮商户标——不用彩色 emoji */}
            <div className="font-lux mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-hairline text-3xl text-ivory">
              Z
            </div>
            <p className="text-[10px] text-fog">The white glove is verifying your identity. Press anything, it all works.</p>
          </div>
        </div>
      )}
    </div>
  )
}
