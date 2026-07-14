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

/** 黑卡开卡仪式（替代新人红包） */
function BlackCardModal({ onClose }: { onClose: () => void }) {
  const [opened, setOpened] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-8">
      <div className="w-full max-w-80 border border-gold/60 bg-gradient-to-b from-[#1c1a16] to-[#0e0d0b] text-center shadow-2xl pop-in">
        {opened ? (
          <div className="p-7 float-up">
            <p className="tracking-maison text-[10px] text-gold">Carte Noire · Activée</p>
            <p className="font-price my-4 text-4xl font-bold text-gold">∞</p>
            <p className="font-lux text-sm leading-relaxed text-ivory">
              尊敬的贵宾：您的黑卡已激活。
              <br />
              额度：无上限。有效期：永久。
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-fog">适用范围：本店。反正结账时也用不上。</p>
            <button
              onClick={onClose}
              className="gold-cta mt-6 w-full border border-gold py-2.5 text-sm tracking-widest text-gold hover:text-goldlit"
            >
              收下，去看看
            </button>
          </div>
        ) : (
          <div className="p-7">
            <p className="tracking-maison text-[10px] text-fog">Maison Zéro</p>
            <div className="mx-auto my-6 flex h-32 w-52 flex-col justify-between border border-gold/70 bg-gradient-to-br from-[#191713] to-black p-3 text-left">
              <span className="text-lg">🖤</span>
              <div>
                <p className="tracking-maison text-[8px] text-gold">Carte Noire</p>
                <p className="font-price text-[10px] text-ivory/70">**** **** **** 0000</p>
              </div>
            </div>
            <p className="font-lux text-sm text-ivory">为您准备了一张黑卡</p>
            <button
              onClick={() => setOpened(true)}
              className="gold-cta mx-auto mt-5 block border border-gold px-10 py-2 text-sm tracking-widest text-gold"
            >
              开卡
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

/** 认购动态 */
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
    <div className="mx-4 mt-3 flex items-center gap-2 border-y border-hairline px-1 py-2 text-[10px] text-fog lg:mx-auto lg:max-w-6xl lg:justify-center">
      <span className="text-gold">◆</span>
      <span key={line} className="float-up truncate">{line}</span>
    </div>
  )
}

/** 今日私享 SALON PRIVÉ：一屏一物 */
function SalonPrive() {
  const countdown = useSeckillCountdown()

  return (
    <section className="mt-5 lg:mx-auto lg:mt-10 lg:max-w-6xl lg:px-6">
      <div className="mx-4 flex items-baseline justify-between lg:mx-0">
        <h2 className="font-lux text-base text-ivory lg:text-xl">
          今日私享 <span className="tracking-maison ml-1 text-[9px] text-gold">Salon Privé</span>
        </h2>
        <span className="text-[9px] text-fog">
          预约通道 <span className="font-price text-gold">{countdown}</span> 后关闭
        </span>
      </div>
      <p className="mx-4 mt-0.5 text-[9px] text-fog lg:mx-0">每次刷新，我们都会重新为您保留。</p>
      <div className="mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [-webkit-overflow-scrolling:touch] lg:grid lg:grid-cols-3 lg:gap-5 lg:overflow-visible lg:px-0">
        {SALON_PRODUCTS.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="w-[82%] shrink-0 snap-center border border-hairline bg-panel transition-colors hover:border-gold/40 lg:w-auto"
          >
            <ProductImage product={p} className="h-56 w-full lg:h-64" emojiClass="text-8xl" plaque />
            <div className="flex items-baseline justify-between gap-2 p-3.5">
              <div className="min-w-0">
                <p className="font-lux truncate text-sm text-ivory">{p.name}</p>
                <p className="mt-1 text-[9px] text-fog">{p.category} · 候补名单已排至第 847 位</p>
              </div>
              <span className="font-price shrink-0 text-base font-semibold text-gold">{yuan(p.price)}</span>
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
    <div className="pb-20">
      {showWelcome && <BlackCardModal onClose={closeWelcome} />}

      {/* 品牌区（桌面端为居中 hero） */}
      <header className="border-b border-hairline px-4 pb-4 pt-7 lg:px-6 lg:pb-10 lg:pt-14">
        <div className="lg:mx-auto lg:max-w-2xl lg:text-center">
          <div className="flex items-baseline justify-between lg:justify-center lg:gap-4">
            <h1 className="font-lux text-2xl tracking-wide text-ivory lg:text-5xl">富了个寂寞</h1>
            <span className="tracking-maison text-[9px] text-gold lg:hidden">Luxury Never Comes</span>
          </div>
          <p className="font-lux mt-1.5 text-xs text-ivory/80 lg:mt-4 lg:text-base">{SLOGAN}</p>
          <p className="mt-1 text-[9px] leading-relaxed text-fog lg:mt-2 lg:text-[11px]">{SUB_SLOGAN}</p>
          <button
            onClick={() => toast('搜了也不会发货。不过您搜的这个，确实很有品位。')}
            className="mt-4 flex w-full items-center gap-2 border border-hairline bg-panel px-4 py-2.5 text-left text-xs text-fog transition-colors hover:border-gold/40 lg:mx-auto lg:mt-6 lg:max-w-xl"
          >
            <span className="text-gold">⌕</span>
            <span key={placeholder} className="float-up">{placeholder}</span>
          </button>
        </div>
      </header>

      <Marquee />
      <SalonPrive />

      {/* 分类 */}
      <section className="mx-4 mt-5 grid grid-cols-5 gap-y-3 border-y border-hairline py-4 lg:mx-auto lg:mt-10 lg:max-w-6xl lg:grid-cols-10 lg:py-6">
        {CATEGORIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setCategory(category === c.name ? null : c.name)}
            className={`flex flex-col items-center gap-1.5 text-[9px] tracking-wider ${
              category === c.name ? 'text-gold' : 'text-fog'
            }`}
          >
            <span
              className={`flex h-10 w-10 items-center justify-center border text-lg ${
                category === c.name ? 'border-gold/70 bg-panel' : 'border-hairline'
              }`}
            >
              {c.emoji}
            </span>
            {c.name}
          </button>
        ))}
      </section>

      {/* 工坊定制氛围入口 */}
      <Link
        to={`/product/${SALON_PRODUCTS[0]?.id ?? ''}`}
        className="mx-4 mt-4 block border border-gold/30 bg-gradient-to-r from-panel to-ink px-4 py-3 lg:mx-auto lg:mt-8 lg:max-w-6xl lg:px-6 lg:py-4 lg:text-center"
      >
        <p className="tracking-maison text-[8px] text-gold">Bespoke · Atelier</p>
        <p className="font-lux mt-1 text-xs leading-relaxed text-ivory/90">
          工坊定制现已开放：认真到毫米的专属之物，正在认真地不被制作。
        </p>
      </Link>

      {/* 藏品陈列 */}
      <section className="mx-4 mt-5 lg:mx-auto lg:mt-10 lg:max-w-6xl lg:px-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-lux text-base text-ivory">
            {category ?? '藏品陈列'}
            <span className="ml-2 text-[9px] font-normal text-fog">买不起的，都在这里买得起</span>
          </h2>
          {category && (
            <button onClick={() => setCategory(null)} className="text-[10px] text-gold">
              全部 ›
            </button>
          )}
        </div>
        <div className="columns-2 gap-3 lg:columns-4 lg:gap-5">
          {shown.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div ref={sentinelRef} />
        {visible >= list.length && (
          <p className="py-5 text-center text-[9px] tracking-widest text-fog">
            已经到底了 —— 底也是金子做的
          </p>
        )}
      </section>

      {/* 常驻账本徽章（治愈绿） */}
      {saved > 0 && (
        <Link
          to="/me"
          className="fixed bottom-20 right-[max(12px,calc(50%-228px))] z-30 border border-jade/60 bg-ink/95 px-3 py-2 text-[10px] font-semibold text-jade shadow-xl lg:hidden"
        >
          已为你守住 {yuan(saved)}
        </Link>
      )}
    </div>
  )
}
