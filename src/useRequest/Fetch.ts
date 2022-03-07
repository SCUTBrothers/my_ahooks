export default class Fetch<TData, TParams extends any[]> {
  pluginImpls: PluginReturn<TData, TParams>[]

  count: number = 0

  state: {
    loading: false
    params: undefined
    data: undefined
    error: undefined
  }

  constructor(
    public serviceRef,
    public options,
    public subscribe,
    public initState
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
      ...initState
    }
  }

  setState(s: Partial<FetchState<TData, TParams> = {}) {
      this.state = {
          ...this.state,
          ...s
      }

      this.subscribe()
  }

  runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
      const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean)

      return Object.assign({}, ...r)
  }

  async runAsync(...params: TParams): Promise(<TData>) {
      this.count += 1
        const currentCount = this.count

        const {
            stopNow = false,
            returnNow = false,
            ...state
        } = this.runPluginHandler("onBefore", params)

      if (stopNow) {
          return new Promise(() => {})
      }

      this.setState({
          loading: true,
          params,
          ...state
      })

      if (returnNow) {
          return Promise.resolve(state.data)
      }

      this.options.onBefore?.(params)

      try {
          let {servicePromise} = this.runPluginHandler("onRequest", this.serviceRef.current, params)

          if (!servicePromise) {
              servicePromise = this.serviceRef.current(...params)
          }

          const res = await servicePromise

          if (currentCount !== this.count) {
              return new Promise(() => {})
          }

          this.setState({
              data: res,
              error: undefined,
              loading: false
          })

          this.options.onSuccess?.(res, params)
          this.runPluginHandler("onSuccess", res, params)
          this.options.onFinally?.(params, res, undefined)

          if (currentCount === this.count) {
              this.runPluginHandler("onFinally", params, res, undefined)
          }

          return res
      } catch (error) {
          if (currentCount !== this.count) {
              return new Promise(() => {})
          }
      }

      this.setState({
          error,
          loading: false
      })

      this.options.onError?.(error, params)
      this.runPluginHandler("onError", error, params)

      this.options.onFinally?.(params, undefined, error)

      if (currentCount === this.count) {
          this.runPluginHandler("onFinally", params, undefined, error)
      }

      throw error
  }

  run(...params: TParams) {
      this.runAsync(..params).catch((error) => {
          if (!this.options.onError) {
              console.error(error)
          }
      })
  }

  cancel() {
      this.count += 1
      this.setState({
          loading: false
      })

      this.runPluginHandler("onCancel")
  }

  refresh() {
      this.run(...(this.state.params || []))
  }

  refreshAsync() {
      return this.runAsync(...(this.state.params || []))
  }

  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
      let targetData: TData | undefined

      if (typeof data === "function") {
          targetData = data(this.state.data)
      } else {
          targetData = data
      }

      this.runPluginHandler("onMutate", targetData)

      this.setState({
          data:targetData
      })
  }
}
