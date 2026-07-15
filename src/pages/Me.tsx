import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CONVERSIONS, PRIVACY_FOOTER, memberLevel } from '../lib/copy'
import { yuan } from '../lib/format'
import { useCountUp } from '../lib/hooks'
import { useStore } from '../lib/store'
import EditorialImage from '../components/EditorialImage'

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
    <div className="pb-28 lg:mx-auto lg:max-w-3xl">
      {/* 贵宾 */}
      <header className="px-6 pt-16 lg:pt-20">
        <div className="flex items-center gap-4">
          <span className="text-2xl">🎩</span>
          <div className="min-w-0">
            <p className="font-lux text-2xl text-ivory lg:text-4xl">Esteemed Patron</p>
            <p className="mt-3 text-[10px] tracking-wider text-fog">
              {memberLevel(orders.length)}, {orders.length} orders placed
            </p>
          </div>
        </div>
      </header>

      {/* 首付账本（治愈绿：全站唯一收起玩笑的地方，也是全站唯一的颜色） */}
      <section className="mt-24 px-6 lg:mt-40">
        <h2 className="font-lux text-2xl text-ivory lg:text-4xl">Downpayment Ledger</h2>
        <p className="mt-2 text-[11px] text-fog">Kept safe for you, in total</p>
        <p className="font-price mt-8 text-4xl font-bold text-jade lg:text-6xl">{yuan(counted)}</p>
        <p className="mt-6 max-w-md text-[11px] leading-loose text-fog">
          Strictly speaking, this money never existed. But the calm of having kept it, and the joy of counting three rows of commas, are real.
        </p>
        {saved > 0 && (
          <button
            onClick={() => setConvIdx((convIdx + 1) % convCount)}
            className="quiet-link mt-8 inline-block text-[11px] text-jade"
          >
            {conv ? (
              <>≈ {convN.toLocaleString('en-US')} {conv.unit}{conv.suffix ?? ''}</>
            ) : (
              <>≈ many years of you, safe and sound</>
            )}
            <span className="ml-2 opacity-60">convert ⟳</span>
          </button>
        )}
      </section>

      {/* 本月小结 */}
      <section className="mt-24 px-6 lg:mt-40">
        <h2 className="font-lux text-lg text-ivory lg:text-2xl">This Month</h2>
        {monthOrders.length > 0 ? (
          <p className="mt-6 max-w-md text-[11px] leading-loose text-fog">
            This month your heart raced <span className="font-price text-ivory">{monthOrders.length}</span> times, keeping{' '}
            <span className="font-price text-jade">{yuan(monthSaved)}</span> safe.
            <br />
            Rich in solitude. The solitude is fake; the looking was real.
          </p>
        ) : (
          <p className="mt-6 max-w-md text-[11px] leading-loose text-fog">No heart-flutters this month yet. That's fine too. The hall is always open, come anytime.</p>
        )}
        {topUrge && (
          <p className="mt-6 max-w-md border-l border-hairline pl-5 text-[10px] leading-loose text-fog">
            Your heart races most often over "{topUrge}". Just keeping note, nothing more by it.
          </p>
        )}
      </section>

      {/* 金库：这里是全站唯一真实的东西 */}
      <EditorialImage
        src="/img/ed-vault.jpg"
        alt="A closed round steel vault door, bolts arrayed in a ring"
        caption="This is where the money you kept is stored. A metaphor, of course. But the money really did go unspent."
      />

      {/* 入口 */}
      <nav className="mt-24 lg:mt-40">
        <Link
          to="/orders"
          className="flex items-center justify-between border-t border-hairline px-6 py-6 text-xs text-ivory"
        >
          <span>🎩 Butler</span>
          <span className="text-[10px] text-fog">{orders.length} orders, all in transit ›</span>
        </Link>
        <Link
          to="/about"
          className="flex items-center justify-between border-t border-hairline px-6 py-6 text-xs text-ivory"
        >
          <span>🏛️ About</span>
          <span className="text-[10px] text-fog">›</span>
        </Link>
        <button
          onClick={() => setConfirmClear(true)}
          className="flex w-full items-center justify-between border-y border-hairline px-6 py-6 text-xs text-ivory"
        >
          <span>🕯️ Renounce it all</span>
          <span className="text-[10px] text-fog">›</span>
        </button>
      </nav>

      <p className="px-6 pt-16 text-[9px] leading-loose tracking-wider text-fog">{PRIVACY_FOOTER}</p>

      {/* 温柔的二次确认 */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-10">
          <div className="pop-in w-full max-w-72 bg-ink p-9">
            <p className="text-3xl">🕯️</p>
            <p className="font-lux mt-6 text-base text-ivory">Renounce it all?</p>
            <p className="mt-3 text-[11px] leading-loose text-fog">
              What's virtual is gone once it's scattered. The calm of having kept it can't be deleted, and it takes nothing real from you.
            </p>
            <div className="mt-10 flex items-center gap-8">
              <button onClick={clearAll} className="gold-cta px-8 py-2.5 text-[11px] tracking-widest">
                Renounce
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="quiet-link text-[11px] tracking-widest text-fog transition-opacity hover:text-ivory"
              >
                Stay a while longer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
