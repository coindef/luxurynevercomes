import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Appointment, CartItem, Customization, Order, OrderItem } from './types'

const CART_KEY = 'flgj.cart'
const ORDERS_KEY = 'flgj.orders'
const WISHLIST_KEY = 'flgj.wishlist'
const APPTS_KEY = 'flgj.appointments'
const RECENT_KEY = 'flgj.recent'
const WAITLIST_KEY = 'flgj.waitlist'
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

/** 等候名单排位：从 id 稳定散列，1,200-9,800 之间。名单不动，所以排位终身有效 */
function waitlistPosition(id: string): number {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return 1200 + (Math.abs(h) % 8600)
}

interface StoreValue {
  cart: CartItem[]
  orders: Order[]
  /** 心愿单：想要而未认购的（Cartier 商品页的第二个 CTA 就是「Add to Wish List」） */
  wishlist: string[]
  /** 预约：真流程真日历，假沙龙 */
  appointments: Appointment[]
  /** 最近看过的（真店的「Recently viewed」，零后端的个性化原料） */
  recent: string[]
  /** 等候名单：id → 排位。配货旗舰的另一条队（Birkin 的那条队，诚实版） */
  waitlist: Record<string, number>
  /** 所有寂寞订单的累计金额 = 已守住的钱 */
  saved: number
  cartCount: number
  addToCart: (productId: string, qty?: number, customization?: Customization) => void
  setQty: (key: string, qty: number) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  toggleWish: (productId: string) => void
  noteViewed: (productId: string) => void
  joinWaitlist: (productId: string) => number
  leaveWaitlist: (productId: string) => void
  bookAppointment: (a: Omit<Appointment, 'id'>) => Appointment
  cancelAppointment: (id: string) => void
  placeOrder: (items: OrderItem[], total: number, opts?: { urge?: string; giftWrap?: boolean }) => Order
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load(CART_KEY, []))
  const [orders, setOrders] = useState<Order[]>(() => load(ORDERS_KEY, []))
  const [wishlist, setWishlist] = useState<string[]>(() => load(WISHLIST_KEY, []))
  const [appointments, setAppointments] = useState<Appointment[]>(() => load(APPTS_KEY, []))
  const [recent, setRecent] = useState<string[]>(() => load(RECENT_KEY, []))
  const [waitlist, setWaitlist] = useState<Record<string, number>>(() => load(WAITLIST_KEY, {}))

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent))
  }, [recent])

  useEffect(() => {
    localStorage.setItem(WAITLIST_KEY, JSON.stringify(waitlist))
  }, [waitlist])

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist))
  }, [wishlist])

  useEffect(() => {
    localStorage.setItem(APPTS_KEY, JSON.stringify(appointments))
  }, [appointments])

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

  const toggleWish = (productId: string) => {
    setWishlist((prev) => (prev.includes(productId) ? prev.filter((x) => x !== productId) : [...prev, productId]))
  }

  const noteViewed = (productId: string) => {
    setRecent((prev) => [productId, ...prev.filter((x) => x !== productId)].slice(0, 24))
  }

  const joinWaitlist = (productId: string): number => {
    const pos = waitlistPosition(productId)
    setWaitlist((prev) => ({ ...prev, [productId]: pos }))
    return pos
  }

  const leaveWaitlist = (productId: string) => {
    setWaitlist((prev) => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  const bookAppointment = (a: Omit<Appointment, 'id'>): Appointment => {
    const appt: Appointment = { ...a, id: `${Date.now()}` }
    setAppointments((prev) => [...prev, appt].sort((x, y) => x.at - y.at))
    return appt
  }

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id))
  }

  const placeOrder = (items: OrderItem[], total: number, opts?: { urge?: string; giftWrap?: boolean }): Order => {
    const order: Order = {
      id: `${Date.now()}`,
      items,
      total,
      createdAt: Date.now(),
      urge: opts?.urge,
      giftWrap: opts?.giftWrap,
    }
    setOrders((prev) => [order, ...prev])
    return order
  }

  const saved = orders.reduce((sum, o) => sum + o.total, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  return (
    <StoreContext.Provider
      value={{ cart, orders, wishlist, appointments, recent, waitlist, saved, cartCount, addToCart, setQty, removeFromCart, clearCart, toggleWish, noteViewed, joinWaitlist, leaveWaitlist, bookAppointment, cancelAppointment, placeOrder }}
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
