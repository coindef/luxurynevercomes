import { Component } from 'react'
import { IconHat } from './icons'
import type { ErrorInfo, ReactNode } from 'react'

interface State {
  hasError: boolean
}

/** 全站错误兜底：出错也要有排面 */
export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[LuxuryNeverComes]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-10 text-center">
          <IconHat size={44} className="text-fog" />
          <p className="font-lux text-sm text-ivory">The salon hit a snag</p>
          <p className="text-[11px] leading-relaxed text-fog">
            The butler is handling it, by taking a deep breath.
            <br />
            You have lost nothing. We were never charging anyway.
          </p>
          <button
            onClick={() => location.reload()}
            className="gold-cta mt-1 px-10 py-2.5 text-sm tracking-widest"
          >
            Re-enter
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
