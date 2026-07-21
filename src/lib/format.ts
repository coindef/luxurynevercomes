export function yuan(n: number): string {
  return `¥${n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** 订单号: MAISON ZÉRO + 时间戳变体，看起来像真的 */
export function orderNo(createdAt: number): string {
  return `MZ${createdAt.toString().slice(1, 11)}${(createdAt % 97).toString().padStart(2, '0')}`
}

