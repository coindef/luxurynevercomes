import type { CustomGroup, Product } from './types'

/**
 * 工坊定制 BESPOKE。
 *
 * 两层：先按**子品类**（SUBTYPE_CUSTOM），落空了才退回**大类**（CATEGORY_CUSTOM）。
 *
 * 为什么要有子品类这一层：大类是按「气质」分的，一类里什么都有。
 * 只按大类给选项的话，一枚钻戒会让你选「表盘」和「三问报时」，
 * 一架超音速公务机让你选「柚木甲板」，火星地块让你选「园林景观」，
 * 一双羊绒袜让你选「衬里刺绣」——同类的一百件商品，选项一字不差。
 * 这和配图提示词踩的是同一个坑：类目混装。
 *
 * 每个子品类沿用真实高定配置的节奏：**材质 → 尺寸/规格 → 刻字**。
 * 尺寸那一档是「像在买东西」的关键（戒圈、链长、鞋码、表径），本来整站都没有。
 */
export const CATEGORY_CUSTOM: Record<string, CustomGroup[]> = {
  腕表珠宝: [
    {
      label: 'Dial · Le Cadran',
      type: 'choice',
      choices: [
        { name: 'Silver-white plain dial (atelier base)', surcharge: 0 },
        { name: 'Aventurine glass · a whole night of stars', surcharge: 66000 },
        { name: 'Grand-feu enamel · twelve firings; the yield rate matches the delivery rate', surcharge: 88000 },
        { name: 'Meteorite dial · certificate of fall included', surcharge: 128000 },
      ],
    },
    {
      label: 'Complications · Les Complications',
      type: 'choice',
      choices: [
        { name: 'Perpetual calendar · displays the exact 10,000th day of waiting', surcharge: 380000 },
        { name: 'Minute repeater · chimes three times, still not the delivery date', surcharge: 580000 },
        { name: 'Moon-phase · synced in real time with the one outside your window', surcharge: 180000 },
        { name: 'Hacking seconds · the hand stops forever at the moment you ordered', surcharge: 88000 },
      ],
    },
    {
      label: 'Engraved caseback · La Gravure',
      type: 'text',
      placeholder: 'e.g. this moment is already eternity',
      choices: [
        { name: 'Hand-engraved inside the sapphire caseback; normally only the movement sees it, now not even the movement does', surcharge: 8800 },
      ],
    },
  ],
  包袋皮具: [
    {
      label: 'Leather selection · La Peau',
      type: 'choice',
      choices: [
        { name: 'Togo calfskin · pewter grey (atelier base)', surcharge: 0 },
        { name: 'Epsom embossed calfskin · chalk', surcharge: 12000 },
        { name: 'Barenia saddle leather · golden brown; it grows a patina over the years, whether the years ever see it is another matter', surcharge: 46000 },
        { name: 'Matte Nile crocodile · midnight blue', surcharge: 380000 },
        { name: 'Concept leather · made of pure concept: zero weight, zero wear, zero existence', surcharge: 1280000 },
      ],
    },
    {
      label: 'Hardware · Les Métaux',
      type: 'choice',
      choices: [
        { name: 'Palladium clasp (atelier base)', surcharge: 0 },
        { name: 'Brushed rose-gold clasp', surcharge: 26000 },
        { name: 'Horseshoe special-order stamp · the atelier\'s highest honour: acknowledging this bag was made for you alone, and never made', surcharge: 88000 },
        { name: 'No hardware · every fitting removed; subtraction costs more than addition, which is very luxury', surcharge: 188000 },
      ],
    },
    {
      label: 'Stamped lining initials',
      type: 'text',
      placeholder: 'Your initials, or a line to stamp (12 characters max)',
      choices: [
        { name: 'Goatskin lining hand-gilded, one artisan sees it through start to finish, start to finish being about 0 hours', surcharge: 8800 },
      ],
    },
  ],
  尊贵座驾: [
    {
      label: 'Paint and coachline · La Robe',
      type: 'choice',
      choices: [
        { name: 'Classic solid · British racing green (atelier base)', surcharge: 0 },
        { name: 'Hand-painted coachline · one stroke of a squirrel-hair brush, the painter holds his breath for three hours, delivered at zero kilometres', surcharge: 68000 },
        { name: 'Colour-matched · to your lipstick', surcharge: 188000 },
        { name: 'Quantum paint · picks its colour only when observed', surcharge: 888000 },
      ],
    },
    {
      label: 'Starlit roof · Starlight',
      type: 'choice',
      choices: [
        { name: 'No starlight · bring your own sky (atelier base)', surcharge: 0 },
        { name: '1,344-point fibre-optic standard starfield', surcharge: 480000 },
        { name: 'The star map of the night you were born', surcharge: 680000 },
        { name: 'One shooting star per hour · wishing works fine, fulfilment is on par with this store', surcharge: 880000 },
      ],
    },
    {
      label: 'Embroidered headrest',
      type: 'text',
      placeholder: 'e.g. another full day',
      choices: [
        { name: 'Each headrest is 5,000 stitches, redone if wrong, it is not coming anyway', surcharge: 26000 },
      ],
    },
  ],
  游艇航空: [
    {
      label: 'Deck and pads · Le Pont',
      type: 'choice',
      choices: [
        { name: 'Pearl-white standard deck (atelier base)', surcharge: 0 },
        { name: 'Full deck in Burmese teak · barefoot for thirty years, the damp parts handled by imagination', surcharge: 2400000 },
        { name: 'No decking · the sea breeze should hit the keel directly', surcharge: 1880000 },
        { name: 'Helipad', surcharge: 6800000 },
        { name: 'No helipad · the helicopter sorts itself out (this option is free, we were surprised too)', surcharge: 0 },
      ],
    },
    {
      label: 'Itinerary preference · L\'Itinéraire',
      type: 'choice',
      choices: [
        { name: 'Classic Mediterranean loop (atelier base)', surcharge: 0 },
        { name: 'Sunset heading only · forever chasing dusk', surcharge: 2600000 },
        { name: 'Cruise without landing · landing is a compromise', surcharge: 5200000 },
        { name: 'Moored at home port for resale value · under home port we wrote: the heart', surcharge: 880000 },
      ],
    },
    {
      label: 'Gilt naming · hull/fuselage',
      type: 'text',
      placeholder: 'e.g. Still Working Late',
      choices: [
        { name: '24K gold leaf hand-applied to the stern or fuselage, the name floats first, the vessel never launches', surcharge: 188000 },
      ],
    },
  ],
  不动产: [
    {
      label: 'Aspect selection · L\'Orientation',
      type: 'choice',
      choices: [
        { name: 'East-facing · chiefly for sunrises', surcharge: 8800000 },
        { name: 'West-facing · chiefly for sunsets', surcharge: 8800000 },
        { name: 'Inward-facing · chiefly for oneself', surcharge: 12000000 },
        { name: 'All-facing · the island is round, it was ringed by sea anyway', surcharge: 18000000 },
      ],
    },
    {
      label: 'Grounds and landscaping · Les Jardins',
      type: 'choice',
      choices: [
        { name: 'Natural coconut grove (atelier base)', surcharge: 0 },
        { name: 'Infinity pool · the seam with the horizon is off by less than 3 millimetres', surcharge: 2200000 },
        { name: 'Bespoke high tide · scheduled around your nap', surcharge: 2200000 },
        { name: 'White lighthouse · lit year-round for the ship that never arrives, the spiritual totem of this store', surcharge: 3600000 },
      ],
    },
    {
      label: 'Naming rights · estate/island',
      type: 'text',
      placeholder: 'e.g. Do Not Disturb Island',
      choices: [
        { name: 'Your name will be recorded on a title deed we print in earnest, the closest thing to real estate in this transaction', surcharge: 88000 },
      ],
    },
  ],
  艺术收藏: [
    {
      label: 'Framing · L\'Encadrement',
      type: 'choice',
      choices: [
        { name: 'Plain solid-wood frame (atelier base)', surcharge: 0 },
        { name: 'Italian hand-gilded frame · applied by a third-generation master', surcharge: 66000 },
        { name: 'Museum-grade UV glass · protecting pigment that does not exist', surcharge: 128000 },
        { name: 'No frame · let the art breathe (subtraction costs more, as usual)', surcharge: 188000 },
      ],
    },
    {
      label: 'Provenance file · La Provenance',
      type: 'choice',
      choices: [
        { name: 'Standard certificate of authenticity (atelier base)', surcharge: 0 },
        { name: 'Roster of former owners · each illustrious, and none aware', surcharge: 88000 },
        { name: 'Auction history · two failed sales included, for added gravitas', surcharge: 168000 },
        { name: 'Signed by the artist · the artist is fictional, the signature is sincere', surcharge: 288000 },
      ],
    },
    {
      label: 'Collector plaque engraving',
      type: 'text',
      placeholder: 'e.g. Private Collection · Not For Sale',
      choices: [
        { name: 'Brass plaque hand-chased, to hang on the wall in your imagination', surcharge: 8800 },
      ],
    },
  ],
  科技算力: [
    {
      label: 'Cooling solution · Le Refroidissement',
      type: 'choice',
      choices: [
        { name: 'Air cooling · vintage server-room roar (atelier base)', surcharge: 0 },
        { name: 'Immersion liquid cooling · the whole rig takes a bath, quiet as the deep sea', surcharge: 8800000 },
        { name: 'Mountain-spring water cooling · water source requires you to supply a mountain', surcharge: 28000000 },
        { name: 'Emotional cooling · the machine stays cool, and so should you', surcharge: 880000 },
      ],
    },
    {
      label: 'Interconnect spec · L\'Interconnexion',
      type: 'choice',
      choices: [
        { name: 'Standard high-speed interconnect (atelier base)', surcharge: 0 },
        { name: 'All-optical interconnect · latency too low to leave time for regret', surcharge: 12800000 },
        { name: 'Quantum-entangled direct link · in perfect sympathy with the other half of the cluster, which also never ships', surcharge: 88000000 },
      ],
    },
    {
      label: 'Rack nameplate',
      type: 'text',
      placeholder: 'e.g. Compute Freedom No. 1',
      choices: [
        { name: 'Laser-etched titanium plate, hung at the door of your imaginary data centre', surcharge: 88000 },
      ],
    },
  ],
  运动竞技: [
    {
      label: 'Seating privileges · La Loge',
      type: 'choice',
      choices: [
        { name: 'Dead centre of the main stand (atelier base)', surcharge: 0 },
        { name: 'Players\' tunnel entrance · brush shoulders with legends', surcharge: 680000 },
        { name: 'Next to the locker room · half-time tactics within earshot', surcharge: 1280000 },
        { name: 'Referee\'s vantage · the least popular seat in the house', surcharge: 88000 },
      ],
    },
    {
      label: 'Support package · Le Soutien',
      type: 'choice',
      choices: [
        { name: 'Quiet appreciation (atelier base)', surcharge: 0 },
        { name: 'One private commentator · thrilled for you alone', surcharge: 268000 },
        { name: 'A whole stand\'s Mexican wave booked out · rising and falling to your rhythm', surcharge: 2880000 },
      ],
    },
    {
      label: 'Jersey printing',
      type: 'text',
      placeholder: 'e.g. All Watch No Play',
      choices: [
        { name: 'Heat-pressed by the official manufacturer, the number is always 0', surcharge: 8800 },
      ],
    },
  ],
  酒窖餐桌: [
    {
      label: 'Sommelier service · Le Service',
      type: 'choice',
      choices: [
        { name: 'Standard two-hour decanting (atelier base)', surcharge: 0 },
        { name: 'Head sommelier throughout · pours half a glass only, more would look poor', surcharge: 188000 },
        { name: 'Blind-tasting mode · every label torn off, what you drink is confidence', surcharge: 88000 },
        { name: 'Decanting by moonlight · requires the fifteenth of the lunar month, no rushing it', surcharge: 280000 },
      ],
    },
    {
      label: 'Pairing arrangement · L\'Accord',
      type: 'choice',
      choices: [
        { name: 'Classic nine-course French menu (atelier base)', surcharge: 0 },
        { name: 'Chef\'s improvisation · the menu is voided on the spot, the surprise happens on the spot', surcharge: 680000 },
        { name: 'A bowl of plain white rice · the finest paired with the plainest, that is having truly dined', surcharge: 88000 },
      ],
    },
    {
      label: 'Custom wine label',
      type: 'text',
      placeholder: 'e.g. My Private Reserve · Not For Sale',
      choices: [
        { name: 'Hand copperplate-printed label, applied to the bottle that is forever en route', surcharge: 28000 },
      ],
    },
  ],
  高定衣橱: [
    {
      label: 'Fabric selection · L\'Étoffe',
      type: 'choice',
      choices: [
        { name: 'High-count wool (atelier base)', surcharge: 0 },
        { name: 'Vicuña · wool of emperors, shorn once every two years', surcharge: 280000 },
        { name: 'Lotus silk · a thousand stems for one metre, a zen fabric', surcharge: 680000 },
        { name: 'Concept fabric · zero weight, same origin as the "airy" clutch', surcharge: 1280000 },
      ],
    },
    {
      label: 'Fit allowance · La Coupe',
      type: 'choice',
      choices: [
        { name: 'Your current figure (atelier base)', surcharge: 0 },
        { name: '"For when I slim down" allowance · optimism surcharge', surcharge: 88000 },
        { name: '"This is fine as it is" forgiving cut · self-acceptance surcharge', surcharge: 88000 },
      ],
    },
    {
      label: 'Lining embroidery',
      type: 'text',
      placeholder: 'e.g. dignity is worn for oneself',
      choices: [
        { name: 'Silk lining hand-embroidered in Suzhou style, seen only by whoever takes it off', surcharge: 18000 },
      ],
    },
  ],
}

/** 刻字组是每个子品类的收尾，只有那句话和加价不同——省得抄 27 遍同样的骨架 */
const engraving = (label: string, placeholder: string, note: string, surcharge: number): CustomGroup => ({
  label,
  type: 'text',
  placeholder,
  choices: [{ name: note, surcharge }],
})

/** 子品类定制：一枚戒指不该跟一只陀飞轮共用「表盘」和「三问报时」 */
export const SUBTYPE_CUSTOM: Record<string, CustomGroup[]> = {
  /* ---------------------------------------------------------- 腕表珠宝 */
  watch: [
    {
      label: 'Case metal · Le Boîtier',
      type: 'choice',
      choices: [
        { name: 'Steel (atelier base)', surcharge: 0 },
        { name: 'White gold · heavier than it looks, like the wait', surcharge: 180000 },
        { name: 'Platinum 950 · the densest way to own nothing', surcharge: 320000 },
        { name: 'Sapphire crystal case · fully transparent, so you can watch it not arrive', surcharge: 980000 },
      ],
    },
    {
      label: 'Case size · Le Diamètre',
      type: 'choice',
      choices: [
        { name: '36mm · classic', surcharge: 0 },
        { name: '39mm · the size that suits every wrist, including the one it never reaches', surcharge: 0 },
        { name: '41mm · contemporary', surcharge: 0 },
        { name: '44mm · to be seen from across the room, from the other side of the ocean', surcharge: 0 },
      ],
    },
    engraving('Engraved caseback · La Gravure', 'e.g. this moment is already eternity', 'Hand-engraved inside the caseback; normally only the movement sees it, now not even the movement does', 8800),
  ],
  ring: [
    {
      label: 'Metal · Le Métal',
      type: 'choice',
      choices: [
        { name: 'Yellow gold 18K (atelier base)', surcharge: 0 },
        { name: 'White gold 18K · rhodium finished', surcharge: 26000 },
        { name: 'Rose gold 18K · warms to the skin it never meets', surcharge: 26000 },
        { name: 'Platinum 950 · the setting outlives everyone at this table', surcharge: 88000 },
      ],
    },
    {
      label: 'Ring size · La Taille',
      type: 'choice',
      choices: [
        { name: 'EU 49 · we will size it for you', surcharge: 0 },
        { name: 'EU 52 · the most requested size on earth', surcharge: 0 },
        { name: 'EU 55', surcharge: 0 },
        { name: 'Unsized · left open, in case the finger changes its mind', surcharge: 0 },
      ],
    },
    engraving('Inner-band engraving', 'e.g. worn for no one in particular', 'Engraved inside the band, against the skin, where no one else will ever read it', 6800),
  ],
  necklace: [
    {
      label: 'Clasp and chain · La Chaîne',
      type: 'choice',
      choices: [
        { name: 'Concealed box clasp (atelier base)', surcharge: 0 },
        { name: 'Hand-knotted between each bead · silk, re-knotted every decade', surcharge: 38000 },
        { name: 'Convertible fitting · wears three ways, none of them today', surcharge: 128000 },
        { name: 'No clasp · a closed circle, put on the way a crown is', surcharge: 288000 },
      ],
    },
    {
      label: 'Length · La Longueur',
      type: 'choice',
      choices: [
        { name: '40cm choker · sits at the throat', surcharge: 0 },
        { name: '45cm princess · the default of the whole world', surcharge: 0 },
        { name: '60cm matinée · for necklines that expect an occasion', surcharge: 0 },
        { name: '90cm sautoir · long enough to knot once, twice if you are feeling grand', surcharge: 0 },
      ],
    },
    engraving('Clasp engraving', 'e.g. the weight is the point', 'Engraved on the clasp plate, read only by whoever fastens it', 6800),
  ],
  bracelet: [
    {
      label: 'Finish · La Finition',
      type: 'choice',
      choices: [
        { name: 'High polish (atelier base)', surcharge: 0 },
        { name: 'Satin brushed · shows every year, gracefully', surcharge: 18000 },
        { name: 'Fully pavé set · 1,240 stones, each one a reason not to sleep', surcharge: 880000 },
      ],
    },
    {
      label: 'Inner circumference',
      type: 'choice',
      choices: [
        { name: '15cm · petite', surcharge: 0 },
        { name: '17cm · the size that fits almost every wrist', surcharge: 0 },
        { name: '19cm · generous', surcharge: 0 },
        { name: 'Rigid, unopening · once on, it stays; a promise with no hinge', surcharge: 0 },
      ],
    },
    engraving('Interior engraving', 'e.g. still here', 'Engraved on the inner face, worn against the pulse', 6800),
  ],
  earrings: [
    {
      label: 'Fitting · L\'Attache',
      type: 'choice',
      choices: [
        { name: 'Post and butterfly (atelier base)', surcharge: 0 },
        { name: 'Clip fitting · for ears that were never pierced and never will be', surcharge: 22000 },
        { name: 'Detachable drops · long by night, short by day, absent throughout', surcharge: 168000 },
      ],
    },
    {
      label: 'Drop length',
      type: 'choice',
      choices: [
        { name: 'Stud · sits on the lobe', surcharge: 0 },
        { name: '3cm · brushes the jaw when you turn', surcharge: 0 },
        { name: '7cm · touches the shoulder, announces the turn', surcharge: 0 },
      ],
    },
    engraving('Reverse engraving', 'e.g. heard, not seen', 'Engraved on the reverse of each, facing the neck', 6800),
  ],
  brooch: [
    {
      label: 'Mounting · La Monture',
      type: 'choice',
      choices: [
        { name: 'Standard pin and safety catch (atelier base)', surcharge: 0 },
        { name: 'Convertible fitting · brooch, pendant, or hair ornament', surcharge: 128000 },
        { name: 'En tremblant · mounted on springs so the stones shiver when you breathe', surcharge: 480000 },
      ],
    },
    {
      label: 'Presentation',
      type: 'choice',
      choices: [
        { name: 'Fitted leather case (atelier base)', surcharge: 0 },
        { name: 'Vitrine mount · displayed rather than worn, which is honest', surcharge: 68000 },
      ],
    },
    engraving('Reverse engraving', 'e.g. pinned to nothing', 'Engraved on the reverse plate, against the cloth', 6800),
  ],
  stone: [
    {
      label: 'Cut and polish · La Taille',
      type: 'choice',
      choices: [
        { name: 'Keep the historic cut (atelier base)', surcharge: 0 },
        { name: 'Recut for brilliance · loses 12% of the weight, gains the room', surcharge: 380000 },
        { name: 'Leave rough · uncut, the way it left the ground', surcharge: 0 },
      ],
    },
    {
      label: 'Setting',
      type: 'choice',
      choices: [
        { name: 'Unset · loose, in a paper', surcharge: 0 },
        { name: 'Set to your design later · the stone waits, as stones do', surcharge: 0 },
        { name: 'Platinum solitaire mount', surcharge: 180000 },
      ],
    },
    engraving('Girdle inscription', 'e.g. older than the argument', 'Laser-inscribed on the girdle, legible at 10x, invisible to everyone else', 12000),
  ],

  /* ---------------------------------------------------------- 包袋皮具 */
  bag: [
    {
      label: 'Leather selection · La Peau',
      type: 'choice',
      choices: [
        { name: 'Togo calfskin · pewter grey (atelier base)', surcharge: 0 },
        { name: 'Epsom embossed calfskin · chalk', surcharge: 12000 },
        { name: 'Barenia saddle leather · golden brown; it grows a patina over the years, whether the years ever see it is another matter', surcharge: 46000 },
        { name: 'Matte Nile crocodile · midnight blue', surcharge: 380000 },
      ],
    },
    {
      label: 'Size · La Taille',
      type: 'choice',
      choices: [
        { name: '25 · holds a phone and a grudge', surcharge: 0 },
        { name: '30 · the one everyone means', surcharge: 0 },
        { name: '35 · holds a laptop, and the laptop holds the work', surcharge: 0 },
        { name: '40 · travel size, for the travel', surcharge: 0 },
      ],
    },
    engraving('Stamped lining initials', 'Your initials, or a line to stamp (12 characters max)', 'Hot-stamped inside the lining, seen only when the bag is open and only by you', 8800),
  ],
  trunk: [
    {
      label: 'Frame and covering',
      type: 'choice',
      choices: [
        { name: 'Poplar frame, coated canvas (atelier base)', surcharge: 0 },
        { name: 'Beech frame with brass corners · survives the century, not the courier', surcharge: 88000 },
        { name: 'Full-grain leather over hardwood · gains a patina in storage', surcharge: 280000 },
      ],
    },
    {
      label: 'Interior fitting · L\'Aménagement',
      type: 'choice',
      choices: [
        { name: 'Open interior with tray (atelier base)', surcharge: 0 },
        { name: 'Fitted for a wardrobe · hanging rail and six drawers', surcharge: 128000 },
        { name: 'Fitted for a library · shelved for forty volumes', surcharge: 168000 },
        { name: 'Fitted for nothing in particular · velvet, and space, and quiet', surcharge: 88000 },
      ],
    },
    engraving('Painted monogram bands', 'Two or three letters, hand painted', 'Hand-painted stripes and letters, redone by the same painter every decade', 26000),
  ],
  sla: [
    {
      label: 'Leather · La Peau',
      type: 'choice',
      choices: [
        { name: 'Box calf · black (atelier base)', surcharge: 0 },
        { name: 'Goatskin · takes a colour deeper than calf', surcharge: 6000 },
        { name: 'Alligator · matte, small scale', surcharge: 68000 },
      ],
    },
    {
      label: 'Interior',
      type: 'choice',
      choices: [
        { name: 'Four card slots (atelier base)', surcharge: 0 },
        { name: 'Eight slots and a note compartment · optimistic', surcharge: 2000 },
        { name: 'No slots · one flat pocket, for the one card that works', surcharge: 4000 },
      ],
    },
    engraving('Corner initials', 'Up to 12 characters', 'Blind-embossed in the corner, no foil, felt with the thumb rather than read', 3800),
  ],

  /* ---------------------------------------------------------- 尊贵座驾 */
  car: [
    {
      label: 'Exterior paint · La Teinte',
      type: 'choice',
      choices: [
        { name: 'Single-stage solid black (atelier base)', surcharge: 0 },
        { name: 'Hand-mixed to a sample you post us · a leaf, a tile, a photograph of a sky', surcharge: 180000 },
        { name: 'Nine-layer lacquer · six weeks of drying, hand-polished between coats', surcharge: 680000 },
        { name: 'Quantum paint · settles on a colour only when observed; unobserved, it is every colour', surcharge: 2800000 },
      ],
    },
    {
      label: 'Wheels and brakes',
      type: 'choice',
      choices: [
        { name: '20-inch forged, silver (atelier base)', surcharge: 0 },
        { name: '21-inch forged, diamond-turned · ruins the ride, makes the photograph', surcharge: 180000 },
        { name: 'Carbon-ceramic brakes · stops from 300km/h; the car is currently at 0km/h', surcharge: 380000 },
      ],
    },
    engraving('Sill plate engraving', 'e.g. the long way round', 'Etched into the door sill, read once a day by your own shoe', 28000),
  ],
  moto: [
    {
      label: 'Frame and tank finish',
      type: 'choice',
      choices: [
        { name: 'Powder-coated black (atelier base)', surcharge: 0 },
        { name: 'Brushed raw aluminium, lacquered · every fingerprint is yours', surcharge: 68000 },
        { name: 'Hand-leafed tank · gold under clear coat, applied by one painter over nine days', surcharge: 180000 },
      ],
    },
    {
      label: 'Riding position',
      type: 'choice',
      choices: [
        { name: 'Standard bars (atelier base)', surcharge: 0 },
        { name: 'Clip-ons · wrists complain, the mirror approves', surcharge: 12000 },
        { name: 'Set for your inseam · measured, then never sat on', surcharge: 26000 },
      ],
    },
    engraving('Triple-clamp engraving', 'e.g. ride it like you stole it', 'Engraved on the top clamp, directly in your eyeline, if there were a road', 8800),
  ],

  /* ---------------------------------------------------------- 游艇航空 */
  yacht: [
    {
      label: 'Deck and pads · Le Pont',
      type: 'choice',
      choices: [
        { name: 'Pearl-white standard deck (atelier base)', surcharge: 0 },
        { name: 'Full deck in Burmese teak · barefoot for thirty years, the damp parts left to imagination', surcharge: 2400000 },
        { name: 'No decking · the sea breeze should hit the keel directly', surcharge: 1880000 },
        { name: 'Helipad', surcharge: 6800000 },
      ],
    },
    {
      label: 'Tender and toys',
      type: 'choice',
      choices: [
        { name: 'One rigid tender (atelier base)', surcharge: 0 },
        { name: 'Tender garage with a matching launch · a small boat for the big boat', surcharge: 3800000 },
        { name: 'Submersible for two · to look up at the hull from below', surcharge: 18000000 },
      ],
    },
    engraving('Gilt naming on the transom', 'The name she will answer to', 'Gold leaf on the transom, laid by hand; a name is the only part of a ship that is real here', 88000),
  ],
  aircraft: [
    {
      label: 'Cabin configuration · La Cabine',
      type: 'choice',
      choices: [
        { name: 'Eight seats, club four (atelier base)', surcharge: 0 },
        { name: 'Stateroom aft · a bed at forty thousand feet', surcharge: 4800000 },
        { name: 'Conference six · so the meeting can follow you into the sky', surcharge: 2800000 },
        { name: 'Empty cabin · carpet, windows, and nothing else; the purest way to fly', surcharge: 1880000 },
      ],
    },
    {
      label: 'Livery',
      type: 'choice',
      choices: [
        { name: 'Bare polished metal (atelier base)', surcharge: 0 },
        { name: 'Matte white with a single hairline stripe', surcharge: 680000 },
        { name: 'Unmarked · no registration visible, which is illegal and very discreet', surcharge: 1280000 },
      ],
    },
    engraving('Doorway plate', 'e.g. mind the step', 'Engraved plate at the cabin door, read by everyone boarding, currently no one', 68000),
  ],

  /* ---------------------------------------------------------- 不动产 */
  home: [
    {
      label: 'Aspect · L\'Orientation',
      type: 'choice',
      choices: [
        { name: 'South-facing, as built (atelier base)', surcharge: 0 },
        { name: 'Rotated to the sunset · the whole house turned, at some expense', surcharge: 4800000 },
        { name: 'Facing away from the neighbours · the most valuable direction there is', surcharge: 2800000 },
      ],
    },
    {
      label: 'Finish package',
      type: 'choice',
      choices: [
        { name: 'Shell and core · you finish it (atelier base)', surcharge: 0 },
        { name: 'Turnkey · furnished down to the salt cellar, ready to not move into', surcharge: 12000000 },
        { name: 'Left exactly as the last owner had it · including the books, unread', surcharge: 6800000 },
      ],
    },
    engraving('Name carved at the gate', 'What the house is called', 'Carved into the gatepost by a letter-cutter who works in stone and does not hurry', 180000),
  ],
  land: [
    {
      label: 'Boundary · Les Limites',
      type: 'choice',
      choices: [
        { name: 'Surveyed and pegged (atelier base)', surcharge: 0 },
        { name: 'Dry-stone wall, laid by hand · one waller, one summer, no mortar', surcharge: 2800000 },
        { name: 'Unmarked · the land does not know it has an edge', surcharge: 0 },
      ],
    },
    {
      label: 'What stands on it',
      type: 'choice',
      choices: [
        { name: 'Nothing, for now (atelier base)', surcharge: 0 },
        { name: 'A single bench, facing the view', surcharge: 88000 },
        { name: 'Planted with slow trees · oak and chestnut, mature in eighty years, roughly the delivery window', surcharge: 1880000 },
      ],
    },
    engraving('Boundary-stone inscription', 'e.g. this far, and no further', 'Cut into the corner stone, found only by whoever walks the whole boundary', 68000),
  ],

  /* ---------------------------------------------------------- 高定衣橱 */
  gown: [
    {
      label: 'Fabric · L\'Étoffe',
      type: 'choice',
      choices: [
        { name: 'Silk duchesse satin (atelier base)', surcharge: 0 },
        { name: 'Chantilly lace · nine hundred hours on the bobbins', surcharge: 480000 },
        { name: 'Lotus silk · a thousand stems for one metre, a zen fabric', surcharge: 680000 },
        { name: 'Concept fabric · zero weight, same origin as the airy clutch', surcharge: 1280000 },
      ],
    },
    {
      label: 'Fit · La Coupe',
      type: 'choice',
      choices: [
        { name: 'Made to measure · three fittings in Paris (atelier base)', surcharge: 0 },
        { name: 'Cut for the figure you have today · the bravest option on this page', surcharge: 0 },
        { name: 'Cut for when you slim down · optimism surcharge', surcharge: 0 },
        { name: 'Cut generous · this is fine as it is; self-acceptance surcharge', surcharge: 0 },
      ],
    },
    engraving('Lining embroidery', 'e.g. dignity is worn for oneself', 'Silk lining hand-embroidered in Suzhou style, seen only by whoever takes it off', 18000),
  ],
  outerwear: [
    {
      label: 'Cloth · L\'Étoffe',
      type: 'choice',
      choices: [
        { name: 'High-count wool (atelier base)', surcharge: 0 },
        { name: 'Vicuña · wool of emperors, shorn once every two years', surcharge: 280000 },
        { name: 'Double-faced cashmere · no lining, no seams shown, twice the cloth', surcharge: 180000 },
      ],
    },
    {
      label: 'Length',
      type: 'choice',
      choices: [
        { name: 'To the knee (atelier base)', surcharge: 0 },
        { name: 'To mid-calf · dramatic on a staircase', surcharge: 0 },
        { name: 'To the ankle · sweeps the floor of a room you do not own yet', surcharge: 0 },
      ],
    },
    engraving('Inside-pocket embroidery', 'e.g. warmer than it needs to be', 'Embroidered inside the breast pocket, against the chest', 18000),
  ],
  shoes: [
    {
      label: 'Last and leather',
      type: 'choice',
      choices: [
        { name: 'House last, box calf (atelier base)', surcharge: 0 },
        { name: 'Personal last carved from your feet · kept on a shelf in the workshop forever', surcharge: 180000 },
        { name: 'Museum calf · shades into three tones under a patina, applied by hand', surcharge: 88000 },
      ],
    },
    {
      label: 'Size · La Pointure',
      type: 'choice',
      choices: [
        { name: 'EU 39', surcharge: 0 },
        { name: 'EU 42 · the most common size on earth', surcharge: 0 },
        { name: 'EU 45', surcharge: 0 },
        { name: 'One of each foot, measured separately · they are not the same size, they never were', surcharge: 0 },
      ],
    },
    engraving('Sole engraving', 'e.g. walked here on my own', 'Engraved into the leather sole, worn away by the first mile, if there is one', 12000),
  ],
  suit: [
    {
      label: 'Cloth · L\'Étoffe',
      type: 'choice',
      choices: [
        { name: 'Super 120s worsted (atelier base)', surcharge: 0 },
        { name: 'Super 250s · so fine it creases if you think about sitting', surcharge: 180000 },
        { name: 'Woven to your own design · one bolt, then the pattern card is burned', surcharge: 380000 },
      ],
    },
    {
      label: 'Cut',
      type: 'choice',
      choices: [
        { name: 'Two-button, single vent (atelier base)', surcharge: 0 },
        { name: 'Double-breasted · never unbutton it, not even to sit', surcharge: 38000 },
        { name: 'Cut for a shoulder holster · the tailor asked nothing', surcharge: 88000 },
      ],
    },
    engraving('Under-collar embroidery', 'e.g. made for a Tuesday', 'Embroidered under the collar, visible only when the coat is on a hanger', 12000),
  ],

  accessory: [
    {
      label: 'Material · La Matière',
      type: 'choice',
      choices: [
        { name: 'Two-ply cashmere (atelier base)', surcharge: 0 },
        { name: 'Vicuña · wool of emperors, shorn once every two years', surcharge: 280000 },
        { name: 'Shahtoosh-weight pashmina · passes through a wedding ring, legally', surcharge: 180000 },
        { name: 'Silk twill · printed from a drawing that took a year and is used once', surcharge: 38000 },
      ],
    },
    {
      label: 'Size',
      type: 'choice',
      choices: [
        { name: 'One size · the polite fiction of accessories', surcharge: 0 },
        { name: 'Made to your measurements · we will ask for three numbers and use one', surcharge: 0 },
        { name: 'Oversized · deliberately too big, which reads as confidence', surcharge: 0 },
      ],
    },
    engraving('Woven initials', 'Up to 12 characters', 'Woven into the hem in matching thread, invisible unless you know to look, and you will', 6800),
  ],
  instrument: [
    {
      label: 'Setup · Le Réglage',
      type: 'choice',
      choices: [
        { name: 'Factory setup (atelier base)', surcharge: 0 },
        { name: 'Regulated by the house technician · two days, by ear, no instruments but his own', surcharge: 180000 },
        { name: 'Set up for a concert hall · voiced brighter than any room you have', surcharge: 380000 },
        { name: 'Left as found · the last player\'s setup, and their habits, preserved', surcharge: 0 },
      ],
    },
    {
      label: 'Case and care',
      type: 'choice',
      choices: [
        { name: 'Fitted case (atelier base)', surcharge: 0 },
        { name: 'Climate-held in our vault · 50% humidity, checked weekly, played never', surcharge: 280000 },
        { name: 'A player kept on retainer · someone comes and plays it, so it does not die', surcharge: 880000 },
      ],
    },
    engraving('Inside the body', 'e.g. play it, please', 'Written inside the body where only the next restorer, in eighty years, will find it', 26000),
  ],
  animal: [
    {
      label: 'Stabling · L\'Écurie',
      type: 'choice',
      choices: [
        { name: 'Boarded at the house yard (atelier base)', surcharge: 0 },
        { name: 'Private barn, one occupant · no neighbours, no noise, no company', surcharge: 1880000 },
        { name: 'Turned out to a field and left alone · what it would have chosen', surcharge: 380000 },
      ],
    },
    {
      label: 'Programme',
      type: 'choice',
      choices: [
        { name: 'In training (atelier base)', surcharge: 0 },
        { name: 'Campaigned properly · entries, travel, a season of trying', surcharge: 4800000 },
        { name: 'Retired immediately · never raced, never asked, simply kept', surcharge: 880000 },
      ],
    },
    engraving('Name on the box door', 'The name it will not answer to', 'Painted on the stable door in the yard hand; the animal is indifferent, which is the point', 28000),
  ],
  robot: [
    {
      label: 'Chassis · Le Châssis',
      type: 'choice',
      choices: [
        { name: 'Matte polymer shell (atelier base)', surcharge: 0 },
        { name: 'Brushed titanium · heavier, slower, unmistakably expensive', surcharge: 880000 },
        { name: 'Upholstered in the same leather as the bags · warm to the touch, which is worse', surcharge: 1280000 },
      ],
    },
    {
      label: 'Manner',
      type: 'choice',
      choices: [
        { name: 'Responds when addressed (atelier base)', surcharge: 0 },
        { name: 'Anticipates · acts before asked, which is either service or surveillance', surcharge: 680000 },
        { name: 'Silent · performs every duty and never once speaks', surcharge: 880000 },
      ],
    },
    engraving('Plate at the nape', 'e.g. thank you, that will be all', 'Etched at the nape, where a collar would sit, read by whoever stands behind it', 68000),
  ],
  naming: [
    {
      label: 'Register · Le Registre',
      type: 'choice',
      choices: [
        { name: 'Our own register, bound in leather (atelier base)', surcharge: 0 },
        { name: 'Lodged with a body that keeps records for centuries · they will not acknowledge it', surcharge: 180000 },
        { name: 'Announced publicly · a notice no one reads, in a journal no one takes', surcharge: 88000 },
      ],
    },
    {
      label: 'Certificate',
      type: 'choice',
      choices: [
        { name: 'Printed and sealed (atelier base)', surcharge: 0 },
        { name: 'Engraved on a brass plate · outlasts paper, and the registry, and you', surcharge: 68000 },
        { name: 'No certificate · the name is either real or it is not; paper decides nothing', surcharge: 0 },
      ],
    },
    engraving('The name itself', 'What it will be called', 'The name entered into the register. This one is not a joke: whatever you type is what it is called', 0),
  ],

  /* ---------------------------------------------------------- 酒窖餐桌 */
  wine: [
    {
      label: 'Format · Le Format',
      type: 'choice',
      choices: [
        { name: 'Bottle, 75cl (atelier base)', surcharge: 0 },
        { name: 'Magnum, 1.5L · ages slower, in step with this shop', surcharge: 0 },
        { name: 'Jeroboam, 3L · needs an occasion and two people to pour it', surcharge: 0 },
        { name: 'Imperial, 6L · ages so slowly it will outlast the argument about opening it', surcharge: 0 },
      ],
    },
    {
      label: 'Storage · La Garde',
      type: 'choice',
      choices: [
        { name: 'Shipped to you (atelier base)', surcharge: 0 },
        { name: 'Held in bond, temperature and humidity logged hourly · it lives better than you', surcharge: 88000 },
        { name: 'Held until 2055 · by then it will be perfect, and so, presumably, will you', surcharge: 180000 },
      ],
    },
    engraving('Custom label line', 'e.g. drunk too early, as always', 'Letterpressed onto the label by the estate; the vintage is real, the occasion is yours', 12000),
  ],
  spirit: [
    {
      label: 'Cask and strength',
      type: 'choice',
      choices: [
        { name: 'Bottled at 46% (atelier base)', surcharge: 0 },
        { name: 'Cask strength · undiluted, uncompromising, undelivered', surcharge: 88000 },
        { name: 'Single cask, your pick from the warehouse · you choose by nosing, remotely, imagining', surcharge: 380000 },
      ],
    },
    {
      label: 'Decanter',
      type: 'choice',
      choices: [
        { name: 'House bottle (atelier base)', surcharge: 0 },
        { name: 'Hand-blown crystal decanter · one glassblower, one breath each', surcharge: 180000 },
        { name: 'No vessel · the spirit remains in the cask, which is where it is happiest', surcharge: 0 },
      ],
    },
    engraving('Decanter engraving', 'e.g. for a slow evening', 'Wheel-cut into the crystal by hand, one letter at a time, no second attempt', 26000),
  ],
  food: [
    {
      label: 'Grade · La Qualité',
      type: 'choice',
      choices: [
        { name: 'House selection (atelier base)', surcharge: 0 },
        { name: 'First pick of the season · the buyer takes it before the market sees it', surcharge: 88000 },
        { name: 'The single finest example of the year · there is exactly one, and this is it', surcharge: 480000 },
      ],
    },
    {
      label: 'Delivery window',
      type: 'choice',
      choices: [
        { name: 'Within 24 hours of harvest (atelier base)', surcharge: 0 },
        { name: 'Flown same-day, packed in ice · arrives at its peak, in principle', surcharge: 68000 },
        { name: 'Never · it stays at its peak indefinitely, which is the only way to keep it there', surcharge: 0 },
      ],
    },
    engraving('Presentation card', 'e.g. eat it before you photograph it', 'Written by hand on the card that comes with it, by someone with better handwriting than either of us', 4800),
  ],

  /* ---------------------------------------------------------- 运动竞技 */
  venue: [
    {
      label: 'Seating privileges',
      type: 'choice',
      choices: [
        { name: 'Two seats, centre (atelier base)', surcharge: 0 },
        { name: 'The whole box, and nobody in it but you', surcharge: 880000 },
        { name: 'Seats behind the bench · close enough to hear what is actually said', surcharge: 480000 },
      ],
    },
    {
      label: 'Catering',
      type: 'choice',
      choices: [
        { name: 'Standard hospitality (atelier base)', surcharge: 0 },
        { name: 'Chef in the box for the day · three courses between the halves', surcharge: 380000 },
        { name: 'A hot dog and a beer · ordered by someone who understands', surcharge: 0 },
      ],
    },
    engraving('Nameplate on the door', 'The name on the box', 'Engraved plate at the box door, polished before every fixture, for a box you will not enter', 68000),
  ],
  experience: [
    {
      label: 'Format',
      type: 'choice',
      choices: [
        { name: 'A single session (atelier base)', surcharge: 0 },
        { name: 'A full day, no clock running · they stay until you have it', surcharge: 280000 },
        { name: 'A standing invitation · whenever you are ready, for the rest of your life', surcharge: 880000 },
      ],
    },
    {
      label: 'Recording',
      type: 'choice',
      choices: [
        { name: 'No cameras (atelier base)', surcharge: 0 },
        { name: 'Filmed properly · two operators, cut in a week', surcharge: 180000 },
        { name: 'One photograph, at the end · the only proof, and enough', surcharge: 28000 },
      ],
    },
    engraving('Dedication on the certificate', 'e.g. showed up, that was the hard part', 'Written on the certificate you receive afterwards, in ink, by the person who taught you', 8800),
  ],

  /* ---------------------------------------------------------- 科技算力 */
  compute: [
    {
      label: 'Cooling · Le Refroidissement',
      type: 'choice',
      choices: [
        { name: 'Air cooled (atelier base)', surcharge: 0 },
        { name: 'Direct liquid to chip · quieter, denser, thirstier', surcharge: 1880000 },
        { name: 'Immersion in dielectric fluid · the whole rack, submerged and silent', surcharge: 4800000 },
      ],
    },
    {
      label: 'Allocation',
      type: 'choice',
      choices: [
        { name: 'Shared queue (atelier base)', surcharge: 0 },
        { name: 'Reserved capacity · yours whether you use it or not, mostly not', surcharge: 6800000 },
        { name: 'Idle · powered, cooled, and running nothing; the most expensive silence available', surcharge: 2800000 },
      ],
    },
    engraving('Rack nameplate', 'e.g. it is thinking about it', 'Etched nameplate on the rack door, read by the technicians, who will not comment', 68000),
  ],
  space: [
    {
      label: 'Orbit and duration',
      type: 'choice',
      choices: [
        { name: 'Low earth orbit, five years (atelier base)', surcharge: 0 },
        { name: 'Geostationary · parked above one spot, watching one thing forever', surcharge: 68000000 },
        { name: 'Escape trajectory · leaves and does not come back, which you already understand', surcharge: 128000000 },
      ],
    },
    {
      label: 'Payload',
      type: 'choice',
      choices: [
        { name: 'Standard instrument package (atelier base)', surcharge: 0 },
        { name: 'A camera pointed back at earth · the only view worth the launch', surcharge: 28000000 },
        { name: 'Ballast · it carries nothing, beautifully', surcharge: 0 },
      ],
    },
    engraving('Plate fixed to the hull', 'e.g. we were here, briefly', 'Etched into a plate bolted to the hull, unreadable from earth, permanent regardless', 880000),
  ],

  /* ---------------------------------------------------------- 艺术收藏 */
  painting: [
    {
      label: 'Framing · L\'Encadrement',
      type: 'choice',
      choices: [
        { name: 'Period-appropriate gilt frame (atelier base)', surcharge: 0 },
        { name: 'Museum glass, non-reflective · you see the picture, never yourself', surcharge: 180000 },
        { name: 'Unframed · as it left the easel, edges and all', surcharge: 0 },
        { name: 'Frame only · we keep the picture, you take the frame; cheaper, and arguably the same', surcharge: 0 },
      ],
    },
    {
      label: 'Hanging',
      type: 'choice',
      choices: [
        { name: 'Standard cleat (atelier base)', surcharge: 0 },
        { name: 'Hung by our own installer · he travels with it and says little', surcharge: 280000 },
        { name: 'Lit by a single picture light · the room goes dark, the picture does not', surcharge: 88000 },
      ],
    },
    engraving('Collector plaque engraving', 'e.g. from the collection of nobody', 'Engraved on the brass plaque below the frame; this is the line the next century reads', 26000),
  ],
  sculpture: [
    {
      label: 'Patina and finish',
      type: 'choice',
      choices: [
        { name: 'As cast (atelier base)', surcharge: 0 },
        { name: 'Hand-applied patina · the founder heats and brushes it until it argues back', surcharge: 180000 },
        { name: 'Left to weather · it will be better in thirty years, outdoors, without you', surcharge: 0 },
      ],
    },
    {
      label: 'Plinth',
      type: 'choice',
      choices: [
        { name: 'No plinth (atelier base)', surcharge: 0 },
        { name: 'Solid stone plinth · weighs more than the piece, as it should', surcharge: 280000 },
        { name: 'Rotating plinth · so it can be seen from every side, by no one', surcharge: 180000 },
      ],
    },
    engraving('Base engraving', 'e.g. stood here a while', 'Cut into the underside of the base, seen only if it is ever moved', 26000),
  ],
  antiquity: [
    {
      label: 'Conservation',
      type: 'choice',
      choices: [
        { name: 'Stabilised, not restored (atelier base)', surcharge: 0 },
        { name: 'Losses filled and toned · honest under raking light, invisible otherwise', surcharge: 380000 },
        { name: 'Left exactly as found · every century still legible on the surface', surcharge: 0 },
      ],
    },
    {
      label: 'Provenance file',
      type: 'choice',
      choices: [
        { name: 'Standard export documentation (atelier base)', surcharge: 0 },
        { name: 'Full chain of ownership, researched · four names, two wars, one silence', surcharge: 680000 },
        { name: 'No file · it appeared, and here it is; the trade calls this "private collection, Europe"', surcharge: 0 },
      ],
    },
    engraving('Case card, hand-lettered', 'e.g. older than the argument', 'Written on the vitrine card in the museum hand, the last line anyone reads before moving on', 26000),
  ],
}

/**
 * 子品类识别：按大类分组匹配，避免跨类误伤
 * （高尔夫的「Staff Bag」不该被当成手袋，赛马也不该被当成运动器材）。
 * 顺序即优先级，先命中先算。
 */
const ANY = /./
const SUBTYPE_PATTERNS: Record<string, [string, RegExp][]> = {
  腕表珠宝: [
    ['watch', /tourbillon|chronograph|watch|repeater|sonnerie|perpetual|diver|flieger|hander|timepiece|moonphase|automaton|chronometer|clock|regulator/i],
    ['ring', /\bring\b|solitaire|signet/i],
    ['necklace', /necklace|pendant|rivi[eè]re|strand|chain|parure|suite|choker|sautoir/i],
    ['earrings', /earring|ear stud|drop earr/i],
    ['bracelet', /bracelet|bangle|cuff\b/i],
    ['brooch', /brooch|tiara|diadem|aigrette/i],
    ['stone', /carat|diamond|emerald|sapphire|ruby|jade|opal|spinel|pearl/i],
  ],
  包袋皮具: [
    ['sla', /wallet|card case|cardholder|folio|pouch|belt bag|notebook|passport/i],
    ['trunk', /trunk|vanity|luggage|suitcase|holdall|\bcase\b|\bbox\b|cover|tube|flask|bowl|globe|humidor/i],
    ['bag', ANY], // 剩下的都是包：这一类本来就叫「包袋皮具」
  ],
  尊贵座驾: [
    ['moto', /motorcycle|motorbike|trike|scooter|snowmobile|\bbike\b/i],
    ['car', ANY], // 剩下的都有轮子：概念车、拖车、消防车、有轨电车……
  ],
  游艇航空: [
    ['aircraft', /jet|aircraft|plane|helicopter|heli|widebody|airship|blimp|jetpack|glider|trainer|tiltrotor|evtol|spaceflight|suborbital|air taxi|airstrip|hovercraft|ground-effect/i],
    ['yacht', ANY], // 剩下的都浮在水上
  ],
  不动产: [
    ['land', /plot|island|cay|atoll|sandbar|\bland\b|acre|seabed|ranch|reserve|domain|waterfall|street/i],
    ['home', ANY], // 剩下的都是能住人的东西（洞窟、车站、修道院也算）
  ],
  高定衣橱: [
    ['shoes', /shoe|boot|slipper|clog|loafer|heel|sneaker/i],
    ['gown', /gown|dress|bridal|robe|cheongsam|qipao|kimono|tangzhuang|pajama/i],
    ['outerwear', /coat|cape|jacket|\bfur\b|sable|parka|trench|cardigan/i],
    ['suit', /suit|tuxedo|smoking|blazer/i],
    ['accessory', ANY], // 围巾/帽子/袜子/手套/伞：不是衣服，别给它们「衬里刺绣」
  ],
  酒窖餐桌: [
    ['spirit', /whisky|whiskey|malt|cognac|rum|\bgin\b|vodka|baijiu|sake|tequila|armagnac|distillery/i],
    ['wine', /wine|bordeaux|burgundy|barolo|champagne|magnum|primeur|riesling|tuscan|qvevri|sauternes|vertical|winery/i],
    ['food', ANY], // 剩下的都能吃
  ],
  艺术收藏: [
    ['naming', /naming|\bname\b|\bstar\b|galaxy|asteroid|constellation/i],
    ['instrument', /violin|piano|cello|guitar|stradivari|cremona|music box|harp/i],
    ['antiquity', /papyrus|mosaic|redfigure|sancai|dynasty|ancient|roman|greek|byzantine|dunhuang|relic|fragment|manuscript|baroque|renaissance|victorian|georgian|century|\bera\b|age of|ming|qing|tang|song/i],
    ['sculpture', /sculpture|bronze|bust|carving|figure|statue|\bjade\b|\bstone\b|hetian|jadeite/i],
    ['painting', /painting|original|impressionist|canvas|study|print|fresco|calligraphy|scroll|\bcel\b|\bart\b/i],
  ],
  科技算力: [
    ['robot', /robot|humanoid|android/i],
    ['space', /satellite|probe|orbit|lunar|mars|space|rocket|antimatter|helium|stratospheric|base-station/i],
    ['naming', /naming rights/i],
    ['compute', ANY], // 剩下的都是「插电的东西」：存储库、反应堆、测序、数据舱
  ],
  运动竞技: [
    ['animal', /racehorse|horse|camel|sled-dog|falcon|hound|stallion|colt|dressage/i],
    ['venue', /\bbox\b|suite|arena|court|paddock|stadium|links|seat|gallery|skybox|carpet|club\b/i],
    ['experience', ANY], // 剩下的都是「一段经历」：教练、训练营、探险、比赛日
  ],
}

/** 这件商品的子品类；认不出就返回 null，退回大类选项 */
export function subtypeOf(product: Product): string | null {
  for (const [key, re] of SUBTYPE_PATTERNS[product.category] ?? []) {
    if (re.test(product.name)) return key
  }
  return null
}

/** 详情页该显示哪套定制：子品类优先，退回大类 */
export function customFor(product: Product): CustomGroup[] {
  const subtype = subtypeOf(product)
  return (subtype && SUBTYPE_CUSTOM[subtype]) || CATEGORY_CUSTOM[product.category] || []
}
