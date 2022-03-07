export type Data = { total: number; list: any[] }

export type Params = [
  { current: number; pageSize: number; [key: string]: any },
  ...any[]
]
