import type { Product } from './types'
import { materialOf, colourwayOf } from './spec'
import { maisonOf } from './maisons'
import { yuan } from './format'

/**
 * 每件商品自己的好评区。
 *
 * 此前全站 1,009 件共用三条评论和一行「100,000+ reviews」——模板味的重灾区。
 * 现在从商品自身派生（材质/色号/屋名/品类/价位），id 稳定散列取样：
 * 同一件永远同一批评论（可分享、可回访），相邻两件几乎不会撞。
 * 评论数也按件定：越贵的越少（¥6.8 亿的游艇只有 4 条留言，本身就是笑点）。
 * 语气家规：自嘲「买不起」，绝不嘲讽写评论的人。
 */

export interface Review {
  user: string
  stars: number
  text: string
}

function h32(s: string): number {
  let x = 2166136261
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i)
    x = Math.imul(x, 16777619)
  }
  return Math.abs(x)
}

const REVIEWERS = [
  'Anon* Patron', 'Mid* Levels', 'Ms. Ch*n', 'A Discreet Collector', 'V., Geneva', 'Third Generation',
  'New Money, Old Soul', 'The Neighbour Upstairs', 'Signature Illegible', 'A Serious Person',
  'Between Bonuses', 'Windowside, Shanghai', 'Curator of One', 'The Quiet Wing', "Someone's Accountant",
  'Recently Ascended', 'On the List Twice', 'His Tailor', 'Her Architect', 'A Patient Man',
  'The Second Home', 'Est. 1987', 'Paddle No. 166', 'Reformed Minimalist',
]

interface Ctx {
  shortName: string
  material: string
  colour: string
  maison: string
  price: string
}

type Skeleton = (c: Ctx) => string

const UNIVERSAL: Skeleton[] = [
  (c) => `Reserved it on a Tuesday. By Friday the wanting had matured into something calmer. The ${c.shortName} remains exactly where it was, which is to say, mine.`,
  (c) => `The ${c.material.toLowerCase()} is exactly as described, in the sense that the description is all there is. Five stars.`,
  (c) => `My third piece from ${c.maison}. Their consistency is remarkable: nothing has arrived three times in a row.`,
  (c) => `Held the page open for an hour. The ${c.colour.toLowerCase()} does something to a person.`,
  () => `I compared it with the real thing in a boutique. Theirs ships, which felt vulgar.`,
  (c) => `Reserved it during a difficult week. The week passed; the ${c.shortName} did not arrive. Both outcomes were the correct ones.`,
  (c) => `${c.price} and I did not flinch. My father flinched at a fraction of this. We are a family in ascent.`,
  () => `The butler wrote to say it paused at an Alpine pass. I have started checking the weather there. We are, in a sense, travelling together.`,
]

const BY_CATEGORY: Record<string, Skeleton[]> = {
  包袋皮具: [
    () => `Fits everything I intend to own.`,
    () => `I am told the handle patinas beautifully. I am patina-ing along with it, at a distance.`,
    (c) => `Asked the associate what fits inside. She said "intentions, mainly." The ${c.shortName} and I understood each other at once.`,
  ],
  腕表珠宝: [
    () => `Keeps perfect time in the one place it exists, where time does not pass. Horology at its purest.`,
    (c) => `The ${c.colour.toLowerCase()} against ${c.material.toLowerCase()} is exactly my taste, which I discovered by seeing it.`,
    () => `I check it the way others check their watch: by remembering it. Never late.`,
  ],
  尊贵座驾: [
    () => `Zero to sixty entirely in the mind, instantly. No tyre wear to report.`,
    () => `The garage stays immaculate. Concours condition is easiest to maintain at zero kilometres, as the listing honestly said.`,
    () => `My neighbour asked when it would arrive. I said it was in transit. We both nodded. A very good car.`,
  ],
  游艇航空: [
    () => `The mooring fees are ¥0.00, in perpetuity. Ask any marina how rare that is.`,
    () => `The captain and I have corresponded about the weather. He has standards. I respect the delay more than I would respect an arrival.`,
    () => `We summer aboard, in conversation. The sea has never been calmer than in this listing.`,
  ],
  不动产: [
    () => `We summer there, in conversation. The light in the photographs is permanent, which no built house can say.`,
    () => `The housekeeper opens the windows on Tuesdays, per the listing. I think of her every Tuesday. Excellent staff.`,
    () => `Property is about location. This one is located in the exact centre of my browser, walking distance from everything I do.`,
  ],
  科技算力: [
    () => `Our workloads have never been more theoretical. Utilisation is a flawless 0%, which the uptime team assures me cannot be improved upon.`,
    () => `The cluster is superstitious about uptime, per the care notes. We do not speak of it. It has never gone down.`,
    () => `Bought it for the team. Morale improved the moment I shared the order confirmation. Deliverables unchanged, as expected.`,
  ],
  运动竞技: [
    () => `My seat has the best view of the seats. The fixtures proceed without me, in showroom condition.`,
    () => `The coaching is one-on-one, the one being me and the other one also being me, holding the order receipt. Form has improved.`,
    () => `Season after season, the box stays exactly as I imagined it. No other box can promise that.`,
  ],
  酒窖餐桌: [
    () => `Decanted it mentally. Notes of patience, stone, and a long finish that has not finished.`,
    () => `Cellared at twelve degrees in my thoughts, on its side, undisturbed. It is living my ideal life, as the care notes promised.`,
    () => `Paired it with an ordinary Tuesday dinner. The Tuesday rose to the occasion. Remarkable versatility.`,
  ],
  高定衣橱: [
    (c) => `Wore it, in spirit, to an event I also attended in spirit. The ${c.colour.toLowerCase()} was noticed by everyone I imagined.`,
    () => `The fit is perfect. It was made to my measurements, none of which I was asked for, all of which it met.`,
    () => `Nine hundred hours of embroidery, the listing says. I have spent eleven looking. We are both artisans now.`,
  ],
  艺术收藏: [
    () => `It ties the room together. The room is also on this site.`,
    () => `Provenance impeccable: it has never left the vault, the vault having never existed. Unbroken chain.`,
    () => `I visit it the way one visits a museum piece: occasionally, quietly, without touching. The glass is my screen.`,
  ],
}

const DOCKED: Review = {
  user: 'A Patient Man',
  stars: 4,
  text: 'One star withheld until delivery. I am told this makes the withholding permanent. Acceptable terms.',
}

/** 评论数：越贵越少。亿级藏品只有个位数留言，本身就是定价的一部分 */
export function reviewCountOf(product: Product): number {
  const h = h32(product.id + '#rc')
  if (product.price >= 100_000_000) return 3 + (h % 9)
  if (product.price >= 10_000_000) return 14 + (h % 38)
  if (product.price >= 1_000_000) return 60 + (h % 320)
  return 480 + (h % 11_800)
}

export function reviewsFor(product: Product): Review[] {
  const ctx: Ctx = {
    shortName: product.name.split('·')[0].trim().toLowerCase().startsWith('the ')
      ? product.name.split('·')[0].trim()
      : product.name.split('·')[0].trim(),
    material: materialOf(product),
    colour: colourwayOf(product),
    maison: maisonOf(product).name,
    price: yuan(product.price),
  }
  const pool = [...UNIVERSAL, ...(BY_CATEGORY[product.category] ?? [])]
  const seed = h32(product.id + '#rev')
  const n = 2 + (seed % 2) // 每件 2-3 条
  const picked: Review[] = []
  const used = new Set<number>()
  for (let i = 0; picked.length < n && i < 24; i++) {
    const idx = h32(`${product.id}#rev${i}`) % pool.length
    if (used.has(idx)) continue
    used.add(idx)
    picked.push({
      user: REVIEWERS[h32(`${product.id}#user${i}`) % REVIEWERS.length],
      stars: 5,
      text: pool[idx](ctx),
    })
  }
  // 七分之一的商品带那条 4 星（扣的那颗星等到货才补——所以是永久的）
  if (seed % 7 === 0) picked[picked.length - 1] = DOCKED
  return picked
}
