import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../lib/types'
import { MARQUEE_CITIES } from '../lib/copy'
import { referenceOf } from '../lib/spec'
import { yuan } from '../lib/format'
import { useStore } from '../lib/store'
import { useMoney } from '../lib/currency'
import { downloadAppointmentIcs } from '../lib/ics'
import { SITE_URL } from '../lib/site'
import { savePriceCard } from '../lib/shareCard'
import { useToast } from './Toast'

/**
 * 礼宾服务：Book an appointment / Contact an ambassador / Request price / Find in boutique。
 *
 * 真店的商品页把人往「人」那里引（Cartier 一页八个 CTA，只有一个是买）；
 * 此前这四个只弹一句 toast——现在是四个真流程：
 *   预约有日期有时段有沙龙，**下载的 .ics 是真的**（全店唯一真的送达物是一条日历邀请）；
 *   大使有可持续的通信线程（回信存 localStorage，隔次回访还在）；
 *   问价回一份书面价格确认书；找门店给一张网点表，八家门店库存整齐划一地为 0。
 * 玩笑照旧只在绿色处收口：能省下/能确认的都是真的，能送达的都不是。
 */

/* ------------------------------------------------------------------ 弹层 */

function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 lg:items-center" onClick={onClose}>
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="pop-in max-h-[86dvh] w-full max-w-md overflow-y-auto bg-ink p-8 focus:outline-none lg:p-10"
      >
        <div className="flex items-baseline justify-between gap-6">
          <h2 className="font-lux text-base text-ivory">{title}</h2>
          <button onClick={onClose} className="quiet-link shrink-0 text-[10px] text-fog hover:text-ivory">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const chip = (selected: boolean) =>
  `border px-3 py-2 text-left text-[10px] leading-relaxed transition-colors ${
    selected ? 'border-ivory text-ivory' : 'border-hairline text-fog hover:border-ivory/40'
  }`

/* ------------------------------------------------------------------ 预约 */

const BOUTIQUES = MARQUEE_CITIES.map((m) => ({ city: m.city, name: `Maison Zéro, ${m.spot}` }))
const SLOTS = ['10:30', '12:00', '15:00', '16:30', '18:00']

/** 未来 10 天（跳过今天：沙龙需要一晚来准备它并不存在的様子） */
function nextDays(): { label: string; date: Date }[] {
  const out = []
  for (let i = 1; i <= 10; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    out.push({ label: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }), date: d })
  }
  return out
}



function AppointmentSheet({ product, onClose }: { product?: Product; onClose: () => void }) {
  const { bookAppointment } = useStore()
  const days = useRef(nextDays()).current
  const [boutique, setBoutique] = useState(BOUTIQUES[0].name)
  const [day, setDay] = useState<number | null>(null)
  const [slot, setSlot] = useState<string | null>(null)
  const [done, setDone] = useState<Date | null>(null)

  const confirm = () => {
    if (day === null || !slot) return
    const at = new Date(days[day].date)
    const [h, m] = slot.split(':').map(Number)
    at.setHours(h, m, 0, 0)
    bookAppointment({ productId: product?.id, productName: product?.name, boutique, at: at.getTime() })
    setDone(at)
  }

  if (done) {
    return (
      <Sheet title="Appointment confirmed" onClose={onClose}>
        <p className="mt-6 max-w-sm text-[11px] leading-loose text-fog">
          {done.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, {SLOTS.find((s) => s === slot)},{' '}
          {boutique}. The salon will be expecting you. The salon does not exist, but the hour is yours, and the
          calendar is real.
        </p>
        <button onClick={() => downloadAppointmentIcs(product?.name, boutique, done)} className="gold-cta mt-8 w-full py-3 text-xs tracking-[0.2em]">
          Add to calendar
        </button>
        <p className="mt-3 text-[8px] leading-relaxed text-fog">
          The invitation file is genuine and will arrive instantly. It is the only thing in this house that ships.
        </p>
        <button onClick={onClose} className="quiet-link mt-6 text-[10px] text-fog hover:text-ivory">
          Done
        </button>
      </Sheet>
    )
  }

  return (
    <Sheet title="Book an appointment" onClose={onClose}>
      {product && <p className="mt-2 text-[10px] text-fog">Regarding {product.name.split('·')[0].trim()}</p>}

      <p className="font-lux mt-6 text-[11px] text-ivory">The boutique</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {BOUTIQUES.map((b) => (
          <button key={b.name} onClick={() => setBoutique(b.name)} className={chip(boutique === b.name)}>
            {b.city}
          </button>
        ))}
      </div>

      <p className="font-lux mt-7 text-[11px] text-ivory">The day</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {days.map((d, i) => (
          <button key={d.label} onClick={() => setDay(i)} className={chip(day === i)}>
            {d.label}
          </button>
        ))}
      </div>

      <p className="font-lux mt-7 text-[11px] text-ivory">The hour</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SLOTS.map((s) => (
          <button key={s} onClick={() => setSlot(s)} className={chip(slot === s)}>
            {s}
          </button>
        ))}
      </div>

      <button
        onClick={confirm}
        disabled={day === null || !slot}
        className="gold-cta mt-8 w-full py-3 text-xs tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Confirm the hour
      </button>
      <p className="mt-3 text-[8px] leading-relaxed text-fog">
        Champagne is poured at five minutes past. Whether anyone drinks it is between the glass and the room.
      </p>
    </Sheet>
  )
}

/* ------------------------------------------------------------------ 通信间 */

interface AmbMsg {
  who: 'you' | 'amb'
  text: string
  at: number
}

interface Persona {
  storageKey: string
  name: string
  presence: string
  greeting: (product?: Product) => string
  routes: { re: RegExp; make: (p?: Product) => string[]; book?: boolean }[]
  fallback: string[]
  quickAsks: string[]
}

/**
 * 大使听得懂你在说什么（在「彬彬有礼地答非所问」的限度内）。
 * 关键词路由 → 各自的回信小池；都不匹配才落回通用池。
 * 这是让通信「像真的」的最便宜也最有效的一层：问价真的报价，问货真的报进度。
 */
const AMBASSADOR: Persona = {
  storageKey: 'flgj.ambassador',
  name: 'The Ambassador',
  presence: 'Present, as always. Replies in ink.',
  greeting: (product) => {
    const h = new Date().getHours()
    const tod = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
    return product
      ? `Good ${tod}. I see the ${product.name.split('·')[0].trim()} has caught your eye. An excellent thing to be caught by. How may I be of no help?`
      : `Good ${tod}. You are most welcome. How may I be of no help?`
  },
  routes: [
    {
      re: /price|cost|how much|expensive|afford|pay/i,
      make: (p) =>
        p
          ? [
              `The ${p.name.split('·')[0].trim()} is ${yuan(p.price)}, of which the payable portion is ¥0.00. Both figures are final; only one will ever trouble you.`,
              `${yuan(p.price)}, in full. Payable, ¥0.00. The difference is our gift, and our entire business model.`,
            ]
          : ['Every price in the house is confirmed at ¥0.00 payable. The figures above it are for atmosphere.'],
    },
    {
      re: /ship|deliver|arriv|track|when|where.*order|status/i,
      make: () => [
        'Your order is under white-glove escort. At this hour the butler is at the Alpine pass, watching the snow on your behalf. Arrival is scheduled for the moment after always.',
        'It is in transit, and will remain so with great dignity. Transit is the finest room in the house.',
      ],
    },
    {
      re: /return|refund|cancel|money back/i,
      make: () => [
        'Returns are accepted within thirty days. In our history nothing has ever been returned, there being nothing to send back. Our satisfaction rate is therefore perfect.',
      ],
    },
    {
      re: /appointment|book|visit|come in|see it|salon|boutique/i,
      book: true,
      make: () => ['With the greatest pleasure. I shall fetch the appointment book. It is bound in leather and entirely blank.'],
    },
    {
      re: /real|exist|actually|true|scam|fake|joke/i,
      make: () => [
        'Everything here is real except the goods. The wanting is real, the calm is real, and the ¥0.00 is extremely real.',
        'The house is entirely sincere about being entirely fictional. Few establishments can say as much.',
      ],
    },
    {
      re: /\b(hi|hello|hey|good (morning|afternoon|evening)|bonjour)\b/i,
      make: () => ['A very good day to you. You are most welcome here. May I confirm that nothing is available?'],
    },
    {
      re: /thank|merci|appreciated/i,
      make: () => ['It is nothing. Quite literally, it is nothing, and it was our honour to provide it.'],
    },
    {
      re: /\b(bye|goodbye|farewell|good night)\b/i,
      make: () => ['Until next time. The house never closes, having never quite opened.'],
    },
    {
      re: /love|beautiful|gorgeous|stunning|want (it|this)|wish/i,
      make: () => ['Taste of this calibre is rare, if I may say so. I have noted it in your file, in ink.'],
    },
  ],
  fallback: [
    'Your message has been read aloud in the salon, to general approval. Nothing further was decided.',
    'Noted with pleasure. Your enquiry has been passed upward, where it will be admired rather than answered.',
    'A considered reply is being drafted. Drafting is, as you know from our deliveries, a long art.',
    'The ambassador read your message twice, the second time purely for the pleasure of it.',
  ],
  quickAsks: ['Will it ever ship?', 'Confirm the price', 'Book an appointment', 'Is any of this real?'],
}

/** 管家：订单页的通信间。同一个抽屉，另一副手套 */
const BUTLER: Persona = {
  storageKey: 'flgj.butler',
  name: 'Butler · Alfred',
  presence: 'Ironing the gloves. Replies between creases.',
  greeting: () =>
    'Good day. The parcel and I are both in excellent health. Neither of us is any closer, and neither of us is worried.',
  routes: [
    {
      re: /where|when|arriv|deliver|ship|track|status|news|update/i,
      make: () => [
        'Since you ask: we have cleared the Alpine pass. The snow was exceptional and I watched it on your behalf for an extra half hour. That half hour is on the house.',
        'The captain is still waiting for weather worthy of the cargo. Today the clouds were merely adequate, and he refuses to insult you with adequate clouds.',
        'Your order rests tonight in the Swiss bonded vault, at 55% humidity, guarded in three shifts. It currently lives better than either of us.',
      ],
    },
    {
      re: /glove|hand|ready/i,
      make: () => [
        'Of the twelve pairs I own, none is yet worthy of your doorbell. I have written to Milan. Milan takes its time, as do we all.',
      ],
    },
    {
      re: /confirm|receipt|received|sign/i,
      make: () => [
        'I would advise against confirming receipt. While it is in transit, no one can take it from you. In transit, it is safest of all.',
      ],
    },
    {
      re: /hurry|faster|late|slow|angry|upset/i,
      make: () => [
        'In our trade, haste is unbecoming. Your patience has been noted in your file, in the finest hand I could manage on a moving train.',
      ],
    },
    {
      // 顺序即优先级：「Thank the captain」含 thank，谢词在前的话船长永远收不到谢意
      re: /captain/i,
      make: () => ['The captain sends his regards, and a weather report of considerable beauty. He asks for nothing but sky.'],
    },
    {
      re: /thank|merci/i,
      make: () => ['It is my honour. The bow I have just performed was, if I may say so, one of my better ones.'],
    },
  ],
  fallback: [
    'Your ring was carried to the front of the vehicle on a silver tray. It has been read. The vehicle has not moved.',
    'You have been upgraded to Priority Non-Delivery. Your wait will now be expedited, at no extra charge.',
    'Good news: among all undelivered orders worldwide, yours remains first.',
    'A lovely ring. It was the only sound in the estate today, and we were all grateful for it.',
  ],
  quickAsks: ['Where is my order?', 'Any news at all?', 'Are the gloves ready?', 'Thank the captain'],
}

function loadThread(key: string): AmbMsg[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]')
  } catch {
    return []
  }
}

const hhmm = (t: number) => new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

function replyFor(persona: Persona, text: string, product?: Product): { reply: string; book: boolean } {
  const route = persona.routes.find((r) => r.re.test(text))
  const pool = route ? route.make(product) : persona.fallback
  return { reply: pool[Math.floor(Math.random() * pool.length)], book: route?.book === true }
}

/**
 * 通信间：整高侧滑抽屉（移动端全屏）。
 * 进门对方先开口；回信前有「正在提笔」；问什么答什么（persona.routes）；
 * 快捷问句一排；线程带时刻与「已读」；大使提到预约会真的去取预约簿。
 */
function ConciergeDrawer({
  persona,
  product,
  onBook,
  onClose,
}: {
  persona: Persona
  product?: Product
  onBook?: () => void
  onClose: () => void
}) {
  const [thread, setThread] = useState<AmbMsg[]>(() => loadThread(persona.storageKey))
  const [draft, setDraft] = useState('')
  const [composing, setComposing] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    localStorage.setItem(persona.storageKey, JSON.stringify(thread.slice(-60)))
    bottom.current?.scrollIntoView({ block: 'end' })
  }, [thread, persona.storageKey])

  useEffect(() => {
    const pending = timers.current // 卸载时清的是这一次挂载攒下的定时器，先取引用再进 cleanup
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      pending.forEach(clearTimeout)
    }
  }, [onClose])

  // 首次进门：对方先开口（真实通信的礼数），只在线程为空时发生一次，且会被存档
  useEffect(() => {
    if (thread.length > 0) return
    setComposing(true)
    timers.current.push(
      setTimeout(() => {
        setComposing(false)
        setThread([{ who: 'amb', text: persona.greeting(product), at: Date.now() }])
      }, 1100),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const send = (raw?: string) => {
    const text = (raw ?? draft).trim()
    if (!text) return
    setDraft('')
    setThread((t) => [...t, { who: 'you', text, at: Date.now() }])
    const { reply, book } = replyFor(persona, text, product)
    setComposing(true)
    timers.current.push(
      setTimeout(() => {
        setComposing(false)
        setThread((t) => [...t, { who: 'amb', text: reply, at: Date.now() }])
        if (book && onBook) timers.current.push(setTimeout(onBook, 1200))
      }, 1600 + Math.random() * 1600),
    )
  }

  const lastYou = [...thread].reverse().find((m) => m.who === 'you')
  const answered = lastYou && thread.some((m) => m.who === 'amb' && m.at > lastYou.at)

  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Correspondence with ${persona.name}`}
        onClick={(e) => e.stopPropagation()}
        className="drawer-in absolute right-0 top-0 flex h-full w-full flex-col border-l border-hairline bg-ink lg:max-w-[420px]"
      >
        {/* 抬头：在场感。不用绿点做在线灯——绿只属于省钱与安抚 */}
        <div className="flex items-baseline justify-between border-b border-hairline px-6 py-4">
          <div>
            <p className="font-lux text-sm text-ivory">{persona.name}</p>
            <p className="mt-0.5 text-[9px] text-fog">{persona.presence}</p>
          </div>
          <button onClick={onClose} className="quiet-link text-[10px] text-fog hover:text-ivory">
            Close
          </button>
        </div>

        {product && (
          <p className="border-b border-hairline px-6 py-2.5 text-[9px] text-fog">
            Regarding {product.name.split('·')[0].trim()}, Ref. {referenceOf(product)}
          </p>
        )}

        {/* 线程 */}
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {thread.map((m, i) => {
            const prev = thread[i - 1]
            const newDay = !prev || new Date(prev.at).toDateString() !== new Date(m.at).toDateString()
            return (
              <div key={m.at + m.who + i}>
                {newDay && (
                  <p className="mb-5 text-center text-[8px] tracking-wider text-fog">
                    {new Date(m.at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                )}
                <div className={m.who === 'you' ? 'text-right' : ''}>
                  <p className="text-[8px] text-fog">
                    {m.who === 'you' ? 'You' : persona.name}, {hhmm(m.at)}
                  </p>
                  <p
                    className={`mt-1.5 inline-block max-w-[85%] text-left text-[11px] leading-relaxed ${
                      m.who === 'you' ? 'border border-hairline px-3.5 py-2.5 text-ivory' : 'text-ivory'
                    }`}
                  >
                    {m.text}
                  </p>
                  {m.who === 'you' && lastYou && m.at === lastYou.at && answered && (
                    <p className="mt-1 text-[8px] text-fog">Read, on a silver tray</p>
                  )}
                </div>
              </div>
            )
          })}
          {composing && (
            <p className="text-[10px] text-fog" aria-live="polite">
              {persona.name.split('·')[0].trim()} is writing
              <span className="quill-dot">.</span>
              <span className="quill-dot">.</span>
              <span className="quill-dot">.</span>
            </p>
          )}
          <div ref={bottom} />
        </div>

        {/* 快捷问句 + 输入 */}
        <div className="border-t border-hairline px-6 pb-6 pt-4">
          <div className="flex flex-wrap gap-2">
            {persona.quickAsks.map((q) => (
              <button key={q} onClick={() => send(q)} className={chip(false)}>
                {q}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 border-b border-hairline pb-2 transition-colors focus-within:border-ivory">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && send()}
              placeholder="Write to the house"
              aria-label={`Message to ${persona.name}`}
              autoFocus={typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches}
              className="min-w-0 flex-1 bg-transparent py-1 text-xs text-ivory placeholder:text-fog focus:outline-none"
            />
            <button onClick={() => send()} className="quiet-link shrink-0 text-[10px] text-ivory">
              Send
            </button>
          </div>
          <p className="mt-3 text-[8px] leading-relaxed text-fog">
            Correspondence is kept on this device, in full, forever. It is the most reliable archive we operate.
          </p>
        </div>
      </div>
    </div>
  )
}

/** 订单页用的管家通信间 */
/** 谢幕之后管家的口径要换：时间线都说 Delivered 了，再答「在阿尔卑斯看雪」就是穿帮 */
const ARRIVED_ROUTE = {
  re: /where|when|order|ship|arriv|track|status|news/i,
  make: () => [
    'Delivered, in the only sense we practice. It sits in the showroom of your heart; I dust it on Tuesdays.',
    'The escort has concluded. The piece is in residence where nothing can reach it, including couriers.',
  ],
}

export function ButlerDrawer({ onClose, arrived = false }: { onClose: () => void; arrived?: boolean }) {
  const persona = arrived ? { ...BUTLER, routes: [ARRIVED_ROUTE, ...BUTLER.routes] } : BUTLER
  return <ConciergeDrawer persona={persona} onClose={onClose} />
}

/* ------------------------------------------------------------------ 赠礼 */

/**
 * 赠礼链接：纯 URL、零后端。收礼人打开 /?gift=<id>&from=<name>，
 * 接受后整单入账进对方的账本——每个用户都成了发行渠道。
 */
function GiftSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  const toast = useToast()
  const money = useMoney()
  const [from, setFrom] = useState('')
  const [copied, setCopied] = useState(false)
  const link = `${SITE_URL}/?gift=${product.id}${from.trim() ? `&from=${encodeURIComponent(from.trim().slice(0, 20))}` : ''}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      toast('The clipboard declined. The link remains above, yours to copy by hand.')
    }
  }

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <Sheet title="Send as a gift" onClose={onClose}>
      <p className="mt-2 max-w-sm text-[10px] leading-loose text-fog">
        {product.name.split('·')[0].trim()}, {money(product.price)}, wrapped and sent for {money(0)}. It will never arrive,
        which keeps it forever on the way to them.
      </p>
      <div className="mt-6 flex items-center gap-3 border-b border-hairline pb-2 transition-colors focus-within:border-ivory">
        <input
          value={from}
          onChange={(e) => setFrom(e.target.value.slice(0, 20))}
          placeholder="Your name on the card (optional)"
          aria-label="Your name on the gift card"
          className="min-w-0 flex-1 bg-transparent py-1 text-xs text-ivory placeholder:text-fog focus:outline-none"
        />
      </div>
      <p className="mt-5 break-all border border-hairline px-3 py-2.5 text-[9px] leading-relaxed text-fog">{link}</p>
      <div className="mt-5 flex items-center gap-6">
        <button onClick={copy} className="gold-cta px-8 py-2.5 text-[11px] tracking-[0.2em]">
          {copied ? 'Copied' : 'Copy the link'}
        </button>
        {canShare && (
          <button
            onClick={() => navigator.share({ title: 'A gift from Maison Zéro', url: link }).catch(() => {})}
            className="quiet-link text-[10px] text-ivory"
          >
            Share
          </button>
        )}
      </div>
      <p className="mt-4 text-[8px] leading-relaxed text-fog">
        The link is the parcel. Everything else about the gift is, as usual, a description.
      </p>
    </Sheet>
  )
}

/* ------------------------------------------------------------------ 问价 */

function PriceSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  const money = useMoney()
  return (
    <Sheet title="Price, confirmed in writing" onClose={onClose}>
      <div className="mt-6 border border-hairline p-6">
        <p className="font-lux text-sm text-ivory">Maison Zéro</p>
        <p className="mt-1 text-[9px] text-fog">Bureau of Written Confirmations</p>
        <div className="my-5 h-px w-12 bg-hairline" />
        <p className="max-w-sm text-[11px] leading-loose text-fog">
          Further to your enquiry regarding <span className="text-ivory">{product.name.split('·')[0].trim()}</span>{' '}
          (Ref. {referenceOf(product)}), the house confirms the price as{' '}
          <span className="font-price text-ivory">{money(product.price)}</span>, of which the payable portion is
        </p>
        <p className="font-price mt-4 text-3xl font-semibold text-jade">{money(0)}</p>
        <p className="mt-4 max-w-sm text-[9px] leading-relaxed text-fog">
          This confirmation is binding. The figure will not rise; it has nowhere to go. Issued{' '}
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, valid in
          perpetuity, honoured nowhere.
        </p>
      </div>
      <div className="mt-6 flex items-center gap-6">
        <button onClick={() => savePriceCard(product)} className="gold-cta px-8 py-2.5 text-[11px] tracking-[0.2em]">
          Save as image
        </button>
        <button onClick={onClose} className="quiet-link text-[10px] text-fog hover:text-ivory">
          Keep it
        </button>
      </div>
    </Sheet>
  )
}

/* ------------------------------------------------------------------ 门店 */

function BoutiqueSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  const toast = useToast()
  return (
    <Sheet title="Find in boutique" onClose={onClose}>
      <p className="mt-2 max-w-sm text-[10px] leading-loose text-fog">
        Availability of {product.name.split('·')[0].trim()}, across all eight maisons, checked just now.
      </p>
      <div className="mt-5">
        {BOUTIQUES.map((b, i) => (
          <div key={b.name} className="flex items-center justify-between gap-4 border-t border-hairline py-3.5 last:border-b">
            <div className="min-w-0">
              <p className="truncate text-[11px] text-ivory">{b.name}</p>
              <p className="mt-0.5 text-[9px] text-fog">
                {b.city}, open 10:00 to {18 + (i % 3)}:00
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-price text-[11px] text-ivory">0 in boutique</p>
              <button
                onClick={() => toast('Noted. The boutique will call the moment it exists.')}
                className="quiet-link mt-0.5 text-[9px] text-fog hover:text-ivory"
              >
                Notify me
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[8px] leading-relaxed text-fog">
        Availability is identical in every location. The house finds this fair, and fairness is a luxury.
      </p>
    </Sheet>
  )
}

/* ------------------------------------------------------------------ 那一排 */

export default function ConciergeRow({ product }: { product: Product }) {
  const { wishlist, toggleWish } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState<null | 'appointment' | 'ambassador' | 'price' | 'boutique' | 'gift'>(null)
  const wished = wishlist.includes(product.id)

  return (
    <>
      {/* 客务台：与真店同款的「服务栈」——一列发丝线行，不再是一把散落的内联链接
          （六个下划线词挤成两行，末尾还悬一个孤儿）。行款借预约/门店表的现成语言 */}
      <div className="mt-10 max-w-md">
        <button
          onClick={() => {
            toggleWish(product.id)
            toast(
              wished
                ? 'Removed from the wish list. The wanting was real while it lasted.'
                : 'Added to the wish list. Wanting, now on file. The file is kept in your browser, like your fortune.',
            )
          }}
          className="group flex w-full items-center justify-between gap-4 border-t border-hairline py-3.5 text-left"
        >
          <span className={`text-[11px] ${wished ? 'text-jade' : 'text-ivory'}`}>
            {wished ? 'In your wish list' : 'Add to wish list'}
          </span>
          <span aria-hidden="true" className={`text-[11px] ${wished ? 'text-jade' : 'text-fog'}`}>
            {wished ? '✓' : '+'}
          </span>
        </button>
        {(
          [
            ['ambassador', 'Contact an ambassador', 'She is at her desk'],
            ['appointment', 'Book an appointment', 'The hours are real'],
            ['boutique', 'Find in boutique', '0 in all eight'],
            ['price', 'Request price', 'Confirmed in writing'],
            ['gift', 'Send as a gift', 'Arrives for no one'],
          ] as const
        ).map(([key, label, note]) => (
          <button
            key={key}
            onClick={() => setOpen(key)}
            className="group flex w-full items-center justify-between gap-4 border-t border-hairline py-3.5 text-left last:border-b"
          >
            <span className="text-[11px] text-ivory">{label}</span>
            <span className="flex shrink-0 items-baseline gap-2 text-[9px] text-fog">
              <span className="min-w-0 truncate">{note}</span>
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">›</span>
            </span>
          </button>
        ))}
      </div>

      {open === 'appointment' && <AppointmentSheet product={product} onClose={() => setOpen(null)} />}
      {open === 'ambassador' && (
        <ConciergeDrawer persona={AMBASSADOR} product={product} onBook={() => setOpen('appointment')} onClose={() => setOpen(null)} />
      )}
      {open === 'gift' && <GiftSheet product={product} onClose={() => setOpen(null)} />}
      {open === 'price' && <PriceSheet product={product} onClose={() => setOpen(null)} />}
      {open === 'boutique' && <BoutiqueSheet product={product} onClose={() => setOpen(null)} />}
    </>
  )
}
