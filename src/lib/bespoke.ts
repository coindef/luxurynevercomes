import type { CustomGroup } from './types'

/** 工坊定制 BESPOKE：按分类分配的定制选项体系 */
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
