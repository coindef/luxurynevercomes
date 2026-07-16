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
      { lead: 'Three-quarter view under raking light, showing surface relief, of a', caption: 'Raking light' },
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
])

/** 名字里带雷但确实是器物的：直接给一个干净的主体短语（见文件头第 3 条）。 */
const SUBJECT_OVERRIDES = {
  'lx-pilot-flieger': 'aviator wristwatch with a large crown', // 原名 "Pilot's Three-Hander"：既有 pilot 又有 hand
  'lx-cashmere-cape': 'cashmere cape', // 原名 "Double-Face…"：Face 会招来一张脸
  'lx-jetpack': 'jetpack', // 原名 "Single-Person…"：Person 会招来一个人
  'lx-humanoid-butler': 'humanoid domestic robot', // 机器人可以画，管家不行
  'lx-butler-warranty': 'humanoid domestic robot',
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
export function promptFor(product, view) {
  const dir = DIRECTION[product.category] ?? FALLBACK
  const v = dir.views[view - 1] ?? dir.views[0]
  return `${v.lead} ${subjectOf(product)}, ${dir.scene}, ${CATALOGUE_TAIL}`
}

export const VIEWS_PER_PRODUCT = 3
export { DIRECTION }
