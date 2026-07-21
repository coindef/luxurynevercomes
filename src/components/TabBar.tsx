import { NavLink } from 'react-router-dom'
import { useStore } from '../lib/store'
import { IconBag, IconBook, IconCloche, IconGrid, IconHall, IconKey } from './icons'

/**
 * 底部 Tab（仅移动端）。图标见 icons.tsx——单色细线，不是彩色 emoji
 * （那正是全站清过的红线：一排满色小图贴在冷调单色界面上）。
 */
const TABS = [
  { to: '/', label: 'Salon', Icon: IconHall },
  // 手机上原本根本到不了全目录：1009 件藏品只能从首页那个「View all」进去。
  // 一家店的货架不该只有一个入口（搜索框也在这一页）
  { to: '/collection', label: 'Collection', Icon: IconGrid },
  { to: '/maisons', label: 'Houses', Icon: IconKey },
  { to: '/cart', label: 'Reserve', Icon: IconBag },
  { to: '/orders', label: 'Butler', Icon: IconCloche },
  { to: '/me', label: 'Ledger', Icon: IconBook },
]

export default function TabBar() {
  const { cartCount } = useStore()

  return (
    <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-hairline bg-ink pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="grid grid-cols-6">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 py-2.5 text-[9px] tracking-widest ${
                isActive ? 'font-semibold text-ivory' : 'text-fog'
              }`
            }
          >
            <span className="relative">
              <Icon size={20} />
              {to === '/cart' && cartCount > 0 && (
                <span className="pop-in absolute -right-2.5 -top-1.5 min-w-4 bg-ivory px-1 text-center text-[9px] font-bold leading-4 text-ink">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </span>
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
