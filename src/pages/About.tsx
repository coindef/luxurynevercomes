import { useNavigate } from 'react-router-dom'
import { IMAGE_CREDITS, UNSPLASH_NOTE } from '../lib/credits'
import { getProduct } from '../lib/products'
import { PRIVACY_FOOTER } from '../lib/copy'
import EditorialImage from '../components/EditorialImage'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="pb-20 lg:mx-auto lg:max-w-3xl">
      <header className="px-6 pt-8 lg:pt-12">
        <nav aria-label="Breadcrumb" className="text-[10px] text-fog">
          <button onClick={() => navigate(-1)} className="hover:text-ivory">Back</button>
          <span aria-hidden="true" className="px-1.5">/</span>
          <span className="text-ivory">About</span>
        </nav>
        <h1 className="font-lux mt-8 text-3xl leading-relaxed text-ivory lg:text-4xl">About</h1>
      </header>

      {/* 无边框无面板：靠留白与发丝线分栏 */}
      <section className="px-6 pt-12">
        <p className="font-lux text-xl leading-relaxed text-ivory lg:text-2xl">LuxuryNeverComes</p>
        <p className="mt-6 text-[11px] leading-loose text-fog">
          A simulated hall of luxury that heals the "can't afford it" ache: subscribe freely to platinum handbags, tourbillons, yachts, private islands, compute clusters.
          You pay ¥0.00, and nothing ever ships. The dopamine comes from anticipation, not acquisition, and for luxury goods that logic holds most completely of all.
          Every order's amount is deposited into your Downpayment Ledger.
        </p>
        <p className="mt-5 text-[11px] leading-loose text-fog">
          Sister site:{' '}
          <a
            href="https://github.com/coindef/parcelnevercomes"
            target="_blank"
            rel="noreferrer"
            className="quiet-link text-ivory"
          >
            ParcelNeverComes
          </a>
          {' '}(the everyday-goods edition). Inspired by{' '}
          <a href="https://foodnevercomes.com" target="_blank" rel="noreferrer" className="quiet-link text-ivory">
            FoodNeverComes
          </a>
          .
        </p>
      </section>

      <EditorialImage
        src="/img/ed-atelier-2.jpg"
        alt="A row of hand tools hanging on the atelier's dark wall, each in its place"
        caption="Our atelier. The artisans are real, the craft is real, the delivery is fake."
      />

      <section className="mt-20 border-t border-hairline px-6 pt-14">
        <h2 className="font-lux text-lg text-ivory">Image Credits</h2>
        <p className="mt-5 text-[11px] leading-loose text-fog">
          Product photos are real, brand-free images, mostly from Unsplash, with some under CC0 / CC BY licenses.
          Each one is inspected by eye, one at a time: no readable brand mark may appear in the frame. If we can't find a suitable image, we run none.
          Pieces without a photo show an "auction catalogue placard" instead, because even a placeholder deserves some poise. The images requiring attribution are listed below.
        </p>
        <ul className="mt-8 space-y-4">
          {IMAGE_CREDITS.map((c) => {
            const p = getProduct(c.productId)
            return (
              <li key={c.productId} className="text-[9px] leading-relaxed text-fog">
                <span className="text-ivory">{c.label ?? p?.name ?? c.productId}</span>
                <br />
                <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="quiet-link text-fog">
                  “{c.title.length > 30 ? `${c.title.slice(0, 30)}…` : c.title}”
                </a>
                , {c.creator}, {c.license}
              </li>
            )
          })}
        </ul>
        <p className="mt-8 text-[9px] leading-loose text-fog">{UNSPLASH_NOTE}</p>
      </section>

      {/* 法务小字层级：本店的签名就藏在最小号字里 */}
      <section className="mt-20 border-t border-hairline px-6 pt-12">
        <p className="text-[8px] leading-loose text-fog">
          This site is an entertainment and emotional self-help tool, not a real store. All products, prices, sales figures, reviews, ateliers, and butlers are fictional,
          with no affiliation with or authorization from any real luxury brand; product names are category descriptions. We take no payment, no shipping address, and collect no personal information whatsoever.
        </p>
        <p className="mt-4 text-[8px] leading-loose text-fog">{PRIVACY_FOOTER}</p>
      </section>
    </div>
  )
}
