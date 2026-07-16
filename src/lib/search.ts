import type { Product } from './types'
import { PRODUCTS, catLabel } from './products'
import { maisonOf } from './maisons'

/**
 * 目录检索。1009 件全在内存里，不需要索引库——建个倒排表反而比直接扫还慢。
 * 每件商品预拼一条小写「草垛」（品名 + 描述 + 品类 + 品牌屋），启动时算一次。
 */

/**
 * 去掉分隔号与标点，压平空白：让 "Top-Handle" 能被 "top handle" 命中。
 * 也脱掉变音符号——品牌屋叫 Manufacture Chronés / Cave Silène / Écurie Vantor，
 * 没人会为了搜一下去按出个 é 来。
 */
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[·,.&'"’\-()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 口语词 → 品类。用户搜的是 "car" 而不是 "Motorcars"，是 "bag" 而不是 "Bags & Leather"。
 *
 * 没有这张表的话，纯靠子串匹配会闹笑话：搜 "car" 排第一的是
 * 「Ten-Thousand-**Card** Cluster」（一堆显卡），因为 "Card" 里也有 "car"，
 * 而 "Motorcars" 里的 car 反倒只是个词中子串，分更低。
 */
const CATEGORY_WORDS: Record<string, string> = {
  car: '尊贵座驾', cars: '尊贵座驾', auto: '尊贵座驾', automobile: '尊贵座驾',
  supercar: '尊贵座驾', motorcar: '尊贵座驾', vehicle: '尊贵座驾', coupe: '尊贵座驾',
  bag: '包袋皮具', bags: '包袋皮具', handbag: '包袋皮具', purse: '包袋皮具',
  leather: '包袋皮具', platinum: '包袋皮具',
  watch: '腕表珠宝', watches: '腕表珠宝', jewellery: '腕表珠宝', jewelry: '腕表珠宝',
  gem: '腕表珠宝', gems: '腕表珠宝', ring: '腕表珠宝', necklace: '腕表珠宝',
  yacht: '游艇航空', yachts: '游艇航空', boat: '游艇航空', ship: '游艇航空',
  jet: '游艇航空', plane: '游艇航空', aircraft: '游艇航空', aviation: '游艇航空',
  house: '不动产', home: '不动产', property: '不动产', estate: '不动产',
  land: '不动产', villa: '不动产', apartment: '不动产',
  compute: '科技算力', tech: '科技算力', gpu: '科技算力', chip: '科技算力',
  server: '科技算力', ai: '科技算力', satellite: '科技算力',
  sport: '运动竞技', sports: '运动竞技', golf: '运动竞技', tennis: '运动竞技',
  wine: '酒窖餐桌', wines: '酒窖餐桌', cellar: '酒窖餐桌', whisky: '酒窖餐桌',
  food: '酒窖餐桌', champagne: '酒窖餐桌', caviar: '酒窖餐桌',
  couture: '高定衣橱', dress: '高定衣橱', gown: '高定衣橱', coat: '高定衣橱',
  clothes: '高定衣橱', fashion: '高定衣橱', wardrobe: '高定衣橱',
  art: '艺术收藏', painting: '艺术收藏', sculpture: '艺术收藏', antique: '艺术收藏',
}

interface Indexed {
  product: Product
  name: string
  rest: string
}

const INDEX: Indexed[] = PRODUCTS.map((p) => ({
  product: p,
  name: normalize(p.name),
  rest: normalize(`${p.description} ${catLabel(p.category)} ${maisonOf(p).name} ${maisonOf(p).flourish}`),
}))

/**
 * 全店皆 ¥0.00，所以「便宜/免费/多少钱」这类搜索在这家店里是个哲学问题：
 * 它们全部命中，因为它们全部为真。这是本店最诚实的一条搜索结果。
 */
const EVERYTHING_QUERIES = new Set([
  'free', 'cheap', 'affordable', 'discount', 'sale', 'price', 'cost', 'money',
  '0', '00', '0 00', 'zero', 'nothing', 'anything', 'everything',
])

export interface SearchResult {
  items: Product[]
  /** 命中「全店皆免费」彩蛋时的那句话，正常搜索为 null */
  everythingLine: string | null
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * 打分：整词 > 词首 > 词中；品名 > 其余字段。
 * 多个词之间是 AND——搜 "croc bag" 该只出鳄鱼包，不该把所有包都倒出来。
 */
function score(entry: Indexed, token: string): number {
  const t = escape(token)
  const whole = new RegExp(`\\b${t}\\b`)
  const prefix = new RegExp(`\\b${t}`)
  let s = 0

  if (whole.test(entry.name)) s += 120
  else if (prefix.test(entry.name)) s += 60
  else if (entry.name.includes(token)) s += 25

  if (whole.test(entry.rest)) s += 20
  else if (prefix.test(entry.rest)) s += 12
  else if (entry.rest.includes(token)) s += 5

  // 口语词命中品类：压过「Card 里有 car」这种词首巧合（60），但压不过品名整词命中（120）
  if (CATEGORY_WORDS[token] === entry.product.category) s += 80

  return s
}

export function searchProducts(query: string): SearchResult {
  const q = normalize(query)
  if (!q) return { items: [], everythingLine: null }

  if (EVERYTHING_QUERIES.has(q)) {
    return {
      items: [...PRODUCTS].sort((a, b) => b.price - a.price),
      everythingLine:
        'All 1,009 pieces match. Every one of them is free. That was never the part standing in your way.',
    }
  }

  const tokens = q.split(' ')
  const hits: { product: Product; total: number }[] = []

  for (const entry of INDEX) {
    let total = 0
    let all = true
    for (const t of tokens) {
      const s = score(entry, t)
      if (s === 0) {
        all = false
        break
      }
      total += s
    }
    if (all) hits.push({ product: entry.product, total })
  }

  hits.sort((a, b) => b.total - a.total || b.product.price - a.product.price)
  return { items: hits.map((h) => h.product), everythingLine: null }
}

/** 空结果时的 deadpan：自嘲这家店，不嘲用户 */
export function emptyLine(query: string): string {
  return `Nothing matches "${query}". A rare failure: usually we have everything, and deliver none of it.`
}
