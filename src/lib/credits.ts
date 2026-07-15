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
  'The remaining product and scene images come from Unsplash (attribution-free license) and CC0 public-domain sources, each inspected by eye, with no readable brand marks in frame.'

export const IMAGE_CREDITS: ImageCredit[] = [
  { productId: 'ed-atelier', title: "An artisan's hands adjusting a movement in dim light", creator: 'Tahlia Doyle', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/bfk68pL0EJ0', label: "An artisan's hands adjusting a movement in dim light" },
  { productId: 'ed-atelier-2', title: "Hand tools lined up on the atelier's dark wall", creator: 'Minh Đức', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/2gu0SU7_kr4', label: "Hand tools lined up on the atelier's dark wall" },
  { productId: 'ed-vault', title: 'A closed round steel vault door, bolts in a ring', creator: 'Alex Duffy', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/1AucbckEJWk', label: 'A closed round steel vault door, bolts in a ring' },
  { productId: 'ed-vitrine', title: 'An empty stone hall, the vitrines quieter than the exhibits', creator: 'Simon Ray', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/16tANB-VhsY', label: 'An empty stone hall, the vitrines quieter than the exhibits' },
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
  { productId: 'lx-triple-crown-colt', title: 'a close up of a horse\'s face in the dark', creator: 'Martin Baron', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/a-close-up-of-a-horses-face-in-the-dark-Jld3OYJFnSE' },
  { productId: 'lx-single-cask-70', title: 'barrels of liquor in a basement', creator: 'Eric Cook', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/barrels-of-liquor-in-a-basement-D9WH_vlxicA' },
  { productId: 'lx-private-chef-year', title: 'cooked food on black round plate', creator: 'Trình Minh Thư', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/cooked-food-on-black-round-plate-a6kYPun9_ao' },
  { productId: 'lx-sommelier-year', title: 'person pouring red wine on wine glass', creator: 'Lefteris kallergis', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/person-pouring-red-wine-on-wine-glass-etWlaoFnTl4' },
  { productId: 'lx-bridal-couture', title: 'A strapless white gown on a mannequin in a window', creator: 'Sou Jest', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/a-strapless-white-gown-on-a-mannequin-in-a-window-tTn-X7huVbI' },
  { productId: 'lx-imperial-dragon-robe', title: 'A mannequin is displayed in a dark room', creator: 'LISK OBE', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/a-mannequin-is-displayed-in-a-dark-room-ctmmIOCbpSs' },
  { productId: 'lx-skyflat-duplex', title: 'Modern living room with large windows and city view', creator: 'Caroline Badran', license: 'Unsplash', sourceUrl: 'https://unsplash.com/photos/modern-living-room-with-large-windows-and-city-view-DhVAndFPb3k' },
]
