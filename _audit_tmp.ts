import { PRODUCTS } from './src/lib/products'
import { subtypeOf, customFor } from './src/lib/bespoke'

const bySub = new Map<string, string[]>()
for (const p of PRODUCTS) {
  const s = subtypeOf(p)
  const k = `${p.category}/${s ?? 'NULL->category-fallback'}`
  if (!bySub.has(k)) bySub.set(k, [])
  bySub.get(k)!.push(p.name)
}
const rows = [...bySub.entries()].sort((a, b) => b[1].length - a[1].length)
console.log('TOTAL PRODUCTS:', PRODUCTS.length)
console.log('DISTINCT SUBTYPE BUCKETS:', rows.length)
console.log('')
for (const [k, names] of rows) console.log(String(names.length).padStart(4), k)
console.log('\n--- biggest buckets, sample names ---')
for (const [k, names] of rows.slice(0, 5)) {
  console.log(`\n## ${k} (${names.length})`)
  console.log(names.slice(0, 10).map((n) => '   ' + n).join('\n'))
}
const fp = new Map<string, number>()
for (const p of PRODUCTS) {
  const key = JSON.stringify(customFor(p))
  fp.set(key, (fp.get(key) ?? 0) + 1)
}
console.log('\n\nDISTINCT OPTION SETS ACROSS CATALOGUE:', fp.size)
console.log('LARGEST OPTION-SET COLLISION:', Math.max(...fp.values()))
