import type { Order, Product } from './types'
import { referenceOf } from './spec'
import { yuan, orderNo } from './format'
import { SITE_HOST } from './site'

/**
 * 分享卡片：把「天生该被截图」的三件套画成真 PNG 下载——
 * 寂寞鉴定证书（深色）、书面价格确认（纸白）、本月小结 Wrapped（纸白 + 治愈绿）。
 *
 * 传播靠截图，截图就该有下载键。手绘 canvas 而不是 html2canvas：
 * 零依赖、构图完全可控、字体走系统栈（Didot/Georgia 缺哪个退哪个）。
 * 尺寸 1080×1350（4:5）：小红书 / Instagram 的原生竖幅，X 里也体面。
 * 每张卡底部带站点行——图片会离家出走，地址得缝在衣角上。
 */

const W = 1080
const H = 1350

const SERIF = 'Didot, "Bodoni 72", Georgia, "Times New Roman", serif'
const SANS = '"Helvetica Neue", Arial, sans-serif'

function canvas(): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d')!
  return [c, ctx]
}

/** 逐词换行。返回结束时的 y（基线） */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const words = text.split(' ')
  let line = ''
  for (const w of words) {
    const probe = line ? `${line} ${w}` : w
    if (ctx.measureText(probe).width > maxWidth && line) {
      ctx.fillText(line, x, y)
      y += lineHeight
      line = w
    } else {
      line = probe
    }
  }
  if (line) ctx.fillText(line, x, y)
  return y
}

function download(c: HTMLCanvasElement, name: string) {
  const a = document.createElement('a')
  a.href = c.toDataURL('image/png')
  a.download = name
  a.click()
}

/** 底部站点行（深浅两版） */
function footer(ctx: CanvasRenderingContext2D, dark: boolean) {
  ctx.font = `26px ${SANS}`
  ctx.fillStyle = dark ? '#8f8f8f' : '#6b6b6b'
  ctx.fillText(SITE_HOST, 96, H - 88)
}

/** 寂寞鉴定证书：全站少数被允许的深色时刻，银箔不用金箔 */
export function saveCertificateCard(order: Order) {
  const [c, ctx] = canvas()
  ctx.fillStyle = '#141414'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(201,201,201,0.35)'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 48, W - 96, H - 96)

  ctx.fillStyle = '#e8e8e8'
  ctx.font = `64px ${SERIF}`
  wrap(ctx, 'Certificate of Genuine Solitude', 96, 220, W - 192, 78)

  ctx.fillStyle = 'rgba(201,201,201,0.5)'
  ctx.fillRect(96, 292, 120, 2)

  ctx.fillStyle = '#8f8f8f'
  ctx.font = `34px ${SANS}`
  let y = 396
  y = wrap(ctx, 'This certifies that the solitude in this order is genuine,', 96, y, W - 192, 52)
  y = wrap(ctx, 'one of one worldwide.', 96, y + 52, W - 192, 52)

  ctx.fillStyle = '#e8e8e8'
  ctx.font = `34px ${SANS}`
  ctx.fillText('Bearer: the undersigned wanting', 96, y + 120)
  ctx.font = `34px ${SERIF}`
  ctx.fillText(`Number: ${orderNo(order.createdAt)}`, 96, y + 180)

  ctx.fillStyle = '#8f8f8f'
  ctx.font = `34px ${SANS}`
  y = wrap(ctx, `${order.items.reduce((s, i) => s + i.qty, 0)} pieces, kept safe in full:`, 96, y + 280, W - 192, 52)
  ctx.fillStyle = '#e8e8e8'
  ctx.font = `72px ${SERIF}`
  ctx.fillText(yuan(order.total), 96, y + 110)

  ctx.fillStyle = '#8f8f8f'
  ctx.font = `28px ${SANS}`
  wrap(ctx, 'Authenticated by the White-Glove Assay Office. This certificate, like the money you kept, is real.', 96, H - 240, W - 192, 44)

  ctx.fillStyle = '#e8e8e8'
  ctx.font = `40px ${SERIF}`
  ctx.fillText('LuxuryNeverComes', 96, H - 140)
  footer(ctx, true)
  download(c, `certificate-${orderNo(order.createdAt)}.png`)
}

/** 书面价格确认：纸白 + 墨黑，¥0.00 是唯一的颜色 */
export function savePriceCard(product: Product) {
  const [c, ctx] = canvas()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#e5e5e5'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 48, W - 96, H - 96)

  ctx.fillStyle = '#111111'
  ctx.font = `48px ${SERIF}`
  ctx.fillText('Maison Zéro', 96, 180)
  ctx.fillStyle = '#6b6b6b'
  ctx.font = `28px ${SANS}`
  ctx.fillText('Bureau of Written Confirmations', 96, 226)
  ctx.fillStyle = '#e5e5e5'
  ctx.fillRect(96, 268, 120, 2)

  ctx.fillStyle = '#6b6b6b'
  ctx.font = `34px ${SANS}`
  let y = wrap(ctx, 'Further to your enquiry regarding', 96, 380, W - 192, 54)
  ctx.fillStyle = '#111111'
  ctx.font = `52px ${SERIF}`
  y = wrap(ctx, product.name.split('·')[0].trim(), 96, y + 84, W - 192, 66)
  ctx.fillStyle = '#6b6b6b'
  ctx.font = `30px ${SANS}`
  ctx.fillText(`Ref. ${referenceOf(product)}`, 96, y + 56)

  ctx.font = `34px ${SANS}`
  y = wrap(ctx, 'the house confirms the price as', 96, y + 150, W - 192, 54)
  ctx.fillStyle = '#111111'
  ctx.font = `56px ${SERIF}`
  ctx.fillText(yuan(product.price), 96, y + 84)
  ctx.fillStyle = '#6b6b6b'
  ctx.font = `34px ${SANS}`
  ctx.fillText('of which the payable portion is', 96, y + 152)

  ctx.fillStyle = '#1f6b4a'
  ctx.font = `120px ${SERIF}`
  ctx.fillText('¥0.00', 96, y + 300)

  ctx.fillStyle = '#6b6b6b'
  ctx.font = `28px ${SANS}`
  wrap(
    ctx,
    'This confirmation is binding. The figure will not rise; it has nowhere to go. Valid in perpetuity, honoured nowhere.',
    96,
    H - 260,
    W - 192,
    44,
  )
  footer(ctx, false)
  download(c, `price-${product.id}.png`)
}

/** 本月小结：Wrapped 式，讲的是你，绿只落在守住的钱上 */
export function saveMonthlyCard(stats: { month: string; flutters: number; kept: number; downpayments: number }) {
  const [c, ctx] = canvas()
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = '#e5e5e5'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 48, W - 96, H - 96)

  ctx.fillStyle = '#6b6b6b'
  ctx.font = `32px ${SANS}`
  ctx.fillText(stats.month, 96, 170)

  ctx.fillStyle = '#111111'
  ctx.font = `72px ${SERIF}`
  wrap(ctx, 'A month of being rich, quietly.', 96, 300, W - 192, 88)

  ctx.font = `40px ${SANS}`
  ctx.fillStyle = '#111111'
  ctx.fillText(`${stats.flutters}`, 96, 520)
  ctx.fillStyle = '#6b6b6b'
  ctx.font = `32px ${SANS}`
  ctx.fillText(stats.flutters === 1 ? 'heart-flutter, acted upon' : 'heart-flutters, acted upon', 200, 520)

  ctx.fillStyle = '#6b6b6b'
  ctx.font = `32px ${SANS}`
  ctx.fillText('kept safe, in full', 96, 640)
  ctx.fillStyle = '#1f6b4a'
  ctx.font = `96px ${SERIF}`
  wrap(ctx, yuan(stats.kept), 96, 750, W - 192, 110)

  ctx.fillStyle = '#6b6b6b'
  ctx.font = `32px ${SANS}`
  ctx.fillText(`≈ ${stats.downpayments.toLocaleString('en-US')} first-tier downpayments, unspent`, 96, 880)

  ctx.fillStyle = '#111111'
  ctx.font = `34px ${SANS}`
  wrap(ctx, 'Nothing arrived. Nothing was lost. The wanting was real, and it was free.', 96, 1020, W - 192, 54)

  ctx.fillStyle = '#111111'
  ctx.font = `40px ${SERIF}`
  ctx.fillText('LuxuryNeverComes', 96, H - 140)
  footer(ctx, false)
  download(c, `kept-safe-${stats.month.replace(/\s/g, '-').toLowerCase()}.png`)
}
