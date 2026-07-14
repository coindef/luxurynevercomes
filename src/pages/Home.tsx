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
import EditorialImage from '../components/EditorialImage'

const WELCOME_KEY = 'flgj.welcomed'
const PAGE_SIZE = 24

/** 黑卡开卡仪式（全站唯一的深色时刻——黑卡本卡；深色面用固定 hex，银箔不用金箔） */
function BlackCardModal({ onClose }: { onClose: () => void }) {
  const [opened, setOpened] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-8">
      <div className="pop-in w-full max-w-80 bg-white">
        {opened ? (
          <div className="float-up p-10">
            <p className="font-price text-5xl font-normal text-ivory">∞</p>
            <p className="font-lux mt-6 text-sm leading-loose text-ivory">
              尊敬的贵宾：您的黑卡已激活。
              <br />
              额度：无上限。有效期：永久。
            </p>
            <p className="mt-3 text-[10px] leading-relaxed text-fog">适用范围：本店。反正结账时也用不上。</p>
            <button onClick={onClose} className="gold-cta mt-8 w-full py-3.5 text-xs tracking-[0.2em]">
              收下，去看看
            </button>
          </div>
        ) : (
          <div className="p-10">
            <div className="mb-8 flex h-32 w-full flex-col justify-end bg-[#141414] p-4 text-left">
              <p className="text-[8px] uppercase tracking-[0.2em] text-[#c9c9c9]">Carte Noire</p>
              <p className="font-price mt-1 text-[11px] text-[#8f8f8f]">**** **** **** 0000</p>
            </div>
            <p className="font-lux text-sm text-ivory">为您准备了一张黑卡</p>
            <button onClick={() => setOpened(true)} className="gold-cta mt-6 w-full py-3.5 text-xs tracking-[0.2em]">
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
        return `${m.city}贵宾于${m.spot}认购了 ${p.name}，${sec} 秒前`
      }),
    [],
  )
  const line = useRotating(lines, 3400)

  return (
    <p className="mt-20 text-[10px] leading-relaxed text-fog lg:mt-28">
      <span key={line} className="float-up inline-block">
        {line}
      </span>
    </p>
  )
}

/** 今日私享 */
function SalonPrive() {
  const countdown = useSeckillCountdown()

  return (
    <section className="mt-24 lg:mt-40">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-lux text-2xl text-ivory lg:text-4xl">今日私享</h2>
        <p className="mt-4 max-w-md text-[11px] leading-loose text-fog">
          预约通道 <span className="font-price text-ivory">{countdown}</span> 后关闭。每次刷新，我们都会重新为您保留。
        </p>
      </div>
      <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [-webkit-overflow-scrolling:touch] lg:mx-auto lg:mt-16 lg:grid lg:max-w-6xl lg:grid-cols-3 lg:gap-14 lg:overflow-visible">
        {SALON_PRODUCTS.slice(0, 6).map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="group w-[82%] shrink-0 snap-center lg:w-auto">
            <div className="overflow-hidden bg-panel">
              <ProductImage
                product={p}
                className="aspect-[3/4] w-full transition-transform duration-700 group-hover:scale-[1.03]"
                emojiClass="text-8xl"
                plaque
              />
            </div>
            <div className="pt-5">
              <p className="font-lux text-[15px] leading-snug text-ivory">{p.name}</p>
              <p className="font-price mt-2 text-[13px] text-ivory">{yuan(p.price)}</p>
              <p className="mt-2 text-[10px] leading-relaxed text-fog">候补名单已排至第 847 位，队伍不动</p>
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
    <div className="pb-28">
      {showWelcome && <BlackCardModal onClose={closeWelcome} />}

      {/* 电影感 hero：一张图占满视野，文字退到图下方的编辑栏 */}
      <header>
        <img
          src="/img/lx-loire-chateau.jpg"
          alt="河谷庄园"
          className="h-[68vh] w-full object-cover lg:h-[86vh]"
        />
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="font-lux mt-14 max-w-2xl text-[26px] leading-relaxed text-ivory lg:mt-20 lg:text-5xl lg:leading-[1.35]">
            {SLOGAN}
          </h1>
          <p className="mt-6 max-w-md text-[11px] leading-loose text-fog">{SUB_SLOGAN}</p>
          <button
            onClick={() => toast('搜了也不会发货。不过您搜的这个，确实很有品位。')}
            className="quiet-link mt-8 block text-left text-[11px] text-fog transition-opacity hover:text-ivory"
          >
            <span key={placeholder} className="float-up">
              {placeholder}
            </span>
          </button>
          <Marquee />
        </div>
      </header>

      <SalonPrive />

      {/* 工坊定制：一张手作照片 + 一句耳语 */}
      <EditorialImage
        src="/img/ed-atelier.jpg"
        alt="暗光里，工匠的手正在调校一枚机芯"
        className="h-[46vh] lg:h-[64vh]"
      />
      <section className="mx-auto mt-14 max-w-6xl px-6 lg:mt-20">
        <p className="font-lux max-w-xl text-lg leading-loose text-ivory lg:text-2xl">
          工坊定制现已开放：认真到毫米的专属之物，正在认真地不被制作。
        </p>
        <Link
          to={`/product/${SALON_PRODUCTS[0]?.id ?? ''}`}
          className="quiet-link mt-6 inline-block text-[11px] tracking-[0.2em] text-ivory"
        >
          预约工坊
        </Link>
      </section>

      {/* 空无一人的橱窗：留白即奢侈，这里连商品都没有 */}
      <EditorialImage
        src="/img/ed-vitrine.jpg"
        alt="空无一人的石厅，列柱之间没有任何展品"
        caption="本店陈列厅。空的——毕竟什么都发不出去。"
      />

      {/* 藏品陈列 */}
      <section className="mt-24 lg:mt-40">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-lux text-2xl text-ivory lg:text-4xl">{category ?? '藏品陈列'}</h2>
          <p className="mt-4 text-[11px] text-fog">买不起的，都在这里买得起</p>
        </div>

        {/* 分类：纯文字链，横向可滚（手机不换行堆叠） */}
        <nav className="mt-10 border-y border-hairline">
          <div className="mx-auto flex max-w-6xl gap-x-8 overflow-x-auto px-6 py-4 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => setCategory(null)}
              className={`shrink-0 text-[11px] tracking-[0.2em] transition-colors ${
                category === null ? 'text-ivory' : 'text-fog hover:text-ivory'
              }`}
            >
              全部
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setCategory(category === c.name ? null : c.name)}
                className={`shrink-0 text-[11px] tracking-[0.2em] transition-colors ${
                  category === c.name ? 'text-ivory' : 'text-fog hover:text-ivory'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </nav>

        <div className="mx-auto mt-12 max-w-6xl px-6 lg:mt-16">
          <div className="columns-2 gap-5 lg:columns-3 lg:gap-14">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div ref={sentinelRef} />
          {visible >= list.length && (
            <p className="py-16 text-[10px] tracking-[0.2em] text-fog">已经到底了——底也是金子做的</p>
          )}
        </div>
      </section>

      {/* 常驻账本徽章（移动端；治愈绿，全站唯一彩色） */}
      {saved > 0 && (
        <Link
          to="/me"
          className="fixed bottom-20 right-3 z-30 border border-jade/40 bg-ink px-3 py-2 text-[10px] font-semibold text-jade lg:hidden"
        >
          已为你守住 {yuan(saved)}
        </Link>
      )}
    </div>
  )
}
