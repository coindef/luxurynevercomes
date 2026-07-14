import { useNavigate } from 'react-router-dom'
import { IMAGE_CREDITS } from '../lib/credits'
import { getProduct } from '../lib/products'
import { PRIVACY_FOOTER } from '../lib/copy'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="pb-10 lg:mx-auto lg:max-w-2xl">
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-hairline bg-ink/95 px-4 py-3.5 backdrop-blur">
        <button onClick={() => navigate(-1)} className="text-lg text-fog">‹</button>
        <h1 className="font-lux text-base text-ivory">关于本店</h1>
      </header>

      <section className="mx-4 mt-4 border border-hairline bg-panel p-5">
        <p className="tracking-maison text-[9px] text-gold">Maison Zéro</p>
        <p className="font-lux mt-2 text-base text-ivory">富了个寂寞 · LuxuryNeverComes</p>
        <p className="mt-3 text-[11px] leading-loose text-fog">
          一个治愈「买不起」的模拟奢侈品殿堂：尽情认购铂金包、陀飞轮、游艇、小岛、算力集群——
          支付 ¥0.00，永不发货。多巴胺来自期待而非获得，对奢侈品，这个逻辑成立得最彻底。
          每一单的金额都会存入你的首付账本。
        </p>
        <p className="mt-3 text-[11px] leading-loose text-fog">
          姊妹站：
          <a href="https://github.com/coindef/parcelnevercomes" target="_blank" rel="noreferrer" className="text-gold underline decoration-gold/40">
            买了个寂寞 · ParcelNeverComes
          </a>
          （日用百货版）。灵感致敬{' '}
          <a href="https://foodnevercomes.com" target="_blank" rel="noreferrer" className="text-gold underline decoration-gold/40">
            FoodNeverComes
          </a>
          。
        </p>
        <div className="mt-4 border border-gold/30 px-3.5 py-3 text-[10px] leading-loose text-fog">
          ⚖️ 本站为娱乐与情绪自助工具，不是真实电商。所有商品、价格、销量、评价、工坊与管家均为虚构，
          与任何真实奢侈品牌无关联、无授权关系，商品名均为品类描述。不收款、不收货址、不收集任何个人信息。
        </div>
      </section>

      <section className="mx-4 mt-4 border border-hairline bg-panel p-5">
        <h2 className="font-lux text-sm text-ivory">图片来源</h2>
        <p className="mt-2 text-[10px] leading-loose text-fog">
          商品图为真实无品牌照片，经 Openverse 检索并逐张核验授权：CC0 图源免署名；
          以下 CC BY / CC BY-SA 授权图片特此署名。未配图的藏品展示「拍卖图录展签」——连占位符都有排面。
        </p>
        <ul className="mt-3 max-h-72 space-y-1.5 overflow-y-auto pr-1">
          {IMAGE_CREDITS.map((c) => {
            const p = getProduct(c.productId)
            return (
              <li key={c.productId} className="border-b border-hairline pb-1.5 text-[9px] leading-relaxed text-fog">
                <span className="text-ivory/80">{p?.name ?? c.productId}</span>
                {' — '}
                <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="text-gold underline decoration-gold/30">
                  “{c.title.length > 30 ? `${c.title.slice(0, 30)}…` : c.title}”
                </a>
                ，{c.creator}，{c.license}
              </li>
            )
          })}
        </ul>
      </section>

      <p className="px-8 py-6 text-center text-[8px] leading-relaxed tracking-wider text-fog/60">{PRIVACY_FOOTER}</p>
    </div>
  )
}
