import { PRODUCTS } from './src/lib/products'
import { subtypeOf, customFor } from './src/lib/bespoke'

// group-count distribution: real houses range 0-3, modal 1
const counts = new Map<number, number>()
for (const p of PRODUCTS) {
  const n = customFor(p).length
  counts.set(n, (counts.get(n) ?? 0) + 1)
}
console.log('GROUPS-PER-PRODUCT DISTRIBUTION:', [...counts.entries()].sort())

// all-zero-surcharge groups = "spec groups masquerading as options"
const specGroups = new Set<string>()
const pricedGroups = new Set<string>()
for (const p of PRODUCTS) {
  for (const g of customFor(p)) {
    if (g.type !== 'choice') continue
    const allZero = (g.choices ?? []).every((c) => c.surcharge === 0)
    ;(allZero ? specGroups : pricedGroups).add(g.label)
  }
}
console.log('\nALL-ZERO "SPEC" GROUPS (rendered w/o price tags):')
for (const l of specGroups) console.log('   ', l)

// mismatch spotcheck
const suspects = ['Butler', 'Key ·', 'Quantum Computer Time', 'Fusion Power Plant', 'Chef', 'Coach', 'Sommelier']
console.log('\nMISMATCH SPOTCHECK:')
for (const p of PRODUCTS) {
  if (!suspects.some((s) => p.name.includes(s))) continue
  const g = customFor(p)
  console.log(`  [${subtypeOf(p)}] ${p.name}`)
  console.log(`      -> asks: ${g.map((x) => x.label).join(' | ')}`)
}
