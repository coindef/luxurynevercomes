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
    // 长句多是两段式冷笑话，第二句才是包袱——按长度给读完的时间
    timer.current = setTimeout(() => setMsg(null), Math.min(7000, Math.max(2600, m.length * 45)))
  }

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* aria-live 要求常驻节点（只换内容不卸载），读屏才会播报；
          手机端抬高到吸底栏之上，别让笑话盖在 Checkout 按钮上 */}
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-40 left-1/2 z-50 -translate-x-1/2 lg:bottom-24">
        {msg && (
          <div className="float-up max-w-[340px] bg-[#111111]/95 px-5 py-3 text-center text-xs leading-relaxed text-[#f5f5f5]">
            {msg}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
