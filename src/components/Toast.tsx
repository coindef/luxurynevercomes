import { createContext, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

const ToastContext = createContext<(msg: string) => void>(() => {})

/** 白手套托银盘式轻提示：黑底金边，慢慢来 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = (m: string) => {
    setMsg(m)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setMsg(null), 2600)
  }

  return (
    <ToastContext.Provider value={show}>
      {children}
      {msg && (
        <div className="float-up fixed bottom-24 left-1/2 z-50 -translate-x-1/2">
          <div className="max-w-[340px] bg-[#111111]/95 px-5 py-3 text-center text-xs leading-relaxed text-[#f5f5f5]">
            {msg}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
