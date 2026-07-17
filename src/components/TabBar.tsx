import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useStore } from '../lib/store'

/**
 * 底部 Tab（仅移动端）。
 *
 * 图标是**单色细线 SVG**，不是彩色 emoji。
 * 之前用的是系统 emoji（🛍️ 粉、🗝️ 金、🖼️ 花的、📖 蓝），在手机上一律满色渲染，
 * 直接违背本站的核心红线「全站只有一个颜色：绿」——一排彩色小图标贴在冷调单色的界面上，
 * 看着就像随手贴的 AI 剪贴画。改成 currentColor 的细线图标，随选中态吃 ink / fog，
 * 与桌面端纯文字导航同气质。
 */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** 图标一律 24×24 视口、细线、无填充，读到 18px 仍清楚。 */
const ICONS: Record<string, ReactNode> = {
  // Salon：殿堂立面（山花 + 列柱），呼应 Maison Zéro
  salon: (
    <>
      <path d="M4 9 L12 4 L20 9" {...stroke} />
      <path d="M4 20 H20" {...stroke} />
      <path d="M7 9 V20 M12 9 V20 M17 9 V20" {...stroke} />
    </>
  ),
  // Collection：目录的方格网
  collection: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1" {...stroke} />
      <rect x="13" y="4" width="7" height="7" rx="1" {...stroke} />
      <rect x="4" y="13" width="7" height="7" rx="1" {...stroke} />
      <rect x="13" y="13" width="7" height="7" rx="1" {...stroke} />
    </>
  ),
  // Houses：一把钥匙（品牌屋导览）
  houses: (
    <>
      <circle cx="8" cy="8" r="3.2" {...stroke} />
      <path d="M10.3 10.3 L19 19" {...stroke} />
      <path d="M16 16 l2.2 2.2 M13.8 18.2 l2 2" {...stroke} />
    </>
  ),
  // Reserve：购物袋
  reserve: (
    <>
      <path d="M6.5 8 H17.5 L18.5 20 H5.5 Z" {...stroke} />
      <path d="M9 8 V6.5 a3 3 0 0 1 6 0 V8" {...stroke} />
    </>
  ),
  // Butler：礼宾服务铃
  butler: (
    <>
      <path d="M5 17 a7 7 0 0 1 14 0" {...stroke} />
      <path d="M4 17 H20" {...stroke} />
      <path d="M12 10 V8" {...stroke} />
      <circle cx="12" cy="7" r="1" {...stroke} />
    </>
  ),
  // Ledger：摊开的账本
  ledger: (
    <>
      <path d="M12 6 C10 5 6.5 5 4.5 6 V19 C6.5 18 10 18 12 19" {...stroke} />
      <path d="M12 6 C14 5 17.5 5 19.5 6 V19 C17.5 18 14 18 12 19" {...stroke} />
      <path d="M12 6 V19" {...stroke} />
    </>
  ),
}

const TABS = [
  { to: '/', label: 'Salon', icon: 'salon' },
  // 手机上原本根本到不了全目录：1009 件藏品只能从首页那个「View all」进去。
  // 一家店的货架不该只有一个入口（搜索框也在这一页）
  { to: '/collection', label: 'Collection', icon: 'collection' },
  { to: '/maisons', label: 'Houses', icon: 'houses' },
  { to: '/cart', label: 'Reserve', icon: 'reserve' },
  { to: '/orders', label: 'Butler', icon: 'butler' },
  { to: '/me', label: 'Ledger', icon: 'ledger' },
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
              `relative flex flex-col items-center gap-1 py-2.5 text-[9px] tracking-widest ${
                isActive ? 'font-semibold text-ivory' : 'text-fog'
              }`
            }
          >
            <span className="relative">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                {ICONS[t.icon]}
              </svg>
              {t.to === '/cart' && cartCount > 0 && (
                <span className="pop-in absolute -right-2.5 -top-1.5 min-w-4 bg-ivory px-1 text-center text-[9px] font-bold leading-4 text-ink">
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
