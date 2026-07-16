import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, catLabel } from '../lib/products'
import { SEARCH_PLACEHOLDERS } from '../lib/copy'
import { emptyLine, searchProducts } from '../lib/search'
import { useRotating } from '../lib/hooks'
import ProductCard from '../components/ProductCard'

const PAGE_SIZE = 24

/** 图录的章节顺序（= 导览栏的品类顺序，两处必须一致，否则读者会觉得目录在跳） */
const CATEGORY_ORDER = CATEGORIES.map((c) => c.name)

const SORTS = [
  { key: '', label: 'Curated' },
  { key: 'price-desc', label: 'Dearest first' },
  { key: 'price-asc', label: 'Least dear first' },
  { key: 'payable', label: 'By what you actually pay' },
] as const

/**
 * 全目录：搜索 + 品类筛选 + 排序 + 无限滚动。
 *
 * 三个状态全挂在 URL 上（?q= &cat= &sort=），所以浏览器后退键、刷新、分享链接都成立——
 * 「筛到一半刷新就白筛了」是这类目录页最常见的失礼。
 *
 * 网格是真 CSS grid，不是 columns。CSS 多列会把卡片从中间劈到下一列去
 * （于是上一件的「962 already claimed」跑到下一件的图上面当了标题），
 * 而且阅读顺序是先竖后横——图录该从左读到右。
 */
export default function Collection() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('cat')
  const sort = params.get('sort') ?? ''
  const quotaOnly = params.get('quota') === '1'

  const [visible, setVisible] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const placeholder = useRotating(SEARCH_PLACEHOLDERS, 3600)

  /** 改哪个参数都保持其它参数不变；空值就把 key 拿掉，别在地址栏里留 `?q=&cat=` 这种垃圾 */
  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const search = useMemo(() => (q ? searchProducts(q) : null), [q])

  const list = useMemo(() => {
    let base = search ? search.items : PRODUCTS
    if (quotaOnly) base = base.filter((p) => p.quota)
    const filtered = category ? base.filter((p) => p.category === category) : base
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price)
    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price)
    if (search) return filtered // 相关度序。"payable" 是彩蛋，见下面那行小字
    // 图录序：按品类成章，章内最贵的在前。
    // RAW_PRODUCTS 从第 600 件往后是严格轮转的（Motorcars|Couture|Real Estate|Sport），
    // 直接按数组顺序铺格子，每一行都是四个毫不相干的东西——没有哪家店的货架是这么摆的
    return [...filtered].sort(
      (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || b.price - a.price,
    )
  }, [search, category, sort, quotaOnly])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [q, category, sort, quotaOnly])

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const ob = new IntersectionObserver((entries) => entries[0].isIntersecting && setVisible((v) => v + PAGE_SIZE), {
      rootMargin: '600px',
    })
    ob.observe(el)
    return () => ob.disconnect()
  }, [])

  const shown = list.slice(0, visible)
  const heading = q ? 'Search' : quotaOnly ? 'By quota only' : category ? catLabel(category) : 'The Collection'
  /** 只有「逛全部、图录序」时才分章：搜索按相关度、按价格排序时，品类是乱的，硬分章只会更乱 */
  const sectioned = !q && !category && !quotaOnly && sort === ''
  const counts = useMemo(() => {
    const n: Record<string, number> = {}
    for (const p of PRODUCTS) n[p.category] = (n[p.category] ?? 0) + 1
    return n
  }, [])

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
        <h1 className="font-lux text-3xl leading-relaxed text-ivory lg:text-5xl">{heading}</h1>
        <p className="mt-4 text-[11px] leading-relaxed text-fog">
          {q ? (
            <>
              <span className="font-price text-ivory">{list.length.toLocaleString('en-US')}</span>
              {list.length === 1 ? ' piece matches ' : ' pieces match '}“{q}”
            </>
          ) : quotaOnly ? (
            <>
              <span className="font-price text-ivory">{list.length.toLocaleString('en-US')}</span> pieces refuse a direct
              order. Reserve other things first to earn the allocation, which is also ¥0.00.
            </>
          ) : (
            <>
              <span className="font-price text-ivory">{list.length.toLocaleString('en-US')}</span> pieces. Everything you
              can't afford, affordable here.
            </>
          )}
        </p>
      </header>

      <div className="mx-auto mt-10 max-w-6xl px-6">
        {/* 搜索 + 排序 */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex flex-1 items-center gap-3 border-b border-hairline pb-2 transition-colors focus-within:border-ivory">
            <span aria-hidden="true" className="text-sm text-fog">
              ⌕
            </span>
            <input
              value={q}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder={placeholder}
              aria-label="Search the collection"
              className="min-w-0 flex-1 bg-transparent py-1 text-xs text-ivory placeholder:text-fog focus:outline-none"
            />
            {q && (
              <button onClick={() => setParam('q', null)} className="shrink-0 text-[10px] text-fog hover:text-ivory">
                Clear
              </button>
            )}
          </div>

          <label className="flex shrink-0 items-center gap-3 border-b border-hairline pb-2 text-[10px] text-fog">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value || null)}
              className="bg-transparent text-[11px] text-ivory focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* 排序彩蛋：实付都是 ¥0.00，所以「按实付排序」什么也排不动 */}
        {sort === 'payable' && (
          <p className="float-up mt-4 text-[10px] leading-relaxed text-jade">
            Sorted by what you actually pay. All 1,009 pieces tie at ¥0.00, so the order is unchanged. The fairest
            ranking in retail.
          </p>
        )}

        {/* 品类：平铺不裁切。原本是横向滚动条，最后一项永远被切成「Co」，像坏了 */}
        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
          <button
            onClick={() => setParam('cat', null)}
            aria-current={category === null}
            className={`text-[11px] tracking-[0.15em] transition-colors ${
              category === null ? 'text-ivory' : 'text-fog hover:text-ivory'
            }`}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.name}
              onClick={() => setParam('cat', category === c.name ? null : c.name)}
              aria-current={category === c.name}
              className={`whitespace-nowrap text-[11px] tracking-[0.15em] transition-colors ${
                category === c.name ? 'text-ivory' : 'text-fog hover:text-ivory'
              }`}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-12 max-w-6xl px-6 lg:mt-16">
        {list.length === 0 ? (
          <p className="max-w-md py-10 text-[11px] leading-loose text-fog">{emptyLine(q)}</p>
        ) : (
          <>
            {search?.everythingLine && (
              <p className="float-up mb-10 max-w-md text-[11px] leading-loose text-jade">{search.everythingLine}</p>
            )}
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-16">
              {shown.map((p, i) => {
                // 逛「全部」时按品类分章。章内是同一类，一行四件才彼此相干
                const opensSection = sectioned && (i === 0 || shown[i - 1].category !== p.category)
                return (
                  <Fragment key={p.id}>
                    {opensSection && (
                      <div
                        className={`col-span-full flex items-baseline justify-between border-b border-hairline pb-3 ${
                          i === 0 ? '' : 'mt-10 lg:mt-16'
                        }`}
                      >
                        <h2 className="font-lux text-lg text-ivory lg:text-2xl">{catLabel(p.category)}</h2>
                        <button
                          onClick={() => setParam('cat', p.category)}
                          className="quiet-link shrink-0 text-[10px] tracking-[0.15em] text-fog hover:text-ivory"
                        >
                          All {counts[p.category]}
                        </button>
                      </div>
                    )}
                    <ProductCard product={p} />
                  </Fragment>
                )
              })}
            </div>
          </>
        )}
        <div ref={sentinelRef} />
        {list.length > 0 && visible >= list.length && (
          <p className="py-16 text-[10px] leading-relaxed text-fog">
            You've reached the bottom. The bottom is priced the same as the top.
          </p>
        )}
      </div>
    </div>
  )
}
