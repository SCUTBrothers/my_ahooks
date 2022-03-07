import {
  useCreation,
  useLatest,
  useMemoizedFn,
  useMount,
  useUnmount,
  useUpdate
} from "../../index"

import Fetch from "./Fetch"
import type { Service, Options } from "./index.types"

export default function useRequestImplement<TData, TParams extends unknown[]>(
  service: Service<TData, TParams>,
  options: Options<TData, TParams>,
  plugins: unknown[]
) {
  // manual默认配置为false
  const { manual = false, ...rest } = options

  const fetchOptions = {
    manual,
    ...rest
  }

  const serviceRef = useLatest(service)

  const update = useUpdate()

  const fetchInstance = useCreation(() => {
    // ? 初始化阶段运行一下plugins
    const initState = plugins
      .map((p) => p?.onInit?.(fetchOptions))
      .filter(Boolean)

    return new Fetch<TData, TParams>(
      serviceRef,
      fetchOptions,
      update,
      Object.assign({}, ...initState)
    )
  })
  fetchInstance.options = fetchOptions
  // ? 初始化以后运行一下plugins
  fetchInstace.pluginImpls = plugins.map((p) => p(fetchInstance, fetchOptions))

  useMount(() => {
    if (!manual) {
      const params = fetchInstance.state.params || options.defaultParmas || []
      fetchInstance.run(...params)
    }
  })

  useUnmount(() => {
    fetchInstance.cancel()
  })

  return {
    loading: fetchInstance.state.loading,
    data: fetchInstance.state.data,
    error: fetchInstance.state.error,
    params: fetchInstance.state.params || [],
    cancel: useMemoizedFn(fetchInstance.cancel.bind(fetchInstance)),
    refresh: useMemoizedFn(fetchInstance.refresh.bind(fetchInstance)),
    refreshAsync: useMemoizedFn(fetchInstance.refreshAsync.bind(fetchInstance)),
    run: useMemoizedFn(fetchInstance.run.bind(fetchInstance)),
    runAsync: useMemoizedFn(fetchInstance.runAsync.bind(fetchInstance)),
    mutate: useMemoizedFn(fetchInstance.mutate.bind(fetchInstance))
  }
}
