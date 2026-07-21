export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  emoji: string
  /** tailwind gradient classes 做商品图背景 */
  gradient: string
  description: string
  /** 假销量，如 "3.2万人富了个寂寞" */
  sales: string
  /** 荒诞彩蛋商品 */
  easterEgg?: boolean
  /**
   * 配货门槛：需累计「守住」（认购）达到此金额，才解锁本款的认购资格。
   * 仅顶级配货商品设置（铂金包/热门陀飞轮/超跑等）。
   * 台账就是 store 的 saved（历史订单总额）——配货本身也 ¥0.00，是本店最诚实的荒诞。
   */
  quota?: number
}

/** 高级定制：单个选项（加价只用于展示与账本，实付永远 ¥0.00） */
export interface CustomChoice {
  name: string
  surcharge: number
}

/** 高级定制：选项组（choice=单选 chips；text=自由输入，如刻字/命名） */
export interface CustomGroup {
  label: string
  type: 'choice' | 'text'
  /**
   * 'size' = 这组是详情页「唯一的那个决定」（戒圈/链长/鞋码……）。
   * 曾经靠「全组不加价」去猜哪组是尺寸——定价数据一动，猜错就静悄悄发生
   * （长裙猜成了「Fit」，红酒猜成了「Format」，西装一组都猜不出）。该声明的声明。
   */
  role?: 'size'
  choices?: CustomChoice[]
  placeholder?: string
}

/** 用户的定制结果：选项组名 → 选中项/输入文本 */
export type Customization = Record<string, string>

export interface CartItem {
  /** 行 key：同商品不同定制各占一行 */
  key: string
  productId: string
  qty: number
  customization?: Customization
}

export interface OrderItem {
  product: Product
  qty: number
  customization?: Customization
}

/** 预约（Book an appointment 是真流程：选沙龙、选日子、进日历。沙龙不存在，那个钟点是你的） */
export interface Appointment {
  id: string
  productId?: string
  productName?: string
  boutique: string
  /** 预约时刻（epoch ms） */
  at: number
  note?: string
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  createdAt: number
  /** 冲动来源标签（结算页温柔一问，可跳过） */
  urge?: string
  /** 礼品包装（Cartier 的折叠区里真有一栏「Gift Wrapping」；这里当然也免费，也不送达） */
  giftWrap?: boolean
  /** 下单时选的配送方式（小票要如实印出来：选择是真的，送达不是） */
  delivery?: string
}
