import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRIVACY_FOOTER } from '../lib/copy'
import { PRODUCTS } from '../lib/products'
import { CURRENCIES, useCurrency } from '../lib/currency'
import { useToast } from './Toast'

/**
 * 页脚：奢侈品站的收尾方式（Dior / Cartier 那一路）——
 * 邮件订阅 + 几栏细链接 + 字标 + 法务小字。留白撑开，不画框不加装饰。
 *
 * 栏标题用宋体小字，不用「全大写宽字距」——那正是本站清掉的 eyebrow 签名。
 */

const COLUMNS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'The Maison',
    links: [
      { to: '/about', label: 'About the house' },
      { to: '/maisons', label: 'The houses' },
      { to: '/about', label: 'Image credits' },
    ],
  },
  {
    title: 'The Collection',
    links: [
      { to: '/collection', label: 'Everything' },
      { to: '/collection?sort=price-desc', label: 'Dearest first' },
      { to: '/collection?quota=1', label: 'By quota only' },
    ],
  },
  {
    title: 'Client Services',
    links: [
      { to: '/cart', label: 'Your reserve' },
      { to: '/orders', label: 'Ring the butler' },
      { to: '/me', label: 'Downpayment ledger' },
    ],
  },
]

const LIST_KEY = 'flgj.list'

export default function Footer() {
  const toast = useToast()
  const { currency, setCode } = useCurrency()
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(() => {
    try {
      return localStorage.getItem(LIST_KEY) === '1'
    } catch {
      return false
    }
  })

  return (
    <footer className="mt-32 border-t border-hairline lg:mt-40">
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-16 lg:pb-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_repeat(3,1fr)] lg:gap-16">
          {/* 订阅：真的不发，也真的不存。所以这行小字是这一整块里唯一严肃的话 */}
          <div>
            <h2 className="font-lux text-sm text-ivory">The mailing list</h2>
            <p className="mt-3 max-w-xs text-[11px] leading-loose text-fog">
              Be the first to hear about the pieces that will not arrive.
            </p>
            {joined ? (
              /* 订过就记得（记在本机）：回访不再劝订，这是真店的礼貌 */
              <p className="mt-6 max-w-xs text-[11px] leading-loose text-ivory">
                You are on the list. The first letter is being composed, indefinitely.{' '}
                <button
                  onClick={() => {
                    try {
                      localStorage.removeItem(LIST_KEY)
                    } catch {
                      /* 隐私模式下本就没存 */
                    }
                    setJoined(false)
                    toast('Struck from the list. You will now receive even less.')
                  }}
                  className="quiet-link text-[10px] text-fog hover:text-ivory"
                >
                  Sign off
                </button>
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!email.includes('@')) {
                    toast('The address wants an @. Even letters that never leave need somewhere not to go.')
                    return
                  }
                  setEmail('')
                  try {
                    localStorage.setItem(LIST_KEY, '1')
                  } catch {
                    /* 隐私模式：订阅状态不持久化，玩笑照常成立 */
                  }
                  setJoined(true)
                  toast('Noted. We will write to you about nothing, at length, and never send it.')
                }}
                className="mt-6 flex max-w-xs items-center gap-3 border-b border-hairline pb-2 transition-colors focus-within:border-ivory"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  aria-label="Email address for the mailing list"
                  className="min-w-0 flex-1 bg-transparent py-1 text-xs text-ivory placeholder:text-fog focus:outline-none"
                />
                <button type="submit" className="shrink-0 text-[10px] tracking-[0.2em] text-fog hover:text-ivory">
                  Sign up
                </button>
              </form>
            )}
            <p className="mt-3 max-w-xs text-[9px] leading-relaxed text-fog">
              Nothing is sent and nothing is stored, except one yes or no on this device. Your address goes nowhere,
              like your fortune.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-lux text-sm text-ivory">{col.title}</h2>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[11px] leading-relaxed text-fog transition-colors hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-hairline pt-8 lg:mt-24 lg:flex-row lg:items-baseline lg:justify-between">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="font-lux text-base tracking-wide text-ivory">LuxuryNeverComes</span>
            <span className="tracking-maison text-[9px] text-fog">Maison Zéro</span>
          </Link>
          <p className="text-[9px] leading-relaxed text-fog">
            Shipping worldwide, to nowhere, equally. {PRODUCTS.length.toLocaleString('en-US')} pieces in stock, 0 in
            existence.
          </p>
          {/* 币种：按访客地区自动定，此处可改。汇率手工冻结（本店没有任何东西是活动的）。
              原生 select，安静下划线——真店的页脚也是这么放的 */}
          <label className="flex items-baseline gap-2 text-[9px] text-fog">
            Prices in
            <select
              value={currency.code}
              onChange={(e) => setCode(e.target.value)}
              className="cursor-pointer border-b border-hairline bg-transparent py-0.5 text-[10px] text-ivory focus:border-ivory focus:outline-none"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code}, {c.label}
                </option>
              ))}
            </select>
            <span className="hidden lg:inline">frozen mid-market rates; the payable sum survives conversion</span>
          </label>
        </div>

        {/* 反承诺放最小字号（法务小字层级），本店签名 */}
        <p className="mt-6 max-w-3xl text-[9px] leading-loose text-fog">{PRIVACY_FOOTER}</p>
      </div>
    </footer>
  )
}
