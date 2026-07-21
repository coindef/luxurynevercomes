import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-10 text-center">
      <div className="font-lux flex h-16 w-16 items-center justify-center border border-hairline text-2xl text-ivory">Z</div>
      <p className="font-lux text-sm text-ivory">404 · No such hall</p>
      <p className="text-[11px] leading-relaxed text-fog">This hall, like your delivery, does not exist. The butler was never headed here either.</p>
      <Link to="/" className="gold-cta mt-1 px-10 py-2.5 text-sm tracking-widest">
        Back to the salon ›
      </Link>
    </div>
  )
}
