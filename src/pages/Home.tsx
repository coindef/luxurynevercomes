import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, SALON_PRODUCTS } from '../lib/products'
import { MARQUEE_CITIES, SEARCH_PLACEHOLDERS, SLOGAN, SUB_SLOGAN, pick } from '../lib/copy'
import { yuan } from '../lib/format'
import { useRotating, useSeckillCountdown } from '../lib/hooks'
import { useStore } from '../lib/store'
import { useToast } from '../components/Toast'
import ProductCard from '../components/ProductCard'
import ProductImage from '../components/ProductImage'

const WELCOME_KEY = 'flgj.welcomed'
const PAGE_SIZE = 24

/** 黑卡开卡仪式（全站唯一的深色时刻——黑卡本卡） */
function BlackCardModal({ onClose }: { onClose: () => void }) {
  const [opened, setOpened] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-8">
      <div className="w-full max-w-80 bg-[#faf6ef] text-center shadow-2xl pop-in">
        {opened ? (
          <div className="p-8 float-up">
            <p className="tracking-maison text-[10px] text-gold">Carte Noire · Activée</p>
            <p className="font-price my-4 text-4xl font-bold text-ivory">∞</p>
            <p className="font-lux text-sm leading-relaxed text-ivory">
              尊敬的贵宾：您的黑卡已激活。
              <br />
              额度：无上限。有效期：永久。
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-fog">适用范围：本店。反正结账时也用不上。</p>
            <button onClick={onClose} className="gold-cta mt-6 w-full py-3 text-sm tracking-widest">
              收下，去看看
            </button>
          </div>
        ) : (
          <div className="p-8">
            <p className="tracking-maison text-[10px] text-fog">Maison Zéro</p>
            <div className="mx-auto my-6 flex h-32 w-52 flex-col justify-between bg-gradient-to-br from-[#191713] to-black p-4 text-left shadow-lg">
              <span className="text-lg">🖤</span>
              <div>
                <p className="tracking-maison text-[8px] text-[#c8a96e]">Carte Noire</p>
                <p className="font-price text-[10px] text-[#f4efe6]/70">**** **** **** 0000</p>
              </div>
            </div>
            <p className="font-lux text-sm text-ivory">为您准备了一张黑卡</p>
            <button onClick={() => setOpened(true)} className="gold-cta mx-auto mt-5 block px-12 py-2.5 text-sm tracking-widest">
              开卡
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/** 认购动态：一行悄声小字 */
function Marquee() {
  const lines = useMemo(
    () =>
      Array.from({ length: 8 }, () => {
        const m = pick(MARQUEE_CITIES)
        const p = pick([...PRODUCTS])
        const sec = 2 + Math.floor(Math.random() * 9)
        return `${m.city}贵宾 · ${sec} 秒前 · 于${m.spot}认购了 ${p.name}`
      }),
    [],
  )
  const line = useRotating(lines, 3400)

  return (
    <p className="mx-auto mt-10 max-w-xl px-6 text-center text-[10px] tracking-wider text-fog">
      <span key={line} className="float-up inline-block truncate align-bottom" style={{ maxWidth: '100%' }}>
        {line}
      </span>
    </p>
  )
}

/** 今日私享 SALON PRIVÉ */
function SalonPrive() {
  const countdown = useSeckillCountdown()

  return (
    <section className="mt-14 lg:mx-auto lg:max-w-6xl lg:px-6">
      <div className="px-6 text-center lg:px-0">
        <p className="tracking-maison text-[9px] text-gold">Salon Privé</p>
        <h2 className="font-lux mt-2 text-xl text-ivory lg:text-2xl">今日私享</h2>
        <p className="mt-2 text-[10px] text-fog">
          预约通道 <span className="font-price">{countdown}</span> 后关闭 —— 每次刷新，我们都会重新为您保留。
        </p>
      </div>
      <div className="mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 [-webkit-overflow-scrolling:touch] lg:grid lg:grid-cols-3 lg:gap-10 lg:overflow-visible lg:px-0">
        {SALON_PRODUCTS.slice(0, 6).map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="group w-[78%] shrink-0 snap-center lg:w-auto">
            <div className="overflow-hidden">
              <ProductImage
                product={p}
                className="aspect-[4/5] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                emojiClass="text-8xl"
                plaque
              />
            </div>
            <div className="pt-4 text-center">
              <p className="font-lux text-sm text-ivory">{p.name}</p>
              <p className="font-price mt-1 text-xs text-ivory/80">{yuan(p.price)}</p>
              <p className="mt-1 text-[9px] tracking-wider text-fog">候补名单已排至第 847 位 · 队伍不动</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { saved } = useStore()
  const toast = useToast()
  const placeholder = useRotating(SEARCH_PLACEHOLDERS, 3600)
  const [category, setCategory] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!localStorage.getItem(WELCOME_KEY)) setShowWelcome(true)
  }, [])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [category])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const ob = new IntersectionObserver(
      (entries) => entries[0].isIntersecting && setVisible((v) => v + PAGE_SIZE),
      { rootMargin: '400px' },
    )
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  const closeWelcome = () => {
    localStorage.setItem(WELCOME_KEY, '1')
    setShowWelcome(false)
  }

  const list = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS
  const shown = list.slice(0, visible)

  return (
    <div className="pb-24">
      {showWelcome && <BlackCardModal onClose={closeWelcome} />}

      {/* 电影感 hero：一张图，一句话 */}
      <header>
        <div className="relative">
          <img
            src="/img/lx-loire-chateau.jpg"
            alt="河谷庄园"
            className="h-[52vh] w-full object-cover lg:h-[68vh]"
          />
        </div>
        <div className="mx-auto max-w-2xl px-6 pt-10 text-center lg:pt-14">
          <p className="tracking-maison text-[9px] text-gold lg:hidden">Luxury Never Comes</p>
          <h1 className="font-lux mt-2 text-2xl leading-relaxed tracking-wide text-ivory lg:mt-0 lg:text-4xl">
            {SLOGAN}
          </h1>
          <p className="mt-3 text-[10px] leading-loose text-fog lg:text-[11px]">{SUB_SLOGAN}</p>
          <button
            onClick={() => toast('搜了也不会发货。不过您搜的这个，确实很有品位。')}
            className="mx-auto mt-7 flex w-full max-w-sm items-center justify-center gap-2 border-b border-hairline pb-2 text-xs text-fog transition-colors hover:border-ivory hover:text-ivory"
          >
            <span>⌕</span>
            <span key={placeholder} className="float-up">{placeholder}</span>
          </button>
        </div>
      </header>

      <Marquee />
      <SalonPrive />

      {/* 分类：纯文字链 */}
      <nav className="mx-auto mt-16 max-w-4xl border-y border-hairline px-6 py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setCategory(category === c.name ? null : c.name)}
              className={`text-[11px] tracking-[0.25em] transition-colors ${
                category === c.name ? 'quiet-link text-ivory' : 'text-fog hover:text-ivory'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </nav>

      {/* 工坊定制：一句耳语 */}
      <div className="mx-auto mt-12 max-w-xl px-6 text-center">
        <p className="tracking-maison text-[9px] text-gold">Bespoke · Atelier</p>
        <p className="font-lux mt-2.5 text-sm leading-loose text-ivory/90">
          工坊定制现已开放：认真到毫米的专属之物，
          <br className="hidden lg:block" />
          正在认真地不被制作。
        </p>
        <Link
          to={`/product/${SALON_PRODUCTS[0]?.id ?? ''}`}
          className="quiet-link mt-3 inline-block text-[10px] tracking-widest text-ivory"
        >
          预约工坊
        </Link>
      </div>

      {/* 藏品陈列 */}
      <section className="mx-6 mt-14 lg:mx-auto lg:max-w-6xl lg:px-6">
        <div className="mb-8 text-center">
          <h2 className="font-lux text-xl text-ivory">{category ?? '藏品陈列'}</h2>
          <p className="mt-1.5 text-[10px] text-fog">买不起的，都在这里买得起</p>
          {category && (
            <button onClick={() => setCategory(null)} className="quiet-link mt-2 text-[10px] tracking-widest text-fog">
              查看全部
            </button>
          )}
        </div>
        <div className="columns-2 gap-6 lg:columns-3 lg:gap-12">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div ref={sentinelRef} />
        {visible >= list.length && (
          <p className="py-8 text-center text-[9px] tracking-[0.3em] text-fog/70">
            已经到底了 —— 底也是金子做的
          </p>
        )}
      </section>

      {/* 常驻账本徽章（移动端；治愈绿） */}
      {saved > 0 && (
        <Link
          to="/me"
          className="fixed bottom-20 right-3 z-30 border border-jade/50 bg-ink/95 px-3 py-2 text-[10px] font-semibold text-jade shadow-lg lg:hidden"
        >
          已为你守住 {yuan(saved)}
        </Link>
      )}
    </div>
  )
}
