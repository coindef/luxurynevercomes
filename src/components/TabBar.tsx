import { NavLink } from 'react-router-dom'
import { useStore } from '../lib/store'

const TABS = [
  { to: '/', label: 'Salon', emoji: '🏛️' },
  // 手机上原本根本到不了全目录：1009 件藏品只能从首页那个「View all」进去。
  // 一家店的货架不该只有一个入口（搜索框也在这一页）
  { to: '/collection', label: 'Collection', emoji: '🖼️' },
  { to: '/maisons', label: 'Houses', emoji: '🗝️' },
  { to: '/cart', label: 'Reserve', emoji: '🛍️' },
  { to: '/orders', label: 'Butler', emoji: '🤍' },
  { to: '/me', label: 'Ledger', emoji: '📖' },
]

export default function TabBar() {
  const { cartCount } = useStore()

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink/95 backdrop-blur lg:hidden">
      <div className="grid grid-cols-6">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-0.5 py-2.5 text-[10px] tracking-widest ${
                isActive ? 'font-semibold text-ivory' : 'text-fog'
              }`
            }
          >
            <span className="relative text-lg leading-none">
              {t.emoji}
              {t.to === '/cart' && cartCount > 0 && (
                <span className="pop-in absolute -right-3 -top-1.5 min-w-4 bg-ivory px-1 text-center text-[9px] font-bold leading-4 text-ink">
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
