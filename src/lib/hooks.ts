import { useEffect, useRef, useState } from 'react'

/** 数字缓动滚动（治愈侧动效：克制） */
export function useCountUp(target: number, durationMs = 1200): number {
  const [value, setValue] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [target, durationMs])

  return value
}

/** 秒杀倒计时：永远停在 00:59:XX，秒数循环 */
export function useSeckillCountdown(): string {
  const [sec, setSec] = useState(59)

  useEffect(() => {
    const id = setInterval(() => setSec((s) => (s <= 0 ? 59 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  return `00:59:${sec.toString().padStart(2, '0')}`
}

/** 每 interval 毫秒轮换数组中的一项 */
export function useRotating<T>(items: T[], intervalMs = 3000): T {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % items.length), intervalMs)
    return () => clearInterval(id)
  }, [items.length, intervalMs])

  return items[i]
}

/** 长按检测（确认收货按钮彩蛋） */
export function useLongPress(onLongPress: () => void, ms = 600) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = () => {
    timer.current = setTimeout(onLongPress, ms)
  }
  const cancel = () => {
    if (timer.current) clearTimeout(timer.current)
  }

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
  }
}
