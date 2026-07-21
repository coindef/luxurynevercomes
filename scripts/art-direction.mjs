/**
 * 图录美术方向：把商品变成「佳士得的一个拍品」的提示词。
 *
 * 硬规则来自 CLAUDE.md：背景只能中性（无缝白/灰/炭/黑/石材/木），材质本色保留，
 * 禁止彩色背景布；硬否决可读品牌 logo/字标、价签、店铺地面、手机快照、人脸、水印。
 *
 * 下面四条是实测出来的（每条都是踩了坑才写的，别想当然改）：
 *
 * 1. **同一件商品的三个视角必须共用一个 seed**。seed 不同 = 三张图画的是三个不同的包
 *    （实测：视角 2 是灰包、视角 3 变成黑包）。共用 seed 才能锁住材质/颜色/五金。
 *    代价是 seed 同时也锁住构图，所以——
 * 2. **视角短语必须放在提示词最前面**，才拽得动构图。写在句尾一律被无视，
 *    Flux 的产品图先验永远给你一张正面英雄图。
 * 3. **绝不出现 "hand" / "people" 这类名词，哪怕是在否定句里**。扩散模型不会否定，
 *    只会把你提到的东西画出来（实测："hand stitching" → 画面里伸进来一只手）。
 *    规避靠正向描述（unbranded / unmarked / vacant），不靠 "no xxx"。
 * 4. **只做整体视角，不做微距细节**。把细节写成主语，模型会丢掉商品本体
 *    （实测：包扣微距 → 画出一枚钻戒）。图录的细节页很美，但这条链路做不到。
 */

/** 每个分类：三个视角（lead 打头拽构图，caption 是画廊小字）+ 布景。 */
const DIRECTION = {
  包袋皮具: {
    scene: 'on a seamless mid-grey studio background, soft directional museum lighting, gentle gradient falloff',
    views: [
      { lead: 'Three-quarter front view, standing upright, complete object in frame, of a', caption: 'Full view' },
      { lead: 'Rear view photographed from directly behind, the back panel facing the camera, complete object in frame, of a', caption: 'Reverse' },
      { lead: 'Photographed directly from above, top-down overhead flat lay, looking straight down at a', caption: 'From above' },
    ],
  },
  // 这一类里表和珠宝混着放，所以视角措辞必须通用：
  // 写「表盘朝向镜头」「背面机芯盖」的话，一枚钻戒会被硬画出个表盘来。
  腕表珠宝: {
    scene: 'on a seamless charcoal background, precise jeweller lighting, controlled specular highlights',
    views: [
      { lead: 'Front view photographed straight on, upright, complete piece in frame, of a', caption: 'Full view' },
      { lead: 'Strict side profile view showing the depth and setting from the side, of a', caption: 'Profile' },
      // 珠宝多是对称的，「背面」和正面长得一模一样（同 seed 更是锁死构图）。
      // 俯视能看到台面/戒圈，才是真的换了个角度。
      { lead: 'Photographed directly from above, top-down overhead view looking straight down at a', caption: 'From above' },
    ],
  },
  尊贵座驾: {
    scene: 'in a seamless grey studio cyclorama, broad overhead softbox, polished concrete floor fading to nothing',
    views: [
      { lead: 'Front three-quarter view, complete car in frame, of a', caption: 'Full view' },
      { lead: 'Rear three-quarter view photographed from behind, complete car in frame, of a', caption: 'Reverse' },
      { lead: 'Photographed directly from above, top-down overhead aerial view looking straight down at a', caption: 'From above' },
    ],
  },
  游艇航空: {
    scene: 'on a calm slate-grey sea under flat overcast silver light, desaturated, no shoreline',
    views: [
      { lead: 'Full profile view, broadside to the camera, complete vessel in frame, of a', caption: 'Full view' },
      { lead: 'Photographed directly from above, top-down overhead aerial view looking straight down at a', caption: 'From above' },
      // 「stern（船尾）」对喷气机/热气球是胡说，这一类里它们混在一起
      { lead: 'Rear three-quarter view photographed from behind, complete craft in frame, of a', caption: 'Reverse' },
    ],
  },
  不动产: {
    scene: 'architectural photography, muted natural light, stone and glass, desaturated overcast palette, vacant and still',
    views: [
      { lead: 'Exterior elevation photographed straight on, the complete building in frame, of a', caption: 'Exterior' },
      { lead: 'Interior view of the principal room, vacant, furniture sparse and still, of a', caption: 'Interior' },
      { lead: 'Photographed directly from above, top-down overhead aerial view looking straight down at a', caption: 'From above' },
    ],
  },
  科技算力: {
    scene: 'in a seamless black studio void, cool hard rim lighting, single subject floating',
    views: [
      { lead: 'Front elevation photographed straight on, complete unit in frame, of a', caption: 'Full view' },
      { lead: 'Three-quarter angle showing the chassis depth, complete unit in frame, of a', caption: 'Profile' },
      { lead: 'Rear view photographed from directly behind, the back panel facing the camera, of a', caption: 'Reverse' },
    ],
  },
  运动竞技: {
    scene: 'flat overcast light, desaturated, deserted and empty, muted greys and greens',
    views: [
      { lead: 'Wide establishing view, deserted, complete subject in frame, of a', caption: 'Full view' },
      { lead: 'Photographed directly from above, top-down overhead aerial view looking straight down at a', caption: 'From above' },
      { lead: 'Low-angle ground-level view, deserted, of a', caption: 'Ground level' },
    ],
  },
  酒窖餐桌: {
    scene: 'on a seamless dark stone surface, single soft key light from behind, deep shadow',
    views: [
      { lead: 'Standing upright photographed straight on, complete object in frame, plain unlabelled surface, of a', caption: 'Full view' },
      { lead: 'Three-quarter view with a soft reflection beneath, complete object in frame, of a', caption: 'Profile' },
      { lead: 'Photographed directly from above, top-down overhead flat lay, looking straight down at a', caption: 'From above' },
    ],
  },
  高定衣橱: {
    scene: 'on an invisible mannequin against a seamless pale grey background, soft even studio light',
    views: [
      { lead: 'Front view, the complete garment in frame, hanging as if worn, of a', caption: 'Full view' },
      { lead: 'Back view photographed from directly behind, the complete garment in frame, of a', caption: 'Reverse' },
      { lead: 'Three-quarter angle showing the drape and silhouette, complete garment in frame, of a', caption: 'Profile' },
    ],
  },
  艺术收藏: {
    scene: 'on a plain museum wall of neutral stone-grey, gallery spotlighting, deep quiet',
    views: [
      { lead: 'Straight-on frontal view, centred, the complete piece in frame, of a', caption: 'Full view' },
      // 「showing surface relief」踩了铁律 4：surface 成了主语，模型画了一面被侧光扫过的空墙，
      // 把青铜簋/纸莎草/丝网版画整个丢了。主语必须始终是作品本身
      { lead: 'Three-quarter view under raking side light, the complete work centred and filling the frame, of a', caption: 'Raking light' },
      { lead: 'Installation view from across a vacant gallery room, seen at a distance, of a', caption: 'In situ' },
    ],
  },
}

const FALLBACK = DIRECTION.艺术收藏

/** 图录质感尾巴。全正向措辞——见文件头第 3 条。 */
const CATALOGUE_TAIL =
  'auction catalogue photograph, single subject, generous negative space, medium format, ultra sharp, ' +
  'unbranded and unmarked with plain blank surfaces, clean of lettering'

/**
 * 商品本身就是「一个人」的：画出来必然是张人脸，而人脸是 CLAUDE.md 的硬否决。
 * 这些一律不生成，交给丝绒展签兜底——缺图不是错误，画错才是。
 * （注：管家/主厨/侍酒师这些「服务类」商品，本来就该用器物而不是人来表现；
 *   站上现有的真实照片也正是这么选的：私厨配的是一只盘子，不是厨师。）
 */
const PERSON_SUBJECT = new Set([
  'lx-butler-tenure', 'lx-goat-lesson', 'lx-surf-coach-world', 'lx-triathlon-coach-year',
  'lx-fencing-olympic-coach', 'lx-archery-olympic-coach', 'lx-gymnastics-coach-year',
  'lx-diving-coach-year', 'lx-go-master-coach', 'lx-windsurf-olympic-coach', 'lx-molecular-dinner',
  'lx-tea-master-life', 'lx-wingsuit-program', 'lx-golf-coach-year', 'lx-tennis-coach-year',
  'lx-private-chef-year', 'lx-sommelier-year', 'lx-personal-stylist', 'lx-house-tailor',
  'lx-golf-legend-round', 'lx-symphony-score', 'lx-ming-calligraphy', 'lx-pop-print-limited',
  // 抽象到没有实体可拍（一堆模型权重长什么样？）
  'lx-model-weights', 'lx-training-corpus',
  // 2026-07 追检补入：教练/球队/席位类全是「人」，Flux 全画了人（18 张违规下架）
  'lx-badminton-champ-coach', 'lx-bjj-blackbelt-coach', 'lx-castle-banquet', 'lx-chess-gm-coach',
  'lx-climbing-coach-year', 'lx-figure-rink-buyout', 'lx-flag-football-team', 'lx-foxhunt-membership',
  'lx-kitesurf-team', 'lx-marathon-six-star', 'lx-race-kart', 'lx-rowing-eight-seat',
  'lx-snooker-champ-coach', 'lx-tabletennis-champ-coach', 'lx-ultimate-frisbee-team',
  'lx-weightlifting-coach', 'lx-whitewater-team', 'lx-wingsuit-camp', 'lx-bridge-world-team',
  'lx-rally-codriver',
])

/** 名字里带雷但确实是器物的：直接给一个干净的主体短语（见文件头第 3 条）。 */
const SUBJECT_OVERRIDES = {
  'lx-pilot-flieger': 'aviator wristwatch with a large crown', // 原名 "Pilot's Three-Hander"：既有 pilot 又有 hand
  'lx-cashmere-cape': 'cashmere cape', // 原名 "Double-Face…"：Face 会招来一张脸
  'lx-jetpack': 'jetpack', // 原名 "Single-Person…"：Person 会招来一个人
  'lx-humanoid-butler': 'humanoid domestic robot', // 机器人可以画，管家不行
  'lx-butler-warranty': 'humanoid domestic robot',
  // ---- 2026-07 目检整改批：名字直译入画会画错对象的，给干净主体短语 ----
  'lx-ostrich-tote': 'ostrich leather tote bag with speckled quill-bump grain', // 实测画了一只活鸵鸟
  'lx-croc-birkin': 'matte crocodile leather top-handle bag with plain palladium hardware', // 实测画出戴戒指的手+金压花锁扣
  'lx-croc-vanity': 'crocodile-embossed leather vanity case with mirrored lid', // 实测箱盖上趴了一条鳄鱼尾/整鳄入框
  'lx-caviar-quota': 'sealed glass jar of black caviar with a gold lid, mother of pearl spoon laid beside it, on grey stone',
  'lx-chenghua-chickencup': 'small shallow antique doucai porcelain wine cup, palm-size, delicate underglaze blue with overglaze enamel', // 实测画成农舍高杯+卡通公鸡
  'lx-jadeite-cabbage': 'small jadeite carving of a bok choy, translucent green and white stone, on a carved wooden stand inside a glass museum vitrine', // 实测画成一颗挂墙的真白菜
  'lx-renaissance-madonna': 'aged renaissance tempera panel painting in a giltwood frame, muted earth pigments, gold leaf halos, hung on a museum wall', // 实测画成浮雕且嘴唇红渍如血
  'lx-nautilus-blue': 'luxury sports wristwatch with integrated steel link bracelet and plain unmarked blue dial, single crown', // 实测三表冠+伪字标+皮带
  'lx-fugu-tenure': 'whole dried pufferfish, inflated and spined, displayed on a black lacquer stand', // 实测画了一只活老虎（Tiger Fugu 的虎）
  'lx-cave-birdnest': "dried edible bird's nest, translucent golden strands formed into a shallow cup, on dark stone", // 实测画了一只红雀
  'lx-pop-silkscreen-canvas': 'framed pop-art silkscreen print of bold flat colour blocks and abstract halftone dots', // 实测画成名人肖像（真人肖像权红线）
  'lx-egypt-papyrus': 'fragment of ancient egyptian papyrus manuscript, faded pigment figures and illegible hieratic markings, mounted between glass', // 实测画成木雕板
  // ---- 2026-07 追检批：按病灶写死主体（实测各画成什么见追检报告）----
  'lx-almas-caviar': 'round 24k gold caviar tin, lid ajar showing pale golden caviar, on dark stone',
  'lx-amber-feather': 'prehistoric feather preserved inside a polished amber cabochon, backlit',
  'lx-animation-cel': 'framed hand-painted animation production cel with vivid character artwork silhouette',
  'lx-bamboo-trike': 'three-wheeled bamboo-framed trike, two rear wheels visible',
  'lx-birdnest-cave-right': 'limestone cave wall with several white edible swiftlet nests attached',
  'lx-bloodstone-seal': 'square red-flecked bloodstone seal blank on a carved wooden stand',
  'lx-cats-eye-ring': "honey-coloured cabochon chrysoberyl ring with a single sharp cat's-eye band of light",
  'lx-dancong-mother-tree': 'ancient gnarled tea tree on a misty mountain terrace',
  'lx-deep-sea-habitat': 'cylindrical underwater habitat module with round viewports resting on the seabed',
  'lx-documentary-photo': 'framed black and white documentary photograph of an empty city street',
  'lx-duffle-croc': 'crocodile-embossed leather duffle bag with rolled handles',
  'lx-expedition-6x6': 'six-wheeled expedition truck, three axles clearly visible',
  'lx-fish-maw-aged': 'dried golden fish maw, a translucent folded sheet, on dark stone',
  'lx-highland-50': 'aged single malt whisky in a crystal decanter beside its oak cask end',
  'lx-jetpack': 'wearable twin-turbine jetpack with shoulder harness, displayed on a metal stand',
  'lx-largeformat-photo': 'framed silver gelatin landscape photograph of mountains, glossy darkroom print',
  'lx-luxury-snowmobile': 'snowmobile with front skis and a rear rubber track, on packed snow',
  'lx-micro-city-ev': 'tiny two-seat bubble-shaped city electric car',
  'lx-offroad-trailer': 'towed off-road camping trailer with no cab, hitch visible at the front',
  'lx-puer-antique': 'dark compressed pu-erh tea disc wrapped in aged bamboo paper',
  'lx-restoration-seat': 'aged oil painting on an easel beside conservation tools and pigments',
  'lx-retro-travel-trailer': 'polished aluminium teardrop travel trailer, hitch visible, no cab',
  'lx-seal-carving-set': 'set of square soapstone seal-carving blanks and gravers in a fitted case',
  'lx-snow-tracked-cruiser': 'enclosed snow cruiser riding on rubber tracks, no wheels',
  'lx-star-ruby-ring': 'oval cabochon ruby ring showing a six-ray star of light across the dome',
  'lx-star-sapphire-ring': 'oval cabochon blue sapphire ring showing a six-ray star of light',
  'lx-sturgeon-adopt': 'sturgeon fish with bony scutes swimming in dark green water',
  'lx-suborbital-cabin': 'suborbital capsule cabin interior with reclined seats and round windows to black sky',
  'lx-trilobite-plate': 'grey stone slab bearing several fossilised trilobites in low relief',
  'lx-truffle-hunt-share': 'whole knobbly white alba truffle on dark stone',
  'lx-ukiyoe-impression': 'framed japanese woodblock print of a great wave and mountain, aged paper',
  'lx-vintage-sidecar': 'vintage motorcycle with attached single-wheel sidecar, both wheels on the ground',
  'lx-drift-missile': 'rear-wheel-drive drift car with four wheels and deep negative camber',
  'lx-hovercraft-cruiser': 'hovercraft with a full inflated black rubber skirt and rear propeller fans',
  'lx-limo-tender': 'sleek enclosed limousine tender boat, pure watercraft with no wheels',
  'lx-mystery-clock': 'mystery clock with hands appearing to float inside a clear crystal dial',
  'lx-skeleton-clock': 'openwork skeletonised brass clock movement under a glass dome, gears visible',
  'lx-robot-dog': 'angular metal quadruped robot with sensor head, entirely mechanical',
  'lx-wagyu-sire-share': 'black japanese wagyu bull standing in a clean straw-floored stall',
  'lx-wagyu-whole-year': 'marbled wagyu beef cuts arranged on dark slate',
  'lx-wardrobe-trunk': 'upright steamer wardrobe trunk opened to show hangers and small drawers',
  'lx-weather-balloon': 'high-altitude white weather balloon with a small instrument box on a long tether',
  'lx-champagne-balthazar': 'oversized balthazar champagne bottle standing beside a standard flute for scale',
  'lx-gramophone-horn': 'antique gramophone with brass horn attached to its wooden case, stylus on the record',
  'lx-jeweled-typewriter': 'vintage typewriter with gem-set round keys, keys in neat rows',
  'lx-emerald-garden': 'suite of Colombian emerald jewellery, a necklace, earrings and a ring with deep green emeralds, arranged on dark stone', // 实测把 Suite 画成了绿宝石质感的 Polo 衫
  'lx-grande-sonnerie': 'vintage gold chiming wristwatch, plain white enamel dial with roman numerals, brown leather strap, single crown', // 实测椭圆表壳+乱码盘面
  'lx-underwater-suite': 'circular underwater hotel room with a large acrylic viewport, deep blue water outside, soft interior light', // 实测画成海面漂床垫
  'lx-supercar-key': 'sculpted carbon and titanium car key fob on dark stone', // 原图两只真人手在交接钥匙
}

/** 这件商品该不该生成配图。 */
export function shouldGenerate(product) {
  return !PERSON_SUBJECT.has(product.id)
}

/**
 * 逐词排雷。扩散模型不会否定，只会把你提到的名词画出来（见文件头第 3 条），
 * 所以雷不是靠 "no xxx" 排掉的，是靠**根本不提**排掉的。
 */
const SCRUB = [
  [/\bhand-(\w)/gi, '$1'], // Hand-Built → Built（留下分词，拆掉 hand）
  [/\bhandmade\b/gi, 'artisanal'],
  [/\bhandful\b/gi, ''],
  [/\bhand\b/gi, ''], // 注：碰不到 "Top-Handle"，\bhand\b 后面必须是词边界
  [/\bhands\b/gi, 'pointers'], // 钟表的「指针」也叫 hands，照样会给你画出人手来
  [/\blogo-free\b/gi, ''],
  [/\blogos?\b/gi, ''],
  [/\b[\w]+-crew\b/gi, ''], // "Eight-Crew Seat"
  [/\bcrew of \d+\b/gi, ''],
  [/\bcrew\b/gi, ''],
  [/\bsingle-person\b/gi, ''],
  [/\bdouble-faced?\b/gi, 'reversible'],
  [/\bfaces?\b/gi, ''],
  [/\bpeople\b/gi, ''],
  [/\bmonogram(med)?\b/gi, 'plain'],
]

/**
 * 商品名 → 可入画的主体短语：**整个名字**（含分隔号后半段），再逐词排雷。
 *
 * 曾经只取分隔号前的第一段，因为第二段常是卖点小尾巴。但商品名其实有两种语序：
 *   'Crocodile Bag · Diamond Clasp'      名词在前 → 取第一段是对的
 *   'Master-Made · Zisha Teapot'         名词在**后** → 取第一段只剩个形容词
 *   'Renaissance · …' / 'Ancient Egypt · …'  同上，984 件里有 236 件栽在这
 * 所以改成整名入画，把雷一个个拆掉——信息最全，且没有语序假设。
 */
export function subjectOf(product) {
  if (SUBJECT_OVERRIDES[product.id]) return SUBJECT_OVERRIDES[product.id]
  let s = product.name.replace(/\s*·\s*/g, ', ')
  for (const [re, to] of SCRUB) s = s.replace(re, to)
  return s
    .replace(/-\s+/g, ' ') // 排雷后留下的悬空连字符（"Eight- Seat"）。只碰后面跟空格的，"Smoke-Gradient" 不受影响
    .replace(/\s+/g, ' ')
    .replace(/\s+,/g, ',')
    .replace(/,\s*(?=,)/g, '')
    .replace(/^[\s,]+|[\s,]+$/g, '')
}

/** 稳定种子：只由 id 决定，**三个视角共用**——见文件头第 1 条。 */
export function seedOf(id) {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % 100000
}

export function viewsFor(category) {
  return (DIRECTION[category] ?? FALLBACK).views
}

/** 分类 → 三个视角的图录小字（画廊 UI 用，经 manifest 生成到 TS 侧）。 */
export function captionsFor(category) {
  return viewsFor(category).map((v) => v.caption)
}

/** 完整提示词：视角打头 + 主体 + 布景 + 图录尾巴。 */
/** 游艇航空共用一片海，但飞机停在海面上是超现实事故（实测：三款公务机全员浮海）。
 * 机类改停湿沥青停机坪；真水上飞机留在海面，那是它们的对。 */
const TARMAC_SCENE = 'parked alone on wet dark tarmac under flat overcast silver light, desaturated, no buildings'
const AIRCRAFT_RE = /jet|heli|turboprop|evtol|tiltrotor|gyro|biplane|airship|balloon|aircraft|aviation|plane/i
const SEA_AIRCRAFT = new Set(['lx-amphib-flyingboat', 'lx-water-bomber', 'lx-seaplane-single', 'lx-seaplane-terminal', 'lx-flying-clipper'])

function sceneOf(product) {
  const dir = DIRECTION[product.category] ?? FALLBACK
  if (
    product.category === '游艇航空' &&
    !SEA_AIRCRAFT.has(product.id) &&
    AIRCRAFT_RE.test(`${product.id} ${product.name}`)
  ) {
    return TARMAC_SCENE
  }
  return dir.scene
}

export function promptFor(product, view) {
  const dir = DIRECTION[product.category] ?? FALLBACK
  const v = dir.views[view - 1] ?? dir.views[0]
  return `${v.lead} ${subjectOf(product)}, ${sceneOf(product)}, ${CATALOGUE_TAIL}`
}

export const VIEWS_PER_PRODUCT = 3
export { DIRECTION }
