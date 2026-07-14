import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { CartItem, Customization, Order, OrderItem } from './types'

const CART_KEY = 'flgj.cart'
const ORDERS_KEY = 'flgj.orders'
const VERSION_KEY = 'flgj.v'
/** 数据结构不兼容升级时递增此版本号，旧数据会被清掉（守住的钱是真的守住了，这个不会变） */
const DATA_VERSION = '1'

try {
  const v = localStorage.getItem(VERSION_KEY)
  if (v !== null && v !== DATA_VERSION) {
    localStorage.removeItem(CART_KEY)
    localStorage.removeItem(ORDERS_KEY)
  }
  localStorage.setItem(VERSION_KEY, DATA_VERSION)
} catch {
  // 隐私模式等场景下 localStorage 不可用，功能降级为不持久化
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

/** 行 key：同商品不同定制各占一行 */
function lineKey(productId: string, customization?: Customization): string {
  if (!customization || Object.keys(customization).length === 0) return productId
  const norm = Object.keys(customization)
    .sort()
    .map((k) => `${k}=${customization[k]}`)
    .join('&')
  return `${productId}|${norm}`
}

interface StoreValue {
  cart: CartItem[]
  orders: Order[]
  /** 所有寂寞订单的累计金额 = 已守住的钱 */
  saved: number
  cartCount: number
  addToCart: (productId: string, qty?: number, customization?: Customization) => void
  setQty: (key: string, qty: number) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  placeOrder: (items: OrderItem[], total: number, urge?: string) => Order
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load(CART_KEY, []))
  const [orders, setOrders] = useState<Order[]>(() => load(ORDERS_KEY, []))

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  const addToCart = (productId: string, qty = 1, customization?: Customization) => {
    const key = lineKey(productId, customization)
    setCart((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [...prev, { key, productId, qty, customization }]
    })
  }

  const setQty = (key: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.key !== key))
    } else {
      setCart((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)))
    }
  }

  const removeFromCart = (key: string) => {
    setCart((prev) => prev.filter((i) => i.key !== key))
  }

  const clearCart = () => setCart([])

  const placeOrder = (items: OrderItem[], total: number, urge?: string): Order => {
    const order: Order = {
      id: `${Date.now()}`,
      items,
      total,
      createdAt: Date.now(),
      urge,
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const saved = orders.reduce((sum, o) => sum + o.total, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <StoreContext.Provider
      value={{ cart, orders, saved, cartCount, addToCart, setQty, removeFromCart, clearCart, placeOrder }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
