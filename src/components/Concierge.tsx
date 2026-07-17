import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../lib/types'
import { MARQUEE_CITIES } from '../lib/copy'
import { referenceOf } from '../lib/spec'
import { yuan } from '../lib/format'
import { useStore } from '../lib/store'
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

/** .ics 是全店唯一真的送达物：日历邀请。字段全按 RFC 5545，能进真日历 */
function downloadIcs(productName: string | undefined, boutique: string, at: Date) {
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,')
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const end = new Date(at.getTime() + 45 * 60000)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maison Zero//LuxuryNeverComes//EN',
    'BEGIN:VEVENT',
    `UID:${at.getTime()}@luxurynevercomes`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(at)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(`Private appointment, ${boutique}`)}`,
    `DESCRIPTION:${esc(
      `${productName ? `Regarding ${productName}. ` : ''}The salon will be expecting you. The salon does not exist, but the hour is yours.`,
    )}`,
    `LOCATION:${esc(boutique)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'maison-zero-appointment.ics'
  a.click()
  URL.revokeObjectURL(url)
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
        <button onClick={() => downloadIcs(product?.name, boutique, done)} className="gold-cta mt-8 w-full py-3 text-xs tracking-[0.2em]">
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

/* ------------------------------------------------------------------ 大使 */

interface AmbMsg {
  who: 'you' | 'amb'
  text: string
  at: number
}

const AMB_KEY = 'flgj.ambassador'

const AMB_REPLIES = [
  'Your message has been read aloud in the salon, to general approval. Nothing further was decided.',
  'The ambassador thanks you for writing. He has filed your letter under Correspondence, Cherished.',
  'Noted with pleasure. Your enquiry has been passed upward, where it will be admired rather than answered.',
  'The house is delighted to hear from you. Deliveries remain as scheduled, which is to say, remain.',
  'A considered reply is being drafted. Drafting is, as you know from our deliveries, a long art.',
  'The ambassador read your message twice, the second time for the pleasure of it.',
]

function loadThread(): AmbMsg[] {
  try {
    return JSON.parse(localStorage.getItem(AMB_KEY) ?? '[]')
  } catch {
    return []
  }
}

function AmbassadorSheet({ product, onClose }: { product?: Product; onClose: () => void }) {
  const [thread, setThread] = useState<AmbMsg[]>(loadThread)
  const [draft, setDraft] = useState('')
  const [composing, setComposing] = useState(false)
  const bottom = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem(AMB_KEY, JSON.stringify(thread.slice(-40)))
    bottom.current?.scrollIntoView({ block: 'nearest' })
  }, [thread])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setDraft('')
    setThread((t) => [...t, { who: 'you', text, at: Date.now() }])
    setComposing(true)
    const reply = AMB_REPLIES[Math.floor(Math.random() * AMB_REPLIES.length)]
    setTimeout(() => {
      setComposing(false)
      setThread((t) => [...t, { who: 'amb', text: reply, at: Date.now() }])
    }, 1800 + Math.random() * 1600)
  }

  return (
    <Sheet title="Contact an ambassador" onClose={onClose}>
      {product && <p className="mt-2 text-[10px] text-fog">Regarding {product.name.split('·')[0].trim()}</p>}

      <div className="mt-6 max-h-64 space-y-4 overflow-y-auto">
        {thread.length === 0 && (
          <p className="max-w-sm text-[10px] leading-loose text-fog">
            The ambassador is at his desk. He answers every letter, and answers nothing in them.
          </p>
        )}
        {thread.map((m, i) => (
          <div key={i} className={m.who === 'you' ? 'text-right' : ''}>
            <p className="text-[8px] text-fog">{m.who === 'you' ? 'You' : 'The Ambassador'}</p>
            <p className={`mt-1 inline-block max-w-[85%] text-left text-[11px] leading-relaxed ${m.who === 'you' ? 'border border-hairline px-3 py-2 text-ivory' : 'text-ivory'}`}>
              {m.text}
            </p>
          </div>
        ))}
        {composing && <p className="text-[9px] text-fog">The ambassador is composing, with a fountain pen, slowly</p>}
        <div ref={bottom} />
      </div>

      <div className="mt-6 flex items-center gap-3 border-b border-hairline pb-2 transition-colors focus-within:border-ivory">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Write to the house"
          aria-label="Message to the ambassador"
          className="min-w-0 flex-1 bg-transparent py-1 text-xs text-ivory placeholder:text-fog focus:outline-none"
        />
        <button onClick={send} className="quiet-link shrink-0 text-[10px] text-ivory">
          Send
        </button>
      </div>
      <p className="mt-3 text-[8px] leading-relaxed text-fog">
        Correspondence is kept on this device, in full, forever. It is the most reliable archive we operate.
      </p>
    </Sheet>
  )
}

/* ------------------------------------------------------------------ 问价 */

function PriceSheet({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <Sheet title="Price, confirmed in writing" onClose={onClose}>
      <div className="mt-6 border border-hairline p-6">
        <p className="font-lux text-sm text-ivory">Maison Zéro</p>
        <p className="mt-1 text-[9px] text-fog">Bureau of Written Confirmations</p>
        <div className="my-5 h-px w-12 bg-hairline" />
        <p className="max-w-sm text-[11px] leading-loose text-fog">
          Further to your enquiry regarding <span className="text-ivory">{product.name.split('·')[0].trim()}</span>{' '}
          (Ref. {referenceOf(product)}), the house confirms the price as{' '}
          <span className="font-price text-ivory">{yuan(product.price)}</span>, of which the payable portion is
        </p>
        <p className="font-price mt-4 text-3xl font-semibold text-jade">¥0.00</p>
        <p className="mt-4 max-w-sm text-[9px] leading-relaxed text-fog">
          This confirmation is binding. The figure will not rise; it has nowhere to go. Issued{' '}
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}, valid in
          perpetuity, honoured nowhere.
        </p>
      </div>
      <button onClick={onClose} className="quiet-link mt-6 text-[10px] text-fog hover:text-ivory">
        Keep it
      </button>
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
  const [open, setOpen] = useState<null | 'appointment' | 'ambassador' | 'price' | 'boutique'>(null)
  const wished = wishlist.includes(product.id)

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
        <button
          onClick={() => {
            toggleWish(product.id)
            toast(
              wished
                ? 'Removed from the wish list. The wanting was real while it lasted.'
                : 'Added to the wish list. Wanting, now on file. The file is kept in your browser, like your fortune.',
            )
          }}
          className={`quiet-link text-[10px] ${wished ? 'text-jade' : 'text-ivory'}`}
        >
          {wished ? 'In your wish list' : 'Add to wish list'}
        </button>
        <button onClick={() => setOpen('ambassador')} className="quiet-link text-[10px] text-ivory">
          Contact an ambassador
        </button>
        <button onClick={() => setOpen('appointment')} className="quiet-link text-[10px] text-ivory">
          Book an appointment
        </button>
        <button onClick={() => setOpen('boutique')} className="quiet-link text-[10px] text-ivory">
          Find in boutique
        </button>
        <button onClick={() => setOpen('price')} className="quiet-link text-[10px] text-ivory">
          Request price
        </button>
      </div>

      {open === 'appointment' && <AppointmentSheet product={product} onClose={() => setOpen(null)} />}
      {open === 'ambassador' && <AmbassadorSheet product={product} onClose={() => setOpen(null)} />}
      {open === 'price' && <PriceSheet product={product} onClose={() => setOpen(null)} />}
      {open === 'boutique' && <BoutiqueSheet product={product} onClose={() => setOpen(null)} />}
    </>
  )
}
