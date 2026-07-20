import { Link } from 'react-router-dom'
import { IMAGE_CREDITS, UNSPLASH_NOTE } from '../lib/credits'
import { PRODUCTS, getProduct } from '../lib/products'
import { MAISONS } from '../lib/maisons'
import { PRIVACY_FOOTER } from '../lib/copy'
import { yuan } from '../lib/format'
import { useStore } from '../lib/store'
import EditorialImage from '../components/EditorialImage'

export default function About() {
  const { saved, orders } = useStore()

  return (
    <div className="pb-20 lg:mx-auto lg:max-w-3xl">
      <header className="px-6 pt-8 lg:px-0 lg:pt-12">
        {/* 面包屑与全站同一套（Home / X）。原为 navigate(-1) 的「Back」——
            从页脚直达本页时，历史栈里没有可退之处 */}
        <nav aria-label="Breadcrumb" className="text-[10px] text-fog">
          <Link to="/" className="hover:text-ivory">Home</Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          <span className="text-ivory">About</span>
        </nav>
        <h1 className="font-lux mt-8 text-3xl leading-relaxed text-ivory lg:text-4xl">About</h1>
      </header>

      {/* 无边框无面板：靠留白与发丝线分栏 */}
      <section className="px-6 pt-12 lg:px-0">
        <h2 className="font-lux text-lg text-ivory">The house</h2>
        <p className="mt-6 max-w-xl text-[11px] leading-loose text-fog">
          A simulated hall of luxury that heals the "can't afford it" ache: reserve platinum handbags, tourbillons,
          yachts, private islands, compute clusters. You pay a solemn ¥0.00, and nothing ever ships. The dopamine
          comes from anticipation, not acquisition, and for luxury goods that logic holds most completely of all.
          Every order's amount is deposited into your Downpayment Ledger, where the money you did not spend adds up
          to a fortune you did not lose.
        </p>
        <p className="mt-5 max-w-xl text-[11px] leading-loose text-fog">
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
          . Built in the open:{' '}
          <a
            href="https://github.com/coindef/luxurynevercomes"
            target="_blank"
            rel="noreferrer"
            className="quiet-link text-ivory"
          >
            the till is on GitHub
          </a>
          .
        </p>
      </section>

      {/* 家底：图录小注的同一套行款（Label: value），数字全是活的。
          「已守住」是访客自己的账，绿只在省钱侧出现——全站唯一的颜色 */}
      <section className="mt-20 border-t border-hairline px-6 pt-12 lg:px-0">
        <h2 className="font-lux text-lg text-ivory">The particulars</h2>
        <div className="mt-6 space-y-1 text-[10px] leading-relaxed">
          <p className="text-fog">
            Pieces in the collection: <span className="text-ivory">{PRODUCTS.length.toLocaleString('en-US')}</span>
          </p>
          <p className="text-fog">
            Houses under this roof: <span className="text-ivory">{MAISONS.length}</span>
          </p>
          <p className="text-fog">
            Paid here, ever, by anyone: <span className="font-price text-ivory">¥0.00</span>
          </p>
          <p className="text-fog">
            Parcels dispatched: <span className="text-ivory">0, a record we intend to defend</span>
          </p>
          <p className="text-fog">
            Kept safe for you so far:{' '}
            <span className="font-price font-semibold text-jade">{yuan(saved)}</span>
            {orders.length === 0 && <span> (the vault opens with your first order)</span>}
          </p>
        </div>
      </section>

      <EditorialImage
        src="/img/ed-atelier-2.jpg"
        alt="A row of hand tools hanging on the atelier's dark wall, each in its place"
        caption="Our atelier. The artisans are real, the craft is real, the delivery is fake."
      />

      <section className="mt-20 border-t border-hairline px-6 pt-12 lg:px-0">
        <h2 className="font-lux text-lg text-ivory">Image credits</h2>
        <p className="mt-5 max-w-xl text-[11px] leading-loose text-fog">
          The photography is of two kinds, and both are inspected by eye, one frame at a time: real photographs
          (Unsplash, CC0, CC BY / CC BY-SA) where a brand-free, catalogue-grade image exists, and images generated
          with Flux where none does. No readable brand mark may appear in either. Pieces still waiting for their
          sitting show an auction catalogue placard instead, because even a placeholder deserves some poise.
          The photographs requiring attribution are listed below; nothing generated requires any.
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
        <p className="mt-8 max-w-xl text-[9px] leading-loose text-fog">{UNSPLASH_NOTE}</p>
      </section>

      {/* 法务小字层级：本店的签名就藏在最小号字里 */}
      <section className="mt-20 border-t border-hairline px-6 pt-12 lg:px-0">
        <p className="max-w-xl text-[8px] leading-loose text-fog">
          This site is an entertainment and emotional self-help tool, not a real store. All products, prices, sales
          figures, reviews, ateliers, and butlers are fictional, with no affiliation with or authorization from any
          real luxury brand; product names are category descriptions. We take no payment, no shipping address, and
          collect no personal information whatsoever.
        </p>
        <p className="mt-4 max-w-xl text-[8px] leading-loose text-fog">{PRIVACY_FOOTER}</p>
      </section>
    </div>
  )
}
