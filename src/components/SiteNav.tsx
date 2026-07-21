import { Link, NavLink } from 'react-router-dom'
import { useMoney } from '../lib/currency'
import { useStore } from '../lib/store'

/** 行话导航配一份白话解码（title/aria）：视觉上一字不动，悬停与读屏各得其所 */
const LINKS = [
  { to: '/', label: 'Salon', plain: 'Home' },
  { to: '/collection', label: 'Collection', plain: 'All 1,009 pieces' },
  { to: '/maisons', label: 'Houses', plain: 'The 45 maisons' },
  { to: '/cart', label: 'Reserve', plain: 'Your cart' },
  { to: '/orders', label: 'Butler', plain: 'Your orders' },
  { to: '/me', label: 'Ledger', plain: 'Your account' },
]

/** 桌面端顶部导航（移动端隐藏，走底部 TabBar） */
export default function SiteNav() {
  const money = useMoney()
  const { cartCount, saved } = useStore()

  return (
    <nav className="sticky top-0 z-40 hidden border-b border-hairline bg-ink lg:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-lux text-lg tracking-wide text-ivory">LuxuryNeverComes</span>
          <span className="tracking-maison text-[9px] text-fog">Maison Zéro</span>
        </Link>
        <div className="flex items-center gap-8">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              title={l.plain}
              aria-label={`${l.label}, ${l.plain.toLowerCase()}`}
              className={({ isActive }) =>
                `text-xs tracking-[0.2em] transition-colors ${isActive ? 'text-ivory' : 'text-fog hover:text-ivory'}`
              }
            >
              {l.label}
              {l.to === '/cart' && cartCount > 0 && (
                <span className="font-price ml-1.5 text-[10px] text-ivory">({cartCount})</span>
              )}
            </NavLink>
          ))}
          {saved > 0 && (
            <Link to="/me" className="border border-jade/40 px-3 py-1.5 text-[10px] font-semibold text-jade">
              Kept {money(saved)}
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
