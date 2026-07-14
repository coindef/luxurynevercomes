import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { CustomGroup, Order, OrderItem } from '../lib/types'
import { getProduct } from '../lib/products'
import { CATEGORY_CUSTOM } from '../lib/bespoke'
import { BESPOKE, SOOTHING_BY_URGE, SOOTHING_GENERIC, URGE_CHIPS, pick } from '../lib/copy'
import { orderNo, yuan } from '../lib/format'
import { useCountUp } from '../lib/hooks'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'

const ADDRESSES = ['半山别墅（心里那栋）', '游艇泊位 3 号（概念泊位）', '就送到心里吧']
const DELIVERY = [
  { name: '白手套管家亲送', note: '永不达', fee: '¥0' },
  { name: '私人飞机直送', note: '在等一个好天气', fee: '+¥0' },
]

const CONFETTI_EMOJIS = ['🥂', '✨', '🤍', '🕊️', '🖤']

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
        left: Math.random() * 90 + 5,
        delay: Math.random() * 1.2,
        size: 14 + Math.random() * 12,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, fontSize: p.size }}
        >
          {p.emoji}
        </span>
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
          <span className="mt-1.5 block text-[10px] font-normal tracking-widest text-jade/90">已存入首付账本</span>
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
  const groups: CustomGroup[] = CATEGORY_CUSTOM[item.product.category] ?? []
  const rows = Object.entries(item.customization).map(([label, v]) => {
    const g = groups.find((x) => x.label === label)
    const surcharge = g?.type === 'text' ? (g.choices?.[0]?.surcharge ?? 0) : (g?.choices?.find((c) => c.name === v)?.surcharge ?? 0)
    return { label: label.split('·')[0].trim(), v, surcharge }
  })
  const total = rows.reduce((s, r) => s + r.surcharge, 0)

  return (
    <div className="mt-1 border-l border-gold/30 pl-2 text-[9px] leading-relaxed text-fog">
      <p className="tracking-widest text-gold/90">{BESPOKE.receiptHeader}</p>
      {rows.map((r) => (
        <div key={r.label} className="flex justify-between gap-2">
          <span className="truncate">
            {r.label}　{r.v.length > 10 ? `${r.v.slice(0, 10)}…` : r.v}
          </span>
          <span className="font-price shrink-0">+{yuan(r.surcharge)}</span>
        </div>
      ))}
      <div className="flex justify-between"><span>定制加价合计</span><span className="font-price">+{yuan(total)}</span></div>
      <div className="flex justify-between"><span>定制加价减免</span><span className="font-price">-{yuan(total)}</span></div>
      <p className="text-fog/60">（本行与上一行互相抵消，像极了生活）</p>
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
      <div className="px-6 pt-16 text-center">
        <div className="pop-in mx-auto flex h-16 w-16 items-center justify-center border border-gold text-2xl text-jade">
          ✓
        </div>
        <h1 className="font-lux mt-5 text-lg text-ivory">支付成功 · 实付 ¥0.00</h1>
        <p className="mt-1.5 text-[10px] tracking-wider text-fog">钱没动，排面到位了。</p>
        <div className="mt-7">
          <SavedFlip total={order.total} />
        </div>
      </div>

      {/* 小票 */}
      <div className="mx-6 mt-9 border border-dashed border-gold/40 bg-panel p-4 text-[10px] leading-relaxed text-fog">
        <div className="flex justify-between">
          <span className="tracking-maison text-[8px] text-gold">Maison Zéro · Facture</span>
          <span className="font-price">{orderNo(order.createdAt)}</span>
        </div>
        <div className="my-2.5 border-t border-dashed border-hairline" />
        {order.items.map((it) => (
          <div key={it.product.id + JSON.stringify(it.customization ?? {})} className="py-1">
            <div className="flex justify-between gap-2">
              <span className="font-lux truncate text-ivory/90">
                {it.product.emoji} {it.product.name}
              </span>
              <span className="shrink-0">×{it.qty}</span>
            </div>
            <ReceiptBespoke item={it} />
          </div>
        ))}
        <div className="my-2.5 border-t border-dashed border-hairline" />
        <div className="flex justify-between">
          <span>配送方式</span>
          <span>白手套管家亲送（永不达）</span>
        </div>
        <div className="mt-1 flex justify-between gap-3">
          <span className="shrink-0">预计送达</span>
          <span className="text-right">等一个好天气（好天气的标准，由机长掌握）</span>
        </div>
      </div>

      {hasBespoke && (
        <p className="font-lux mx-8 mt-4 text-center text-[10px] leading-relaxed text-gold/90">{BESPOKE.successLine}</p>
      )}

      {/* 安抚语（治愈绿） */}
      <div className="mx-6 mt-4 border border-jade/30 bg-jade/5 p-4 text-center">
        {order.urge && <p className="mb-1.5 text-[9px] tracking-wider text-jade/70">因为「{order.urge}」的这一单</p>}
        <p className="font-lux text-xs leading-relaxed text-jade">{soothing}</p>
      </div>

      <div className="mx-6 mt-7 flex gap-3">
        <Link
          to="/orders"
          className="flex-1 border border-hairline py-2.5 text-center text-xs tracking-widest text-fog hover:border-gold/40 hover:text-gold"
        >
          查看管家动态（他不会来）
        </Link>
        <Link
          to="/"
          className="gold-cta flex-1 py-3 text-center text-xs font-semibold tracking-widest"
        >
          再富一次
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
        <span className="text-4xl">🧾</span>
        <p className="font-lux text-sm">没什么可结算的。排面是免费的，随时来。</p>
        <Link to="/" className="text-sm text-gold">回殿堂 ›</Link>
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
        <h1 className="font-lux text-base text-ivory">确认订单</h1>
      </header>

      {/* 收货地址 */}
      <section className="mx-4 mt-4 border border-hairline bg-panel p-3.5">
        <p className="tracking-maison text-[8px] text-gold">Adresse</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {ADDRESSES.map((a) => (
            <button
              key={a}
              onClick={() => setAddress(a)}
              className={`border px-2.5 py-1.5 text-[10px] ${
                address === a ? 'border-gold text-gold' : 'border-hairline text-fog'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </section>

      {/* 配送方式 */}
      <section className="mx-4 mt-3 border border-hairline bg-panel p-3.5">
        <p className="tracking-maison text-[8px] text-gold">Livraison</p>
        <div className="mt-2 space-y-2">
          {DELIVERY.map((d, i) => (
            <button
              key={d.name}
              onClick={() => setDelivery(i)}
              className={`flex w-full items-center justify-between border px-3 py-2 text-[10px] ${
                delivery === i ? 'border-gold/70 text-ivory' : 'border-hairline text-fog'
              }`}
            >
              <span>
                🖤 {d.name} <span className="text-fog">· {d.note}</span>
              </span>
              <span className="font-price font-semibold text-gold">{d.fee}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 藏品清单 */}
      <section className="mx-4 mt-3 border border-hairline bg-panel p-3.5">
        {lines.map((r) => (
          <div key={r.key} className="flex items-start gap-3 py-1.5">
            <ProductImage product={r.product} className="h-12 w-12 shrink-0" emojiClass="text-2xl" />
            <div className="min-w-0 flex-1">
              <p className="font-lux truncate text-xs text-ivory/90">{r.product.name}</p>
              {r.customization && Object.keys(r.customization).length > 0 ? (
                <p className="mt-0.5 truncate text-[9px] text-gold/80">
                  BESPOKE · {Object.values(r.customization).join(' / ')}
                </p>
              ) : (
                <p className="mt-0.5 text-[9px] text-fog">{BESPOKE.skipLine}</p>
              )}
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[9px] text-fog">×{r.qty}</p>
              <p className="font-price text-xs font-semibold text-gold">{yuan(r.product.price * r.qty)}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 心动来源（温柔一问） */}
      <section className="mx-4 mt-3 border border-hairline bg-panel p-3.5">
        <p className="text-[10px] text-fog">今晚想拥有它，是因为——（不说也行）</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {URGE_CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => {
                setUrge(urge === c ? null : c)
                if (urge !== c) toast('记下了。都是好品位。')
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
      <section className="mx-4 mt-3 border border-hairline bg-panel p-3.5 text-[10px]">
        <div className="flex justify-between py-1 text-fog">
          <span>藏品总价</span>
          <span className="font-price line-through">{yuan(originalTotal)}</span>
        </div>
        <div className="flex justify-between py-1 text-fog">
          <span>私享礼遇</span>
          <span className="font-price">-{yuan(priveOff)}</span>
        </div>
        {subtotal >= 1_000_000 && (
          <div className="flex justify-between gap-4 py-1 text-fog">
            <span className="shrink-0">满 ¥1,000,000 臻礼</span>
            <span className="text-right">帆布托特袋一只（与主商品一同不发货）</span>
          </div>
        )}
        <div className="flex justify-between py-1 text-fog">
          <span>黑卡礼金抵扣（额度无上限，反正也用不上）</span>
          <span className="font-price">-{yuan(subtotal)}</span>
        </div>
        <div className="mt-1.5 flex items-baseline justify-between border-t border-hairline pt-2.5">
          <span className="font-lux text-ivory">实付</span>
          <span className="font-price text-xl font-bold text-gold">¥0.00</span>
        </div>
      </section>

      {/* 支付栏 */}
      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink px-4 py-3 lg:max-w-2xl">
        <button
          onClick={pay}
          className="gold-cta w-full py-3.5 text-center text-sm font-semibold tracking-widest"
        >
          支付 ¥0.00
          <span className="ml-2 text-[10px] font-normal text-[#7fd4ab]">这一下，守住 {yuan(subtotal)}</span>
        </button>
      </div>

      {/* 白手套核验弹层 */}
      {paying && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
          <div className="w-full max-w-[480px] border-t border-gold/40 bg-panel p-9 text-center float-up">
            <p className="tracking-maison text-[9px] text-gold">Vérification</p>
            <div className="mx-auto my-6 flex h-20 w-20 items-center justify-center border border-hairline text-3xl">
              🖤
            </div>
            <p className="text-[10px] text-fog">白手套正在核验您的身份——随便按，都对。</p>
          </div>
        </div>
      )}
    </div>
  )
}
