import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * 多币种显示：价格按访客所在区自动换算（navigator.language 的地区位），页脚可手改。
 * 基准价永远是人民币（store 里存的都是 CNY），只有**显示层**换算——
 * 台账、配货门槛、订单总额的账本一致性因此不受汇率影响。
 * 汇率是手工冻结的中间价（本店没有任何东西是活动的，汇率也一样）。
 * 例外：分享卡 canvas 与大使聊天里的报价保留 ¥（文书与馆方口径用本位币，真店亦然）。
 */

export interface Currency {
  code: string
  symbol: string
  label: string
  /** 1 CNY 兑多少该币 */
  rate: number
  /** 小数位：日元没有分位（JP¥0 也照样好笑） */
  decimals: number
}

export const CURRENCIES: Currency[] = [
  { code: 'CNY', symbol: '¥', label: 'Chinese yuan', rate: 1, decimals: 2 },
  { code: 'USD', symbol: '$', label: 'US dollar', rate: 0.14, decimals: 2 },
  { code: 'EUR', symbol: '€', label: 'Euro', rate: 0.13, decimals: 2 },
  { code: 'GBP', symbol: '£', label: 'Pound sterling', rate: 0.11, decimals: 2 },
  { code: 'JPY', symbol: 'JP¥', label: 'Japanese yen', rate: 20.5, decimals: 0 },
  { code: 'HKD', symbol: 'HK$', label: 'Hong Kong dollar', rate: 1.09, decimals: 2 },
  { code: 'SGD', symbol: 'S$', label: 'Singapore dollar', rate: 0.19, decimals: 2 },
  { code: 'CHF', symbol: 'CHF ', label: 'Swiss franc', rate: 0.12, decimals: 2 },
  { code: 'AED', symbol: 'AED ', label: 'UAE dirham', rate: 0.51, decimals: 2 },
]

/** 地区位 → 币种。欧元区列主要几国；未列入的地区一律本位币（客随主便） */
const REGION_TO_CODE: Record<string, string> = {
  US: 'USD',
  GB: 'GBP',
  JP: 'JPY',
  HK: 'HKD',
  MO: 'HKD',
  SG: 'SGD',
  CH: 'CHF',
  AE: 'AED',
  FR: 'EUR',
  DE: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  AT: 'EUR',
  IE: 'EUR',
  PT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  LU: 'EUR',
  MC: 'EUR',
}

export function guessCurrencyCode(): string {
  try {
    const region = (navigator.language || '').split('-')[1]?.toUpperCase()
    return (region && REGION_TO_CODE[region]) || 'CNY'
  } catch {
    return 'CNY'
  }
}

const CURRENCY_KEY = 'flgj.currency'

interface CurrencyValue {
  currency: Currency
  setCode: (code: string) => void
  /** 把一个人民币金额排成当前币种的全位数千分位（逗号的长度就是多巴胺，哪国逗号都一样） */
  money: (cny: number) => string
}

const CurrencyContext = createContext<CurrencyValue | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState<string>(() => {
    try {
      return localStorage.getItem(CURRENCY_KEY) ?? guessCurrencyCode()
    } catch {
      return 'CNY'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(CURRENCY_KEY, code)
    } catch {
      // 隐私模式：本次会话内仍生效
    }
  }, [code])

  const currency = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
  const money = (cny: number) =>
    `${currency.symbol}${(cny * currency.rate).toLocaleString('en-US', {
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    })}`

  return <CurrencyContext.Provider value={{ currency, setCode: setCodeState, money }}>{children}</CurrencyContext.Provider>
}

export function useCurrency(): CurrencyValue {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider')
  return ctx
}

/** 大多数组件只要格式化函数 */
export function useMoney(): (cny: number) => string {
  return useCurrency().money
}
