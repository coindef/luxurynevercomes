import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '../lib/types'
import {
  BESPOKE_TRACKING_TEXT,
  CONFIRM_RECEIPT_HINT,
  EMPTY_ORDERS,
  TRACKING_SCRIPT,
  revisitLine,
} from '../lib/copy'
import { orderNo, yuan } from '../lib/format'
import { useLongPress } from '../lib/hooks'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'
import { ButlerDrawer } from '../components/Concierge'
import { saveCertificateCard } from '../lib/shareCard'
import { IconHat, IconPlane } from '../components/icons'

function daysSince(ts: number): number {
  return Math.floor((Date.now() - ts) / 86400_000)
}

/** 物流剧场：一条安静的竖线，不用圆点，不用徽章 */
function Timeline({ order }: { order: Order }) {
  const now = Date.now()
  const hasBespoke = order.items.some((i) => i.customization && Object.keys(i.customization).length > 0)
  const nodes = [...TRACKING_SCRIPT]
  if (hasBespoke) {
    nodes.push({ offsetMs: 36 * 3600_000, label: 'Atelier', text: BESPOKE_TRACKING_TEXT })
    nodes.sort((a, b) => a.offsetMs - b.offsetMs)
  }
  const unlocked = nodes.filter((n) => order.createdAt + n.offsetMs <= now)
  const next = nodes[unlocked.length]

  return (
    <div className="mt-10 border-l border-hairline pl-6">
      {next && <p className="pb-8 text-[10px] leading-loose text-fog">The next butler's note is being transcribed... (spoiler: still not coming)</p>}
      {[...unlocked].reverse().map((n, i) => (
        <div key={n.offsetMs} className="pb-8 last:pb-0">
          <p className={`text-[11px] leading-loose ${i === 0 ? 'font-lux text-ivory' : 'text-fog'}`}>
            【{n.label}】{n.text}
          </p>
          <p className="font-price mt-2 text-[9px] text-fog">
            {new Date(order.createdAt + n.offsetMs).toLocaleString('en-US', {
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ))}
    </div>
  )
}

/** 寂寞正品鉴定证书（全站少数被允许的深色时刻：深色面用固定 hex，银箔不用金箔） */
function Certificate({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-8" onClick={onClose}>
      <div className="pop-in w-full max-w-80 bg-[#141414] p-9">
        <p className="font-lux text-base text-[#e8e8e8]">Certificate of Genuine Solitude</p>
        <div className="my-6 h-px w-16 bg-[#c9c9c9]/50" />
        <p className="text-[10px] leading-loose text-[#8f8f8f]">
          This certifies that the solitude in this order is genuine, one of one worldwide.
          <br />
          Bearer: <span className="text-[#e8e8e8]">You</span>
          <br />
          Number: <span className="font-price">{orderNo(order.createdAt)}</span>
          <br />
          Authenticated by: LuxuryNeverComes, White-Glove Assay Office
        </p>
        <p className="mt-6 text-[8px] leading-relaxed tracking-widest text-[#8f8f8f]">This certificate, like the money you kept, is real.</p>
        <div className="mt-8 flex items-center gap-8">
          <button
            onClick={(e) => {
              e.stopPropagation()
              saveCertificateCard(order)
            }}
            className="quiet-link text-[10px] tracking-widest text-[#e8e8e8]"
          >
            Save as image
          </button>
          <button onClick={onClose} className="quiet-link text-[10px] tracking-widest text-[#c9c9c9]">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmButton({ order }: { order: Order }) {
  const toast = useToast()
  const [cert, setCert] = useState(false)
  const longPress = useLongPress(() => {
    toast(CONFIRM_RECEIPT_HINT)
    setTimeout(() => setCert(true), 900)
  })

  return (
    <>
      <button
        {...longPress}
        onClick={() => toast('You can\'t confirm it. Try a long press for a surprise. The surprise doesn\'t ship either, but you can look at it.')}
        className="quiet-link text-[11px] tracking-widest text-fog transition-opacity hover:text-ivory"
      >
        Confirm Receipt
      </button>
      {cert && <Certificate order={order} onClose={() => setCert(false)} />}
    </>
  )
}

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false)
  const [butlerOpen, setButlerOpen] = useState(false)
  const days = daysSince(order.createdAt)
  const arrived = days >= 7
  const revisit = revisitLine(days)

  return (
    <article className="border-t border-hairline px-6 py-10 last:border-b">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-price text-[10px] text-fog">{orderNo(order.createdAt)}</span>
          <span className={`text-[10px] tracking-wider ${arrived ? 'text-jade' : 'text-fog'}`}>
            {arrived ? 'On display in your heart\'s gallery' : 'Under white-glove escort'}{' '}
            {!arrived && <span className="truck-move inline-block align-[-2px]"><IconPlane size={12} /></span>}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3 overflow-hidden">
          {order.items.slice(0, 4).map((it) => (
            <ProductImage
              key={it.product.id + JSON.stringify(it.customization ?? {})}
              product={it.product}
              className="aspect-[3/4] w-14 shrink-0"
              emojiClass="text-2xl"
            />
          ))}
          {order.items.length > 4 && <span className="text-[10px] text-fog">+{order.items.length - 4}</span>}
        </div>

        <p className="mt-6 text-[11px] leading-loose text-fog">
          {order.items.reduce((s, i) => s + i.qty, 0)} pieces in all, kept safe{' '}
          <span className="font-price text-ivory">{yuan(order.total)}</span>
        </p>
        <p className="mt-2 text-[10px] leading-loose text-fog">
          This order has been {days} days by your side{order.urge && `, because "${order.urge}"`}
          <span className="ml-3 text-fog">{expanded ? 'Collapse ▴' : "Butler's Note ▾"}</span>
        </p>
      </button>

      {expanded && (
        <div className="float-up mt-10">
          {revisit && <p className="text-[11px] leading-loose text-jade">{revisit}</p>}

          {/* 定制档案 */}
          {order.items.some((i) => i.customization) && (
            <div className="mt-10">
              <p className="text-[10px] leading-loose text-fog">Bespoke file (permanently archived. Unlike the goods, the file is real.)</p>
              {order.items
                .filter((i) => i.customization)
                .map((i) => (
                  <p key={i.product.id} className="mt-2 text-[11px] leading-loose text-ivory">
                    <span className="grayscale">{i.product.emoji}</span> {Object.values(i.customization!).join(', ')}
                  </p>
                ))}
            </div>
          )}

          {/* 管家 */}
          <div className="mt-10 flex items-center gap-4">
            <IconHat size={22} className="shrink-0 text-ivory" />
            <div className="flex-1">
              <p className="font-lux text-[12px] text-ivory">Butler · Alfred</p>
              <p className="mt-1 text-[10px] text-fog">Selecting gloves worthy of your doorbell</p>
            </div>
            <button
              onClick={() => setButlerOpen(true)}
              className="quiet-link text-[11px] tracking-wider text-fog transition-opacity hover:text-ivory"
            >
              Call
            </button>
          </div>

          <Timeline order={order} />

          {/* 摇铃 = 打开管家的通信间（与大使同一套抽屉，另一副手套；线程全局持续） */}
          <div className="mt-12 flex items-center gap-10">
            <button onClick={() => setButlerOpen(true)} className="quiet-link text-[11px] tracking-widest text-ivory">
              Ring for the butler
            </button>
            <ConfirmButton order={order} />
          </div>
          {butlerOpen && <ButlerDrawer onClose={() => setButlerOpen(false)} />}
        </div>
      )}
    </article>
  )
}

export default function Orders() {
  const { orders } = useStore()

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-6 px-10 pb-20 text-center">
        <IconHat size={44} className="text-fog" />
        <p className="font-lux text-sm leading-loose text-fog">{EMPTY_ORDERS}</p>
        <Link to="/" className="gold-cta mt-2 px-10 py-3 text-xs tracking-[0.2em]">
          Take a look ›
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-28 lg:mx-auto lg:max-w-3xl">
      <header className="px-6 pb-12 pt-16 lg:pt-20">
        <h1 className="font-lux text-2xl text-ivory lg:text-4xl">Butler</h1>
      </header>

      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}

      {/* 法务小字统一挪到全站页脚，别一页一份 */}
    </div>
  )
}
