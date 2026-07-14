export function yuan(n: number): string {
  return `¥${n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** 订单号: MAISON ZÉRO + 时间戳变体，看起来像真的 */
export function orderNo(createdAt: number): string {
  return `MZ${createdAt.toString().slice(1, 11)}${(createdAt % 97).toString().padStart(2, '0')}`
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60_000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min} 分钟前`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr} 小时前`
  return `${Math.floor(hr / 24)} 天前`
}
