export type Option<T> = {
  value: T
  label: string
}
export type OptionWithMeta<T, Meta> = {
  value: T
  label: string
  meta?: Meta
}
