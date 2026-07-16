import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Customization, CustomGroup, Product } from '../lib/types'
import { catLabel, getProduct } from '../lib/products'
import { maisonOf } from '../lib/maisons'
import { customFor } from '../lib/bespoke'
import { referenceOf, specsOf } from '../lib/spec'
import { BESPOKE, MARQUEE_CITIES, REVIEWS, pick } from '../lib/copy'
import { yuan } from '../lib/format'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductGallery from '../components/ProductGallery'
import Accordion from '../components/Accordion'

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

/**
 * 这件商品「唯一的那个决定」。
 *
 * 实测六家真店：一个商品详情页的决策数是 0-3，**众数是 1，就是尺寸**。
 * 颜色/材质从来不是选项——那是另一个商品、另一个编号。
 * Cartier 的尺寸选择器还逐尺寸标可用性（「15 cm - Notify when available」），
 * 这行字放在一家什么都不发货的店里，是全站最诚实的一句。
 */
function SizeChoice({
  group,
  value,
  onChange,
  product,
}: {
  group: CustomGroup
  value: string
  onChange: (v: string) => void
  product: Product
}) {
  const toast = useToast()
  // 稳定地让其中一个尺码「缺货」：同一件商品永远缺同一个码
  const outIdx = useMemo(() => {
    let h = 0
    for (let i = 0; i < product.id.length; i++) h = (h * 31 + product.id.charCodeAt(i)) >>> 0
    return h % ((group.choices?.length ?? 1) + 2) // 多数商品全码齐，少数缺一个
  }, [product.id, group.choices])

  return (
    <div className="mt-10">
      <div className="flex items-baseline justify-between">
        <p className="font-lux text-xs text-ivory">{group.label.split('·')[0].trim()}</p>
        {value && <p className="text-[10px] text-fog">{value.split('·')[0].trim()}</p>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {group.choices?.map((c, i) => {
          const out = i === outIdx
          const selected = value === c.name
          return (
            <button
              key={c.name}
              onClick={() =>
                out
                  ? toast('Noted. You will be told the moment it is back, which is the moment after this one, forever.')
                  : onChange(c.name)
              }
              className={`border px-3 py-2 text-left text-[10px] leading-relaxed transition-colors ${
                selected ? 'border-ivory text-ivory' : 'border-hairline text-fog hover:border-ivory/40'
              }`}
            >
              {c.name.split('·')[0].trim()}
              {out && <span className="ml-1.5 text-[8px] text-fog">Notify when available</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** 工坊定制：从「一整面选项墙」降级成折叠区里的可选项（真店的个性化也是单独一步，不是主线） */
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
    <div>
      <p className="max-w-md text-[10px] leading-loose text-fog">{BESPOKE.intro}</p>

      {groups.map((g) => (
        <div key={g.label} className="mt-7">
          <p className="font-lux text-[11px] text-ivory">{g.label}</p>
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
      <div className="mt-8 flex items-baseline justify-between border-t border-hairline pt-5">
        <span className="text-[9px] text-fog">
          Bespoke surcharge total <span className="font-price text-fog line-through">+{yuan(surcharge)}</span>
        </span>
        <span className="font-price text-base font-semibold text-jade">Payable ¥0.00</span>
      </div>
      {complete && <p className="font-lux float-up mt-3 text-[10px] leading-relaxed text-jade">{BESPOKE.completeLine}</p>}
      <p className="mt-5 text-[8px] leading-relaxed text-fog">{BESPOKE.footnote}</p>
    </div>
  )
}

/**
 * 只把人引向人的那一排。真店的 CTA 很深（Cartier 商品页有八个：Add to Bag / Add to Wish List /
 * Request Price / NOTIFY ME / Contact an ambassador / Book an Appointment / Order by Phone /
 * Find in Boutique），因为这单本来就不指望在线上成交——只有一个是买，其余都是把你交给一个人。
 * 一家永远不发货的店，正该把这排照抄。
 */
const HUMAN_CTAS: { label: string; reply: string }[] = [
  { label: 'Contact an ambassador', reply: 'The ambassador has read your message on a silver tray. He sends his regards, and nothing else.' },
  { label: 'Book an appointment', reply: 'Booked. The salon is expecting you on a date we have not chosen, at an address we do not have.' },
  { label: 'Find in boutique', reply: 'Available in 0 boutiques worldwide. Reassuringly, it is equally unavailable in all of them.' },
  { label: 'Request price', reply: 'The price is on this page. It is ¥0.00. We are nonetheless happy to confirm it by telephone.' },
]

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id ?? '')
  const { addToCart, saved } = useStore()
  const toast = useToast()
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

  const maison = maisonOf(product)
  const groups = customFor(product)
  // 规格组（全组不加价）= 尺寸，提到正文里当「唯一的那个决定」；
  // 其余（材质/五金/刻字）收进「工坊」折叠区——真店的个性化是单独一步，不是首屏一面墙
  const sizeGroup = groups.find((g) => g.type === 'choice' && (g.choices ?? []).every((c) => c.surcharge === 0))
  const atelierGroups = groups.filter((g) => g !== sizeGroup)

  // 选择器一旦让你挑某个尺寸，规格表就不能再断言它：项链的规格写「长度 45cm」、
  // 选择器又给你 40/45/60/90 选——挑了 60，这一页就自己打自己的脸。谁给选，谁拥有这个字段。
  const sizeLabel = sizeGroup?.label.split('·')[0].trim().toLowerCase()
  const specs = specsOf(product).filter((s) => s.label.toLowerCase() !== sizeLabel)

  const cleanCustom = Object.fromEntries(Object.entries(custom).filter(([, v]) => v))
  const hasCustom = Object.keys(cleanCustom).length > 0

  // 配货门控：需累计守住达门槛才解锁认购资格（saved 即配货台账）。
  // 真店确有此事：LV 的 Neverfull 把「Place in Cart」换成了「Notify Me」，排队 2-3 个月，
  // 拿到名额后 24 小时内必须去店里完成——我们只是把它诚实地做完。
  const quota = product.quota ?? 0
  const needsQuota = quota > 0
  const quotaMet = !needsQuota || saved >= quota
  const quotaLeft = Math.max(0, quota - saved)
  const quotaPct = needsQuota ? Math.min(100, Math.round((saved / quota) * 100)) : 100

  return (
    <div className="pb-28 lg:mx-auto lg:max-w-6xl lg:px-6 lg:pb-32">
      {/* 面包屑：真店近乎人人都有，斜杠分隔（Cartier「Home / Jewelry / All Collections」） */}
      <nav aria-label="Breadcrumb" className="px-6 pt-6 text-[10px] text-fog lg:px-0 lg:pt-8">
        <Link to="/" className="hover:text-ivory">
          Home
        </Link>
        <span aria-hidden="true" className="px-1.5">/</span>
        <Link to="/collection" className="hover:text-ivory">
          The Collection
        </Link>
        <span aria-hidden="true" className="px-1.5">/</span>
        <Link to={`/collection?cat=${encodeURIComponent(product.category)}`} className="hover:text-ivory">
          {catLabel(product.category)}
        </Link>
      </nav>

      <div className="mt-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="relative lg:sticky lg:top-24">
          <ProductGallery product={product} />
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 z-10 flex h-9 w-9 items-center justify-center bg-black/35 text-white backdrop-blur-sm lg:hidden"
            aria-label="Back"
          >
            ‹
          </button>
        </div>

        <div className="px-6 pt-10 lg:px-0 lg:pt-0">
          {/* 屋号在品名之上：真店的卡片与详情页都是「品牌 → 品名 → 价格」 */}
          <Link to={`/maison/${maison.id}`} className="text-[10px] text-fog transition-colors hover:text-ivory">
            {maison.name}
          </Link>
          <h1 className="font-lux mt-2 text-xl leading-relaxed text-ivory lg:text-3xl">{product.name}</h1>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-price text-3xl font-semibold text-ivory lg:text-4xl">{yuan(product.price)}</span>
            {product.originalPrice && (
              <span className="font-price text-xs text-fog line-through">{yuan(product.originalPrice)}</span>
            )}
          </div>
          <p className="mt-2 text-[9px] text-fog">Tax included. The tax is also ¥0.00.</p>

          {/* 散文只讲来历与材质，数字全在下面的规格表里——两者从不混排（Cartier 的写法） */}
          <p className="mt-6 max-w-md text-xs leading-loose text-fog">{product.description}</p>

          {/* 唯一的那个决定 */}
          {sizeGroup && (
            <SizeChoice
              group={sizeGroup}
              product={product}
              value={custom[sizeGroup.label] ?? ''}
              onChange={(v) => setCustom({ ...custom, [sizeGroup.label]: v })}
            />
          )}

          {/* 配货门槛 */}
          {needsQuota && (
            <div className="mt-10 border-t border-hairline pt-6">
              <p className="font-lux text-xs text-ivory">Open only to patrons who have met their quota</p>
              <p className="mt-2 max-w-md text-[10px] leading-loose text-fog">
                Coveted pieces cannot be reserved directly. You must first accumulate quota, which means reserving a few
                other things first.
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
              <div className="mt-2 h-px w-full bg-hairline">
                <div className="h-px bg-jade transition-[width] duration-700" style={{ width: `${quotaPct}%` }} />
              </div>
              {!quotaMet && (
                <p className="mt-3 text-[9px] leading-relaxed text-fog">
                  <span className="font-price text-ivory">{yuan(quotaLeft)}</span> of quota to go. Every reservation is
                  recorded in your quota file (the same ledger as the down-payment book).
                </p>
              )}
            </div>
          )}

          {/* 把人交给人的那一排 */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {HUMAN_CTAS.map((c) => (
              <button key={c.label} onClick={() => toast(c.reply)} className="quiet-link text-[10px] text-ivory">
                {c.label}
              </button>
            ))}
          </div>

          {/* 规格表：数字都在这儿。每件商品的这张表都不一样，这才是「每件都不同」的来源 */}
          <div className="mt-12 border-t border-hairline pt-8">
            <h2 className="font-lux text-xs text-ivory">Specifications</h2>
            <dl className="mt-4 max-w-md">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 py-1.5 text-[10px] leading-relaxed">
                  <dt className="shrink-0 text-fog">{s.label}</dt>
                  <dd className="text-right text-ivory">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* 折叠区按商品拼装：有定制才有工坊，有尺码才有尺码表（Hermès 就是这么拼的） */}
          <div className="mt-10">
            {atelierGroups.length > 0 && (
              // BESPOKE.title 是「Bespoke Atelier · BESPOKE」，把 bespoke 说了两遍
              <Accordion title="Bespoke atelier">
                <BespokeSection groups={atelierGroups} value={custom} onChange={setCustom} />
              </Accordion>
            )}
            {sizeGroup && (
              <Accordion title="Sizing guide">
                <p className="max-w-md text-[10px] leading-loose text-fog">
                  Measure the one you already own and match it. If you own none, choose the size you would like to be
                  the sort of person who owns. Both methods have the same accuracy here, since nothing is dispatched
                  against either.
                </p>
              </Accordion>
            )}
            <Accordion title="Care">
              <p className="max-w-md text-[10px] leading-loose text-fog">
                Keep away from direct sun, radiators and salt water. Have it seen by the house every five years. None of
                this will be necessary, but the instructions are real and we would rather you had them.
              </p>
            </Accordion>
            <Accordion title="Delivery and returns">
              <p className="max-w-md text-[10px] leading-loose text-fog">
                White-glove delivery, worldwide, at no charge. The butler departs on receipt of the order and does not
                arrive. Returns are accepted within 30 days, which is generous of us, given there is nothing to send
                back. Nothing has ever been returned. Our satisfaction rate is therefore perfect.
              </p>
            </Accordion>
            <Accordion title="Gifting">
              <p className="max-w-md text-[10px] leading-loose text-fog">
                Presented in the house box, satin ribbon tied by hand, wax seal, and a card in the hand of someone with
                better handwriting than either of us. The box is the only part of this that has ever existed, and even
                it is a description.
              </p>
            </Accordion>
            <Accordion title="The story behind">
              <p className="max-w-md text-[10px] leading-loose text-fog">
                {maison.story}{' '}
                <Link to={`/maison/${maison.id}`} className="quiet-link text-ivory">
                  Discover {maison.name}
                </Link>
              </p>
            </Accordion>
          </div>

          {/* 编号：不解释、不补零、放在最底下（Cartier 把「Ref. B6067517」印在分享按钮下面） */}
          <p className="mt-8 text-[9px] text-fog">Ref. {referenceOf(product)}</p>

          <div className="mt-14 border-t border-hairline pt-10">
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
