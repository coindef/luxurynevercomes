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

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  createdAt: number
  /** 冲动来源标签（结算页温柔一问，可跳过） */
  urge?: string
}
