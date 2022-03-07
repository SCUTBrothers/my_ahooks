import { useRef } from "react"

/**
 * 这个函数好像也就是和普通的useRef写法一样,只不过是用函数包了一下而已
 * * 源码文档写的是为了解决闭包问题
 * ? 具体是怎么样的呢? 难道是为了解决命名冲突?
 * @param value
 * @returns
 */
function useLatest<T>(value: T) {
  const ref = useRef(value)
  ref.current = value

  return ref
}

export default useLatest
