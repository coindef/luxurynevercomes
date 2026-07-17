import type { Product } from './types'
import { subtypeOf } from './bespoke'

/**
 * 每件藏品自己的规格：编号、材质、尺寸、色号、产地。
 *
 * **这是「每件商品看起来都一样」的真正解药。**
 * 我们之前的思路是「给每件商品更多选项」，方向就错了。实测六家真店
 * （Cartier / Loro Piana / Chanel / Dior / Van Cleef / LV）：
 *   - 一个商品详情页的「决策数」是 0 到 3，**众数是 1，就是尺寸**；
 *   - **颜色从来不是一个选项**——每个颜色是**另一个商品**，有自己的编号
 *     （Dior 的 _M900 就是全站通用的黑色码，Chanel 的 A01112 款号后面挂着不同的色号）；
 *   - Hermès 的 Petit h 干脆一个决策都没有：选择器上写着「Color, Random selected」，
 *     底下一行「The color of the product is a surprise!」
 * 所以真店的「每件都不一样」不来自配置器，来自**数据**：
 * 每件有自己的编号、自己的材质、自己的尺寸。配置器反而是我们自己加的假东西。
 *
 * 另一条实测规律（Cartier 的 LOVE 手镯页逐字核对过）：
 *   **散文只讲来历和材质，数字全部进列表，两者从不混排。**
 * 所以描述保持原样（deadpan 散文），规格另起一张表。
 */

/** 稳定伪随机：同一件藏品永远得到同一份规格 */
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** 由 id + 字段名派生的稳定取值，让同一件商品的每个字段各自独立又稳定 */
const seeded = (product: Product, field: string) => hash(`${product.id}#${field}`)
const pickBy = <T,>(product: Product, field: string, arr: T[]): T => arr[seeded(product, field) % arr.length]
const rangeBy = (product: Product, field: string, lo: number, hi: number, step = 1) =>
  lo + (seeded(product, field) % Math.floor((hi - lo) / step + 1)) * step

/**
 * 图录编号。真店的编号都是「不解释、不补零、放在页面最底下」的一串
 * （Cartier「Ref. B6067517」印在分享按钮下面；Hermès「P044189P」；Dior「M0538ONGE_M900」——
 *  后缀 _M900 是全站的黑色码）。我们跟 Dior 的构成：款号 + 色号。
 */
export function referenceOf(product: Product): string {
  const style = String(1000000 + (seeded(product, 'ref') % 8999999))
  return `MZ${style}_${colourCodeOf(product)}`
}

/* ------------------------------------------------------------------ 色号 */

const COLOURS: [RegExp, string, string][] = [
  [/smoke|graphite|anthracite/i, 'Smoke grey', 'S090'],
  [/midnight|navy|royal[- ]blue/i, 'Midnight blue', 'B740'],
  [/black|noir|onyx|jet\b/i, 'Noir', 'M900'],
  [/white|blanc|chalk|ivory|pearl/i, 'Blanc casse', 'W010'],
  [/gold|golden|18k|yellow/i, 'Yellow gold', 'G750'],
  [/rose[- ]gold|pink/i, 'Rose gold', 'G755'],
  [/platinum|palladium|rhodium|silver/i, 'Platinum', 'P950'],
  [/emerald|jade|jadeite|green/i, 'Vert imperial', 'V420'],
  [/ruby|red|crimson|scarlet/i, 'Rouge', 'R500'],
  [/sapphire|blue/i, 'Bleu', 'B500'],
  [/brown|whiskey|tan|cognac|barenia|saddle/i, 'Fauve', 'F200'],
  [/grey|gray|steel|titanium/i, 'Gris', 'G300'],
  [/burgundy|bordeaux|wine|maroon/i, 'Bordeaux', 'D600'],
  [/amber|honey|topaz/i, 'Ambre', 'A300'],
]

const FALLBACK_COLOURS: [string, string][] = [
  ['Noir', 'M900'],
  ['Blanc casse', 'W010'],
  ['Gris', 'G300'],
  ['Fauve', 'F200'],
  ['Smoke grey', 'S090'],
  ['Bleu nuit', 'B740'],
  ['Vert fonce', 'V300'],
  ['Bordeaux', 'D600'],
]

/** 这件商品的颜色。名字里说了就用名字里的，没说就按 id 稳定分一个。 */
export function colourwayOf(product: Product): string {
  const hit = COLOURS.find(([re]) => re.test(product.name))
  return hit ? hit[1] : pickBy(product, 'colour', FALLBACK_COLOURS)[0]
}

function colourCodeOf(product: Product): string {
  const hit = COLOURS.find(([re]) => re.test(product.name))
  return hit ? hit[2] : pickBy(product, 'colour', FALLBACK_COLOURS)[1]
}

/* ------------------------------------------------------------ 材质与产地 */

const MATERIALS: [RegExp, string][] = [
  [/matte nile crocodile|matte crocodile/i, 'Matte Nile crocodile'],
  [/crocodile|croc\b/i, 'Nile crocodile'],
  [/alligator/i, 'Mississippi alligator'],
  [/lizard/i, 'Lizard'],
  [/python/i, 'Burmese python'],
  [/ostrich/i, 'Ostrich'],
  [/stingray|shagreen/i, 'Shagreen'],
  [/calfskin|calf\b|togo|epsom/i, 'Togo calfskin'],
  [/full[- ]grain|leather/i, 'Full-grain calfskin'],
  [/vicu/i, 'Vicuna'],
  [/cashmere/i, 'Two-ply cashmere'],
  [/silk|twill|satin/i, 'Silk twill'],
  [/lace/i, 'Chantilly lace'],
  [/wool|tweed|worsted/i, 'High-count wool'],
  [/linen/i, 'Belgian linen'],
  [/velvet/i, 'Silk velvet'],
  [/brocade/i, 'Songjin brocade'],
  [/platinum/i, 'Platinum 950/1000'],
  [/18k|yellow gold/i, '18K yellow gold (750/1000)'],
  [/white gold/i, '18K white gold (750/1000)'],
  [/rose gold/i, '18K rose gold (750/1000)'],
  [/titanium/i, 'Grade 5 titanium'],
  [/steel/i, 'Oystersteel'],
  [/bronze/i, 'Cast bronze'],
  [/jadeite|jade/i, 'Type A jadeite'],
  [/diamond/i, 'Diamond, D colour'],
  [/emerald/i, 'Colombian emerald'],
  [/sapphire/i, 'Ceylon sapphire'],
  [/ruby|spinel/i, 'Mogok ruby'],
  [/pearl/i, 'South Sea pearl'],
  [/opal/i, 'Black opal'],
  [/teak/i, 'Burmese teak'],
  [/mahogany/i, 'Honduran mahogany'],
  [/walnut/i, 'Circassian walnut'],
  [/oak/i, 'Quarter-sawn oak'],
  [/bamboo/i, 'Moso bamboo'],
  [/carbon/i, 'Prepreg carbon fibre'],
  [/marble|granite|stone/i, 'Carrara marble'],
  [/porcelain/i, 'Limoges porcelain'],
  [/crystal/i, 'Lead crystal'],
  [/canvas/i, 'Coated canvas'],
]

const MATERIAL_BY_SUBTYPE: Record<string, string[]> = {
  bag: ['Togo calfskin', 'Epsom calfskin', 'Barenia leather', 'Box calf'],
  sla: ['Box calf', 'Goatskin', 'Epsom calfskin'],
  trunk: ['Poplar frame, coated canvas', 'Beech frame, full-grain hide', 'Poplar frame, vulcanised fibre'],
  watch: ['Oystersteel', '18K yellow gold (750/1000)', 'Platinum 950/1000', 'Grade 5 titanium'],
  ring: ['18K yellow gold (750/1000)', 'Platinum 950/1000', '18K white gold (750/1000)'],
  necklace: ['18K yellow gold (750/1000)', 'Platinum 950/1000'],
  bracelet: ['18K yellow gold (750/1000)', '18K rose gold (750/1000)'],
  earrings: ['18K white gold (750/1000)', 'Platinum 950/1000'],
  brooch: ['Platinum 950/1000', '18K yellow gold (750/1000)'],
  stone: ['Unmounted', 'Loose, in a paper'],
  car: ['Aluminium monocoque', 'Prepreg carbon fibre monocoque', 'Steel spaceframe'],
  moto: ['Trellis steel frame', 'Aluminium beam frame'],
  yacht: ['Composite hull, teak deck', 'Aluminium hull, teak deck', 'Steel hull, aluminium superstructure'],
  aircraft: ['Aluminium-lithium fuselage', 'Carbon-composite fuselage'],
  home: ['Stone, glass and oak', 'Board-marked concrete and glass', 'Lime render and slate'],
  land: ['Title deed only', 'Unimproved land'],
  gown: ['Silk duchesse satin', 'Chantilly lace', 'Silk crepe'],
  outerwear: ['Two-ply cashmere', 'Vicuna', 'Double-faced cashmere'],
  shoes: ['Box calf', 'Museum calf', 'Suede calf'],
  suit: ['Super 120s worsted', 'Super 180s worsted'],
  accessory: ['Two-ply cashmere', 'Silk twill', 'Vicuna'],
  wine: ['Cork, natural', 'Cork, diam'],
  spirit: ['Oak cask, first fill', 'Oak cask, refill'],
  food: ['Fresh, unprocessed'],
  painting: ['Oil on canvas', 'Oil on panel', 'Ink on silk'],
  sculpture: ['Cast bronze, lost wax', 'Carrara marble'],
  antiquity: ['As excavated', 'Stabilised'],
  instrument: ['Spruce and maple', 'Spruce, maple and ebony'],
  compute: ['Aluminium rack, 42U', 'Immersion-rated chassis'],
  space: ['Aluminium-lithium bus'],
  robot: ['Polymer shell over aluminium'],
  animal: ['Living animal'],
  venue: ['Concrete and glass'],
  experience: ['A person, and some hours'],
  naming: ['Paper, and a register'],
}

/** 这件商品是什么做的。名字里说了就信名字，没说就按子品类稳定分一个。 */
export function materialOf(product: Product): string {
  const hit = MATERIALS.find(([re]) => re.test(product.name))
  if (hit) return hit[1]
  const st = subtypeOf(product)
  const pool = (st ? MATERIAL_BY_SUBTYPE[st] : undefined) ?? ['Undisclosed']
  return pickBy(product, 'material', pool)
}

/**
 * 珠宝的「Metal」行**只认贵金属**。materialOf 会被名字里的宝石先劫走——
 * 「Red Diamond Solitaire」在 Metal 一栏印出「Diamond, D colour」，钻石成了戒托。
 * 名字里真提了金属就用它，否则从子品类的金属池里稳定分一个。
 */
const METAL_RE = /platinum|18k|yellow gold|white gold|rose gold|titanium|steel|silver\b/i
function metalOf(product: Product): string {
  if (METAL_RE.test(product.name)) {
    const hit = MATERIALS.find(([re]) => re.test(product.name) && METAL_RE.test(product.name.match(re)?.[0] ?? ''))
    if (hit) return hit[1]
  }
  const st = subtypeOf(product)
  const pool = (st ? MATERIAL_BY_SUBTYPE[st] : undefined) ?? ['18K yellow gold (750/1000)']
  return pickBy(product, 'metal', pool)
}

const ATELIERS = [
  'Made in France',
  'Made in Italy',
  'Made in Switzerland',
  'Made in England',
  'Made in Japan',
  'Made in Germany',
]

export const originOf = (product: Product) => pickBy(product, 'origin', ATELIERS)

/* ------------------------------------------------------------------ 规格表 */

export interface SpecRow {
  label: string
  value: string
}

/**
 * 规格表。字段名随子品类走——一枚戒指和一只腕表不该列同一组数字
 * （Cartier 的 LOVE 手镯列的是「18K yellow gold (750/1000) / Width: 6.1mm / two functional screws」，
 *  腕表列的是表径、机芯、动力储存、防水）。
 */
const SPECS: Record<string, (p: Product) => SpecRow[]> = {
  watch: (p) => [
    { label: 'Case', value: materialOf(p) },
    { label: 'Case size', value: `${rangeBy(p, 'case', 36, 44)} mm` },
    { label: 'Movement', value: pickBy(p, 'mvt', ['Manual winding', 'Self-winding', 'Self-winding, micro-rotor']) },
    { label: 'Power reserve', value: `${rangeBy(p, 'pr', 38, 120, 2)} hours` },
    { label: 'Water resistance', value: pickBy(p, 'wr', ['30 metres', '50 metres', '100 metres', '300 metres']) },
  ],
  ring: (p) => [
    { label: 'Metal', value: metalOf(p) },
    { label: 'Width', value: `${(rangeBy(p, 'w', 21, 92) / 10).toFixed(1)} mm` },
    { label: 'Stone', value: colourwayOf(p) },
    { label: 'Certificate', value: pickBy(p, 'cert', ['GIA, with the piece', 'SSEF, with the piece', 'House certificate']) },
  ],
  necklace: (p) => [
    { label: 'Metal', value: metalOf(p) },
    { label: 'Length', value: `${pickBy(p, 'len', [40, 45, 60, 90])} cm` },
    { label: 'Clasp', value: pickBy(p, 'clasp', ['Concealed box clasp', 'Ratchet clasp', 'Hook and eye']) },
  ],
  bracelet: (p) => [
    { label: 'Metal', value: metalOf(p) },
    { label: 'Inner circumference', value: `${rangeBy(p, 'circ', 15, 21)} cm` },
    { label: 'Width', value: `${(rangeBy(p, 'w', 30, 110) / 10).toFixed(1)} mm` },
  ],
  earrings: (p) => [
    { label: 'Metal', value: metalOf(p) },
    { label: 'Drop', value: `${rangeBy(p, 'drop', 8, 70) / 10} cm` },
    { label: 'Fitting', value: pickBy(p, 'fit', ['Post and butterfly', 'Clip', 'Lever back']) },
  ],
  brooch: (p) => [
    { label: 'Metal', value: metalOf(p) },
    { label: 'Dimensions', value: `H ${rangeBy(p, 'h', 30, 90) / 10} x W ${rangeBy(p, 'w', 20, 70) / 10} cm` },
    { label: 'Fitting', value: 'Pin with safety catch' },
  ],
  stone: (p) => [
    { label: 'Weight', value: `${(rangeBy(p, 'ct', 12, 480) / 10).toFixed(2)} carats` },
    { label: 'Origin', value: pickBy(p, 'org', ['Mogok, Burma', 'Muzo, Colombia', 'Kashmir', 'Undisclosed']) },
    { label: 'Certificate', value: 'GIA, with the piece' },
  ],
  bag: (p) => [
    { label: 'Material', value: materialOf(p) },
    { label: 'Dimensions', value: `L ${rangeBy(p, 'l', 16, 40)} x H ${rangeBy(p, 'h', 12, 30)} x D ${rangeBy(p, 'd', 7, 20)} cm` },
    { label: 'Lining', value: pickBy(p, 'lin', ['Goatskin', 'Chevre', 'Suede calf']) },
    { label: 'Hardware', value: pickBy(p, 'hw', ['Palladium plated', 'Gold plated', 'Ruthenium']) },
  ],
  sla: (p) => [
    { label: 'Material', value: materialOf(p) },
    { label: 'Dimensions', value: `L ${rangeBy(p, 'l', 8, 20)} x H ${rangeBy(p, 'h', 6, 12)} cm` },
    { label: 'Interior', value: `${rangeBy(p, 'slots', 2, 12)} card slots` },
  ],
  trunk: (p) => [
    { label: 'Frame', value: materialOf(p) },
    { label: 'Dimensions', value: `L ${rangeBy(p, 'l', 40, 120)} x H ${rangeBy(p, 'h', 30, 110)} x D ${rangeBy(p, 'd', 20, 60)} cm` },
    { label: 'Hardware', value: pickBy(p, 'hw', ['Solid brass, lacquered', 'Nickel silver']) },
  ],
  car: (p) => [
    { label: 'Construction', value: materialOf(p) },
    { label: 'Power', value: `${rangeBy(p, 'bhp', 320, 1600, 5)} bhp` },
    { label: '0 to 100 km/h', value: `${(rangeBy(p, 'acc', 19, 62) / 10).toFixed(1)} s` },
    { label: 'Kerb weight', value: `${rangeBy(p, 'kg', 980, 2600, 10).toLocaleString('en-US')} kg` },
  ],
  moto: (p) => [
    { label: 'Frame', value: materialOf(p) },
    { label: 'Power', value: `${rangeBy(p, 'bhp', 45, 220)} bhp` },
    { label: 'Dry weight', value: `${rangeBy(p, 'kg', 140, 280)} kg` },
  ],
  yacht: (p) => [
    { label: 'Construction', value: materialOf(p) },
    { label: 'Length overall', value: `${rangeBy(p, 'loa', 12, 110)} m` },
    { label: 'Beam', value: `${(rangeBy(p, 'beam', 40, 180) / 10).toFixed(1)} m` },
    { label: 'Berths', value: `${rangeBy(p, 'berth', 2, 24)} guests` },
  ],
  aircraft: (p) => [
    { label: 'Construction', value: materialOf(p) },
    { label: 'Range', value: `${rangeBy(p, 'rng', 1200, 14000, 100).toLocaleString('en-US')} km` },
    { label: 'Cruise', value: `Mach ${(rangeBy(p, 'mach', 30, 200) / 100).toFixed(2)}` },
    { label: 'Cabin', value: `${rangeBy(p, 'seats', 2, 19)} seats` },
  ],
  home: (p) => [
    { label: 'Construction', value: materialOf(p) },
    { label: 'Floor area', value: `${rangeBy(p, 'area', 90, 2400, 10).toLocaleString('en-US')} m2` },
    { label: 'Bedrooms', value: `${rangeBy(p, 'bed', 1, 12)}` },
    { label: 'Completed', value: `${rangeBy(p, 'year', 1680, 2026)}` },
  ],
  land: (p) => [
    { label: 'Title', value: materialOf(p) },
    { label: 'Area', value: `${rangeBy(p, 'ha', 1, 900).toLocaleString('en-US')} hectares` },
    { label: 'Access', value: pickBy(p, 'acc', ['By sea', 'By air', 'Unmade track', 'None at present']) },
  ],
  gown: (p) => [
    { label: 'Fabric', value: materialOf(p) },
    { label: 'Atelier hours', value: `${rangeBy(p, 'hrs', 120, 1800, 10).toLocaleString('en-US')} hours` },
    { label: 'Lining', value: 'Silk habotai' },
  ],
  outerwear: (p) => [
    { label: 'Cloth', value: materialOf(p) },
    { label: 'Length', value: `${rangeBy(p, 'len', 70, 140)} cm` },
    { label: 'Lining', value: pickBy(p, 'lin', ['Silk habotai', 'Unlined, double-faced']) },
  ],
  shoes: (p) => [
    { label: 'Upper', value: materialOf(p) },
    { label: 'Construction', value: pickBy(p, 'cons', ['Goodyear welted', 'Blake stitched', 'Hand-sewn norvegese']) },
    { label: 'Sole', value: pickBy(p, 'sole', ['Oak-bark leather', 'Double leather', 'Leather with rubber insert']) },
  ],
  suit: (p) => [
    { label: 'Cloth', value: materialOf(p) },
    { label: 'Atelier hours', value: `${rangeBy(p, 'hrs', 40, 120)} hours` },
    { label: 'Construction', value: 'Full floating canvas' },
  ],
  accessory: (p) => [
    { label: 'Material', value: materialOf(p) },
    { label: 'Dimensions', value: `${rangeBy(p, 'l', 30, 200)} x ${rangeBy(p, 'w', 30, 90)} cm` },
    { label: 'Finish', value: pickBy(p, 'fin', ['Hand-rolled hem', 'Machine hem', 'Raw edge']) },
  ],
  wine: (p) => [
    { label: 'Vintage', value: `${rangeBy(p, 'vint', 1945, 2021)}` },
    { label: 'Format', value: pickBy(p, 'fmt', ['Bottle, 75cl', 'Magnum, 1.5L', 'Jeroboam, 3L']) },
    { label: 'Alcohol', value: `${(rangeBy(p, 'abv', 115, 155) / 10).toFixed(1)}%` },
    { label: 'Drink from', value: `${rangeBy(p, 'drink', 2026, 2070)}` },
  ],
  spirit: (p) => [
    { label: 'Cask', value: materialOf(p) },
    { label: 'Age', value: `${rangeBy(p, 'age', 12, 70)} years` },
    { label: 'Strength', value: `${(rangeBy(p, 'abv', 400, 640) / 10).toFixed(1)}%` },
  ],
  food: (p) => [
    { label: 'Condition', value: materialOf(p) },
    { label: 'Season', value: pickBy(p, 'sea', ['Autumn only', 'Spring only', 'Winter only', 'Year round']) },
    { label: 'Keeps for', value: `${rangeBy(p, 'keep', 2, 40)} days` },
  ],
  painting: (p) => [
    { label: 'Medium', value: materialOf(p) },
    { label: 'Dimensions', value: `H ${rangeBy(p, 'h', 24, 220)} x W ${rangeBy(p, 'w', 18, 300)} cm` },
    { label: 'Executed', value: `${rangeBy(p, 'year', 1480, 1990)}` },
    { label: 'Signed', value: pickBy(p, 'sig', ['Lower right', 'Lower left', 'Verso', 'Unsigned']) },
  ],
  sculpture: (p) => [
    { label: 'Medium', value: materialOf(p) },
    { label: 'Height', value: `${rangeBy(p, 'h', 12, 260)} cm` },
    { label: 'Edition', value: pickBy(p, 'ed', ['Unique', '1 of 8', '2 of 8', 'Artist proof']) },
  ],
  antiquity: (p) => [
    { label: 'Condition', value: materialOf(p) },
    { label: 'Dimensions', value: `H ${rangeBy(p, 'h', 4, 90)} x W ${rangeBy(p, 'w', 4, 70)} cm` },
    { label: 'Period', value: `circa ${rangeBy(p, 'per', 1, 1800)} ${seeded(p, 'ad') % 2 ? 'AD' : 'BC'}` },
  ],
  instrument: (p) => [
    { label: 'Materials', value: materialOf(p) },
    { label: 'Made', value: `${rangeBy(p, 'year', 1680, 1960)}` },
    { label: 'Condition', value: pickBy(p, 'cond', ['Playing condition', 'Restored, playing', 'Museum condition']) },
  ],
  compute: (p) => [
    { label: 'Chassis', value: materialOf(p) },
    { label: 'Nodes', value: `${rangeBy(p, 'nodes', 8, 4096, 8).toLocaleString('en-US')}` },
    { label: 'Power draw', value: `${rangeBy(p, 'kw', 12, 9000, 4).toLocaleString('en-US')} kW` },
    { label: 'Interconnect', value: pickBy(p, 'ic', ['400G InfiniBand', '800G Ethernet', 'Optical mesh']) },
  ],
  space: (p) => [
    { label: 'Bus', value: materialOf(p) },
    { label: 'Launch mass', value: `${rangeBy(p, 'kg', 40, 6800, 10).toLocaleString('en-US')} kg` },
    { label: 'Design life', value: `${rangeBy(p, 'life', 3, 25)} years` },
  ],
  robot: (p) => [
    { label: 'Shell', value: materialOf(p) },
    { label: 'Height', value: `${rangeBy(p, 'h', 120, 190)} cm` },
    { label: 'Endurance', value: `${rangeBy(p, 'hrs', 4, 20)} hours` },
  ],
  animal: (p) => [
    { label: 'Foaled', value: `${rangeBy(p, 'year', 2016, 2024)}` },
    { label: 'Height', value: `${rangeBy(p, 'hh', 142, 172)} cm` },
    { label: 'Record', value: pickBy(p, 'rec', ['Unraced', '3 starts, 2 wins', '11 starts, 4 wins', 'Retired sound']) },
  ],
  venue: (p) => [
    { label: 'Capacity', value: `${rangeBy(p, 'cap', 2, 24)} seats` },
    { label: 'Access', value: pickBy(p, 'acc', ['Private lift', 'Members entrance', 'Ground level']) },
    { label: 'Term', value: `${rangeBy(p, 'term', 1, 25)} years` },
  ],
  experience: (p) => [
    { label: 'Duration', value: pickBy(p, 'dur', ['One afternoon', 'One full day', 'Three days', 'A season']) },
    { label: 'Party size', value: `${rangeBy(p, 'pax', 1, 8)}` },
    { label: 'Held', value: pickBy(p, 'held', ['By arrangement', 'Off season only', 'When the weather allows']) },
  ],
  naming: (p) => [
    { label: 'Register', value: materialOf(p) },
    { label: 'Term', value: 'In perpetuity' },
    { label: 'Recognised by', value: 'This house' },
  ],
}

/** 通用兜底：至少给出材质与产地，别让规格表开天窗 */
const GENERIC = (p: Product): SpecRow[] => [
  { label: 'Material', value: materialOf(p) },
  { label: 'Dimensions', value: `H ${rangeBy(p, 'h', 10, 120)} x W ${rangeBy(p, 'w', 10, 120)} cm` },
]

/**
 * 不给这些子品类附「色号/产地」：星系命名权没有色号，赛马不是 Made in France。
 * 通栏追加曾把这两行盖到所有 1009 件上——真店的规格是按商品拼的，不是模板打的。
 */
const NO_EXTRAS = new Set(['naming', 'experience', 'animal', 'venue', 'land'])

/**
 * 首行是「身份行」：Cartier 的做法是把材质当第一句陈述而不是键值对
 * （「18K white gold (750/1000)」单独一行，下面才是「Width: 5.5mm」）。
 * 详情页据此把这些 label 渲染成**裸名词短语**，其余行才是「Label: value」。
 */
export const IDENTITY_LABELS = new Set([
  'Metal', 'Material', 'Case', 'Cloth', 'Fabric', 'Medium', 'Frame', 'Construction',
  'Upper', 'Cask', 'Shell', 'Bus', 'Chassis', 'Condition', 'Title', 'Register', 'Materials', 'Leather',
])

export function specsOf(product: Product): SpecRow[] {
  const st = subtypeOf(product)
  const rows = ((st ? SPECS[st] : undefined) ?? GENERIC)(product)
  if (st && NO_EXTRAS.has(st)) return rows
  const colour = colourwayOf(product)
  return [
    ...rows,
    // 某行已经写了这个颜色（戒指的 Stone: Rouge）就别再来一行 Colourway: Rouge
    ...(rows.some((r) => r.value === colour) ? [] : [{ label: 'Colourway', value: colour }]),
    { label: 'Origin', value: originOf(product) },
  ]
}
