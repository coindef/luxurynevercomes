#!/usr/bin/env node
/**
 * Build a resumable review queue for the product-image refresh.
 *
 * This does not call any image model. It only lists current product image files,
 * marks which are safe to regenerate, and sorts them by storefront visibility.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const IMG_DIR = join(ROOT, 'public', 'img')
const OUT = join(ROOT, 'scripts', '.image-audit-queue.json')

const { PRODUCTS, SALON_PRODUCTS } = await import(join(ROOT, 'src/lib/products.ts'))
const { maisonHero, MAISONS } = await import(join(ROOT, 'src/lib/maisons.ts'))
const aiSourced = new Set(JSON.parse(readFileSync(join(ROOT, 'scripts', 'ai-sourced.json'), 'utf8')).ids)

const heroIds = new Set(MAISONS.map((m) => maisonHero(m.id)?.id).filter(Boolean))
const salonIds = new Set(SALON_PRODUCTS.map((p) => p.id))

function pathFor(id, view) {
  return join(IMG_DIR, view === 1 ? `${id}.jpg` : `${id}-v${view}.jpg`)
}

function visibility(product) {
  let score = 0
  if (heroIds.has(product.id)) score += 1000
  if (salonIds.has(product.id)) score += 500
  if (product.quota) score += 250
  return score
}

function viewLabel(view) {
  if (view === 1) return 'main'
  return `v${view}`
}

const queue = []
for (const product of PRODUCTS) {
  for (let view = 1; view <= 3; view++) {
    const path = pathFor(product.id, view)
    if (!existsSync(path)) continue
    queue.push({
      status: 'pending-review',
      decision: null,
      reason: null,
      id: product.id,
      view,
      viewLabel: viewLabel(view),
      path: relative(ROOT, path),
      name: product.name,
      category: product.category,
      price: product.price,
      visibility: visibility(product),
      source: aiSourced.has(product.id) ? 'ai-generated' : 'protected-real-photo',
    })
  }
}

queue.sort((a, b) => {
  if (a.source !== b.source) return a.source === 'ai-generated' ? -1 : 1
  return b.visibility - a.visibility || b.price - a.price || a.id.localeCompare(b.id) || a.view - b.view
})

writeFileSync(
  OUT,
  `${JSON.stringify(
    {
      note:
        'Review each image visually. Regenerate only when it is unattractive, artificial, off-subject, branded, poorly framed, or unlike real-world luxury/product photography.',
      generatedAt: new Date().toISOString(),
      total: queue.length,
      aiGenerated: queue.filter((item) => item.source === 'ai-generated').length,
      protectedRealPhoto: queue.filter((item) => item.source === 'protected-real-photo').length,
      queue,
    },
    null,
    2,
  )}\n`,
)

console.log(`wrote ${OUT}`)
console.log(`${queue.length} image files queued`)
console.log(`${queue.filter((item) => item.source === 'ai-generated').length} AI-generated, ${queue.filter((item) => item.source === 'protected-real-photo').length} protected real photos`)
