import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, catLabel, getProduct } from '../lib/products'
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
  /** 别人分享来的心愿单：/collection?ids=a,b,c（纯 URL，零后端） */
  const sharedIds = (params.get('ids') ?? '').split(',').filter(Boolean)
  const sharedWish = sharedIds.length > 0

  const [visible, setVisible] = useState(PAGE_SIZE)
  const placeholder = useRotating(SEARCH_PLACEHOLDERS, 3600)

  /** 改哪个参数都保持其它参数不变；空值就把 key 拿掉，别在地址栏里留 `?q=&cat=` 这种垃圾 */
  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const search = useMemo(() => (q ? searchProducts(q) : null), [q])

  /** 品类筛选**之前**的结果集：品类计数要按它算，才是「活的」计数 */
  const base = useMemo(() => {
    if (sharedWish) {
      const picked = sharedIds.map(getProduct).filter((p) => p !== undefined)
      return quotaOnly ? picked.filter((p) => p.quota) : picked
    }
    const b = search ? search.items : PRODUCTS
    return quotaOnly ? b.filter((p) => p.quota) : b
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, quotaOnly, params.get('ids')])

  const list = useMemo(() => {
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
  }, [base, search, category, sort])

  useEffect(() => {
    setVisible(PAGE_SIZE)
  }, [q, category, sort, quotaOnly])

  // 无限滚动已移除：实测七家（Hermès / Cartier / Dior / Net-a-Porter / Mytheresa / Farfetch…）
  // **没有一家用纯无限滚动**——要么「Load more」+ 一行看过多少的进度，要么老老实实翻页。
  // 无限滚动会吃掉页脚，也让人永远不知道自己在 1009 件里走到了哪

  const shown = list.slice(0, visible)
  const heading = q ? 'Search' : sharedWish ? 'A shared wish list' : quotaOnly ? 'By quota only' : category ? catLabel(category) : 'The Collection'
  /** 只有「逛全部、图录序」时才分章：搜索按相关度、按价格排序时，品类是乱的，硬分章只会更乱 */
  const sectioned = !q && !category && !quotaOnly && !sharedWish && sort === ''
  /** 每个品类**在当前结果里**有多少件。Hermès 的每个筛选值后面都挂着实时计数（「Black (5)」） */
  const counts = useMemo(() => {
    const n: Record<string, number> = {}
    for (const p of base) n[p.category] = (n[p.category] ?? 0) + 1
    return n
  }, [base])
  const filtered = Boolean(q || category || quotaOnly || sort)

  return (
    <div className="pb-28">
      <header className="mx-auto max-w-6xl px-6 pt-8 lg:pt-12">
        {/* 面包屑：真店近乎人人都有，斜杠分隔（Cartier「Home / Jewelry / All Collections」） */}
        <nav aria-label="Breadcrumb" className="text-[10px] text-fog">
          <Link to="/" className="hover:text-ivory">
            Home
          </Link>
          <span aria-hidden="true" className="px-1.5">/</span>
          {category || q || quotaOnly ? (
            <>
              <Link to="/collection" className="hover:text-ivory">
                The Collection
              </Link>
              <span aria-hidden="true" className="px-1.5">/</span>
              <span className="text-ivory">{heading}</span>
            </>
          ) : (
            <span className="text-ivory">The Collection</span>
          )}
        </nav>
        <h1 className="font-lux mt-8 text-3xl leading-relaxed text-ivory lg:text-5xl">{heading}</h1>
        <p className="mt-4 text-[11px] leading-relaxed text-fog">
          {q ? (
            <>
              <span className="font-price text-ivory">{list.length.toLocaleString('en-US')}</span>
              {list.length === 1 ? ' piece matches ' : ' pieces match '}“{q}”
            </>
          ) : sharedWish ? (
            <>
              <span className="font-price text-ivory">{list.length.toLocaleString('en-US')}</span>
              {list.length === 1 ? ' piece someone' : ' pieces someone'} wanted enough to send you the list. Wanting,
              forwarded, is still free.
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

        {/* 品类：平铺不裁切（原本是横向滚动条，最后一项永远被切成「Co」，像坏了）。
            每个值挂实时计数，且当前结果里没有的品类直接不列——Hermès 就是这么做的。
            清除是一个「Clear all」链接，不是一排 chips：实测七家没有一家用 chips 当主显示 */}
        <nav className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <button
            onClick={() => setParam('cat', null)}
            aria-current={category === null}
            className={`text-[11px] tracking-[0.15em] transition-colors ${
              category === null ? 'text-ivory' : 'text-fog hover:text-ivory'
            }`}
          >
            All
          </button>
          {CATEGORIES.filter((c) => counts[c.name]).map((c) => (
            <button
              key={c.name}
              onClick={() => setParam('cat', category === c.name ? null : c.name)}
              aria-current={category === c.name}
              className={`whitespace-nowrap text-[11px] tracking-[0.15em] transition-colors ${
                category === c.name ? 'text-ivory' : 'text-fog hover:text-ivory'
              }`}
            >
              {c.label} <span className="font-price text-[10px]">({counts[c.name]})</span>
            </button>
          ))}
          {filtered && (
            <button onClick={() => setParams({}, { replace: true })} className="quiet-link ml-auto text-[10px] text-ivory">
              Clear all
            </button>
          )}
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
        {/* Load more + 看过多少：真店的主流做法（MatchesFashion 逐字是
            「You've viewed 72 out of 3609 products」，Cartier 是「Showing 24 of …」） */}
        {list.length > 0 && (
          <div className="mt-20 flex flex-col items-start gap-5">
            <p className="text-[10px] leading-relaxed text-fog">
              You have viewed <span className="font-price text-ivory">{Math.min(visible, list.length)}</span> of{' '}
              <span className="font-price text-ivory">{list.length.toLocaleString('en-US')}</span>
              {list.length === 1 ? ' piece' : ' pieces'}
            </p>
            {visible < list.length ? (
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="quiet-link text-[11px] text-ivory"
              >
                Load more
              </button>
            ) : (
              <p className="text-[10px] leading-relaxed text-fog">
                That is all of them. Every one is priced the same as the first.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
