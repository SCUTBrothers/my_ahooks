import { useRef } from "react"
import { useEffect, useLayoutEffect } from "react"

type effectHookType = typeof useEffect | typeof useLayoutEffect

/**
 * 创建useUpdateEffect
 * useUpdateEffect(callback)中的callback只有在组件mounted时才会执行
 *
 * 组件会经历第一次初始化创建阶段, 然后mounted.
 * 在创建以后, 每一次setState调用触发的是组件更新. 在该阶段,组件会diff更新,然后mount挂载
 *
 * useUpdateEffect(callback)的使用场景为
 * 组件的第一次初始化创建阶段的mounted阶段不会执行callback
 * 但是往后的每一次更新的挂载后阶段mounted, 都会执行callback
 *
 * ! useUpdateEffect(callback)和useEffect(callback)的区别在于, 第一次挂载是否触发callback
 * @param hook
 * @returns
 */
const createUpdateEffect: (hook: effectHookType) => effectHookType =
  (hook) => (effect, deps) => {
    const isMounted = useRef(false)

    hook(
      () => () => {
        isMounted.current = false
      },
      []
    )

    hook(() => {
      if (!isMounted.current) {
        // 在组件的第一次初始化阶段, 固定isMounted.current = true
        // effect不会被执行
        isMounted.current = true
      } else {
        // 在往后的组件mounted阶段, isMounted.current都保持为true
        // 会去执行effect()
        return effect()
      }
    }, deps)
  }

export default createUpdateEffect
