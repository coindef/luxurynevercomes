import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { CustomGroup, Order, OrderItem } from '../lib/types'
import { getProduct } from '../lib/products'
import { customFor } from '../lib/bespoke'
import { BESPOKE, SOOTHING_BY_URGE, SOOTHING_GENERIC, URGE_CHIPS, pick } from '../lib/copy'
import { orderNo, yuan } from '../lib/format'
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
          +{yuan(counted)}
          <span className="mt-1.5 block text-[10px] font-normal tracking-widest text-jade/90">Deposited to your down-payment book</span>
        </p>
      ) : (
        <p className="font-price text-3xl font-bold text-fog">-¥0.00</p>
      )}
    </div>
  )
}

/** 小票上的定制块：加价与减免互相抵消，像极了生活 */
function ReceiptBespoke({ item }: { item: OrderItem }) {
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
            {r.label}　{r.v.length > 10 ? `${r.v.slice(0, 10)}…` : r.v}
          </span>
          <span className="font-price shrink-0">+{yuan(r.surcharge)}</span>
        </div>
      ))}
      <div className="flex justify-between"><span>Bespoke surcharge total</span><span className="font-price">+{yuan(total)}</span></div>
      <div className="flex justify-between"><span>Bespoke surcharge waiver</span><span className="font-price">-{yuan(total)}</span></div>
      <p className="text-fog">(This line cancels the one above, much like life.)</p>
    </div>
  )
}

function SuccessView({ order }: { order: Order }) {
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
        <h1 className="font-lux mt-8 text-lg text-ivory">Payment successful. Paid ¥0.00</h1>
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
        <div className="flex justify-between">
          <span>Delivery method</span>
          <span>Hand-delivered by white-glove butler (never arrives)</span>
        </div>
        <div className="mt-1 flex justify-between gap-3">
          <span className="shrink-0">Estimated delivery</span>
          <span className="text-right">Awaiting good weather (the standard for good weather is set by the captain)</span>
        </div>
      </div>

      {hasBespoke && (
        <p className="font-lux mx-6 mt-10 text-[10px] leading-relaxed text-ivory">{BESPOKE.successLine}</p>
      )}

      {/* 安抚语（治愈绿） */}
      <div className="mx-6 mt-10 border border-jade/30 bg-jade/5 p-5">
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
  const { cart, removeFromCart, placeOrder } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const [address, setAddress] = useState(ADDRESSES[2])
  const [delivery, setDelivery] = useState(0)
  const [urge, setUrge] = useState<string | null>(null)
  const [paying, setPaying] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

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

  const pay = () => {
    setPaying(true)
    setTimeout(() => {
      const items: OrderItem[] = lines.map((r) => ({ product: r.product, qty: r.qty, customization: r.customization }))
      const created = placeOrder(items, subtotal, urge ?? undefined)
      lines.forEach((r) => removeFromCart(r.key))
      setPaying(false)
      setOrder(created)
    }, 1600)
  }

  return (
    <div className="pb-28 lg:mx-auto lg:max-w-2xl">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-hairline bg-ink/95 px-4 py-3.5 backdrop-blur">
        <button onClick={() => navigate(-1)} className="text-lg text-fog">‹</button>
        <h1 className="font-lux text-base text-ivory">Confirm order</h1>
      </header>

      {/* 收货地址 */}
      <section className="mx-4 mt-10 border border-hairline bg-panel p-5 lg:mt-14">
        <div className="flex flex-wrap gap-2">
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
      <section className="mx-4 mt-10 border border-hairline bg-panel p-5 lg:mt-14">
        <div className="space-y-2">
          {DELIVERY.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setDelivery(i)}
              className={`flex w-full items-center justify-between border px-3 py-2 text-[10px] ${
                delivery === i ? 'border-ivory text-ivory' : 'border-hairline text-fog'
              }`}
            >
              <span>
                {d.name} <span className="text-fog">, {d.note}</span>
              </span>
              <span className="font-price font-semibold text-ivory">{d.fee}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 藏品清单 */}
      <section className="mx-4 mt-10 border border-hairline bg-panel p-5 lg:mt-14">
        {lines.map((r) => (
          <div key={r.key} className="flex items-start gap-3 py-1.5">
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
              <p className="font-price text-xs font-semibold text-ivory">{yuan(r.product.price * r.qty)}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 心动来源（温柔一问） */}
      <section className="mx-4 mt-10 border border-hairline bg-panel p-5 lg:mt-14">
        <p className="text-[10px] text-fog">You want it tonight because... (you needn't say)</p>
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
      <section className="mx-4 mt-10 border border-hairline bg-panel p-5 text-[10px] lg:mt-14">
        <div className="flex justify-between py-1 text-fog">
          <span>Collection total</span>
          <span className="font-price line-through">{yuan(originalTotal)}</span>
        </div>
        <div className="flex justify-between py-1 text-fog">
          <span>Private client courtesy</span>
          <span className="font-price">-{yuan(priveOff)}</span>
        </div>
        {subtotal >= 1_000_000 && (
          <div className="flex justify-between gap-4 py-1 text-fog">
            <span className="shrink-0">Gift for orders over ¥1,000,000</span>
            <span className="text-right">One canvas tote (which, like the main item, does not ship)</span>
          </div>
        )}
        <div className="flex justify-between py-1 text-fog">
          <span>Black-card credit (unlimited balance, not that you'll ever use it)</span>
          <span className="font-price">-{yuan(subtotal)}</span>
        </div>
        <div className="mt-4 flex items-baseline justify-between border-t border-hairline pt-4">
          <span className="font-lux text-ivory">Amount paid</span>
          <span className="font-price text-xl font-bold text-ivory">¥0.00</span>
        </div>
      </section>

      {/* 支付栏 */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink px-4 py-3 lg:max-w-2xl">
        <button
          onClick={pay}
          className="gold-cta w-full py-3.5 text-center text-sm font-semibold tracking-widest"
        >
          Pay ¥0.00
          <span className="ml-2 text-[10px] font-normal text-[#7fd4ab]">This one keeps {yuan(subtotal)}</span>
        </button>
      </div>

      {/* 白手套核验弹层 */}
      {paying && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
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
