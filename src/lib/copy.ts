/** Site-wide copy pool. Deadpan and healing; the green is the only sincerity. */

/**
 * 主标语。戏仿的是奢侈品行业最出名的那一句——百达翡丽的
 * 「You never actually own a Patek Philippe. You merely look after it for the next generation.」
 * 那句广告语本身讲的就是**你并不拥有它**；本站不过是把这个逻辑推到了尽头。
 * 所以懂行的人一眼就接住了梗，不懂的人读到的也是一句正经的、温柔的话。
 * 落点在治愈那一侧（wanting is free），不落在笑点上——这是本店的规矩。
 */
export const SLOGAN = 'You never actually own it. You merely want it.'
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
