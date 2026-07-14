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

/** 物流剧场：一条安静的竖线，不用圆点，不用徽章 */
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
    <div className="mt-10 border-l border-hairline pl-6">
      {next && <p className="pb-8 text-[10px] leading-loose text-fog">下一封管家手记正在誊写……（剧透：仍不会来）</p>}
      {[...unlocked].reverse().map((n, i) => (
        <div key={n.offsetMs} className="pb-8 last:pb-0">
          <p className={`text-[11px] leading-loose ${i === 0 ? 'font-lux text-ivory' : 'text-fog'}`}>
            【{n.label}】{n.text}
          </p>
          <p className="font-price mt-2 text-[9px] text-fog">
            {new Date(order.createdAt + n.offsetMs).toLocaleString('zh-CN', {
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
        <p className="font-lux text-base text-[#e8e8e8]">寂寞正品鉴定证书</p>
        <div className="my-6 h-px w-16 bg-[#c9c9c9]/50" />
        <p className="text-[10px] leading-loose text-[#8f8f8f]">
          兹证明本单寂寞为正品，全球限量一份。
          <br />
          持有人：<span className="text-[#e8e8e8]">您</span>
          <br />
          编号：<span className="font-price">{orderNo(order.createdAt)}</span>
          <br />
          鉴定机构：富了个寂寞，白手套鉴定所
        </p>
        <p className="mt-6 text-[8px] leading-relaxed tracking-widest text-[#8f8f8f]">此证书与您守住的钱一样：是真的</p>
        <button onClick={onClose} className="quiet-link mt-8 inline-block text-[10px] tracking-widest text-[#c9c9c9]">
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
        className="quiet-link text-[11px] tracking-widest text-fog transition-opacity hover:text-ivory"
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
    <article className="border-t border-hairline px-6 py-10">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-price text-[10px] text-fog">{orderNo(order.createdAt)}</span>
          <span className={`text-[10px] tracking-wider ${arrived ? 'text-jade' : 'text-fog'}`}>
            {arrived ? '已入驻心里的陈列室' : '白手套护送中'}{' '}
            {!arrived && <span className="truck-move inline-block">🕊️</span>}
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3 overflow-hidden">
          {order.items.slice(0, 4).map((it) => (
            <ProductImage
              key={it.product.id + JSON.stringify(it.customization ?? {})}
              product={it.product}
              className="h-16 w-16 shrink-0"
              emojiClass="text-2xl"
            />
          ))}
          {order.items.length > 4 && <span className="text-[10px] text-fog">+{order.items.length - 4}</span>}
        </div>

        <p className="mt-6 text-[11px] leading-loose text-fog">
          共 {order.items.reduce((s, i) => s + i.qty, 0)} 件，守住{' '}
          <span className="font-price text-ivory">{yuan(order.total)}</span>
        </p>
        <p className="mt-2 text-[10px] leading-loose text-fog">
          这单已陪你 {days} 天{order.urge && `，因为「${order.urge}」`}
          <span className="ml-3 text-fog">{expanded ? '收起 ▴' : '管家手记 ▾'}</span>
        </p>
      </button>

      {expanded && (
        <div className="float-up mt-10">
          {revisit && <p className="text-[11px] leading-loose text-jade">{revisit}</p>}

          {/* 定制档案 */}
          {order.items.some((i) => i.customization) && (
            <div className="mt-10">
              <p className="text-[10px] leading-loose text-fog">定制档案（已永久归档。与商品不同，档案是真的）</p>
              {order.items
                .filter((i) => i.customization)
                .map((i) => (
                  <p key={i.product.id} className="mt-2 text-[11px] leading-loose text-ivory">
                    {i.product.emoji} {Object.values(i.customization!).join('，')}
                  </p>
                ))}
            </div>
          )}

          {/* 管家 */}
          <div className="mt-10 flex items-center gap-4">
            <span className="text-lg">🎩</span>
            <div className="flex-1">
              <p className="font-lux text-[12px] text-ivory">管家 · 阿尔弗雷德</p>
              <p className="mt-1 text-[10px] text-fog">正在挑选与您门铃相称的手套</p>
            </div>
            <button
              onClick={() => toast('管家正在熨手套，未接听。他让您放心：没有消息，就是没有消息。')}
              className="quiet-link text-[11px] tracking-wider text-fog transition-opacity hover:text-ivory"
            >
              致电
            </button>
          </div>

          <Timeline order={order} />

          {replies.length > 0 && (
            <div className="mt-10 border-l border-hairline pl-6">
              {replies.map((r, i) => (
                <p key={i} className="float-up mt-3 text-[11px] leading-loose text-ivory first:mt-0">
                  {r}
                </p>
              ))}
            </div>
          )}

          <div className="mt-12 flex items-center gap-10">
            <button
              onClick={() => setReplies((prev) => [...prev, pick(BUTLER_REPLIES)])}
              className="quiet-link text-[11px] tracking-widest text-ivory"
            >
              摇铃唤管家
            </button>
            <ConfirmButton order={order} />
          </div>
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
        <span className="text-5xl">🎩</span>
        <p className="font-lux text-sm leading-loose text-fog">{EMPTY_ORDERS}</p>
        <Link to="/" className="gold-cta mt-2 px-10 py-3 text-xs tracking-[0.2em]">
          去逛逛 ›
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-28 lg:mx-auto lg:max-w-3xl">
      <header className="px-6 pb-12 pt-16 lg:pt-20">
        <h1 className="font-lux text-2xl text-ivory lg:text-4xl">管家动态</h1>
      </header>

      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}

      <p className="px-6 pt-16 text-[9px] leading-loose tracking-wider text-fog">{PRIVACY_FOOTER}</p>
    </div>
  )
}
