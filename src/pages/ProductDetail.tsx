import { useEffect, useMemo, useState } from 'react'
import { useMoney } from '../lib/currency'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Customization, CustomGroup, Product } from '../lib/types'
import { catLabel, getProduct } from '../lib/products'
import { maisonOf, productsOfMaison } from '../lib/maisons'
import { bespokeOffered, customFor, subtypeOf } from '../lib/bespoke'
import { IDENTITY_LABELS, referenceOf, specsOf } from '../lib/spec'
import { BESPOKE, MARQUEE_CITIES, REVIEWS, pick } from '../lib/copy'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductGallery from '../components/ProductGallery'
import ProductCard from '../components/ProductCard'
import ConciergeRow from '../components/Concierge'
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
    <div className="pointer-events-none fixed bottom-32 left-1/2 z-30 w-full max-w-[480px] -translate-x-1/2 px-6 lg:left-auto lg:right-[max(1.5rem,calc(50%-36rem))] lg:w-auto lg:max-w-sm lg:translate-x-0 lg:px-0">
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

  const selectedNote = value.split('·')[1]?.trim()

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
      {/* 尺码芯片只留数字，但那半句俏皮话是文案资产，不删——选中后作为从属小字浮出
          （Cartier 也是把「52 mm (US 6)」的注释放从属层级，不是塞在芯片里） */}
      {selectedNote && <p className="float-up mt-2.5 text-[9px] leading-relaxed text-fog">{selectedNote}</p>}
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
  const money = useMoney()
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
                      {c.surcharge > 0 ? `+${money(c.surcharge)}` : BESPOKE.baseTag}
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
                {/* 刻字免费是实测（Cartier / LV 热压 / Burberry 花押都不收钱）：
                    免费就写 complimentary，别写 +¥0.00——加价那笑点留给真加价的项 */}
                <span className="shrink-0 text-[8px] text-fog">
                  {(value[g.label] ?? '').length}/12,{' '}
                  {(g.choices?.[0]?.surcharge ?? 0) > 0 ? `+${money(g.choices?.[0]?.surcharge ?? 0)}` : 'complimentary'}
                </span>
              </div>
              <p className="mt-2 text-[8px] leading-relaxed text-fog">{BESPOKE.textHelper}</p>
              {/* 打样：LV/卡地亚的刻字配置器都给实时预览。字排出来，笑点才落地 */}
              {value[g.label] && (
                <div className="float-up mt-5">
                  <p className="text-[8px] tracking-wider text-fog">The proof</p>
                  <p className="font-lux mt-2 text-2xl italic leading-relaxed tracking-[0.2em] text-ivory">
                    {value[g.label]}
                  </p>
                  <p className="mt-2 text-[8px] leading-relaxed text-fog">
                    Set in the house italic, exactly as the master would strike it. He is ready. He will remain ready.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* 合计条：加价划掉，实付归零——归零那一刻是绿的 */}
      <div className="mt-8 flex items-baseline justify-between border-t border-hairline pt-5">
        <span className="text-[9px] text-fog">
          Bespoke surcharge total <span className="font-price text-fog line-through">+{money(surcharge)}</span>
        </span>
        <span className="font-price text-base font-semibold text-jade">Payable {money(0)}</span>
      </div>
      {complete && <p className="font-lux float-up mt-3 text-[10px] leading-relaxed text-jade">{BESPOKE.completeLine}</p>}
      <p className="mt-5 text-[8px] leading-relaxed text-fog">{BESPOKE.footnote}</p>
    </div>
  )
}

/**
 * Care 文案按子品类走。此前全站共用一段「远离阳光与海水」——
 * 对赛马、星系命名权和液冷机柜念同一段保养须知，正是「每件都一样」的余毒。
 * Hermès 自己站上两个商品的折叠区就不一样；Cartier 的动力储存栏 Santos 没有、Ballon Bleu 有。
 */
const CARE_BY_SUBTYPE: Record<string, string> = {
  bag: 'Feed the leather twice a year and keep it stuffed with tissue when resting. It will rest a great deal.',
  sla: 'Rotate your cards occasionally so the pockets wear evenly. Wear is unlikely, but rotation is dignified.',
  trunk: 'Wax the brass, air the interior each season, and never stack anything on top except another trunk.',
  watch: 'Wind it gently at the same hour each day. A serviced movement keeps time for a century, all of it spent waiting.',
  ring: 'Warm soapy water, a soft brush, and restraint. Remove it before gardening, which you were not going to do anyway.',
  necklace: 'Fasten the clasp before storing so the strand cannot knot. Restring every decade, whether worn or only wanted.',
  bracelet: 'Polish with the cloth provided. The cloth is real and will be dispatched with the same punctuality as everything else.',
  earrings: 'Store the pair apart from other pieces; diamonds scratch diamonds, and these know no equals.',
  brooch: 'Pin through two layers of cloth, never one. The second layer is for confidence.',
  stone: 'Keep it in its paper, in the dark. Stones have waited a hundred million years; the dark does not trouble them.',
  car: 'Start it monthly, drive it never, and keep the battery on a conditioner. Concours condition is easiest to maintain at zero kilometres.',
  moto: 'Keep the chain waxed and the tank full. Fuel does not go stale in a motorcycle that does not exist.',
  yacht: 'Haul out annually, antifoul, and re-oil the teak. The crew handles all of it, at the same rate as the delivery.',
  aircraft: 'Hangared, always. Hours are logged by the maintenance team, of which there are currently zero, logging zero hours.',
  home: 'A house wants living in. Failing that, it wants a housekeeper who opens the windows on Tuesdays. We have noted Tuesdays.',
  land: 'Walk the boundary once a year. The land needs nothing from you; the walking is for you.',
  gown: 'Hang on a padded hanger, never fold. Steam, never iron. Wear once, remember always.',
  outerwear: 'Rest it a day between wearings, brush along the nap, and let rain dry naturally. Cashmere forgives almost everything except hurry.',
  shoes: 'Cedar trees in, always. Polish with a little water and a lot of patience. Resole at the house, which will take approximately forever.',
  suit: 'Brush after wearing, press rarely, dry-clean almost never. Cloth outlives fashion when treated with indifference.',
  accessory: 'Fold along the original creases. Silk remembers everything, which is more than can be said for the courier.',
  wine: 'Cellar at 12 degrees, on its side, in the dark, undisturbed. In this respect it is living your ideal life.',
  spirit: 'Upright, out of the sun, and open it for occasions only. The occasion of it arriving does not count, as it will not occur.',
  food: 'Consume at its peak, which we have arranged to be permanent by never dispatching it.',
  painting: 'No direct sun, 50% humidity, and a dusting with a sable brush once a season. Do not clean it yourself; do not clean it at all.',
  sculpture: 'Wax the bronze annually. Patina is time made visible, and time is the one material we supply in quantity.',
  antiquity: 'Handle with cotton gloves, or better, do not handle it. It has survived everyone who ever did.',
  instrument: 'Keep it at 45 to 55 percent humidity and play it, or arrange for it to be played. Instruments die of silence, not of use.',
  compute: 'Dust the intakes, mind the dew point, and never speak of uptime aloud. The cluster is superstitious.',
  space: 'No maintenance is possible after launch. This is the only product here whose non-serviceability is industry standard.',
  robot: 'Wipe with a dry cloth. Do not thank it; gratitude confuses the routing tables.',
  animal: 'Turned out daily, shod every six weeks, and spoken to kindly. It will not know it is yours. It is not troubled by this.',
  venue: 'The seats are cleaned before every fixture and after every season. Your absence leaves them in showroom condition.',
  experience: 'No care required. Memories, unlike goods, improve with neglect.',
  naming: 'The register is acid-free and kept from the light. The name itself requires nothing, which suits it.',
}

const CARE_FALLBACK =
  'Keep away from direct sun, radiators and salt water. Have it seen by the house every five years. None of this will be necessary, but the instructions are real and we would rather you had them.'

export default function ProductDetail() {
  const money = useMoney()
  const { id } = useParams()
  const navigate = useNavigate()
  const product = getProduct(id ?? '')
  const { addToCart, saved, noteViewed, waitlist, joinWaitlist, leaveWaitlist } = useStore()
  const toast = useToast()
  const reviews = useMemo(() => [...REVIEWS].sort(() => 0.5 - Math.random()).slice(0, 2), [])
  const [custom, setCustom] = useState<Customization>({})

  // 看过即入档（真店的 Recently viewed）。只记 id，个性化全在本机
  useEffect(() => {
    if (product) noteViewed(product.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

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
  const subtype = subtypeOf(product)
  const groups = customFor(product)
  // 「唯一的那个决定」按声明取（role:'size'），不再从定价数据里猜——
  // 猜过一次，长裙猜成 Fit、红酒猜成 Format、西装一组都猜不出
  const sizeGroup =
    groups.find((g) => g.role === 'size') ??
    groups.find((g) => g.type === 'choice' && (g.choices ?? []).every((c) => c.surcharge === 0))
  const atelierGroups = groups.filter((g) => g !== sizeGroup)
  // 工坊只开放给约四成商品，配货旗舰一律不开放（真店越镇店的款越没得配，见 bespokeOffered）
  const atelierOpen = atelierGroups.length > 0 && bespokeOffered(product)

  // 同屋的另外几件：详情页原本是条死胡同，看完只能按返回。
  // 真店的每一页都把你送向下一页（Hermès 的「Keep exploring」、卡地亚的系列横条）
  const alsoFromHouse = productsOfMaison(maison.id)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

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
            <span className="font-price text-3xl font-semibold text-ivory lg:text-4xl">{money(product.price)}</span>
            {product.originalPrice && (
              <span className="font-price text-xs text-fog line-through">{money(product.originalPrice)}</span>
            )}
          </div>
          <p className="mt-2 text-[9px] text-fog">Tax included. The tax is also {money(0)}.</p>

          {/* 散文只讲来历与材质，数字全在下面的图录小注里——两者从不混排（Cartier 的写法） */}
          <p className="mt-6 max-w-md text-xs leading-loose text-fog">{product.description}</p>

          {/* 图录小注：紧跟散文（散文在上、数字在下，Cartier / Hermès 皆然）。
              这张表每件都不一样，是「每件都不同」的真正来源，所以它排在所有共用控件之前。
              首行是身份行，裸名词短语；其余行「Label: value」内联左对齐——
              原先的两端对齐键值网格，内容再不同，**形状**也永远相同 */}
          <div className="mt-8 max-w-md border-t border-hairline pt-6">
            <h2 className="font-lux text-xs text-ivory">Catalogue note</h2>
            <div className="mt-3 space-y-1 text-[10px] leading-relaxed">
              {specs.map((s) =>
                IDENTITY_LABELS.has(s.label) ? (
                  <p key={s.label} className="text-ivory">{s.value}</p>
                ) : (
                  <p key={s.label} className="text-fog">
                    {s.label}: <span className="text-ivory">{s.value}</span>
                  </p>
                ),
              )}
            </div>
          </div>

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
                  Earned <span className="font-price text-jade">{money(saved)}</span>
                </span>
                <span className="text-fog">
                  Threshold <span className="font-price text-ivory">{money(quota)}</span>
                </span>
              </div>
              <div className="mt-2 h-px w-full bg-hairline">
                <div className="h-px bg-jade transition-[width] duration-700" style={{ width: `${quotaPct}%` }} />
              </div>
              {!quotaMet && (
                <p className="mt-3 text-[9px] leading-relaxed text-fog">
                  <span className="font-price text-ivory">{money(quotaLeft)}</span> of quota to go. Every reservation is
                  recorded in your quota file (the same ledger as the down-payment book).
                </p>
              )}
              {/* 另一条队：等候名单（Birkin 的那条队，诚实版）。排位从 id 稳定散列，名单不动 */}
              {!quotaMet &&
                (waitlist[product.id] ? (
                  <p className="mt-5 text-[10px] leading-relaxed text-ivory">
                    On the waiting list, No. <span className="font-price">{waitlist[product.id].toLocaleString('en-US')}</span>.
                    <span className="text-fog"> The list does not move, so the position is yours for life.</span>{' '}
                    <button
                      onClick={() => {
                        leaveWaitlist(product.id)
                        toast('Struck from the list. The number will be kept empty in your honour.')
                      }}
                      className="quiet-link text-fog hover:text-ivory"
                    >
                      Leave the list
                    </button>
                  </p>
                ) : (
                  <button
                    onClick={() => {
                      const pos = joinWaitlist(product.id)
                      toast(`You are No. ${pos.toLocaleString('en-US')}. The list is long, still, and now partly yours.`)
                    }}
                    className="quiet-link mt-5 text-[10px] text-ivory"
                  >
                    Or join the waiting list
                  </button>
                ))}
            </div>
          )}

          {/* 礼宾那一排：心愿单 + 四个真流程（预约/大使/问价/找门店），见 Concierge.tsx */}
          <ConciergeRow product={product} />

          {/* 工坊不开放时给一句屋里的托词（真店的原话腔调是「a selection of creations, subject to feasibility」） */}
          {!atelierOpen && (
            <p className="mt-10 max-w-md text-[9px] leading-loose text-fog">
              Personalisation is offered on a selection of creations, subject to feasibility. This one is not among
              them. Feasibility is not the obstacle.
            </p>
          )}

          {/* 折叠区按商品拼装：有定制才有工坊，有尺码才有尺码表（Hermès 就是这么拼的） */}
          <div className="mt-12">
            {atelierOpen && (
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
                {(subtype && CARE_BY_SUBTYPE[subtype]) || CARE_FALLBACK}
              </p>
            </Accordion>
            <Accordion title="Delivery and returns">
              <p className="max-w-md text-[10px] leading-loose text-fog">
                {hasCustom ? (
                  // 刻了字就是 final sale——真店的个性化商品一律不退。
                  // 在一家什么都不存在的店里，唯一不可撤销的，是退回那份不存在的权利
                  <>
                    White-glove delivery, worldwide, at no charge. The butler departs on receipt of the order and does
                    not arrive. Personalised pieces are final sale: the one irreversible thing sold in this house is
                    your right to send the nothing back. You have just spent it. It cost ¥0.00.
                  </>
                ) : (
                  <>
                    White-glove delivery, worldwide, at no charge. The butler departs on receipt of the order and does
                    not arrive. Returns are accepted within 30 days, which is generous of us, given there is nothing to
                    send back. Nothing has ever been returned. Our satisfaction rate is therefore perfect.
                  </>
                )}
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

          {/* 好评压到与图录小注同级：它是个好笑话，但不该是页面上第二响的东西 */}
          <div className="mt-14 border-t border-hairline pt-8">
            <h2 className="font-lux text-xs text-ivory">Patron reviews</h2>
            <p className="mt-1 text-[9px] text-fog">100,000+ reviews</p>
            {reviews.map((r) => (
              <div key={r.text} className="mt-6">
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

      {/* 同屋的另外几件：把死胡同接回目录。真店的每一页都把你送向下一页 */}
      {alsoFromHouse.length > 0 && (
        <section className="mt-24 px-6 lg:mt-32 lg:px-0">
          <div className="flex items-baseline justify-between">
            <h2 className="font-lux text-lg text-ivory lg:text-2xl">More from {maison.name}</h2>
            <Link to={`/maison/${maison.id}`} className="quiet-link shrink-0 text-[10px] tracking-[0.15em] text-fog hover:text-ivory">
              The house
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
            {alsoFromHouse.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

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
              toast('Quota is the easiest threshold in retail. Start small, a card holder counts. It all counts, and it is all ¥0.00.')
              navigate('/collection?sort=price-asc')
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
