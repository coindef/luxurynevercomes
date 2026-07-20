import { useEffect, useMemo, useState } from 'react'
import { useMoney } from '../lib/currency'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, getProduct, viewsOf } from '../lib/products'
import { MARQUEE_CITIES, SEARCH_PLACEHOLDERS, SLOGAN, SUB_SLOGAN, pick } from '../lib/copy'
import { MAISONS, maisonOf } from '../lib/maisons'
import { bespokeOffered } from '../lib/bespoke'
import { colourwayOf, materialOf } from '../lib/spec'
import { useRotating, useSeckillCountdown } from '../lib/hooks'
import { useStore } from '../lib/store'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'
import EditorialImage from '../components/EditorialImage'

const WELCOME_KEY = 'flgj.welcomed'

/** Salon showcase: the dearest photographed piece per category, so the strip is all real photos. */
const SHOWCASE_IDS = [
  'lx-superyacht-76',
  'lx-himalaya-croc',
  'lx-lily-corner',
  'lx-emerald-garden',
  'lx-vintage-racer',
  'lx-bridal-couture',
]

/** Collection preview: twelve photographed pieces spanning categories (the full grid lives at /collection). */
const FEATURED_IDS = [
  'lx-croc-birkin',
  'lx-d-flawless',
  'lx-v12-coupe',
  'lx-gigayacht-110',
  'lx-skyflat-duplex',
  'lx-gpu-cluster',
  'lx-triple-crown-colt',
  'lx-single-cask-70',
  'lx-imperial-dragon-robe',
  'lx-postimpressionist-study',
  'lx-croc-cardcase',
  'lx-royal-sapphire',
]

/**
 * 今日沙龙：按日期播种的轮换。此前是写死的六件——「Today's Salon」名不副实，
 * 回头客每天看到同一面墙。现在每天午夜换展：每个品类取最贵的八件有照片的，
 * 按「日期+品类」稳定抽一件，再抽六个品类上墙。确定性的：同一天所有人看到同一面墙。
 */
function dailySalon() {
  const d = new Date()
  const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  const h = (s: string) => {
    let x = 0
    for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0
    return x
  }
  const picks = CATEGORIES.map((c) => {
    const pool = PRODUCTS.filter((p) => p.category === c.name && viewsOf(p).length > 0)
      .sort((a, b) => b.price - a.price)
      .slice(0, 8)
    return pool.length ? pool[h(key + c.name) % pool.length] : null
  }).filter((p) => p !== null)
  return picks.sort((a, b) => h(key + a.id) - h(key + b.id)).slice(0, 6)
}

/** 工坊开着的展示件：优先从首页已亮相的藏品里挑，保证「Book the atelier」说到做到 */
const atelierPieceId =
  [...SHOWCASE_IDS, ...FEATURED_IDS].map(getProduct).find((p) => p && bespokeOffered(p))?.id ??
  PRODUCTS.find((p) => bespokeOffered(p))?.id ??
  SHOWCASE_IDS[0]

/** Black-card ritual (the only dark moment on the site; fixed hex, silver not gold foil). */
function BlackCardModal({ onClose }: { onClose: () => void }) {
  const [opened, setOpened] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-8">
      <div className="pop-in w-full max-w-80 bg-white">
        {opened ? (
          <div className="float-up p-10">
            <p className="font-price text-5xl font-normal text-ivory">∞</p>
            <p className="font-lux mt-6 text-sm leading-loose text-ivory">
              Esteemed patron: your black card is active.
              <br />
              Limit: none. Valid: forever.
            </p>
            <p className="mt-3 text-[10px] leading-relaxed text-fog">Accepted here. Not that checkout will need it.</p>
            <button onClick={onClose} className="gold-cta mt-8 w-full py-3.5 text-xs tracking-[0.2em]">
              Take it, look around
            </button>
          </div>
        ) : (
          <div className="p-10">
            <div className="mb-8 flex h-32 w-full flex-col justify-end bg-[#141414] p-4 text-left">
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#c9c9c9]">Carte Noire</p>
              <p className="font-price mt-1 text-[11px] text-[#8f8f8f]">**** **** **** 0000</p>
            </div>
            <p className="font-lux text-sm text-ivory">A black card, prepared for you</p>
            <button onClick={() => setOpened(true)} className="gold-cta mt-6 w-full py-3.5 text-xs tracking-[0.2em]">
              Activate
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/** Live subscription ticker, one quiet rotating line. `tone` styles it for light or dark ground. */
function Ticker({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const lines = useMemo(
    () =>
      Array.from({ length: 8 }, () => {
        const m = pick(MARQUEE_CITIES)
        const p = pick([...PRODUCTS])
        const sec = 2 + Math.floor(Math.random() * 9)
        return `A patron in ${m.city} claimed ${p.name} at ${m.spot}, ${sec}s ago`
      }),
    [],
  )
  const line = useRotating(lines, 3400)
  return (
    <p className={`truncate text-[10px] leading-relaxed ${tone === 'light' ? 'text-white/60' : 'text-fog'}`}>
      <span key={line} className="float-up inline-block max-w-full truncate align-bottom">
        {line}
      </span>
    </p>
  )
}

/** Today's Salon: a tight showcase of photographed flagships. */
function SalonPrive() {
  const money = useMoney()
  const countdown = useSeckillCountdown()
  const items = dailySalon()

  return (
    <section className="mt-24 lg:mt-40">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-lux text-2xl text-ivory lg:text-4xl">Today's Salon</h2>
        <p className="mt-4 max-w-md text-[11px] leading-loose text-fog">
          The booking window closes in <span className="font-price text-ivory">{countdown}</span>. Every refresh, we
          quietly reserve it for you again. The wall is rehung at midnight.
        </p>
      </div>
      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [-webkit-overflow-scrolling:touch] lg:mx-auto lg:mt-16 lg:grid lg:max-w-6xl lg:grid-cols-3 lg:gap-14 lg:overflow-visible">
        {items.map((p) => (
          <Link key={p!.id} to={`/product/${p!.id}`} className="group w-[82%] shrink-0 snap-center lg:w-auto">
            <div className="overflow-hidden bg-panel">
              <ProductImage
                product={p!}
                className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                emojiClass="text-8xl"
                plaque
              />
            </div>
            {/* 卡片三行制式与目录一致（屋 → 名 → 价 + 这件自己的材质色号）。
                原本六张卡下面重复同一句排队笑话——同一个笑话讲六遍，是模板不是幽默 */}
            <div className="pt-5">
              <p className="truncate text-[10px] text-fog">{maisonOf(p!).name}</p>
              <p className="font-lux mt-1 text-[15px] leading-snug text-ivory">{p!.name}</p>
              <p className="font-price mt-2 text-[13px] text-ivory">{money(p!.price)}</p>
              <p className="mt-1.5 truncate text-[9px] leading-relaxed text-fog">
                {materialOf(p!)}, {colourwayOf(p!)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/** The Houses: a typographic directory of the fictional maisons (no image clutter). */
function HousesDirectory() {
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6 lg:mt-40">
      <div className="flex items-baseline justify-between">
        <h2 className="font-lux text-2xl text-ivory lg:text-4xl">The Houses</h2>
        <Link to="/maisons" className="quiet-link text-[11px] tracking-[0.2em] text-ivory">
          All 22
        </Link>
      </div>
      <p className="mt-4 max-w-md text-[11px] leading-loose text-fog">
        Twenty-two maisons, none of them real. Browse by house, the way you would a boutique arcade.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-hairline pt-8 lg:grid-cols-3 lg:gap-x-14">
        {MAISONS.map((m) => (
          <Link key={m.id} to={`/maison/${m.id}`} className="group block">
            {/* 名字在上、行当在下、正常大小写：eyebrow 是本站清过的 AI 排版签名 */}
            <p className="font-lux text-[15px] leading-snug text-ivory transition-opacity group-hover:opacity-60">
              {m.name}
            </p>
            <p className="mt-1 text-[10px] text-fog">{m.flourish}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

/** 收礼页：/?gift=<id>&from=<name>。接受后整单入账进收礼人的账本——链接就是包裹 */
function GiftReceived({ productId, from, onDone }: { productId: string; from: string; onDone: () => void }) {
  const money = useMoney()
  const { placeOrder } = useStore()
  const product = getProduct(productId)
  const [accepted, setAccepted] = useState(false)
  if (!product) return null

  const accept = () => {
    placeOrder([{ product, qty: 1 }], product.price, { urge: from ? `A gift from ${from}` : 'A gift' })
    setAccepted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-8">
      <div className="pop-in max-h-[88dvh] w-full max-w-80 overflow-y-auto bg-white p-8">
        {accepted ? (
          <div className="float-up">
            <p className="font-lux text-sm leading-loose text-ivory">
              It is yours. <span className="font-price text-jade">{money(product.price)}</span> has been kept safe on
              your behalf, and the butler has set out already.
            </p>
            <p className="mt-3 text-[10px] leading-relaxed text-fog">He will not arrive. The gift, however, stays given.</p>
            <div className="mt-8 flex items-center gap-6">
              <Link to="/orders" onClick={onDone} className="gold-cta px-8 py-2.5 text-[11px] tracking-[0.2em]">
                See it in his care
              </Link>
              <button onClick={onDone} className="quiet-link text-[10px] text-fog hover:text-ivory">
                Keep browsing
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-[10px] text-fog">{from ? `${from} has sent you` : 'Someone has sent you'}</p>
            <div className="mt-4 overflow-hidden bg-panel">
              <ProductImage product={product} className="aspect-[3/4] w-full" emojiClass="text-6xl" plaque />
            </div>
            <p className="font-lux mt-5 text-base leading-snug text-ivory">{product.name}</p>
            <p className="font-price mt-2 text-sm text-ivory">{money(product.price)}</p>
            <p className="mt-4 text-[10px] leading-loose text-fog">
              Wrapped in the house box, ribbon tied by hand. It will never arrive, which keeps it forever on the way to
              you.
            </p>
            <div className="mt-7 flex items-center gap-6">
              <button onClick={accept} className="gold-cta px-8 py-2.5 text-[11px] tracking-[0.2em]">
                Accept the gift
              </button>
              <button onClick={onDone} className="quiet-link text-[10px] text-fog hover:text-ivory">
                Decline
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** 最近看过：真店的「Recently viewed」。只读本机档案，回访才出现 */
function RecentlyViewed() {
  const { recent } = useStore()
  const pieces = recent.map(getProduct).filter((p) => p !== undefined).slice(0, 4)
  if (pieces.length < 2) return null
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6 lg:mt-40">
      <h2 className="font-lux text-lg text-ivory lg:text-2xl">Recently viewed</h2>
      <p className="mt-2 max-w-md text-[11px] text-fog">Looking is the first form of keeping.</p>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
        {pieces.map((p) => (
          <ProductCard key={p!.id} product={p!} />
        ))}
      </div>
    </section>
  )
}

/** 心选：从心愿单/订单/浏览档案推品类偏好，日更轮换。个性化的全部原料都在本机 */
function ChosenForYou() {
  const { recent, wishlist, orders } = useStore()
  const pieces = useMemo(() => {
    const known = new Set<string>([...recent, ...wishlist])
    for (const o of orders) for (const it of o.items) known.add(it.product.id)
    if (known.size === 0) return []
    const counts = new Map<string, number>()
    for (const id of known) {
      const p = getProduct(id)
      if (p) counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    }
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([c]) => c)
    if (top.length === 0) return []
    const day = new Date().toISOString().slice(0, 10)
    const h = (s: string) => {
      let x = 2166136261
      for (let i = 0; i < s.length; i++) {
        x ^= s.charCodeAt(i)
        x = Math.imul(x, 16777619)
      }
      return Math.abs(x)
    }
    const out = PRODUCTS.filter((p) => top.includes(p.category) && !known.has(p.id) && viewsOf(p).length > 0)
      .sort((a, b) => h(a.id + day) - h(b.id + day))
      .slice(0, 4)
    return out.length === 4 ? out : []
  }, [recent, wishlist, orders])
  if (pieces.length === 0) return null
  return (
    <section className="mx-auto mt-24 max-w-6xl px-6 lg:mt-40">
      <h2 className="font-lux text-lg text-ivory lg:text-2xl">You may also like</h2>
      <p className="mt-2 max-w-md text-[11px] text-fog">
        Drawn from what you have kept and lingered over. The taste is yours; it never leaves this device.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
        {pieces.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const money = useMoney()
  const { saved } = useStore()
  const navigate = useNavigate()
  const placeholder = useRotating(SEARCH_PLACEHOLDERS, 3600)
  const [showWelcome, setShowWelcome] = useState(false)
  const [query, setQuery] = useState('')
  const [params] = useSearchParams()
  const giftId = params.get('gift')
  const giftFrom = (params.get('from') ?? '').replace(/[<>]/g, '').slice(0, 20)
  const [gift, setGift] = useState<string | null>(() => (giftId && getProduct(giftId) ? giftId : null))

  useEffect(() => {
    // 收礼优先于开卡仪式：一个访客一次只该有一件大事
    if (!gift && !localStorage.getItem(WELCOME_KEY)) setShowWelcome(true)
  }, [gift])

  const closeWelcome = () => {
    localStorage.setItem(WELCOME_KEY, '1')
    setShowWelcome(false)
  }

  const featured = FEATURED_IDS.map(getProduct).filter(Boolean)

  return (
    <div className="pb-28">
      {gift && (
        <GiftReceived
          productId={gift}
          from={giftFrom}
          onDone={() => {
            setGift(null)
            window.history.replaceState({}, '', '/')
          }}
        />
      )}
      {showWelcome && <BlackCardModal onClose={closeWelcome} />}

      {/* Cinematic hero: an empty grand gallery, the showroom for a store that ships nothing.
          The photograph IS the design; headline and CTA overlaid so the fold communicates. */}
      <header className="relative h-[92vh] min-h-[560px] w-full overflow-hidden bg-black">
        {/* 大理石本身是**纯白**的（量过：字底下最亮处 rgb(255,255,255)，白字对它 1.00:1，
            也就是压根看不见）。标语换成三行之后文字上移到亮拱顶，问题才暴露出来。
            所以先把照片压暗，再叠两道遮罩——对比度是硬红线，不是打光偏好。 */}
        <img
          src="/img/ed-hero.jpg"
          alt="An empty baroque gallery, checkered marble receding to a distant door"
          className="absolute inset-0 h-full w-full object-cover [filter:grayscale(0.6)_contrast(1.05)_brightness(0.62)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
        {/* 文字靠左，就在左边再压一道横向遮罩：右边的照片保持干净，左边保证读得清 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-6 pb-14 lg:pb-20">
            {/* eyebrow 已删：SiteNav 的字标就悬在正上方，再来一行全大写宽字距是本站清过的签名。
                入场做一次「昂贵地慢」的错落淡入——品牌页允许一次编排好的开场，reduced-motion 由全局规则接管 */}
            <h1 className="font-lux float-up max-w-3xl text-[30px] leading-[1.25] text-white lg:text-[64px] lg:leading-[1.1]">
              {SLOGAN}
            </h1>
            <p className="float-up mt-5 max-w-md text-[11px] leading-loose text-white/70 lg:text-[13px]" style={{ animationDelay: '0.15s' }}>{SUB_SLOGAN}</p>
            {/* 真的能搜了。原本这里是个假搜索框，点一下弹句俏皮话——
                笑点还在（搜到了也照样不发货），但一家店的搜索框总得真的会搜 */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                navigate(query.trim() ? `/collection?q=${encodeURIComponent(query.trim())}` : '/collection')
              }}
              className="float-up mt-8 flex w-full max-w-sm items-center gap-2 border-b border-white/40 pb-2 transition-colors focus-within:border-white"
              style={{ animationDelay: '0.3s' }}
            >
              <span aria-hidden="true" className="text-white/70">
                ⌕
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                aria-label="Search the collection"
                className="min-w-0 flex-1 bg-transparent text-[11px] text-white placeholder:text-white/70 focus:outline-none"
              />
              <button type="submit" className="shrink-0 text-[10px] tracking-[0.2em] text-white/70 hover:text-white">
                Search
              </button>
            </form>
            <div className="float-up mt-10 max-w-md" style={{ animationDelay: '0.45s' }}>
              <Ticker tone="light" />
            </div>
          </div>
        </div>
      </header>

      <HousesDirectory />

      <SalonPrive />

      {/* One editorial break: an artisan's hands, the single human touch on the page */}
      <EditorialImage
        src="/img/ed-atelier.jpg"
        alt="An artisan's hands adjusting a movement in dim light"
        className="mt-24 h-[46vh] lg:mt-40 lg:h-[62vh]"
      />
      <section className="mx-auto mt-14 max-w-6xl px-6 lg:mt-20">
        <p className="font-lux max-w-xl text-lg leading-loose text-ivory lg:text-2xl">
          The bespoke atelier is open: something made to the millimetre for you, being earnestly not made.
        </p>
        {/* 链到一件工坊真开着的藏品：曾链到配货旗舰，而旗舰的工坊按新规一律不开放——
            「Book the atelier」点进去是一句「This one is not among them」，承诺当场落空 */}
        <Link
          to={`/product/${atelierPieceId}`}
          className="quiet-link mt-6 inline-block text-[11px] tracking-[0.2em] text-ivory"
        >
          Book the atelier
        </Link>
      </section>

      {/* The Collection: a small featured preview; the full 1,009-piece grid lives at /collection */}
      <section className="mt-24 lg:mt-40">
        <div className="mx-auto flex max-w-6xl items-baseline justify-between px-6">
          <h2 className="font-lux text-2xl text-ivory lg:text-4xl">The Collection</h2>
          <Link to="/collection" className="quiet-link text-[11px] tracking-[0.2em] text-ivory">
            View all {PRODUCTS.length.toLocaleString('en-US')}
          </Link>
        </div>
        <div className="mx-auto max-w-6xl px-6">
          <p className="mt-4 max-w-md text-[11px] text-fog">A dozen to begin with. Everything you can't afford, affordable here.</p>
        </div>

        <div className="mx-auto mt-12 max-w-6xl px-6 lg:mt-16">
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
            {featured.map((p) => (
              <ProductCard key={p!.id} product={p!} />
            ))}
          </div>
        </div>
      </section>

      {/* 回访才有的两条私人段落：最近看过 + 心选（原料全在本机，首访一无所知所以一无所示） */}
      <RecentlyViewed />
      <ChosenForYou />

      {/* Persistent ledger badge (mobile; healing green, the only colour on the site) */}
      {saved > 0 && (
        <Link
          to="/me"
          className="fixed bottom-20 right-3 z-30 border border-jade/40 bg-ink px-3 py-2 text-[10px] font-semibold text-jade lg:hidden"
        >
          Kept safe: {money(saved)}
        </Link>
      )}
    </div>
  )
}
