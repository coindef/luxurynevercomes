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

/** 认购低语：单条淡入淡出（浮层用固定 hex） */
function Whisper() {
  const [item, setItem] = useState<{ id: number; text: string } | null>(null)

  useEffect(() => {
    let n = 0
    const make = () => {
      n += 1
      const m = pick(MARQUEE_CITIES)
      setItem({ id: n, text: `${m.city} patron just claimed one, ${1 + Math.floor(Math.random() * 9)} seconds ago` })
    }
    make()
    const id = setInterval(make, 4200)
    return () => clearInterval(id)
  }, [])

  if (!item) return null
  return (
    <div className="pointer-events-none fixed bottom-32 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-6">
      <div key={item.id} className="whisper w-fit bg-[#111111]/85 px-3 py-1.5 text-[9px] tracking-wider text-[#e8e8e8]">
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
    <section className="mt-12 border-t border-hairline px-6 pt-10">
      <h2 className="font-lux text-lg text-ivory">{BESPOKE.title}</h2>
      <p className="mt-1.5 text-[10px] text-fog">{BESPOKE.subtitle}</p>
      <p className="mt-4 max-w-md text-[10px] leading-loose text-fog">{BESPOKE.intro}</p>

      {groups.map((g) => (
        <div key={g.label} className="mt-8">
          <p className="font-lux text-xs text-ivory">{g.label}</p>
          {g.type === 'choice' ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {g.choices?.map((c) => {
                const selected = value[g.label] === c.name
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      onChange({ ...value, [g.label]: c.name })
                      toast(`Noted: ${c.name.split('·')[0].trim()}. The workshop has been informed. The workshop remains, as ever, calm.`)
                    }}
                    className={`border px-3 py-2 text-left text-[10px] leading-relaxed transition-colors ${
                      selected ? 'border-ivory text-ivory' : 'border-hairline text-fog hover:border-ivory/40'
                    }`}
                  >
                    {c.name}
                    <span className={`ml-1.5 text-[8px] ${selected ? 'text-ivory' : 'text-fog'}`}>
                      {c.surcharge > 0 ? `+${yuan(c.surcharge)}` : BESPOKE.baseTag}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-3">
              <div className="flex items-center gap-3">
                <input
                  value={value[g.label] ?? ''}
                  onChange={(e) => onChange({ ...value, [g.label]: e.target.value.slice(0, 12) })}
                  onBlur={() => {
                    const t = value[g.label]
                    if (t) toast(`"${t}" sent to the engraving department. The old master glanced at it and said these words have a story.`)
                  }}
                  placeholder={g.placeholder}
                  className="min-w-0 flex-1 border-b border-hairline bg-transparent px-1 py-2.5 text-xs text-ivory placeholder:text-fog focus:border-ivory focus:outline-none"
                />
                <span className="shrink-0 text-[8px] text-fog">
                  {(value[g.label] ?? '').length}/12, +{yuan(g.choices?.[0]?.surcharge ?? 0)}
                </span>
              </div>
              <p className="mt-2 text-[8px] leading-relaxed text-fog">{BESPOKE.textHelper}</p>
            </div>
          )}
        </div>
      ))}

      {/* 合计条：加价划掉，实付归零——归零那一刻是绿的 */}
      <div className="mt-10 flex items-baseline justify-between border-t border-hairline pt-5">
        <span className="text-[9px] text-fog">
          Bespoke surcharge total <span className="font-price text-fog line-through">+{yuan(surcharge)}</span>
        </span>
        <span className="font-price text-base font-semibold text-jade">Payable ¥0.00</span>
      </div>
      {complete && <p className="font-lux float-up mt-3 text-[10px] leading-relaxed text-jade">{BESPOKE.completeLine}</p>}
      <p className="mt-5 text-[8px] leading-relaxed text-fog">{BESPOKE.footnote}</p>
    </section>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id ?? '')
  const { addToCart, saved } = useStore()
  const toast = useToast()
  const countdown = useSeckillCountdown()
  const reviews = useMemo(() => [...REVIEWS].sort(() => 0.5 - Math.random()).slice(0, 2), [])
  const [custom, setCustom] = useState<Customization>({})

  if (!product) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-fog">
        <p className="font-lux text-sm text-ivory">This piece is even less in existence than the others.</p>
        <Link to="/" className="quiet-link text-xs text-ivory">
          Back to the hall
        </Link>
      </div>
    )
  }

  const groups = CATEGORY_CUSTOM[product.category] ?? []
  const cleanCustom = Object.fromEntries(Object.entries(custom).filter(([, v]) => v))
  const hasCustom = Object.keys(cleanCustom).length > 0

  // 配货门控：需累计守住达门槛才解锁认购资格（saved 即配货台账）
  const quota = product.quota ?? 0
  const needsQuota = quota > 0
  const quotaMet = !needsQuota || saved >= quota
  const quotaLeft = Math.max(0, quota - saved)
  const quotaPct = needsQuota ? Math.min(100, Math.round((saved / quota) * 100)) : 100

  return (
    <div className="pb-28 lg:mx-auto lg:max-w-6xl lg:px-6 lg:pb-32 lg:pt-12">
      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
        {/* 大图区：藏品先声夺人 */}
        <div className="relative lg:sticky lg:top-24">
          <ProductImage
            product={product}
            className="h-[58vh] w-full lg:h-[680px]"
            emojiClass="emoji-float text-[96px]"
            plaque
          />
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-black/35 text-white backdrop-blur-sm"
            aria-label="Back"
          >
            ‹
          </button>
          {/* 轮播小圆点：每张图一模一样（彩蛋） */}
          <div
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5"
            title="Every image is identical. It never ships anyway."
          >
            <span className="h-1 w-4 bg-white" />
            <span className="h-1 w-1 bg-white/50" />
            <span className="h-1 w-1 bg-white/50" />
          </div>
        </div>

        <div className="lg:pt-4">
          {/* 品名与价格：价格是主角 */}
          <div className="px-6 pt-10 lg:pt-0">
            <h1 className="font-lux text-xl leading-relaxed text-ivory lg:text-3xl">{product.name}</h1>
            <p className="mt-3 max-w-md text-xs leading-loose text-fog">{product.description}</p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="font-price text-3xl font-semibold text-ivory lg:text-4xl">{yuan(product.price)}</span>
              {product.originalPrice && (
                <span className="font-price text-xs text-fog line-through">{yuan(product.originalPrice)}</span>
              )}
            </div>
            <p className="mt-2 text-[9px] text-fog">Tax included. The tax is also ¥0.00.</p>

            <div className="mt-8 space-y-1.5 text-[9px] leading-relaxed text-fog">
              <p>Global allocation: 3 pieces. Waitlist now at position 847 (the line does not move).</p>
              <p>Reservation window closes in {countdown}</p>
              <p>{product.sales}</p>
            </div>

            {/* 配货门槛：热门款需先有购买记录才有认购资格 */}
            {needsQuota && (
              <div className="mt-10 border-t border-hairline pt-6">
                <p className="font-lux text-xs text-ivory">Open only to patrons who have met their quota</p>
                <p className="mt-2 text-[10px] leading-loose text-fog">
                  Coveted pieces cannot be reserved directly. You must first accumulate quota, which means reserving a few other things first.
                  {quotaMet ? ' You have met the threshold. Claim it now.' : ' No rush. Quota, like everything else, is ¥0.00.'}
                </p>
                <div className="mt-5 flex items-baseline justify-between text-[10px]">
                  <span className="text-fog">
                    Earned <span className="font-price text-jade">{yuan(saved)}</span>
                  </span>
                  <span className="text-fog">
                    Threshold <span className="font-price text-ivory">{yuan(quota)}</span>
                  </span>
                </div>
                {/* 极细进度线：绿是「正在积累」的正向信号，非粗底填充条 */}
                <div className="mt-2 h-px w-full bg-hairline">
                  <div className="h-px bg-jade transition-[width] duration-700" style={{ width: `${quotaPct}%` }} />
                </div>
                {!quotaMet && (
                  <p className="mt-3 text-[9px] leading-relaxed text-fog">
                    <span className="font-price text-ivory">{yuan(quotaLeft)}</span> of quota to go.
                    Every reservation is recorded in your quota file (the same ledger as the down-payment book).
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 工坊定制 */}
          {groups.length > 0 && <BespokeSection groups={groups} value={custom} onChange={setCustom} />}

          {/* 服务保障 */}
          <div className="mt-12 flex flex-wrap gap-x-5 gap-y-2 border-t border-hairline px-6 pt-8 text-[9px] text-fog">
            {SERVICE_BAR.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>

          {/* 贵宾好评 */}
          <div className="mt-12 px-6">
            <h2 className="font-lux text-lg text-ivory">Patron Reviews</h2>
            <p className="mt-1.5 text-[10px] text-fog">100,000+ reviews</p>
            {reviews.map((r) => (
              <div key={r.text} className="mt-8">
                <div className="flex items-center gap-2 text-[9px] text-fog">
                  <span>{r.user}</span>
                  <span className="text-ivory">{'★'.repeat(r.stars)}</span>
                </div>
                <p className="mt-2 max-w-md text-xs leading-loose text-ivory">{r.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-16 px-6 text-[8px] leading-relaxed text-fog">Nothing further below. White space is part of the luxury too.</p>
        </div>
      </div>

      <Whisper />

      {/* 吸底操作栏 */}
      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-[480px] -translate-x-1/2 items-stretch gap-2 border-t border-hairline bg-ink px-4 py-3 lg:max-w-none lg:justify-end lg:gap-3 lg:px-[max(1.5rem,calc(50%-36rem))] lg:py-4">
        <button
          onClick={() => {
            addToCart(product.id, 1, hasCustom ? cleanCustom : undefined)
            toast(hasCustom ? 'Added to your reserve, bespoke file and all.' : 'Added to your reserve. The salon associate is keeping it for you, and will keep it, always.')
          }}
          className="flex-1 border border-ivory py-3.5 text-xs tracking-[0.2em] text-ivory transition-colors hover:bg-ivory/5 lg:w-56 lg:flex-none"
        >
          Add to Reserve
        </button>
        {quotaMet ? (
          <button
            onClick={() => {
              addToCart(product.id, 1, hasCustom ? cleanCustom : undefined)
              navigate('/checkout')
            }}
            className="gold-cta flex-1 py-3.5 text-center text-xs font-semibold tracking-[0.2em] lg:w-56 lg:flex-none"
          >
            Claim it now
          </button>
        ) : (
          <button
            onClick={() => {
              toast('Quota is the only threshold, and the easiest one to cross. Go reserve something else. It all counts, and it is all ¥0.00.')
              navigate('/')
            }}
            className="gold-cta flex-1 py-3.5 text-center text-xs font-semibold tracking-[0.2em] lg:w-56 lg:flex-none"
          >
            Go earn quota
          </button>
        )}
      </div>
    </div>
  )
}
