#!/usr/bin/env node
/**
 * 扫 public/img/ 生成 src/lib/imageManifest.ts。
 *
 * 为什么要 manifest，而不是运行时靠 <img> 的 onError 兜底：
 *   1. 1009 件商品里大部分没有图，靠 404 才回退 = 每次进目录页就打几百个必然失败的请求；
 *   2. 画廊必须**事先**知道一件商品有几个视角，总不能先渲染三个再删掉两个。
 * 图是构建期就定死的事实，那就构建期查清楚。
 *
 * 配图流水线跑完就重跑一次：
 *   node --import ./scripts/ts-resolve.mjs scripts/build-image-manifest.mjs
 */
import { readdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { captionsFor } from './art-direction.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'src', 'lib', 'imageManifest.ts')

const { PRODUCTS, CATEGORIES } = await import(join(ROOT, 'src/lib/products.ts'))

const files = new Set(readdirSync(join(ROOT, 'public', 'img')).filter((f) => f.endsWith('.jpg')))

/** 视角必须从 1 开始连续：只有 1、3 没有 2 时，第 3 张会被忽略（画廊不留洞） */
const views = {}
for (const p of PRODUCTS) {
  let n = 0
  while (files.has(n === 0 ? `${p.id}.jpg` : `${p.id}-v${n + 1}.jpg`)) n++
  if (n > 0) views[p.id] = n
}

const ids = Object.keys(views).sort()
const total = ids.reduce((sum, id) => sum + views[id], 0)
const galleries = ids.filter((id) => views[id] > 1).length

const captions = CATEGORIES.map((c) => `  '${c.name}': [${captionsFor(c.name).map((s) => `'${s}'`).join(', ')}],`).join('\n')

writeFileSync(
  OUT,
  `/* 由 scripts/build-image-manifest.mjs 生成，请勿手改。

   IMAGE_VIEWS：商品 id → 已有的图录视角数（1 = 只有主图，3 = 全貌/另一角度/细节）。
   未列出的商品没有照片，走丝绒展签兜底——缺图不是错误。 */

export const IMAGE_VIEWS: Record<string, number> = {
${ids.map((id) => `  '${id}': ${views[id]},`).join('\n')}
}

/** 分类 → 各视角的图录小字。与 scripts/art-direction.mjs 里生成图片的视角一一对应。 */
export const VIEW_CAPTIONS: Record<string, string[]> = {
${captions}
}

/** 有照片的商品数（其余走展签） */
export const PHOTOGRAPHED_COUNT = ${ids.length}
`,
)

console.log('wrote src/lib/imageManifest.ts')
console.log(`  ${ids.length}/${PRODUCTS.length} pieces photographed (${((ids.length / PRODUCTS.length) * 100).toFixed(1)}%)`)
console.log(`  ${galleries} have a multi-view gallery · ${total} image files in use`)
