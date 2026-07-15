import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-10 text-center">
      <span className="text-5xl">🖤</span>
      <p className="font-lux text-sm text-ivory">404 · No such hall</p>
      <p className="text-[11px] leading-relaxed text-fog">This room, like your parcel, does not exist.</p>
      <Link to="/" className="gold-cta mt-1 px-10 py-2.5 text-sm tracking-widest">
        Back to the salon ›
      </Link>
    </div>
  )
}
