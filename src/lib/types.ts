export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  emoji: string
  /** 真实商品图路径（加载失败时回退到 emoji 色块） */
  image: string
  /** tailwind gradient classes 做商品图背景 */
  gradient: string
  description: string
  /** 假销量，如 "3.2万人富了个寂寞" */
  sales: string
  /** 荒诞彩蛋商品 */
  easterEgg?: boolean
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
