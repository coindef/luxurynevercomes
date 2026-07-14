import { Component } from 'react'
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
    console.error('[富了个寂寞]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-10 text-center">
          <span className="text-5xl">🎩</span>
          <p className="font-lux text-sm text-ivory">殿堂出了点状况</p>
          <p className="text-[11px] leading-relaxed text-fog">
            管家正在处理，处理方式是深呼吸。
            <br />
            您没有任何损失——本来也不收钱。
          </p>
          <button
            onClick={() => location.reload()}
            className="gold-cta mt-1 px-10 py-2.5 text-sm tracking-widest"
          >
            重新入场
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
