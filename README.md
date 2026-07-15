<div align="center">

# LuxuryNeverComes

### Tonight, money is no object. We don't take any.

*Finally affordable. Forever undelivered.*

![The salon](docs/home.jpg)

</div>

A healing storefront for everything you can't afford. Subscribe to crocodile bags, tourbillons,
hypercars, superyachts, private islands, ten-thousand-GPU clusters. Pay a solemn **¥0.00**, and
nothing ever ships. The dopamine lives in the wanting, not the having, and for luxury that logic
holds best of all. Every order's price is quietly banked in your **Downpayment Ledger**.

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
- **Bespoke atelier** — pick crocodile leathers, a starlight roof of your birth sky, a quantum-paint
  that decides its colour only when observed. Surcharges shown, then struck through: payable ¥0.00.
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
motion is "expensively slow." Full design doctrine in [DESIGN.md](DESIGN.md).

## Tech

Vite · React 19 · TypeScript · Tailwind CSS v4 · React Router. State lives in the browser's
`localStorage` (cart, orders, the ledger). No backend, no payment, no data collected: *your fortune
exists only on this device; we can't see it, and neither can your relatives.*

## Not a real store

An entertainment and mood-lifting toy, not a shop. Every product, price, review, atelier, and butler is
fictional, with no affiliation to or endorsement from any real brand; all names are category
descriptions. Nothing is charged, no address is taken, no personal data is collected.

## Licence

Code under [MIT](LICENSE). Images per their individual sources: product photos are real, brand-free
pictures, each inspected by eye, with attributions for CC BY / CC BY-SA and Unsplash images maintained in
[src/lib/credits.ts](src/lib/credits.ts) and shown at `/about`.

## Thanks

To FoodNeverComes, which went first, and to everyone who has ever looked at a yacht in their cart and
sighed, softly, late at night.
