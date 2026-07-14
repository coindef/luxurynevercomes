import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-10 text-center">
      <span className="text-5xl">🖤</span>
      <p className="font-lux text-sm text-ivory">404 · 查无此厅</p>
      <p className="text-[11px] leading-relaxed text-fog">这个房间和您的包裹一样，并不存在。</p>
      <Link to="/" className="gold-cta mt-1 border border-gold px-8 py-2 text-sm tracking-widest text-gold">
        回殿堂 ›
      </Link>
    </div>
  )
}
