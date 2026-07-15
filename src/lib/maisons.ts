import type { Product } from './types'
import { PRODUCTS } from './products'

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
}

export const MAISONS: Maison[] = [
  // Bags & Leather
  { id: 'cuir', name: 'Maison du Cuir', flourish: 'Leather House', story: 'Old-world leatherwork, one bag one artisan. The artisan is real; the delivery is not.', category: '包袋皮具' },
  { id: 'nova-bag', name: 'Atelier Nova', flourish: 'Modern Leather', story: 'Avant-garde structure. Holds your ambition, not your keys.', category: '包袋皮具' },
  // Watches & Jewellery
  { id: 'chrones', name: 'Manufacture Chronés', flourish: 'Fine Watchmaking', story: 'Time polished to the nine-hundredth step. Delivery scheduled for the nine-hundredth year.', category: '腕表珠宝' },
  { id: 'feilong', name: 'Joaillerie Vollance', flourish: 'High Jewellery', story: 'Every stone waited a hundred million years. It can wait a little more for you.', category: '腕表珠宝' },
  { id: 'astris', name: 'Astris', flourish: 'Haute Joaillerie', story: 'Bold settings. Wearing one is like carrying a small piece of the night.', category: '腕表珠宝' },
  // Motorcars
  { id: 'vantor', name: 'Écurie Vantor', flourish: 'Coachbuilt Motorcars', story: 'Each body panel hand-beaten, then parked in the description.', category: '尊贵座驾' },
  { id: 'patrimoine', name: 'Garage Patrimoine', flourish: 'Classic & Collector', story: 'History cleaner than a museum. The engine starts twice a year, on film.', category: '尊贵座驾' },
  // Yachts & Aviation
  { id: 'orion', name: 'Chantier Oríon', flourish: 'Shipyard', story: 'Already launched, currently crossing some canal, forever crossing.', category: '游艇航空' },
  { id: 'celeste', name: 'Aéro Céleste', flourish: 'Private Aviation', story: 'Destination of your choosing. Departure time agreed between the captain and the weather.', category: '游艇航空' },
  // Real Estate
  { id: 'terrafirma', name: 'Bureau Terra Firma', flourish: 'Estates', story: "The 'pre' in pre-sale is as the industry understands it.", category: '不动产' },
  { id: 'skyline', name: 'Atelier Skyline', flourish: 'Sky Residences', story: 'Home above the clouds, on the floors the lift cannot reach.', category: '不动产' },
  // Compute & Tech
  { id: 'nimbus', name: 'Institut Nimbus', flourish: 'Compute House', story: 'Compute managed like an asset: parameters uncapped, delivery undated.', category: '科技算力' },
  { id: 'cosmos', name: 'Bureau Cosmos', flourish: 'Orbital Works', story: 'Passes over your head every 90 minutes, more punctual than any courier.', category: '科技算力' },
  // Sport
  { id: 'agon', name: 'Cercle Agón', flourish: 'Sporting Club', story: 'Waitlist starts at forty years. We waive it. You are not getting in anyway.', category: '运动竞技' },
  { id: 'concierge', name: 'Le Concierge', flourish: 'Private Experiences', story: 'We can arrange anything for you, except to actually deliver it.', category: '运动竞技' },
  // Cellar & Table
  { id: 'silene', name: 'Cave Silène', flourish: 'Wine Merchant', story: 'Pay in full now, the wine ships in two years. The trade and this shop agree.', category: '酒窖餐桌' },
  { id: 'gourmet', name: 'Table Gourmet', flourish: 'Gastronomy', story: 'Aroma lasts five days. On the sixth it becomes legend, like everything here.', category: '酒窖餐桌' },
  // Couture
  { id: 'nuage', name: 'Atelier Nuage', flourish: 'Haute Couture', story: 'Nine hundred hours of embroidery, delivery date to be confirmed.', category: '高定衣橱' },
  { id: 'soiree', name: 'Maison Soirée', flourish: 'Evening & Ceremony', story: 'There is applause at the end of the red carpet. Applause not included.', category: '高定衣橱' },
  // Art & Collectibles
  { id: 'chronos', name: 'Galerie Chronos', flourish: 'Gallery & Auction', story: 'Hammer price three hundred million. The sound of the hammer is free.', category: '艺术收藏' },
  { id: 'antiqua', name: 'Cabinet Antiqua', flourish: 'Antiquities', story: 'Fewer than a hundred survive, and someone tracks each one, including this one.', category: '艺术收藏' },
  { id: 'etoiles', name: 'Bureau des Étoiles', flourish: 'Naming Rights', story: 'We name a star for you and hand you a certificate. The star is not informed.', category: '艺术收藏' },
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

/** The house an item belongs to (assigned within its category by stable hash, evenly). */
export function maisonOf(product: Product): Maison {
  const houses = BY_CATEGORY[product.category] ?? MAISONS
  return houses[hash(product.id) % houses.length]
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
