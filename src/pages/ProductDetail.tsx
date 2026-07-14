import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Customization, CustomGroup } from '../lib/types'
import { getProduct } from '../lib/products'
import { CATEGORY_CUSTOM } from '../lib/bespoke'
import { BESPOKE, MARQUEE_CITIES, REVIEWS, SERVICE_BAR, pick } from '../lib/copy'
import { yuan } from '../lib/format'
import { useSeckillCountdown } from '../lib/hooks'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductImage from '../components/ProductImage'

/** 认购低语：单条淡入淡出 */
function Whisper() {
  const [item, setItem] = useState<{ id: number; text: string } | null>(null)

  useEffect(() => {
    let n = 0
    const make = () => {
      n += 1
      const m = pick(MARQUEE_CITIES)
      setItem({ id: n, text: `${m.city}贵宾 · ${1 + Math.floor(Math.random() * 9)} 秒前 · 已纳入名下` })
    }
    make()
    const id = setInterval(make, 4200)
    return () => clearInterval(id)
  }, [])

  if (!item) return null
  return (
    <div className="pointer-events-none fixed bottom-32 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-4">
      <div key={item.id} className="whisper w-fit border border-hairline bg-black/70 px-3 py-1 text-[9px] tracking-wider text-fog">
        {item.text}
      </div>
    </div>
  )
}

/** 工坊定制区 */
function BespokeSection({
  groups,
  value,
  onChange,
}: {
  groups: CustomGroup[]
  value: Customization
  onChange: (v: Customization) => void
}) {
  const toast = useToast()

  const surcharge = groups.reduce((sum, g) => {
    const v = value[g.label]
    if (!v) return sum
    if (g.type === 'text') return sum + (g.choices?.[0]?.surcharge ?? 0)
    return sum + (g.choices?.find((c) => c.name === v)?.surcharge ?? 0)
  }, 0)
  const complete = groups.every((g) => value[g.label])

  return (
    <section className="mt-3 border-y border-gold/25 bg-panel px-4 py-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-lux text-sm text-gold">{BESPOKE.title}</h2>
        <span className="text-[9px] text-fog">{BESPOKE.subtitle}</span>
      </div>
      <p className="mt-1 text-[9px] leading-relaxed text-fog">{BESPOKE.intro}</p>

      {groups.map((g) => (
        <div key={g.label} className="mt-4">
          <p className="font-lux text-xs text-ivory/90">{g.label}</p>
          {g.type === 'choice' ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {g.choices?.map((c) => {
                const selected = value[g.label] === c.name
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      onChange({ ...value, [g.label]: c.name })
                      toast(`已登记：${c.name.split('·')[0].trim()}。工坊已知悉，工坊一如既往地平静。`)
                    }}
                    className={`border px-2.5 py-1.5 text-left text-[10px] leading-relaxed transition-colors ${
                      selected ? 'border-gold bg-ink text-gold' : 'border-hairline text-fog hover:border-gold/40'
                    }`}
                  >
                    {c.name}
                    <span className={`ml-1.5 text-[8px] ${selected ? 'text-goldlit' : 'text-fog/70'}`}>
                      {c.surcharge > 0 ? `+${yuan(c.surcharge)}` : BESPOKE.baseTag}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <input
                  value={value[g.label] ?? ''}
                  onChange={(e) => onChange({ ...value, [g.label]: e.target.value.slice(0, 12) })}
                  onBlur={() => {
                    const t = value[g.label]
                    if (t) toast(`「${t}」已交付镌刻部。老师傅看了一眼，说这几个字有故事。`)
                  }}
                  placeholder={g.placeholder}
                  className="min-w-0 flex-1 border border-hairline bg-ink px-3 py-2 text-xs text-ivory placeholder:text-fog/60 focus:border-gold/60 focus:outline-none"
                />
                <span className="shrink-0 text-[8px] text-fog">
                  {(value[g.label] ?? '').length}/12 · +{yuan(g.choices?.[0]?.surcharge ?? 0)}
                </span>
              </div>
              <p className="mt-1 text-[8px] leading-relaxed text-fog/80">{BESPOKE.textHelper}</p>
            </div>
          )}
        </div>
      ))}

      {/* 合计条 */}
      <div className="mt-4 flex items-baseline justify-between border-t border-hairline pt-3">
        <span className="text-[9px] text-fog">
          定制加价合计 <span className="font-price text-fog line-through">+{yuan(surcharge)}</span>
        </span>
        <span className="font-price text-sm font-semibold text-gold">实付 ¥0.00</span>
      </div>
      {complete && <p className="font-lux mt-2 text-[10px] leading-relaxed text-jade float-up">{BESPOKE.completeLine}</p>}
      <p className="mt-3 text-[8px] leading-relaxed text-fog/60">{BESPOKE.footnote}</p>
    </section>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id ?? '')
  const { addToCart } = useStore()
  const toast = useToast()
  const countdown = useSeckillCountdown()
  const reviews = useMemo(() => [...REVIEWS].sort(() => 0.5 - Math.random()).slice(0, 2), [])
  const [custom, setCustom] = useState<Customization>({})

  if (!product) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 text-fog">
        <span className="text-5xl">🖤</span>
        <p className="font-lux text-sm">这件藏品比其他藏品更不存在。</p>
        <Link to="/" className="text-sm text-gold">回殿堂 ›</Link>
      </div>
    )
  }

  const groups = CATEGORY_CUSTOM[product.category] ?? []
  const cleanCustom = Object.fromEntries(Object.entries(custom).filter(([, v]) => v))
  const hasCustom = Object.keys(cleanCustom).length > 0

  return (
    <div className="pb-24">
      {/* 大图区 */}
      <div className="relative">
        <ProductImage product={product} className="h-80 w-full" emojiClass="emoji-float text-[96px]" plaque />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center border border-hairline bg-black/50 text-ivory"
        >
          ‹
        </button>
        {/* 轮播小圆点：每张图一模一样（彩蛋） */}
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5" title="每张图都一样，反正也发不出去">
          <span className="h-1 w-4 bg-gold" />
          <span className="h-1 w-1 bg-ivory/40" />
          <span className="h-1 w-1 bg-ivory/40" />
        </div>
      </div>

      {/* 价格区 */}
      <div className="border-b border-hairline bg-panel px-4 py-3.5">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-price text-2xl font-semibold text-gold">{yuan(product.price)}</span>
            {product.originalPrice && (
              <span className="font-price text-xs text-fog line-through">{yuan(product.originalPrice)}</span>
            )}
            <span className="tracking-maison border border-gold/60 px-1.5 py-0.5 text-[8px] text-gold">Privé</span>
          </div>
          <span className="text-[9px] text-fog">通道 {countdown} 后关闭</span>
        </div>
        <p className="mt-1 text-[9px] text-fog">含税。税也是 ¥0.00。</p>
      </div>

      {/* 标题 */}
      <div className="px-4 py-3.5">
        <h1 className="font-lux text-base leading-relaxed text-ivory">{product.name}</h1>
        <p className="mt-1.5 text-xs leading-relaxed text-fog">{product.description}</p>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="border border-gold/50 px-1.5 py-0.5 text-[9px] tracking-wider text-gold">全球配额 3 件</span>
          <span className="text-[9px] text-fog">候补已排至第 847 位（队伍不动）</span>
          <span className="ml-auto text-[9px] text-fog">{product.sales}</span>
        </div>
      </div>

      {/* 工坊定制 */}
      {groups.length > 0 && <BespokeSection groups={groups} value={custom} onChange={setCustom} />}

      {/* 服务保障 */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 border-b border-hairline px-4 py-3 text-[9px] text-fog">
        {SERVICE_BAR.map((s) => (
          <span key={s}>
            <span className="mr-1 text-gold">✓</span>
            {s}
          </span>
        ))}
      </div>

      {/* 贵宾好评 */}
      <div className="px-4 py-4">
        <div className="flex items-baseline justify-between">
          <h2 className="font-lux text-sm text-ivory">贵宾好评</h2>
          <span className="text-[9px] text-fog">10万+ 条 ›</span>
        </div>
        {reviews.map((r) => (
          <div key={r.text} className="mt-3 border-t border-hairline pt-3">
            <div className="flex items-center gap-2 text-[9px] text-fog">
              <span className="flex h-5 w-5 items-center justify-center border border-hairline">🎩</span>
              {r.user}
              <span className="text-gold">{'★'.repeat(r.stars)}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ivory/80">{r.text}</p>
          </div>
        ))}
      </div>

      <p className="px-4 pb-4 text-center text-[8px] tracking-widest text-fog/60">
        以下无更多内容 —— 留白也是奢侈的一部分
      </p>

      <Whisper />

      {/* 吸底操作栏 */}
      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 items-stretch gap-2 border-t border-hairline bg-ink px-3 py-2.5">
        <button
          onClick={() => {
            addToCart(product.id, 1, hasCustom ? cleanCustom : undefined)
            toast(hasCustom ? '已连同定制档案纳入珍藏。' : '已纳入珍藏。柜姐为您留着，一直留着。')
          }}
          className="flex-1 border border-gold/60 py-3 text-sm tracking-widest text-gold"
        >
          加入珍藏
        </button>
        <button
          onClick={() => {
            addToCart(product.id, 1, hasCustom ? cleanCustom : undefined)
            navigate('/checkout')
          }}
          className="gold-cta flex-1 border border-gold bg-gradient-to-r from-[#2a2418] to-[#1c1a14] py-3 text-center text-sm font-semibold tracking-widest text-goldlit"
        >
          即刻纳入名下
        </button>
      </div>
    </div>
  )
}
