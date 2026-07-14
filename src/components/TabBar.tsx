import { NavLink } from 'react-router-dom'
import { useStore } from '../lib/store'

const TABS = [
  { to: '/', label: '殿堂', emoji: '🏛️' },
  { to: '/cart', label: '珍藏', emoji: '🗝️' },
  { to: '/orders', label: '管家', emoji: '🤍' },
  { to: '/me', label: '账本', emoji: '📖' },
]

export default function TabBar() {
  const { cartCount } = useStore()

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink/95 backdrop-blur">
      <div className="grid grid-cols-4">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] tracking-widest ${
                isActive ? 'font-semibold text-gold' : 'text-fog'
              }`
            }
          >
            <span className="relative text-lg leading-none">
              {t.emoji}
              {t.to === '/cart' && cartCount > 0 && (
                <span className="absolute -right-3 -top-1.5 min-w-4 border border-gold bg-ink px-1 text-center text-[9px] font-bold leading-4 text-gold pop-in">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
