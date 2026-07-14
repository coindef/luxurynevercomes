/** 图片署名。CC0 与免署名 Unsplash 图不逐条列出，见 UNSPLASH_NOTE 总述。 */
export interface ImageCredit {
  /** 商品 id；编辑配图（ed-*）没有对应商品，靠 label 显示中文名 */
  productId: string
  title: string
  creator: string
  license: string
  sourceUrl: string
  /** 非商品图（编辑配图）的中文标题，商品图留空则回退到商品名 */
  label?: string
}

/** 未逐条署名的图片总述（Unsplash 免署名图 + CC0 图源）。 */
export const UNSPLASH_NOTE =
  '其余商品图与场景图来自 Unsplash（免署名授权）及 CC0 公共领域图源，均经逐张目检，画面内无可读品牌标识。'

export const IMAGE_CREDITS: ImageCredit[] = [
  { productId: 'ed-atelier', title: '工匠的手在暗光里调校一枚机芯', creator: 'Tahlia Doyle', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/bfk68pL0EJ0', label: '工匠的手在暗光里调校一枚机芯' },
  { productId: 'ed-atelier-2', title: '工坊暗墙上挂了一排手工具，各归各位', creator: 'Minh Đức', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/2gu0SU7_kr4', label: '工坊暗墙上挂了一排手工具，各归各位' },
  { productId: 'ed-vault', title: '合着的银行金库门，厚得听不见外面', creator: 'Alex Duffy', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/1AucbckEJWk', label: '合着的银行金库门，厚得听不见外面' },
  { productId: 'ed-vitrine', title: '空无一人的石厅，展柜比藏品更安静', creator: 'Simon Ray', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/16tANB-VhsY', label: '空无一人的石厅，展柜比藏品更安静' },
  { productId: 'lx-croc-cardcase', title: 'a black wallet sitting on top of a metal rail', creator: 'CHUTTERSNAP', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/W9kn44uJIDk' },
  { productId: 'lx-d-flawless', title: 'a diamond ring on a black surface', creator: 'Khizar Rathore', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/99Kn46xpr-Y' },
  { productId: 'lx-tourbillon-minute', title: 'a close up of a watch on a black surface', creator: 'Kent Lam', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/0G33SkbFgb8' },
  { productId: 'lx-zero-clutch', title: 'A brown leather clutch sits on a wooden surface', creator: 'Ocult Store', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/K78mXNm0zdM' },
  { productId: 'lx-emerald-garden', title: 'Emerald & Diamond Tiara', creator: 'euthman', license: 'CC BY', sourceUrl: 'https://www.flickr.com/photos/78147607@N00/4739771202' },
  { productId: 'lx-royal-sapphire', title: 'Sapphire ring', creator: 'Stanislav Doronenko', license: 'CC BY', sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=5499291' },
  { productId: 'lx-v12-coupe', title: 'File:\' 13 - Italian sport cars - Alfa Romeo 4C - air scoops and door handle.jpg', creator: 'edvvc', license: 'CC BY-SA', sourceUrl: 'https://commons.wikimedia.org/w/index.php?curid=28407331' },
  { productId: 'lx-single-cask-60', title: 'Wine barrels', creator: 'Christian Haugen', license: 'CC BY', sourceUrl: 'https://www.flickr.com/photos/34073237@N04/6027018922' },
  { productId: 'lx-loire-chateau', title: 'Chateau Chambord', creator: 'flamouroux', license: 'CC BY-SA', sourceUrl: 'https://www.flickr.com/photos/23909906@N05/7989572147' },
  { productId: 'lx-cremona-violin', title: 'Violin, Figaro House, Vienna', creator: 'cphoffman42', license: 'CC BY-SA', sourceUrl: 'https://www.flickr.com/photos/23088289@N02/3325997340' },
  { productId: 'lx-south-sea', title: 'Pearl Necklace', creator: 'TenthMusePhotography', license: 'CC BY-SA', sourceUrl: 'https://www.flickr.com/photos/26429593@N08/2474201376' },
]
