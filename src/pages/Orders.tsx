import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '../lib/types'
import {
  BESPOKE_TRACKING_TEXT,
  BUTLER_REPLIES,
  CONFIRM_RECEIPT_HINT,
  EMPTY_ORDERS,
  PRIVACY_FOOTER,
  TRACKING_SCRIPT,
  pick,
  revisitLine,
} from '../lib/copy'
import { orderNo, yuan } from '../lib/format'
import { useLongPress } from '../lib/hooks'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'

function daysSince(ts: number): number {
  return Math.floor((Date.now() - ts) / 86400_000)
}

function Timeline({ order }: { order: Order }) {
  const now = Date.now()
  const hasBespoke = order.items.some((i) => i.customization && Object.keys(i.customization).length > 0)
  const nodes = [...TRACKING_SCRIPT]
  if (hasBespoke) {
    nodes.push({ offsetMs: 36 * 3600_000, label: '工坊', text: BESPOKE_TRACKING_TEXT })
    nodes.sort((a, b) => a.offsetMs - b.offsetMs)
  }
  const unlocked = nodes.filter((n) => order.createdAt + n.offsetMs <= now)
  const next = nodes[unlocked.length]

  return (
    <div className="mt-3">
      {next && (
        <div className="flex gap-2.5 opacity-40">
          <div className="flex flex-col items-center">
            <span className="mt-1 h-1.5 w-1.5 border border-fog" />
            <span className="w-px flex-1 bg-hairline" />
          </div>
          <p className="pb-3 text-[9px] text-fog">下一封管家手记正在誊写……（剧透：仍不会来）</p>
        </div>
      )}
      {[...unlocked].reverse().map((n, i) => (
        <div key={n.offsetMs} className="flex gap-2.5">
          <div className="flex flex-col items-center">
            <span className={`mt-1 h-1.5 w-1.5 ${i === 0 ? 'bg-jade' : 'bg-hairline'}`} />
            {i < unlocked.length - 1 && <span className="w-px flex-1 bg-hairline" />}
          </div>
          <div className="pb-3.5">
            <p className={`text-[11px] leading-relaxed ${i === 0 ? 'font-lux text-ivory' : 'text-fog'}`}>
              【{n.label}】{n.text}
            </p>
            <p className="font-price mt-0.5 text-[8px] text-fog/70">
              {new Date(order.createdAt + n.offsetMs).toLocaleString('zh-CN', {
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

/** 寂寞正品鉴定证书 */
function Certificate({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 px-8" onClick={onClose}>
      <div className="w-full max-w-80 border border-[#c8a96e] bg-gradient-to-b from-[#1c1a16] to-[#0d0c0a] p-6 text-center pop-in">
        <p className="tracking-maison text-[9px] text-[#c8a96e]">Certificat d'Authenticité</p>
        <p className="font-lux mt-3 text-base text-[#f4efe6]">寂寞正品鉴定证书</p>
        <div className="mx-auto my-4 h-px w-16 bg-[#c8a96e]/60" />
        <p className="text-[10px] leading-loose text-[#8a857c]">
          兹证明本单寂寞为正品，全球限量一份。
          <br />
          持有人：<span className="text-[#f4efe6]">您</span>
          <br />
          编号：<span className="font-price">{orderNo(order.createdAt)}</span>
          <br />
          鉴定机构：富了个寂寞 · 白手套鉴定所
        </p>
        <p className="mt-4 text-[8px] tracking-widest text-[#8a857c]/70">此证书与您守住的钱一样：是真的</p>
        <button onClick={onClose} className="mt-5 border border-[#c8a96e]/60 px-8 py-1.5 text-[10px] tracking-widest text-[#c8a96e]">
          收下
        </button>
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
        onClick={() => toast('确认不了的。长按试试，有惊喜——惊喜也不发货，但可以看。')}
        className="flex-1 border border-hairline py-2 text-[10px] tracking-widest text-fog/60"
      >
        确认收货
      </button>
      {cert && <Certificate order={order} onClose={() => setCert(false)} />}
    </>
  )
}

function OrderCard({ order }: { order: Order }) {
  const toast = useToast()
  const [expanded, setExpanded] = useState(false)
  const [replies, setReplies] = useState<string[]>([])
  const days = daysSince(order.createdAt)
  const arrived = days >= 7
  const revisit = revisitLine(days)

  return (
    <div className="mx-4 mt-4 border border-hairline bg-panel p-3.5">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-center justify-between">
          <span className="font-price text-[9px] text-fog">{orderNo(order.createdAt)}</span>
          <span className={`text-[10px] tracking-wider ${arrived ? 'text-jade' : 'text-gold'}`}>
            {arrived ? '已入驻心里的陈列室' : '白手套护送中'}{' '}
            {!arrived && <span className="inline-block truck-move">🕊️</span>}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2 overflow-hidden">
          {order.items.slice(0, 4).map((it) => (
            <ProductImage
              key={it.product.id + JSON.stringify(it.customization ?? {})}
              product={it.product}
              className="h-11 w-11 shrink-0"
              emojiClass="text-xl"
            />
          ))}
          {order.items.length > 4 && <span className="text-[10px] text-fog">+{order.items.length - 4}</span>}
          <span className="ml-auto shrink-0 text-[10px] text-fog">
            共 {order.items.reduce((s, i) => s + i.qty, 0)} 件 · 守住{' '}
            <span className="font-price font-semibold text-jade">{yuan(order.total)}</span>
          </span>
        </div>
        <p className="mt-2.5 text-[9px] text-fog">
          这单已陪你 {days} 天{order.urge && ` · 因为「${order.urge}」`}
          <span className="float-right text-fog/60">{expanded ? '收起 ▴' : '管家手记 ▾'}</span>
        </p>
      </button>

      {expanded && (
        <div className="float-up mt-3 border-t border-hairline pt-3">
          {revisit && (
            <div className="border border-jade/30 bg-jade/5 px-3 py-2.5 text-[10px] leading-relaxed text-jade">
              {revisit}
            </div>
          )}

          {/* 定制档案 */}
          {order.items.some((i) => i.customization) && (
            <div className="mt-3 border border-gold/25 px-3 py-2.5">
              <p className="text-[8px] tracking-widest text-gold">BESPOKE · 定制档案（已永久归档。与商品不同，档案是真的）</p>
              {order.items
                .filter((i) => i.customization)
                .map((i) => (
                  <p key={i.product.id} className="mt-1 text-[9px] leading-relaxed text-fog">
                    {i.product.emoji} {Object.values(i.customization!).join(' · ')}
                  </p>
                ))}
            </div>
          )}

          {/* 管家卡片 */}
          <div className="mt-3 flex items-center gap-3 border border-hairline px-3 py-2.5">
            <span className="flex h-9 w-9 items-center justify-center border border-gold/40 text-lg">🎩</span>
            <div className="flex-1">
              <p className="font-lux text-[11px] text-ivory">管家 · 阿尔弗雷德</p>
              <p className="text-[9px] text-fog">正在挑选与您门铃相称的手套</p>
            </div>
            <button
              onClick={() => toast('管家正在熨手套，未接听。他让您放心：没有消息，就是没有消息。')}
              className="border border-hairline px-3 py-1 text-[9px] tracking-wider text-fog"
            >
              致电
            </button>
          </div>

          <Timeline order={order} />

          {replies.map((r, i) => (
            <div key={i} className="float-up mb-1.5 flex justify-end">
              <span className="max-w-[85%] border border-gold/30 bg-ink px-3 py-1.5 text-[10px] leading-relaxed text-gold/90">
                {r}
              </span>
            </div>
          ))}

          <div className="mt-2.5 flex gap-2">
            <button
              onClick={() => setReplies((prev) => [...prev, pick(BUTLER_REPLIES)])}
              className="flex-1 border border-gold/60 py-2 text-[10px] tracking-widest text-gold"
            >
              摇铃唤管家
            </button>
            <ConfirmButton order={order} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const { orders } = useStore()

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-4 px-10 pb-20 text-center">
        <span className="text-5xl">🎩</span>
        <p className="font-lux text-sm leading-relaxed text-fog">{EMPTY_ORDERS}</p>
        <Link to="/" className="gold-cta mt-1 px-10 py-2.5 text-sm tracking-widest">
          去逛逛 ›
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-20 lg:mx-auto lg:max-w-2xl">
      <header className="sticky top-0 z-30 border-b border-hairline bg-ink/95 px-4 py-3.5 backdrop-blur lg:top-[57px]">
        <h1 className="font-lux text-base text-ivory">
          管家动态 <span className="tracking-maison ml-1 text-[9px] font-normal text-gold">En Route · Forever</span>
        </h1>
      </header>
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
      <p className="px-8 py-6 text-center text-[8px] leading-relaxed tracking-wider text-fog/60">{PRIVACY_FOOTER}</p>
    </div>
  )
}
