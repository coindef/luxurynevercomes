#!/usr/bin/env node
/**
 * 把不是 3:4 的商品图补边成 3:4（而不是让它在页面上被裁掉）。
 *
 * 为什么要这么干：全站的图录开本是 3:4，生成的图本来就是 525×700。
 * 但早期那批真实照片是各种比例（900×506 的横构图最要命），
 * 塞进 3:4 的框里靠 object-cover 居中裁——一只 900×506 的腕表被裁掉 58% 的宽度，
 * 看上去就是「变形了」。裁掉的是照片的一半，不是比例出了错。
 *
 * 做法：不缩放、不拉伸，只在短边补背景色，把画幅补成 3:4。
 * 补的颜色从照片**自己的边缘**采样（studio 棚拍的背景是一片均匀的扫光），
 * 所以补完看不出接缝，像本来就是竖着拍的。
 *
 * 用法： node scripts/normalise-aspect.mjs [--dry]
 */
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, unlinkSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const IMG = join(ROOT, 'public', 'img')
const TMP = join(ROOT, 'scripts', '.aspect-tmp')
const DRY = process.argv.includes('--dry')

const TARGET = 3 / 4
const TOL = 0.02 // 2% 以内当作已经是 3:4

const sips = (...args) => execFileSync('sips', args, { stdio: ['ignore', 'pipe', 'ignore'] }).toString()

function sizeOf(file) {
  const out = sips('-g', 'pixelWidth', '-g', 'pixelHeight', file)
  return {
    w: Number(out.match(/pixelWidth: (\d+)/)?.[1]),
    h: Number(out.match(/pixelHeight: (\d+)/)?.[1]),
  }
}

/**
 * 整图转成 BMP，直接读像素。
 *
 * 为什么不用 `sips -c` 裁一个角来采样：**`sips -c` 是从中心裁的，不是从左上角**
 * （拿一张明确带红边的图标定过：裁「最上面 80 行」拿回来的是照片中段，不是红色）。
 * 也就是说，用它采「四个角」其实采的是画面中央——采到的是主体，不是背景。
 * BMP 没有这种歧义：24 位 BMP = 头 + 自下而上的 BGR 三元组，坐标是我自己算的。
 */
function readBMP(file) {
  const bmp = `${TMP}.bmp`
  sips('-s', 'format', 'bmp', file, '--out', bmp)
  const b = readFileSync(bmp)
  const off = b.readUInt32LE(10)
  const w = b.readInt32LE(18)
  const h = Math.abs(b.readInt32LE(22))
  const bpp = b.readUInt16LE(28) / 8
  const stride = ((w * bpp + 3) & ~3) >>> 0
  const bottomUp = b.readInt32LE(22) > 0
  const at = (x, y) => {
    const row = bottomUp ? h - 1 - y : y
    const p = off + row * stride + x * bpp
    return { r: b[p + 2], g: b[p + 1], b: b[p] }
  }
  if (existsSync(bmp)) unlinkSync(bmp)
  return { w, h, at }
}

const dist = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b)

/**
 * 背景色 = **四个角里最像的那两个的平均**。
 *
 * 一开始取的是整条边的平均色，结果很难看：那只 900×506 的腕表是张微距，
 * 边上全是表壳本身，平均出来是一坨橄榄棕，补上去就是两条脏边。
 * 但四个角里，主体最多占掉两个——剩下两个几乎总是背景，而且彼此一模一样。
 * 取最接近的那一对，腕表得到 #000000（它的背景本来就是纯黑），补完看不出接缝。
 */
function backgroundColour(file) {
  const { w, h, at } = readBMP(file)
  const s = Math.max(6, Math.round(Math.min(w, h) * 0.06))
  const mean = (x0, y0) => {
    let r = 0
    let g = 0
    let b = 0
    for (let y = y0; y < y0 + s; y++)
      for (let x = x0; x < x0 + s; x++) {
        const p = at(x, y)
        r += p.r
        g += p.g
        b += p.b
      }
    const n = s * s
    return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) }
  }
  const corners = [mean(0, 0), mean(w - s, 0), mean(0, h - s), mean(w - s, h - s)]
  let best = [0, 1]
  let bd = Infinity
  for (let i = 0; i < 4; i++)
    for (let j = i + 1; j < 4; j++) {
      const d = dist(corners[i], corners[j])
      if (d < bd) {
        bd = d
        best = [i, j]
      }
    }
  const [a, b] = [corners[best[0]], corners[best[1]]]
  return { r: Math.round((a.r + b.r) / 2), g: Math.round((a.g + b.g) / 2), b: Math.round((a.b + b.b) / 2) }
}

const hex = ({ r, g, b }) => [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')

const files = readdirSync(IMG)
  .filter((f) => f.startsWith('lx-') && f.endsWith('.jpg'))
  .sort()

let fixed = 0
let skipped = 0
const report = []

for (const f of files) {
  const file = join(IMG, f)
  const { w, h } = sizeOf(file)
  if (!w || !h) continue
  const ratio = w / h
  if (Math.abs(ratio - TARGET) / TARGET <= TOL) {
    skipped++
    continue
  }

  // 只补短边，绝不缩放：横图补上下，竖过头的补左右
  const [padH, padW] = ratio > TARGET ? [Math.round(w / TARGET), w] : [h, Math.round(h * TARGET)]

  const pad = hex(backgroundColour(file))

  report.push(`  ${f.padEnd(34)} ${w}x${h} (${ratio.toFixed(2)}) → ${padW}x${padH}  pad #${pad}`)
  if (!DRY) {
    sips('-p', String(padH), String(padW), '--padColor', pad, file, '--out', file)
    sips('-Z', '700', file) // 补完统一压回 700px 长边
  }
  fixed++
}

console.log(report.join('\n'))
console.log(`\n${DRY ? 'would pad' : 'padded'} ${fixed} images to 3:4 · ${skipped} already 3:4`)
if (!DRY) console.log('nothing was scaled or stretched: the photograph is untouched, only the canvas grew')
