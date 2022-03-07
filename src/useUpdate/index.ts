import { useCallback, useState } from "react"

/**
 * 返回一个用于 强制组件更新 的函数
 * @returns
 */
const useUpdate = () => {
  const [, setState] = useState({})

  return useCallback(() => setState({}), [])
}

export default useUpdate
