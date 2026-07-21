import type { Product } from './types'
import { PRODUCTS } from './products'
import { seriesOf } from './series'

/**
 * Fictional maisons (houses). This shop names no real brand; every house here is invented.
 * They power the "shop by house" axis, alongside the category filter.
 * Each house belongs to one category and is named by personality (any item in that
 * category fits). Non-physical categories (compute, real estate) get invented-institution
 * names, which is exactly the "sort them another way" the store needed.
 */
export interface Maison {
  id: string
  /** House name (English/Western, like an international maison) */
  name: string
  /** Small caps eyebrow flourish */
  flourish: string
  /** One deadpan line of backstory */
  story: string
  /** internal category key (Chinese, matches product.category) */
  category: string
  /** 专营系列（series.ts 的 id）。缺省 = 全品类通吃 */
  series?: string[]
}

export const MAISONS: Maison[] = [
  // Bags & Leather
  { id: 'cuir', name: 'Maison du Cuir', flourish: 'Leather House', story: 'Old-world leatherwork, one bag one artisan. The artisan is real; the delivery is not.', category: '包袋皮具', series: ['handbags', 'small-leather'] },
  { id: 'nova-bag', name: 'Atelier Nova', flourish: 'Modern Leather', story: 'Avant-garde structure. Holds your ambition, not your keys.', category: '包袋皮具', series: ['handbags'] },
  { id: 'exotique', name: 'Maison Exotique', flourish: 'Exotic Skins', story: 'Crocodile, ostrich, and patience. Two of the three are farmed.', category: '包袋皮具', series: ['exotics'] },
  { id: 'malle', name: 'Malletier Voyage', flourish: 'Trunks & Travel', story: 'Trunks for journeys of any length. Current journeys: length zero.', category: '包袋皮具', series: ['trunks'] },
  // Watches & Jewellery
  { id: 'chrones', name: 'Manufacture Chronés', flourish: 'Fine Watchmaking', story: 'Time polished to the nine-hundredth step. Delivery scheduled for the nine-hundredth year.', category: '腕表珠宝', series: ['watches'] },
  { id: 'feilong', name: 'Joaillerie Vollance', flourish: 'Rings & High Jewellery', story: 'Every stone waited a hundred million years. It can wait a little more for you.', category: '腕表珠宝', series: ['rings'] },
  { id: 'astris', name: 'Astris', flourish: 'Necklaces & Parures', story: 'Bold settings. Wearing one is like carrying a small piece of the night.', category: '腕表珠宝', series: ['necklaces', 'parures'] },
  { id: 'lapidaire', name: 'Le Lapidaire', flourish: 'Unset Stones', story: 'We sell the stone and the silence around it. The silence is included; the setting is extra.', category: '腕表珠宝', series: ['stones'] },
  // Motorcars
  { id: 'vantor', name: 'Écurie Vantor', flourish: 'Hypercars & Grand Tourers', story: 'Each body panel hand-beaten, then parked in the description.', category: '尊贵座驾', series: ['grand-tourers'] },
  { id: 'patrimoine', name: 'Garage Patrimoine', flourish: 'Classics & Coachbuilt', story: 'History cleaner than a museum. The engine starts twice a year, on film.', category: '尊贵座驾', series: ['classics', 'eccentrics'] },
  { id: 'scuderia', name: 'Scuderia Lampo', flourish: 'Racing Provenance', story: 'Every car here holds a lap record somewhere, and a parking record here.', category: '尊贵座驾', series: ['racing'] },
  { id: 'deux-roues', name: 'Atelier Deux Roues', flourish: 'Motorcycles', story: 'Two wheels, one seat, zero shipments. The helmet is mandatory anyway.', category: '尊贵座驾', series: ['motorcycles'] },
  // Yachts & Aviation
  { id: 'orion', name: 'Chantier Oríon', flourish: 'Motor Yachts', story: 'Already launched, currently crossing some canal, forever crossing.', category: '游艇航空', series: ['motor-yachts'] },
  { id: 'celeste', name: 'Aéro Céleste', flourish: 'Private Aviation', story: 'Destination of your choosing. Departure time agreed between the captain and the weather.', category: '游艇航空', series: ['fixed-wing'] },
  { id: 'alize', name: 'Voilerie Alizé', flourish: 'Under Sail', story: 'Powered entirely by wind. The wind, too, declines to arrive.', category: '游艇航空', series: ['sail'] },
  { id: 'abysse', name: 'Bureau Abysse', flourish: 'Submersibles', story: 'Rated to eleven thousand metres. Tested to the depth of this sentence.', category: '游艇航空', series: ['submersibles'] },
  { id: 'verticale', name: 'Héliport Verticale', flourish: 'Vertical Flight', story: 'Lands anywhere. Departs nowhere.', category: '游艇航空', series: ['vertical'] },
  { id: 'karman', name: 'Ligne Kármán', flourish: 'The Edge of Space', story: 'Eighty kilometres up, the sky turns black and the refund policy turns moot.', category: '游艇航空', series: ['space-edge'] },
  // Real Estate
  { id: 'terrafirma', name: 'Bureau Terra Firma', flourish: 'Estates & Castles', story: "The 'pre' in pre-sale is as the industry understands it.", category: '不动产', series: ['estates'] },
  { id: 'skyline', name: 'Atelier Skyline', flourish: 'Sky Residences', story: 'Home above the clouds, on the floors the lift cannot reach.', category: '不动产', series: ['sky-flats'] },
  { id: 'insulaire', name: 'Agence Insulaire', flourish: 'Coasts & Islands', story: 'Every listing surrounded by water on all sides, including the moat of paperwork.', category: '不动产', series: ['coasts'] },
  { id: 'cadastre', name: 'Cadastre & Fils', flourish: 'Land & Wilderness', story: 'We sell the horizon by the hectare. Fencing optional, walking mandatory.', category: '不动产', series: ['wilderness'] },
  // Compute & Tech
  { id: 'nimbus', name: 'Institut Nimbus', flourish: 'Clusters & Silicon', story: 'Compute managed like an asset: parameters uncapped, delivery undated.', category: '科技算力', series: ['silicon', 'networks'] },
  { id: 'cosmos', name: 'Bureau Cosmos', flourish: 'Orbital Works', story: 'Passes over your head every 90 minutes, more punctual than any courier.', category: '科技算力', series: ['orbital'] },
  { id: 'decohere', name: 'Institut Décohère', flourish: 'Quantum', story: 'Both delivered and undelivered until observed. We recommend not observing.', category: '科技算力', series: ['quantum'] },
  { id: 'automate', name: 'Manufacture Automate', flourish: 'Automata', story: 'Obeys the three laws, plus a fourth of our own: never arrive.', category: '科技算力', series: ['automata'] },
  // Sport
  { id: 'agon', name: 'Cercle Agón', flourish: 'Seats & Stadia', story: 'Waitlist starts at forty years. We waive it. You are not getting in anyway.', category: '运动竞技', series: ['seats'] },
  { id: 'concierge', name: 'Le Concierge', flourish: 'Lessons & Legends', story: 'We can arrange anything for you, except to actually deliver it.', category: '运动竞技', series: ['legends'] },
  { id: 'haras', name: 'Haras Royal', flourish: 'Bloodstock', story: 'Sires of champions. The foals inherit everything except existence.', category: '运动竞技', series: ['bloodstock'] },
  // Cellar & Table
  { id: 'silene', name: 'Cave Silène', flourish: 'Wine Merchant', story: 'Pay in full now, the wine ships in two years. The trade and this shop agree.', category: '酒窖餐桌', series: ['cellar'] },
  { id: 'gourmet', name: 'Table Gourmet', flourish: 'The Larder', story: 'Aroma lasts five days. On the sixth it becomes legend, like everything here.', category: '酒窖餐桌', series: ['larder', 'tables'] },
  { id: 'alambic', name: 'Distillerie Alambic', flourish: 'Spirits & Casks', story: 'The angels take their share every year. They alone take delivery.', category: '酒窖餐桌', series: ['still-room'] },
  { id: 'theine', name: 'Comptoir Théine', flourish: 'Tea & Leaf', story: 'Some leaves waited three hundred years on the mountain. Yours will wait in nicer packaging.', category: '酒窖餐桌', series: ['tea'] },
  // Couture
  { id: 'nuage', name: 'Atelier Nuage', flourish: 'Haute Couture', story: 'Nine hundred hours of embroidery, delivery date to be confirmed.', category: '高定衣橱', series: ['evening', 'fitting-room'] },
  { id: 'soiree', name: 'Maison Soirée', flourish: 'Evening & Ceremony', story: 'There is applause at the end of the red carpet. Applause not included.', category: '高定衣橱', series: ['evening'] },
  { id: 'rowe', name: 'Rowe & Steadman', flourish: 'Tailoring', story: 'Measured thrice, cut once, shipped never. The chalk marks are archived.', category: '高定衣橱', series: ['tailoring'] },
  { id: 'soie', name: 'Soierie du Matin', flourish: 'Scarves & Silks', story: 'Ninety centimetres of silk, hemmed by hand, worn seventeen ways, delivered zero.', category: '高定衣橱', series: ['silks', 'knits'] },
  { id: 'forme', name: 'Maison de la Forme', flourish: 'Hats & Gloves', story: 'Made to the millimetre of your head. Your head need not attend.', category: '高定衣橱', series: ['millinery'] },
  { id: 'lucide', name: 'Cordonnerie Lucide', flourish: 'Shoes', story: 'The last is carved from your footprint. The first step remains pending.', category: '高定衣橱', series: ['shoes'] },
  // Art & Collectibles
  { id: 'chronos', name: 'Galerie Chronos', flourish: 'Gallery & Auction', story: 'Hammer price three hundred million. The sound of the hammer is free.', category: '艺术收藏', series: ['paintings'] },
  { id: 'antiqua', name: 'Cabinet Antiqua', flourish: 'Antiquities', story: 'Fewer than a hundred survive, and someone tracks each one, including this one.', category: '艺术收藏', series: ['antiquities'] },
  { id: 'etoiles', name: 'Bureau des Étoiles', flourish: 'Curiosities & Naming Rights', story: 'We name a star for you and hand you a certificate. The star is not informed.', category: '艺术收藏', series: ['one-of-ones'] },
  { id: 'eternelle', name: 'Fonderie Éternelle', flourish: 'Sculpture & Bronzes', story: 'Cast to outlast civilisations. Stored to outlast the courier.', category: '艺术收藏', series: ['sculpture'] },
  { id: 'profond', name: 'Cabinet du Temps Profond', flourish: 'Deep Time', story: 'Everything here predates money. The prices are making up for it.', category: '艺术收藏', series: ['deep-time'] },
  { id: 'luthier', name: 'Atelier du Luthier', flourish: 'Instruments', story: 'Three centuries of resonance. It plays beautifully in the vault, they say.', category: '艺术收藏', series: ['instruments'] },
]

/** stable hash: an item always lands in the same house */
function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

const BY_CATEGORY: Record<string, Maison[]> = {}
for (const m of MAISONS) (BY_CATEGORY[m.category] ??= []).push(m)

const MAISON_BY_ID: Record<string, Maison> = Object.fromEntries(MAISONS.map((m) => [m.id, m]))

/** The house an item belongs to: 先找专营其系列的屋，没有专营再落回全品类，稳定散列均衡。 */
export function maisonOf(product: Product): Maison {
  const houses = BY_CATEGORY[product.category] ?? MAISONS
  const sid = seriesOf(product).id
  const specialists = houses.filter((m) => m.series?.includes(sid))
  const pool = specialists.length > 0 ? specialists : houses
  return pool[hash(product.id) % pool.length]
}

export function getMaison(id: string): Maison | undefined {
  return MAISON_BY_ID[id]
}

/** All pieces of a house, dearest first. */
export function productsOfMaison(id: string): Product[] {
  return PRODUCTS.filter((p) => maisonOf(p).id === id).sort((a, b) => b.price - a.price)
}

/** One flagship piece per house (the dearest), for the directory. */
export function maisonHero(id: string): Product | undefined {
  return productsOfMaison(id)[0]
}

/** Piece count per house. */
export function maisonCount(id: string): number {
  return PRODUCTS.filter((p) => maisonOf(p).id === id).length
}
