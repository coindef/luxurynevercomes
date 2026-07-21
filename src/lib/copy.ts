/** Site-wide copy pool. Deadpan and healing; the green is the only sincerity. */

/**
 * 主标语。方向是**鼓励购买、满足购买欲**，不能以「失去/得不到」开场。
 * （上一版戏仿百达翡丽的「You never actually own it」——聪明，但「你并不拥有它」
 *   领着一股丧气，跟本店「点一下就当富过」的多巴胺是拧着的。）
 * 「Buy everything. Keep everything.」两句都字面为真，正因为一切 ¥0.00：
 * 整车都买（满足购买欲），一分不花（钱全留下）。邀请你买，落点在你毫无损失。
 */
export const SLOGAN = 'Buy everything. Keep everything.'
export const SLOGAN_EN = 'Finally affordable. Forever undelivered.'
export const SUB_SLOGAN = 'No queue. No quota. No proof of funds. All equal here: everything ¥0.00, nothing ships.'

export const SEARCH_PLACEHOLDERS = [
  'Whatever you search, you can afford it',
  'Trending: financial freedom, a yacht, the next life',
  "Try 'platinum bag', the kind with no quota",
  "Try 'yacht', it won't park outside your place anyway",
]

export const MARQUEE_CITIES: { city: string; spot: string }[] = [
  { city: 'Shanghai', spot: 'the Bund' },
  { city: 'Beijing', spot: 'Guomao' },
  { city: 'Shenzhen', spot: 'Bay No.1' },
  { city: 'Hangzhou', spot: 'West Lake' },
  { city: 'Chengdu', spot: 'Luxelakes' },
  { city: 'Hong Kong', spot: 'Mid-Levels' },
  { city: 'Singapore', spot: 'Marina Bay' },
  { city: 'Suzhou', spot: 'Jinji Lake' },
]

/** White-glove butler delivery script, unlocked by real elapsed time after an order. */
export interface TrackingNode {
  offsetMs: number
  label: string
  text: string
}

const H = 3600_000
const D = 24 * H

export const TRACKING_SCRIPT: TrackingNode[] = [
  { offsetMs: 0, label: 'Order received', text: 'Your white-glove butler has accepted the order and is pressing his gloves. The goods can wait; the manners cannot.' },
  { offsetMs: 2 * H, label: 'Collected', text: 'Three master packers are done: satin, ribbon, wax seal. Weight: 0g. The masters say the finest things weigh nothing.' },
  { offsetMs: 1 * D, label: 'In escort', text: 'A two-man escort has left Geneva with your order, gloves on throughout, accompanied by a gentleman whose only job is opening doors.' },
  { offsetMs: 2 * D, label: 'In escort', text: 'The escort paused at an Alpine pass. The butler said the snow was too fine and watched it for you an extra half hour. That half hour is on the house.' },
  { offsetMs: 3 * D, label: 'In escort', text: 'Your order now rests in a Swiss bonded vault, climate-held at 55% humidity, guarded in three shifts. It currently lives better than any of us.' },
  { offsetMs: 4 * D, label: 'Out for delivery', text: 'The private jet is ready. The captain is waiting for weather worthy of the cargo. Today the clouds are a touch off.' },
  { offsetMs: 5 * D, label: 'Out for delivery', text: 'The weather came. The captain looked at the cloudless sky, decided a day this fine belonged to flying itself, circled the field three times, and loaded nothing.' },
  { offsetMs: 6 * D, label: 'Out for delivery', text: 'The butler has reached your city and is hunting for a pair of gloves worthy of your doorbell. Of the twelve he owns, none will do.' },
  { offsetMs: 7 * D, label: 'Delivered', text: 'The butler bows out. Nothing arrived, but rest assured: the way you wanted it is worth more than it is. It now sits in the showroom of your heart, climate-controlled, never depreciating. No signature required.' },
  // 长尾：真店的 clienteling 会寄周年卡。剧场谢幕之后，偶尔还来一张明信片
  { offsetMs: 14 * D, label: 'In residence', text: 'Week two. The piece remains in the showroom of your heart, dusted daily by staff who do not exist.' },
  { offsetMs: 30 * D, label: 'Postcard', text: 'Month one. Transit has become a residence. The order is thriving there, and asks after you.' },
  { offsetMs: 100 * D, label: 'Postcard', text: "Day one hundred. The escort has learned the names of the Alpine innkeeper's children. He sends his regards; the children send nothing, correctly." },
  { offsetMs: 365 * D, label: 'Anniversary', text: 'One year ago today, you placed this order. It has been kept in mint non-existence throughout. The house marked the hour; the hour did not notice.' },
]

/** Bespoke-order node, inserted when the order carries customization. */
export const BESPOKE_TRACKING_TEXT = 'The engraver stopped halfway to watch a sunset. He said the strokes need light in them.'

/** Reply pool for ringing the butler (chasing an order). */
export const BUTLER_REPLIES = [
  'In our trade, madam or sir, haste is unbecoming. Your patience has been noted in your file.',
  'Your ring was carried to the captain on a silver tray. The captain has read it. The ship has not moved.',
  'You have been upgraded to Priority Non-Delivery: your wait will be expedited, at no extra charge.',
  'Good news: among all undelivered orders worldwide, yours ranks first.',
  'A lovely ring. The butler says it was the only sound in the estate today. Thank you.',
  'Good things are worth waiting for. Things that never come are worth waiting longer.',
]

/** Impulse-source chips. */
export const URGE_CHIPS = [
  'Saw a celebrity with one',
  "A coworker's bag blinded me",
  'Watched a billionaire documentary',
  'Bonus just landed',
  "Bonus hasn't landed",
  'Curious how rich feels',
]

export const SOOTHING_BY_URGE: Record<string, string> = {
  "A coworker's bag blinded me": 'Next time she brings it, you can say quietly to yourself: I have one too. No need to say it out loud.',
  'Curious how rich feels': "Roughly what just happened: you saw it, you ordered it, you didn't flinch. You've had the core experience already.",
  "Bonus hasn't landed": 'The bonus will come. Until it does, you got rich first, as a courtesy.',
  'Watched a billionaire documentary': 'They order the same way in the documentary: see it, nod, never check the price. You just did the exact same thing, a little faster.',
  'Saw a celebrity with one': "Same piece, secured. The celebrity's took a quota; yours skips the goods entirely, which is purer.",
  'Bonus just landed': 'The bonus is still intact. The prestige is in place. You win both ways, which is very old-money.',
}

export const SOOTHING_GENERIC = [
  'The happiest part of owning something is the moment you decide to. You just had that part in full.',
  'The money never came. The wanting did. The calm stayed.',
  "See it, order it, don't flinch. That routine, you now share with them exactly.",
]

export const REVIEWS = [
  { user: 'Anon* Patron', stars: 5, text: "The yacht isn't here yet, but I've started turning down weekend overtime. It could arrive any moment; I need to keep the time free." },
  { user: 'Mid* Levels', stars: 5, text: 'Three years of buying bags here. Never met a quota, never spent a cent, and the associate smiles at me daily. Closest I have come to dignity.' },
  { user: 'Ms. Ch*n', stars: 5, text: 'Bought the compute cluster downstairs from the office. In meetings I look out the window and feel secure.' },
]

export const EMPTY_CART = 'Your reserve is empty. Just as well: the finest boutique windows are the emptiest, and the dearest.'
export const EMPTY_ORDERS = "No orders yet. For your first taste of wealth, start with a card holder. Once you've been rich once, the rest comes easy."
export const PRIVACY_FOOTER = "Your fortune exists only on this device. We can't see it, and neither can your relatives. Every item here is a limited edition, limited to 0. © LuxuryNeverComes · MAISON ZÉRO. Nine-figure averages, not a cent taken."
export const CONFIRM_RECEIPT_HINT = "A white glove settles over the button: 'Leave it in transit. While it is in transit, no one can take it from you.'"
export const SERVICE_BAR = ['Global warranty (nothing to repair)', "Boutique-sourced (the boutique hasn't seen it either)", 'White-glove delivery (the gloves are real)']

/** Reference units for the downpayment ledger. */
export const CONVERSIONS: { unit: string; price: number; suffix?: string }[] = [
  { unit: 'downpayments in a first-tier city', price: 2_000_000 },
  { unit: 'years of salary eating nothing', price: 150_000, suffix: ' (you may now eat)' },
  { unit: 'cups of bubble tea', price: 18 },
  { unit: 'times paying off the mortgage early', price: 1_000_000 },
]

/** 尺码指南按子品类走（此前 1,009 件念同一段） */
export const SIZING_BY_SUBTYPE: Record<string, string> = {
  watch: 'Measure your wrist with a ribbon, then add nothing: the house sized the case to the wrist you have, not the one the mirror promises. Between two sizes, take the quieter one.',
  ring: 'Ring size is taken at evening, when the hand has had its day. Ours are sized to the finger you point with, since that is the one that chose it.',
  gown: 'The gown is cut to measurements we never took and met them anyway. Alterations are complimentary and, like the gown, purely conceptual.',
  suit: 'A suit is measured thrice and cut once. Yours has been measured zero times and cut zero times, which the house notes is the same ratio.',
  shoes: 'Take your usual size in the evening. The last is carved from your footprint, which we imagine daily.',
  outerwear: 'Outerwear is sized to be worn over everything you own, including the other pieces from this house, which stack weightlessly.',
  bag: 'The sizes are named after what they refuse to carry. All of them refuse everything, generously.',
  necklace: 'Lengths are given in centimetres from the clasp. Wear the number that touches where you would want a compliment to land.',
}

/** 礼赠说明按品类走（盒子的玩笑每个品类各讲一遍，不重样） */
export const GIFTING_BY_CATEGORY: Record<string, string> = {
  包袋皮具: 'The house box is itself nearly a bag. Inside it, the idea of one, wrapped in tissue that is entirely real.',
  腕表珠宝: 'Presented in a lacquered case lined with velvet. The hinge is engineered to open slowly, which is fortunate, as there is no hurry whatsoever.',
  尊贵座驾: 'The ribbon is tied around the paperwork. A bow on the car itself would scratch the paint it does not have.',
  游艇航空: 'Gift wrap at this scale is a formality the house takes seriously: the bow alone measures eleven metres and is stored in the same place as the yacht.',
  不动产: 'The deed arrives in an envelope sealed with wax. The envelope is the first structure ever built on the property.',
  科技算力: 'Wrapped in antistatic tissue. The static, like the cluster, is theoretical, and both are handled with gloves.',
  运动竞技: 'The gift is a certificate of the experience. The experience is a certificate of the gift. Both frames are included.',
  酒窖餐桌: 'Chilled to cellar temperature for transport. The temperature will arrive in perfect condition.',
  高定衣橱: "Folded by the house's folder, thirty years at the bench. Unfolding is the recipient's privilege, indefinitely deferred.",
  艺术收藏: 'Crated as for a museum loan: never opened, fully insured, admired through the slats.',
}

/** Revisit lines for older orders. */
export function revisitLine(days: number): string | null {
  if (days >= 30) return `This order has kept you company for ${days} days. That night's longing was real, and not needing it now is real too. Both real, both fine.`
  if (days >= 7) return `This order has kept you company for ${days} days. The butler bowed out yesterday; you went to work as usual today. Both of you, very dignified.`
  if (days >= 3) return `This order has kept you company for ${days} days. Still thinking about it is normal. It is worth a house, after all.`
  return null
}

/** Member tier, by order count. */
export function memberLevel(orderCount: number): string {
  if (orderCount >= 50) return 'Old Money · too serene to ask the price'
  if (orderCount >= 20) return 'Dynasty · the associate pours champagne on sight'
  if (orderCount >= 5) return 'Collector · your taste is on file'
  return 'New Money · first time rich, every courtesy is yours'
}

/** Bespoke atelier copy. */
export const BESPOKE = {
  title: 'Bespoke Atelier · BESPOKE',
  subtitle: 'Each one unique. Each one never coming.',
  intro: 'The options below follow a century of couture tradition. The artisans are fictional; not one step was skipped.',
  baseTag: 'Atelier base · included in ¥0.00',
  textHelper: 'Up to 12 characters, hand-engraved, irreversible. These words are taken seriously: they are the only real thing in the whole process.',
  completeLine: 'Your bespoke file is complete. One of one worldwide, and one of one never shipped. The atelier begins at once, solemnly making nothing.',
  skipLine: 'As it comes · bare-faced, which is its own kind of luxury.',
  footnote: 'The atelier\'s artisans, steps, and waiting are all fictional; every surcharge is solemnly waived. The words you engrave, and the money you save, are real.',
  successLine: 'Your bespoke file has been solemnly filed in the atelier vault, displayed beside 0 other finished pieces.',
  receiptHeader: '· HAUTE BESPOKE ·',
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
