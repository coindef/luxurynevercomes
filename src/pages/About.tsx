import { useNavigate } from 'react-router-dom'
import { IMAGE_CREDITS, UNSPLASH_NOTE } from '../lib/credits'
import { getProduct } from '../lib/products'
import { PRIVACY_FOOTER } from '../lib/copy'
import EditorialImage from '../components/EditorialImage'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="pb-20 lg:mx-auto lg:max-w-2xl">
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-hairline bg-ink/95 px-6 py-4 backdrop-blur">
        <button onClick={() => navigate(-1)} className="text-lg text-fog" aria-label="返回">
          ‹
        </button>
        <h1 className="font-lux text-base text-ivory">关于本店</h1>
      </header>

      {/* 无边框无面板：靠留白与发丝线分栏 */}
      <section className="px-6 pt-14">
        <p className="font-lux text-xl leading-relaxed text-ivory lg:text-2xl">富了个寂寞</p>
        <p className="mt-6 text-[11px] leading-loose text-fog">
          一个治愈「买不起」的模拟奢侈品殿堂：尽情认购铂金包、陀飞轮、游艇、小岛、算力集群——
          支付 ¥0.00，永不发货。多巴胺来自期待而非获得，对奢侈品，这个逻辑成立得最彻底。
          每一单的金额都会存入你的首付账本。
        </p>
        <p className="mt-5 text-[11px] leading-loose text-fog">
          姊妹站：
          <a
            href="https://github.com/coindef/parcelnevercomes"
            target="_blank"
            rel="noreferrer"
            className="quiet-link text-ivory"
          >
            买了个寂寞 · ParcelNeverComes
          </a>
          （日用百货版）。灵感致敬{' '}
          <a href="https://foodnevercomes.com" target="_blank" rel="noreferrer" className="quiet-link text-ivory">
            FoodNeverComes
          </a>
          。
        </p>
      </section>

      <EditorialImage
        src="/img/ed-atelier-2.jpg"
        alt="工坊暗墙上挂着一排手工具，各归各位"
        caption="本店工坊。工匠是真的，工序是真的，交付是假的。"
      />

      <section className="mt-20 border-t border-hairline px-6 pt-14">
        <h2 className="font-lux text-lg text-ivory">图片来源</h2>
        <p className="mt-5 text-[11px] leading-loose text-fog">
          商品图为真实无品牌照片，主要来自 Unsplash，另有部分 CC0 / CC BY 授权图源。
          每一张都经过逐张目检：画面里不得出现任何可读的品牌字标——找不到合格的，就不放图。
          未配图的藏品展示「拍卖图录展签」——连占位符都有排面。以下为需要署名的图片。
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
                ，{c.creator}，{c.license}
              </li>
            )
          })}
        </ul>
        <p className="mt-8 text-[9px] leading-loose text-fog">{UNSPLASH_NOTE}</p>
      </section>

      {/* 法务小字层级：本店的签名就藏在最小号字里 */}
      <section className="mt-20 border-t border-hairline px-6 pt-10">
        <p className="text-[8px] leading-loose text-fog">
          本站为娱乐与情绪自助工具，不是真实电商。所有商品、价格、销量、评价、工坊与管家均为虚构，
          与任何真实奢侈品牌无关联、无授权关系，商品名均为品类描述。不收款、不收货址、不收集任何个人信息。
        </p>
        <p className="mt-4 text-[8px] leading-loose text-fog">{PRIVACY_FOOTER}</p>
      </section>
    </div>
  )
}
