import { useMemo, useState } from 'react'
import { useMoney } from '../lib/currency'
import { Link } from 'react-router-dom'
import { CONVERSIONS, memberLevel } from '../lib/copy'
import { getProduct } from '../lib/products'
import { useCountUp } from '../lib/hooks'
import { SITE_URL } from '../lib/site'
import { downloadAppointmentIcs } from '../lib/ics'
import { saveMonthlyCard } from '../lib/shareCard'
import { useToast } from '../components/Toast'
import { useStore } from '../lib/store'
import { IconCandle, IconHat } from '../components/icons'
import EditorialImage from '../components/EditorialImage'
import ProductCard from '../components/ProductCard'

export default function Me() {
  const money = useMoney()
  const { orders, saved, wishlist, appointments, cancelAppointment, waitlist, waitlistSince, leaveWaitlist } = useStore()
  const toast = useToast()
  const wishes = wishlist.map(getProduct).filter((p) => p !== undefined)
  // 过去七天的预约不悄悄蒸发：那个钟点真进过对方的日历，值得一句收场白
  const upcoming = appointments.filter((a) => a.at > Date.now() - 7 * 86400_000)
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
          <IconHat size={30} className="shrink-0 text-ivory" />
          <div className="min-w-0">
            <p className="font-lux text-2xl text-ivory lg:text-4xl">Esteemed Patron</p>
            <p className="mt-3 text-[10px] tracking-wider text-fog">
              {memberLevel(orders.length)}, {orders.length} orders placed
            </p>
            {/* localStorage 即全体客户名册，所以这句是实话 */}
            <p className="mt-1 text-[10px] tracking-wider text-fog">Client No. 1 of 1. The book is intimate.</p>
          </div>
        </div>
      </header>

      {/* 首付账本（治愈绿：全站唯一收起玩笑的地方，也是全站唯一的颜色） */}
      <section className="mt-24 px-6 lg:mt-40">
        <h2 className="font-lux text-2xl text-ivory lg:text-4xl">Downpayment Ledger</h2>
        <p className="mt-2 text-[11px] text-fog">Kept safe for you, in total</p>
        <p className="font-price mt-8 text-4xl font-bold text-jade lg:text-6xl">{money(counted)}</p>
        {saved > 0 ? (
          <p className="mt-6 max-w-md text-[11px] leading-loose text-fog">
            Strictly speaking, this money never existed. But the calm of having kept it, and the joy of counting three rows of commas, are real.
          </p>
        ) : (
          <p className="mt-6 max-w-md text-[11px] leading-loose text-fog">
            The ledger stands at zero commas. Your first order corrects this at no cost, which is the only way this house corrects anything.
          </p>
        )}
        {orders.length > 0 && (
          <p className="mt-6 max-w-md text-[10px] leading-loose text-fog">
            Market value of the collection, at 9% a year:{' '}
            <span className="font-price text-ivory">
              {money(orders.reduce((sum, o) => sum + o.total * (1 + 0.09 * ((Date.now() - o.createdAt) / 31536000000)), 0))}
            </span>
            . The appreciation is as real as the rest, and equally unspendable.
          </p>
        )}
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
            <span className="font-price text-jade">{money(monthSaved)}</span> safe.
            <br />
            Rich in solitude. The solitude is fake; the looking was real.
          </p>
        ) : (
          <p className="mt-6 max-w-md text-[11px] leading-loose text-fog">
            No heart-flutters this month yet. That's fine too.{' '}
            <Link to="/collection" className="quiet-link text-ivory">The hall is always open ›</Link>
          </p>
        )}
        {monthOrders.length > 0 && (
          <button
            onClick={() =>
              saveMonthlyCard({
                month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
                flutters: monthOrders.length,
                kept: monthSaved,
                downpayments: Math.floor(monthSaved / 2_000_000),
              })
            }
            className="quiet-link mt-6 inline-block text-[11px] text-jade"
          >
            Save this month as a card
          </button>
        )}
        {topUrge && (
          <p className="mt-6 max-w-md border-l border-hairline pl-5 text-[10px] leading-loose text-fog">
            Your heart races most often over "{topUrge}". Just keeping note, nothing more by it.
          </p>
        )}
      </section>

      {/* 预约：真日期真日历，假沙龙 */}
      {upcoming.length > 0 && (
        <section className="mt-24 px-6 lg:mt-40">
          <h2 className="font-lux text-lg text-ivory lg:text-2xl">Appointments</h2>
          <p className="mt-2 max-w-md text-[11px] leading-loose text-fog">
            The hours are real and so is your calendar. The salon will be ready, in the sense that it will not be there.
          </p>
          <div className="mt-6 max-w-md">
            {upcoming.map((a) => (
              <div key={a.id} className="flex items-baseline justify-between gap-4 border-t border-hairline py-4 last:border-b">
                <div className="min-w-0">
                  <p className="text-[11px] text-ivory">
                    {new Date(a.at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })},{' '}
                    {new Date(a.at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                  </p>
                  <p className="mt-1 truncate text-[10px] text-fog">
                    {a.boutique}
                    {a.productName ? `, regarding ${a.productName.split('·')[0].trim()}` : ''}
                  </p>
                  {a.at <= Date.now() && (
                    <p className="mt-1 text-[9px] leading-relaxed text-fog">
                      The hour came and went. Champagne was poured at five past; the room drank it.
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-baseline gap-4">
                  {a.at > Date.now() ? (
                    <>
                      {/* .ics 是全店唯一真的送达物；订完过几天想要文件，得在这儿能再拿一次 */}
                      <button
                        onClick={() => downloadAppointmentIcs(a.productName, a.boutique, new Date(a.at))}
                        className="quiet-link text-[9px] text-fog hover:text-ivory"
                      >
                        Calendar file
                      </button>
                      <button
                        onClick={() => cancelAppointment(a.id)}
                        className="quiet-link text-[9px] text-fog hover:text-ivory"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => cancelAppointment(a.id)}
                      className="quiet-link text-[9px] text-fog hover:text-ivory"
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 等候名单：配货旗舰的另一条队。名单不动，排位因此终身优秀 */}
      {Object.keys(waitlist).length > 0 && (
        <section className="mt-24 px-6 lg:mt-40">
          <h2 className="font-lux text-lg text-ivory lg:text-2xl">Waiting Lists</h2>
          <p className="mt-2 max-w-md text-[11px] leading-loose text-fog">
            The lists do not move. Your positions are therefore permanently excellent.
          </p>
          <div className="mt-6 max-w-md">
            {Object.entries(waitlist).map(([id, pos]) => {
              const p = getProduct(id)
              if (!p) return null
              return (
                <div key={id} className="flex items-baseline justify-between gap-4 border-t border-hairline py-4 last:border-b">
                  <div className="min-w-0">
                    <Link to={`/product/${id}`} className="block truncate text-[11px] text-ivory hover:underline">
                      {p.name}
                    </Link>
                    <p className="mt-1 text-[10px] text-fog">
                      No. <span className="font-price text-ivory">{pos.toLocaleString('en-US')}</span> in line
                      {(() => {
                        const since = waitlistSince[id]
                        if (!since) return ', precisely where you stood yesterday'
                        const d = Math.floor((Date.now() - since) / 86400_000)
                        return d === 0
                          ? ', as of today. The queue admired your decisiveness'
                          : `, day ${d} of the wait. Seniority accrues even when nothing else does`
                      })()}
                    </p>
                  </div>
                  <button
                    onClick={() => leaveWaitlist(id)}
                    className="quiet-link shrink-0 text-[9px] text-fog hover:text-ivory"
                  >
                    Leave
                  </button>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 心愿单：想要而未认购的。想要本身就值得建档 */}
      {wishes.length > 0 && (
        <section className="mt-24 px-6 lg:mt-40">
          <div className="flex items-baseline justify-between">
            <h2 className="font-lux text-lg text-ivory lg:text-2xl">The Wish List</h2>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(`${SITE_URL}/collection?ids=${wishlist.join(',')}`)
                  toast('The list is on your clipboard. Wanting, forwarded, is still free.')
                } catch {
                  toast('The clipboard declined. The wanting remains yours alone.')
                }
              }}
              className="quiet-link shrink-0 text-[10px] text-fog hover:text-ivory"
            >
              Copy share link
            </button>
          </div>
          <p className="mt-2 max-w-md text-[11px] leading-loose text-fog">
            {wishes.length === 1 ? 'One piece, wanted and on file.' : `${wishes.length} pieces, wanted and on file.`}{' '}
            Wanting is kept here at the same temperature as owning.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
            {wishes.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

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
          <span>Butler</span>
          <span className="text-[10px] text-fog">
            {(() => {
              if (orders.length === 0) return '0 orders ›'
              const arrived = orders.filter((o) => Date.now() - o.createdAt >= 7 * 86400_000).length
              const transit = orders.length - arrived
              if (arrived === 0) return `${orders.length} orders, all in transit ›`
              if (transit === 0) return `${orders.length} orders, all arrived, nowhere ›`
              return `${orders.length} orders, ${transit} in transit, ${arrived} on display in the heart ›`
            })()}
          </span>
        </Link>
        <Link
          to="/vitrine"
          className="flex items-center justify-between border-t border-hairline px-6 py-6 text-xs text-ivory"
        >
          <span>The Vitrine</span>
          <span className="text-[10px] text-fog">the private collection, on view nowhere ›</span>
        </Link>
        <Link
          to="/about"
          className="flex items-center justify-between border-t border-hairline px-6 py-6 text-xs text-ivory"
        >
          <span>About</span>
          <span className="text-[10px] text-fog">›</span>
        </Link>
        <button
          onClick={() => setConfirmClear(true)}
          className="flex w-full items-center justify-between border-y border-hairline px-6 py-6 text-xs text-ivory"
        >
          <span>Renounce it all</span>
          <span className="text-[10px] text-fog">›</span>
        </button>
      </nav>

      {/* 法务小字统一挪到全站页脚，别一页一份 */}

      {/* 温柔的二次确认 */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-10">
          <div className="pop-in w-full max-w-72 bg-ink p-9">
            <IconCandle size={30} className="text-ivory" />
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
