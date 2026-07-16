import { useId, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * 详情页的折叠区。用原生 <button aria-expanded> + 区域，不引组件库。
 *
 * 真店的折叠区标题是**每家自己的一套词**，而且**按商品拼装**，不是固定模板：
 *   Cartier：Instructions for use / Sizing guide / CARE / Gift Wrapping / Shipping / return
 *   Hermès：Product description / Care / Delivery & returns / Gifting / The story behind
 * 而且 Hermès 两个商品的折叠区并不一样——有定制内容的才有「and customization」，
 * 有规格的才有「Product details」。所以这里也按商品拼（见 ProductDetail 的 sections）。
 *
 * 没有边框、没有底色：靠发丝线分隔，标题即热区。
 */
export default function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div className="border-t border-hairline">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-lux text-xs text-ivory">{title}</span>
        {/* 加减号而不是箭头：不旋转、不弹跳，只是换个字形 */}
        <span aria-hidden="true" className="ml-4 shrink-0 text-[11px] leading-none text-fog">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div id={id} className="float-up pb-8">
          {children}
        </div>
      )}
    </div>
  )
}
