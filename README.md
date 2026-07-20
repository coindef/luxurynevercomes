<div align="center">

# LuxuryNeverComes

### Buy everything. Keep everything.

*Finally affordable. Forever undelivered.*

**[Enter the maison](https://luxurynevercomes.vercel.app)**

![The salon](docs/home.jpg)

</div>

A satirical, front-end-only luxury storefront. Reserve crocodile bags, tourbillons, superyachts,
private islands, ten-thousand-GPU clusters; pay a solemn **¥0.00**; nothing ever ships. Every order is
banked in your **Downpayment Ledger**, where the money you did not spend adds up to a fortune you did
not lose. The dopamine lives in the wanting, not the having, and for luxury that logic holds best of
all.

```bash
npm install && npm run dev      # http://localhost:5173
```

Sister site: [ParcelNeverComes](https://github.com/coindef/parcelnevercomes) for everyday goods, in
the tradition of [FoodNeverComes](https://foodnevercomes.com).

## What it does

- **1,009 pieces across 22 invented houses.** Every name is a category description, never a real
  brand. Prices match real-world levels, spelled to the last comma, and display in your local
  currency (frozen mid-market rates; the payable sum survives conversion).
- **A quota system for the coveted.** Flagships refuse a direct order until you have reserved enough
  of everything else, and the quota is also ¥0.00. Beside it sits a waiting list that never moves:
  your number is assigned once and is yours for life.
- **Bespoke on a selection.** Surcharges are shown, then struck through to ¥0.00. Engraving renders
  a live proof in the house italic, and personalised pieces are final sale, the one irreversible
  thing sold here.
- **A butler who never arrives.** Nine dispatch notes unlock by real elapsed time; chase the parcel
  and he replies. Long-press the forever-greyed "confirm receipt" for a Certificate of Genuine
  Solitude.
- **A concierge that behaves like one.** Book an appointment (the calendar invite is real, and the
  only thing this house ships), talk to an ambassador, request the price in writing, check boutique
  stock (0, in every location, equally).
- **Send it onward.** Gift any piece with a plain link that unwraps on the recipient's screen; share
  a wish list the same way. The certificate, the price confirmation and the monthly summary all
  export as portrait cards, pre-composed for posting.
- **Be remembered.** Recently viewed, "You may also like", waiting-list standings, a mailing list
  that remembers you signed up. All of it is a seeded hash over localStorage; your taste never
  leaves the device.

<div align="center">

![The Houses](docs/houses.jpg)

*Twenty-two invented maisons, each with a name, a temperament and a one-line history.*

![The Collection](docs/collection.jpg)

*The catalogue in chapters, dearest first, live counts on every filter. Pieces awaiting photography
show a catalogue placard, not a gap.*

![A product page](docs/product.jpg)

*One decision, then the numbers. This one is quota-gated besides, and there is a waiting list, which
does not move.*

</div>

## The craft

**Researched, then simulated.** Ten real luxury retailers were read and every claim adversarially
tested before it shaped the store: colourway is never a decision (each colour is its own reference);
a product page asks zero to three decisions and the mode is one, the size; size is never priced
inside a selector; nobody uses infinite scroll. The variety comes from data, not configurators:
every piece derives its own reference, materials and dimensions in [src/lib/spec.ts](src/lib/spec.ts),
and a spec row exists only where its logic is real, so a yacht has a yard, a gem has a mine, and a
1691 oil is not "Made in Germany".

**Photographed at 3:4, or not at all.** Images are real photographs (Unsplash, CC0/CC BY, credited
at `/about`) where a brand-free, catalogue-grade one exists, otherwise generated with Flux on a free,
one-request-at-a-time lane; 570 of 1,009 pieces are photographed at the time of writing and the rest
show an auction-catalogue placard rather than a broken image. The prompt rules in
[scripts/art-direction.mjs](scripts/art-direction.mjs) are scar tissue, one failure each: one seed
per piece, or three views draw three different bags; never write "hand", because diffusion renders
instead of negating; whole objects only, or the model paints the detail and loses the product. Every
frame is inspected by eye for brand marks before it ships.

**Cold Luxury.** True paper white, ink black, one hairline grey, and a single colour: private-bank
green `#1F6B4A`, spent only where money is saved. Didone prices with every digit spelled out,
editorial left alignment, expensively slow motion, no borders, no eyebrow labels. The full doctrine
is [DESIGN.md](DESIGN.md).

## Run it

```bash
npm run dev        # develop
npm run build      # type-check + production build → dist/
npm run lint       # oxlint
npm run images     # resume the photography pipeline; Ctrl-C safe
```

Vite, React 19, TypeScript, Tailwind CSS v4. State lives entirely in localStorage: no backend, no
payment, no analytics, nothing collected. Ships as a static SPA anywhere
([vercel.json](vercel.json) and [public/_redirects](public/_redirects) included).

## Not a real store

An entertainment and mood-lifting toy. Every product, price, review, atelier and butler is
fictional, with no affiliation to or endorsement from any real brand. Code is under [MIT](LICENSE).
Built for everyone who has ever looked at a yacht in their cart and sighed, softly, late at night.
