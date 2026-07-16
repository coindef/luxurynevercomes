<div align="center">

# LuxuryNeverComes

### You never actually own it. You merely want it.

*Finally affordable. Forever undelivered.*

![The salon](docs/home.jpg)

</div>

A healing storefront for everything you can't afford. Subscribe to crocodile bags, tourbillons,
hypercars, superyachts, private islands, ten-thousand-GPU clusters. Pay a solemn **¥0.00**, and
nothing ever ships. The dopamine lives in the wanting, not the having, and for luxury that logic
holds best of all. Every order's price is quietly banked in your **Downpayment Ledger**.

The headline is Patek Philippe's, finished honestly. Theirs runs *"You never actually own a Patek
Philippe. You merely look after it for the next generation."* The most famous sentence in luxury is
already about not owning the thing; this shop is only that sentence taken the rest of the way.

Sister site: [ParcelNeverComes](https://github.com/coindef/parcelnevercomes) (everyday goods).
In the tradition of dopamine sites like [FoodNeverComes](https://foodnevercomes.com).

---

## The experience

- **Black-card ritual** — your first visit hands you a *Carte Noire*, limit none, valid forever
  (not that checkout will need it).
- **The Houses** — browse **22 fictional maisons**, each with a name, a temperament, and a one-line
  history. None of them are real; none will ship you anything.
- **Today's Salon** — one object per screen, generous whitespace, a booking window forever stuck at
  fifty-nine minutes.
- **The catalogue, sectioned** — 1,009 pieces in chapters by category, dearest first, with search,
  filter and sort all held in the URL, so the back button and a shared link both behave.
- **Search that answers** — type `croc bag`, `platinum bag`, or a house name. Ask it for `free` and all
  1,009 pieces match: *"Every one of them is free. That was never the part standing in your way."*
  Sort **by what you actually pay** and nothing moves, because every piece ties at ¥0.00.
- **Lot galleries** — two or three catalogue views per photographed piece (full view, reverse, from
  above), swipeable, with a filmstrip. *"Photographed from three angles. Undeliverable from all of them."*
- **A product page built like a maison's** — one decision (the size), each size carrying its own
  availability ("40, notify when available", which in this shop is the only wholly honest line on the
  page); then a specification table, then accordions composed per piece, then the reference number, set
  small and unexplained at the very bottom where Cartier puts it. The CTA stack routes you to a human
  four ways, because in real luxury the sale usually does not close online. Here none of them close.
- **1,009 pieces, 1,009 different specification sheets** — its own reference, material, dimensions,
  colourway and origin, all derived from the piece itself. This is where the variety lives, and it is
  where real maisons keep it too. See [Shopping, simulated](#shopping-simulated).
- **Bespoke atelier** — demoted to an accordion, where personalisation belongs: crocodile leathers, a
  starlight roof of your birth sky, a quantum paint that picks its colour only when observed.
  Surcharges are shown, then struck through: payable ¥0.00.
- **Quota (配货)** — the most coveted pieces refuse a direct order. You must first subscribe to *other*
  things to build up allocation. The joke: the allocation is also ¥0.00. You spend nothing, repeatedly,
  to earn the right to spend nothing on the bag.
- **White-glove butler tracking** — nine dispatch notes unlock by real elapsed time. The butler pauses
  at an Alpine pass to watch the snow for you; the captain waits for weather worthy of the cargo.
- **Certificate of Genuine Solitude** — long-press the forever-greyed "confirm receipt" for a dark
  keepsake certificate.
- **Downpayment Ledger** — your total *kept safe* (`¥380,000,000.00`, every comma spelled out),
  converted into "≈ 190 first-tier downpayments" or "≈ many years of you, unharmed."

<div align="center">

![The Houses](docs/houses.jpg)

*The Houses: twenty-two invented maisons, each with a name, a temperament and a one-line history.*

</div>

## The catalogue

**1,009 pieces across 10 categories**, each named by description, **never by a real brand**, with
prices calibrated to the real world (a 76-metre superyacht at ¥680,000,000; a ten-thousand-GPU cluster
at ¥2,180,000,000; a card holder at ¥8,800). Beyond the classics (bags, watches, motorcars, yachts,
real estate, art, cellar, couture) there is new-money luxury too:

- **Compute & Tech** — ten-thousand-GPU clusters, an hour of quantum time ("your task is both done and
  not done"), satellite naming rights, humanoid butlers, a share of a fusion plant ("always fifty years
  away, and all of humanity waits with you").
- **Sport** — a full-season paddock pass, a Grand Slam final box, a lifetime links membership ("the
  waitlist starts at forty years; we waive it, you're not getting in anyway").

Pieces without a real, logo-free photograph fall back to an **auction-catalogue velvet plaque** — even
the placeholder has poise.

<div align="center">

![The Collection](docs/collection.jpg)

*The catalogue runs in chapters, dearest first, every filter value carrying a live count. Pieces
awaiting photography show a catalogue plaque rather than a gap.*

![A product page](docs/product.jpg)

*One decision, then the numbers. Each size carries its own availability; the reference number sits
small and unexplained at the foot of the page, where Cartier puts it.*

</div>

## Shopping, simulated

The store is modelled on how luxury e-commerce actually behaves, which was researched rather than
assumed: Cartier, Hermès, Dior, Louis Vuitton, Chanel, Van Cleef, Loro Piana, Net-a-Porter, Mytheresa
and Farfetch were read directly where they were readable, then every claim was handed to an adversarial
pass whose only job was to refute it. Several were refuted. What survived shaped the build, and three
findings overturned what had already been written here:

**Colourway is never a decision.** Every colourway is a separate page with its own reference, confirmed
at six houses (Dior's `_M900` is a house-wide black code; Chanel keeps style `A01112` and varies the
suffix). So a leather picker on a bag page is not a luxury pattern, it is an invention. Ours was also
identical across all 100 bags, which is exactly what it felt like.

**A product page asks for almost nothing.** Decisions per page run 0 to 3, and the mode is 1: the size.
Hermès Petit h asks for nothing at all, its selector reading "Color, Random selected" over the line "The
color of the product is a surprise!" So the variety in real luxury does not come from a configurator. It
comes from the *data*: every piece has its own reference, material, dimensions, colourway. That is what
[src/lib/spec.ts](src/lib/spec.ts) generates, deterministically, per piece, one thousand and nine times.

**Size is never priced inside a selector.** Either one price spans the whole run (Cartier's LOVE is one
number from 15 to 21cm, while conceding that the diamond count changes) or the size is a separate
product you navigate to (Hermès prices the Birkin 25/30/35 apart). Either way the page shows one
finished number.

Also adopted, each because a real house does it: breadcrumbs; live counts on every filter value with
empty categories omitted; a single "Clear all" rather than filter chips; brand → name → price on the
card with the piece's own material beneath; a deep CTA stack that routes to a human; and **load more with
a viewed count instead of infinite scroll**, which not one of the ten sites uses.

The counter-evidence was kept too. NN/g documents shoppers punishing maisons for withholding information,
and found Tom Ford's light-grey all-caps text actively undermined its luxury positioning: an independent
corroboration of this repo's own contrast floor and its ban on eyebrow labels. Steal the restraint, not
the withholding.

## Photography

Every lot wants three views: full, reverse, from above. That is **2,742 images**, and the free lane
([Pollinations](https://pollinations.ai), Flux, no key) allows **one request at a time per IP** and
settles at **~40s an image**, so the full set is roughly a 32-hour job. The pipeline is therefore
prioritised and resumable, and being unfinished is its normal state, not a fault:

```bash
npm run images:plan      # what it would make, and in what order
npm run images           # generate; Ctrl-C whenever, re-run to continue
npm run images:manifest  # rescan public/img → src/lib/imageManifest.ts
```

It works the queue by visibility (house flagships, the salon, quota pieces, then by price), skips
whatever is already on disk, and keeps the seed a pure function of the product id, so a view made today
still matches one made next week.

Four rules live in [scripts/art-direction.mjs](scripts/art-direction.mjs), and each one is there because
the obvious alternative failed:

1. **One seed per piece, shared by all three views.** Separate seeds draw three *different* handbags.
2. **The angle goes first.** At the end of the prompt it is ignored and you get a frontal hero shot.
3. **Never name `hand` or `people`, not even to forbid them.** Diffusion models do not negate, they
   render: "hand stitching" put a literal hand in the frame. Catalogue names hid 37 of these
   (`Hand-Built`, "A Global Handful", "Logo-Free Edition", a clock's "Hands"); all are scrubbed.
4. **Whole objects only, no macro details.** Make "the clasp" the subject and the model forgets the bag
   and draws a ring.

Real photography outranks generated work: pieces shot by people (Unsplash, CC BY) are never overwritten,
and pieces that *are* a person (a butler, a coach, a chef) are never generated at all, because that means
generating a face. They keep the plaque.

Everything is generated and shown at **3:4**, the catalogue's page shape. Every frame on the site holds
that ratio, so nothing is ever cropped to fit: a container in any other proportion quietly slices the
handles and the base off a standing bag and leaves you the middle.

The older photographs did not arrive at 3:4 (they run 900x506 to 600x900), and a landscape photograph
dropped into a portrait frame loses most of its subject: one tiara was showing at 20% of its width.
`npm run images:aspect` pads them instead, and pads them with **the photograph's own background colour**,
sampled by taking the two most similar of its four corners. On a studio sweep the subject can occupy at
most two corners, so the other two are the background and agree almost exactly, which is how a macro
watch shot on black resolves to `#000000` and gains two invisible bands. Nothing is scaled and nothing
is stretched: the photograph is untouched, only the canvas grows.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

```bash
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build
npm run lint       # oxlint
```

Any static host, no backend required. Vercel imports as-is ([vercel.json](vercel.json) sets the SPA
fallback and image caching); Netlify uses [public/_redirects](public/_redirects); elsewhere, route all
paths back to `index.html`.

## Design — Cold Luxury

True paper white `#FFFFFF` + ink black `#111111` + cool hairline `#E5E5E5` + private-bank green
`#1F6B4A`. **There is only one colour on the whole site, and it is the green**, appearing only on the
saving-and-soothing side (payable ¥0.00, kept safe, the ledger). The rest is black and white; colour
arrives only at the moment the joke lands.

A cinematic full-bleed hero with the headline overlaid, borderless editorial product cards, left-aligned
type, and a great deal of whitespace. **The luxury is in the restraint, not the ornament.** Prices are
set in a Didone face with every digit and comma spelled out (the length of the commas is the dopamine);
motion is "expensively slow." The page closes the way a maison closes one: a mailing list for the pieces
that will not arrive, a few quiet columns, and the fine print. Full design doctrine in
[DESIGN.md](DESIGN.md).

## Tech

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router. State lives in the browser's
`localStorage` (cart, orders, the ledger). No backend, no payment, no data collected: *your fortune
exists only on this device; we can't see it, and neither can your relatives.*

Which pieces have photographs, and how many views each, is settled at build time in
[src/lib/imageManifest.ts](src/lib/imageManifest.ts) (generated, committed). Nine in ten pieces have no
photograph, so letting the browser discover that through failed requests would mean hundreds of doomed
404s on every visit to the catalogue.

## Not a real store

An entertainment and mood-lifting toy, not a shop. Every product, price, review, atelier, and butler is
fictional, with no affiliation to or endorsement from any real brand; all names are category
descriptions. Nothing is charged, no address is taken, no personal data is collected.

## Licence

Code under [MIT](LICENSE). Images are either photographs (Unsplash, CC0, CC BY / CC BY-SA) or generated
with Flux, and every one is inspected by eye for readable brand marks before it ships. Attribution for
the photographs is maintained in [src/lib/credits.ts](src/lib/credits.ts) and shown at `/about`;
[scripts/ai-sourced.json](scripts/ai-sourced.json) records which pieces are generated, which is also what
keeps the pipeline from ever painting over someone's photograph.

## Thanks

To FoodNeverComes, which went first, and to everyone who has ever looked at a yacht in their cart and
sighed, softly, late at night.
