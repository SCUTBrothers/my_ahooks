import { useMemo, useRef } from "react"

type noop = (this: any, ...args: any[]) => any

/**
 * 用于代替useCallback
 * 返回一个持久记忆化的函数对象, 该函数不会在渲染过程中重新生成
 * 不需要传入deps
 */
export default function useMemoizedFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn)

  // 记忆外部传入的fn
  fnRef.current = useMemo(() => fn, [fn])

  // 记忆外部传入的fn的执行结果
  const memoizedFn = useRef<T>()

  if (!memoizedFn.current) {
    memoizedFn.current = function (...args) {
      return fnRef.current.apply(this, args)
    } as T
  }

  return memoizedFn.current
}
