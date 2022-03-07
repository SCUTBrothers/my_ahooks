// Service为返回Promise的函数, TParams指定了请求所需的参数数组
// * 对于请求来说, 只需要知道你请求的参数设置,以及你期望的返回数据类型
export type Service<TData, TParams extends unknown[]> = (
  ...args: TParams
) => Promise<TData>

export interface Options<TData, TParams extends unknown[]> {
  /**
   * 默认 false。 即在初始化时自动执行 service。
   * 如果设置为 true，则需要手动调用 run 或 runAsync 触发执行。
   */
  manual?: boolean

  /**
   * 传给service的默认参数
   */
  defaultParams?: TParams

  /**
   * 请求前, 以及请求后的一个处理逻辑
   */
  onBefore?: (params: TParams) => void
  onFinally?: (params: TParams, data?: TData, e?: Error) => void
  onSuccess?: (data: TData, params: TParams) => void
  onError?: (e: Error, params: TParams) => void
}

export type Subscript = () => void
