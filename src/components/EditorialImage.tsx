import { useState } from 'react'

/**
 * 编辑式全幅配图：页面之间的呼吸。
 * 图片缺失时整块消失（不留占位空框）——缺图不是错误，是安静。
 */
export default function EditorialImage({
  src,
  alt,
  caption,
  className = 'h-[42vh] lg:h-[58vh]',
}: {
  src: string
  alt: string
  /** 图下的一行小字（可选） */
  caption?: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) return null

  return (
    <figure className="mt-24 lg:mt-40">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className={`w-full object-cover ${className}`}
      />
      {caption && (
        <figcaption className="mx-auto max-w-6xl px-6 pt-4 text-[9px] leading-relaxed text-fog">{caption}</figcaption>
      )}
    </figure>
  )
}
