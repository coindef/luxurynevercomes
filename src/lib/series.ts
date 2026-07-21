import type { Product } from './types'
import { subtypeOf } from './bespoke'

/**
 * 系列（série）：品类之下的第二层结构——真店的导航就是这么分的
 * （Hermès 的 Bags and Clutches / Travel；Dior 的 Gowns / Outerwear / Shoes）。
 * 用户的原话是「collection 太宽泛：衣服还分场合、正装、运动」——对。
 * 一个品类约 100 件混排，是仓库不是精品店；分成 3-7 个系列，每个系列 4-50 件，
 * 才是「按厅逛」。
 *
 * 判定规则：先看子品类（subtypeOf，已有 36 类），再按名字关键词细分；
 * 每类最后一条是兜底（test 恒真）。规则有序，先中先得。
 * 内部 id 用英文 kebab（新代码无中文键包袱；品类键仍是中文，见 CLAUDE.md）。
 */

export interface Series {
  id: string
  label: string
}

type Rule = Series & { test: (name: string, subtype: string | null) => boolean }

const R = (id: string, label: string, test: Rule['test']): Rule => ({ id, label, test })
const kw = (re: RegExp) => (name: string) => re.test(name)
const always = () => true

const SERIES_RULES: Record<string, Rule[]> = {
  包袋皮具: [
    R('exotics', 'Exotic Skins', kw(/croc|ostrich|python|lizard|alligator|himalaya|caiman/i)),
    R('trunks', 'Trunks & Travel', (_n, st) => st === 'trunk'),
    R('small-leather', 'Small Leather Goods', (_n, st) => st === 'sla'),
    R('handbags', 'Handbags', always),
  ],
  腕表珠宝: [
    R('watches', 'Watches', (_n, st) => st === 'watch'),
    R('rings', 'Rings', (_n, st) => st === 'ring'),
    R('necklaces', 'Necklaces & Pendants', (_n, st) => st === 'necklace'),
    R('stones', 'Unset Stones', (_n, st) => st === 'stone'),
    R('parures', 'Bracelets, Brooches & Parures', always),
  ],
  尊贵座驾: [
    R('motorcycles', 'Motorcycles', (_n, st) => st === 'moto'),
    R('racing', 'Racing Provenance', kw(/f1|formula|rally|dakar|grand.?prix|endurance|hillclimb|salt.?flat|group.?b|track.?only|showcar|le mans/i)),
    R('classics', 'Classics & Coachbuilt', kw(/vintage|antique|pre.?war|art.?deco|coachbuilt|restomod|steam|brass|wedding|royal|motorcade|carriage|fire.?engine|tram|electric.*19|victorian/i)),
    R('eccentrics', 'Utility & Eccentrics', kw(/armou?red|bullion|mining|land.?yacht|tour.?bus|six.?wheel|maglev|lunar|hover|amphib|diplomatic|convoy|haul/i)),
    R('grand-tourers', 'Hypercars & Grand Tourers', always),
  ],
  游艇航空: [
    R('sail', 'Under Sail', kw(/sail|sloop|schooner|wingsail|j.?class|regatta|clipper(?!.*flying)/i)),
    R('submersibles', 'Beneath the Surface', kw(/\bsub\b|submersible|submarine|hadal|deep.?sea|underwater|bathy/i)),
    R('space-edge', 'The Edge of Space', kw(/suborbital|orbital|strato|space/i)),
    R('vertical', 'Vertical Flight & Airships', kw(/heli|tiltrotor|evtol|gyro|airship|blimp|air.?taxi|jet.?pack/i)),
    R('fixed-wing', 'Fixed Wing', (_n, st) => st === 'aircraft'),
    R('motor-yachts', 'Motor Yachts & Explorers', always),
  ],
  不动产: [
    R('coasts', 'Coasts & Islands', kw(/island|islet|waterfront|fjord|lighthouse|archipelago|beach|cliff|coast|canal|lagoon|riverfront|lake/i)),
    R('wilderness', 'Land & Wilderness', (_n, st) => st === 'land' || /vineyard|ranch|forest|desert|prairie|plain|barn|savanna|steppe|glacier|valley/i.test(_n)),
    R('sky-flats', 'Townhouses & Sky Flats', kw(/flat|penthouse|duplex|loft|apartment|residence|tower|corner|storey|floor|lift|mews|townhouse/i)),
    R('estates', 'Estates & Castles', always),
  ],
  科技算力: [
    R('quantum', 'Quantum', kw(/quantum|qubit|photon|anneal|topological/i)),
    R('orbital', 'Orbital Works', (_n, st) => st === 'space'),
    R('automata', 'Automata', (_n, st) => st === 'robot'),
    R('networks', 'Networks & Spectrum', kw(/6g|cable|spectrum|backbone|relay|network|antenna|mesh/i)),
    R('silicon', 'Clusters & Silicon', always),
  ],
  运动竞技: [
    R('bloodstock', 'The Stable', (_n, st) => st === 'animal'),
    R('seats', 'Seats & Stadia', (_n, st) => st === 'venue'),
    R('legends', 'Lessons & Legends', always),
  ],
  酒窖餐桌: [
    R('cellar', 'The Cellar', (_n, st) => st === 'wine'),
    R('still-room', 'Spirits & Casks', (_n, st) => st === 'spirit'),
    R('tea', 'Tea & Leaf', kw(/\btea\b|pu.?er|longjing|dan cong|rock tea|matcha|chakai|oolong/i)),
    R('tables', 'Private Tables', kw(/chef|banquet|restaurant|sommelier|omakase|kaiseki|hound|mill|greenhouse/i)),
    R('larder', 'The Larder', always),
  ],
  高定衣橱: [
    R('evening', 'Evening & Ceremony', (_n, st) =>
      st === 'gown' || /gala|red.?carpet|veil|opera(?!.*glove)|tiara|evening|stole|cummerbund|corset|lingerie|bridal|wedding/i.test(_n)),
    R('tailoring', 'Tailoring & Shirts', (_n, st) =>
      st === 'suit' || /\btie\b|pocket square|cufflink|braces|shirt|kilt|tailor\b/i.test(_n)),
    R('shoes', 'Shoes', (_n, st) => st === 'shoes'),
    R('millinery', 'Hats, Gloves & Canes', kw(/\bhat\b|fedora|boater|glove|sunglasses|umbrella|snood|bracer/i)),
    R('knits', 'Outerwear & Knits', (_n, st) =>
      st === 'outerwear' || /cashmere|knit|turtleneck|loungewear|sock|caftan|qiviut/i.test(_n)),
    R('fitting-room', 'The Fitting Room', kw(/stylist|fragrance|couple|button|crest|bedding|wrap it all/i)),
    R('silks', 'Scarves & Silks', always),
  ],
  艺术收藏: [
    R('paintings', 'Paintings & Works on Paper', (_n, st) =>
      st === 'painting' || /pointillist|ukiyo|flemish|dutch|minimalist|masterpiece|calligraphy|scroll|print/i.test(_n)),
    R('sculpture', 'Sculpture & Bronzes', (_n, st) => st === 'sculpture'),
    R('instruments', 'Instruments', (_n, st) => st === 'instrument'),
    R('deep-time', 'Deep Time', kw(/meteorite|fossil|amber|paleozoic|ice age|comet|pallasite|dinosaur|bloodstone|mars\b|lunar/i)),
    R('one-of-ones', 'Curiosities & One-of-Ones', (_n, st) =>
      st === 'naming' || /one of a kind|stamp|camera|sunrise|aurora|naming/i.test(_n)),
    R('antiquities', 'Antiquities & Dynasties', always),
  ],
}

const FALLBACK: Series = { id: 'collection', label: 'The Collection' }

export function seriesOf(product: Product): Series {
  const rules = SERIES_RULES[product.category]
  if (!rules) return FALLBACK
  const st = subtypeOf(product)
  for (const r of rules) {
    if (r.test(product.name, st)) return { id: r.id, label: r.label }
  }
  return FALLBACK
}

/** 该品类下的系列清单（按定义顺序，即陈列顺序） */
export function seriesForCategory(category: string): Series[] {
  return (SERIES_RULES[category] ?? []).map(({ id, label }) => ({ id, label }))
}
