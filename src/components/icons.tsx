import type { ReactNode } from 'react'

/**
 * 全站的单色细线图标。UI 骨架（导航、空状态、时间线）一律用这套，
 * **不用系统 emoji**——🎩🕊️🖤🕯️ 在所有平台都按满色 emoji 渲染，
 * 一枚彩色小图贴在冷调单色的界面上，等于替全站打破「只有一个颜色」的红线。
 * （商品数据里的 emoji 只活在兜底展签上，且已去色，不归这里管。）
 *
 * 统一 24×24 视口、1.4 细线、圆头、无填充、currentColor——
 * 图标颜色永远跟着文字层级走（ivory / fog），自己不带颜色。
 */
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function Icon({ size = 20, className = '', children }: { size?: number; className?: string; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      {children}
    </svg>
  )
}

type P = { size?: number; className?: string }

/** 殿堂立面（山花 + 列柱）：Salon */
export const IconHall = (p: P) => (
  <Icon {...p}>
    <path d="M4 9 L12 4 L20 9" {...stroke} />
    <path d="M4 20 H20" {...stroke} />
    <path d="M7 9 V20 M12 9 V20 M17 9 V20" {...stroke} />
  </Icon>
)

/** 目录方格网：Collection */
export const IconGrid = (p: P) => (
  <Icon {...p}>
    <rect x="4" y="4" width="7" height="7" rx="1" {...stroke} />
    <rect x="13" y="4" width="7" height="7" rx="1" {...stroke} />
    <rect x="4" y="13" width="7" height="7" rx="1" {...stroke} />
    <rect x="13" y="13" width="7" height="7" rx="1" {...stroke} />
  </Icon>
)

/** 钥匙：品牌屋，以及「空着的珍藏」 */
export const IconKey = (p: P) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="3.2" {...stroke} />
    <path d="M10.3 10.3 L19 19" {...stroke} />
    <path d="M16 16 l2.2 2.2 M13.8 18.2 l2 2" {...stroke} />
  </Icon>
)

/** 购物袋：Reserve */
export const IconBag = (p: P) => (
  <Icon {...p}>
    <path d="M6.5 8 H17.5 L18.5 20 H5.5 Z" {...stroke} />
    <path d="M9 8 V6.5 a3 3 0 0 1 6 0 V8" {...stroke} />
  </Icon>
)

/** 礼宾罩盖：Butler 服务 */
export const IconCloche = (p: P) => (
  <Icon {...p}>
    <path d="M5 17 a7 7 0 0 1 14 0" {...stroke} />
    <path d="M4 17 H20" {...stroke} />
    <path d="M12 10 V8" {...stroke} />
    <circle cx="12" cy="7" r="1" {...stroke} />
  </Icon>
)

/** 摊开的账本：Ledger */
export const IconBook = (p: P) => (
  <Icon {...p}>
    <path d="M12 6 C10 5 6.5 5 4.5 6 V19 C6.5 18 10 18 12 19" {...stroke} />
    <path d="M12 6 C14 5 17.5 5 19.5 6 V19 C17.5 18 14 18 12 19" {...stroke} />
    <path d="M12 6 V19" {...stroke} />
  </Icon>
)

/** 大礼帽：管家本人（订单页、错误页、贵宾头像） */
export const IconHat = (p: P) => (
  <Icon {...p}>
    <path d="M4 17.5 H20" {...stroke} />
    <path d="M7.5 17.5 V8 a1.5 1.5 0 0 1 1.5-1.5 h6 a1.5 1.5 0 0 1 1.5 1.5 V17.5" {...stroke} />
    <path d="M7.5 14 H16.5" {...stroke} />
  </Icon>
)

/** 纸飞机：在途（白手套护送中）。dove 的 emoji 是彩色的，纸飞机的线条是干净的 */
export const IconPlane = (p: P) => (
  <Icon {...p}>
    <path d="M20.5 4.5 L3.5 11 L10 13.5 L12.5 20 Z" {...stroke} />
    <path d="M20.5 4.5 L10 13.5" {...stroke} />
  </Icon>
)

/** 蜡烛：清空账本的告别仪式 */
export const IconCandle = (p: P) => (
  <Icon {...p}>
    <path d="M12 4 c1.4 1.7 1.4 3 0 4.2 c-1.4 -1.2 -1.4 -2.5 0 -4.2 Z" {...stroke} />
    <path d="M12 8.2 V11" {...stroke} />
    <path d="M9.5 11 H14.5 V20 H9.5 Z" {...stroke} />
  </Icon>
)

/** 小票（锯齿底边）：空结算 */
export const IconReceipt = (p: P) => (
  <Icon {...p}>
    <path d="M6.5 3.5 H17.5 V19.5 l-1.8 -1.4 -1.8 1.4 -1.9 -1.4 -1.9 1.4 -1.8 -1.4 -1.8 1.4 Z" {...stroke} />
    <path d="M9.5 8.5 H14.5 M9.5 12 H14.5" {...stroke} />
  </Icon>
)
