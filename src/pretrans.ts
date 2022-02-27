const isSingleFuncQuery = (query: string) =>
  !query.includes('@') && !query.includes('.') && !query.includes('.')
const isStartOptional = (query: string) => query.startsWith('.')

type Complement = 'head@' | 'call@'

const complementsDefault = (): Record<Complement, boolean> => ({
  'head@': false,
  'call@': false,
})

type TrasFunc = (s: string) => string

export const preTrans = (query: string) => {
  const comps = complementsDefault()
  const transes: TrasFunc[] = []

  if (isStartOptional(query)) {
    comps['head@'] = true
    transes.push((q) => `@` + q)
  }
  if (isSingleFuncQuery(query)) {
    comps['call@'] = true
    transes.push((q) => q + '(@)')
  }
  return { query: transes.reduce((p, f) => f(p), query), comps }
}
