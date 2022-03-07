import type { DependencyList } from "react"
import { useRef } from "react"

import depsAreSame from "../utils/depsAreSame"

/**
 * useRef是useMemo的替代品
 * 用useRef手动实现useMemo, 内部保证会执行传入的回调函数, 并且记住执行结果
 * 这一点是为了解决 未来react的useMemo可能不会记住某些执行结果 的问题
 */
const useCreation = <T>(factory: () => T, deps: DependencyList): T => {
  const { current } = useRef({
    deps,
    obj: void 0 as undefined | T,
    initialized: false
  })

  /**
   * 当current初始化且依赖没有发生变化, 那么才进行计算
   */
  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps
    current.obj = factory()
    current.initialized = true
  }

  return current.obj as T
}

export default useCreation
