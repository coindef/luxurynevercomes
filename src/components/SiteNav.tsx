import { Link, NavLink } from 'react-router-dom'
import { yuan } from '../lib/format'
import { useStore } from '../lib/store'

const LINKS = [
  { to: '/', label: 'Salon' },
  { to: '/collection', label: 'Collection' },
  { to: '/maisons', label: 'Houses' },
  { to: '/cart', label: 'Reserve' },
  { to: '/orders', label: 'Butler' },
  { to: '/me', label: 'Ledger' },
]

/** 桌面端顶部导航（移动端隐藏，走底部 TabBar） */
export default function SiteNav() {
  const { cartCount, saved } = useStore()

  return (
    <nav className="sticky top-0 z-40 hidden border-b border-hairline bg-ink/95 backdrop-blur lg:block">
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
              Kept {yuan(saved)}
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
