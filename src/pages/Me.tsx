import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONVERSIONS, PRIVACY_FOOTER, memberLevel } from '../lib/copy'
import { yuan } from '../lib/format'
import { useCountUp } from '../lib/hooks'
import { useStore } from '../lib/store'

export default function Me() {
  const { orders, saved } = useStore()
  const counted = useCountUp(saved, 1800)
  const [convIdx, setConvIdx] = useState(0)
  const [confirmClear, setConfirmClear] = useState(false)

  const now = new Date()
  const monthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const monthSaved = monthOrders.reduce((s, o) => s + o.total, 0)

  const topUrge = useMemo(() => {
    const counts = new Map<string, number>()
    for (const o of orders) if (o.urge) counts.set(o.urge, (counts.get(o.urge) ?? 0) + 1)
    let best: string | null = null
    let bestN = 0
    for (const [k, v] of counts) if (v > bestN) { best = k; bestN = v }
    return best
  }, [orders])

  // 折算参照物：4 个数字项 + 1 个特别项
  const convCount = CONVERSIONS.length + 1
  const conv = convIdx < CONVERSIONS.length ? CONVERSIONS[convIdx] : null
  const convN = conv ? Math.floor(saved / conv.price) : 0

  const clearAll = () => {
    localStorage.clear()
    location.href = '/'
  }

  return (
    <div className="pb-20 lg:mx-auto lg:max-w-2xl">
      {/* 贵宾卡 */}
      <header className="border-b border-hairline px-5 pb-9 pt-9">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center border border-gold/50 text-2xl">🎩</span>
          <div className="min-w-0">
            <p className="font-lux text-base text-ivory">尊敬的贵宾</p>
            <p className="mt-1 w-fit border border-gold/60 px-2 py-0.5 text-[9px] tracking-wider text-gold">
              {memberLevel(orders.length)} · 已下 {orders.length} 单
            </p>
          </div>
        </div>
      </header>

      {/* 首付账本（治愈绿：全站唯一收起玩笑的地方） */}
      <section className="mx-4 -mt-5 border border-jade/30 bg-jade/5 p-6 text-center">
        <p className="tracking-maison text-[9px] text-jade/80">首付账本 · 累计守住</p>
        <p className="font-price mt-3 text-3xl font-bold text-jade">{yuan(counted)}</p>
        <p className="mt-2.5 text-[10px] leading-relaxed text-jade/70">
          这些钱严格来说从来没有过。但守住的踏实，和数完三行逗号的快乐，是真的。
        </p>
        {saved > 0 && (
          <button
            onClick={() => setConvIdx((convIdx + 1) % convCount)}
            className="mt-3.5 border border-jade/40 px-4 py-1.5 text-[10px] text-jade"
          >
            {conv ? (
              <>≈ {convN.toLocaleString('zh-CN')} {conv.unit}{conv.suffix ?? ''}</>
            ) : (
              <>≈ 你安然无恙的很多年</>
            )}
            <span className="ml-1.5 opacity-60">换算 ⟳</span>
          </button>
        )}
      </section>

      {/* 本月小结 */}
      <section className="mx-4 mt-4 border border-hairline bg-panel p-4">
        <h2 className="font-lux text-sm text-ivory">本月小结</h2>
        {monthOrders.length > 0 ? (
          <p className="mt-2 text-[11px] leading-relaxed text-fog">
            本月你心动了 <span className="font-price font-bold text-ivory">{monthOrders.length}</span> 次，守住{' '}
            <span className="font-price font-bold text-jade">{yuan(monthSaved)}</span>。
            <br />
            富了个寂寞——寂寞是假的，开过眼是真的。
          </p>
        ) : (
          <p className="mt-2 text-[11px] text-fog">本月还没心动过。也挺好，殿堂常开，随时来。</p>
        )}
        {topUrge && (
          <p className="mt-2.5 border border-hairline px-3 py-2 text-[10px] leading-relaxed text-fog">
            你最常因为「{topUrge}」心动。只是记着，没有别的意思。
          </p>
        )}
      </section>

      {/* 入口 */}
      <section className="mx-4 mt-4 border border-hairline bg-panel">
        <Link to="/orders" className="flex items-center justify-between px-4 py-3.5 text-xs text-ivory/90">
          <span>🎩 管家动态</span>
          <span className="text-[10px] text-fog">{orders.length} 单，全部在途 ›</span>
        </Link>
        <div className="border-t border-hairline" />
        <Link to="/about" className="flex items-center justify-between px-4 py-3.5 text-xs text-ivory/90">
          <span>🏛️ 关于本店 · MAISON ZÉRO</span>
          <span className="text-[10px] text-fog">›</span>
        </Link>
        <div className="border-t border-hairline" />
        <button
          onClick={() => setConfirmClear(true)}
          className="flex w-full items-center justify-between px-4 py-3.5 text-xs text-ivory/90"
        >
          <span>🕯️ 散尽家财</span>
          <span className="text-[10px] text-fog">›</span>
        </button>
      </section>

      <p className="px-8 py-6 text-center text-[8px] leading-relaxed tracking-wider text-fog/60">{PRIVACY_FOOTER}</p>

      {/* 温柔的二次确认 */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-10">
          <div className="w-full max-w-72 border border-gold/50 bg-panel p-6 text-center pop-in">
            <p className="text-3xl">🕯️</p>
            <p className="font-lux mt-3 text-sm text-ivory">要散尽家财了吗？</p>
            <p className="mt-2 text-[10px] leading-relaxed text-fog">
              虚拟的散了就散了，守住的踏实删不掉，也带不走你的。
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 border border-hairline py-2 text-[10px] tracking-widest text-fog"
              >
                再留一会儿
              </button>
              <button onClick={clearAll} className="flex-1 border border-gold py-2 text-[10px] tracking-widest text-gold">
                散尽
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
