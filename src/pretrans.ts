const isStartOptional = (query: string) => query.startsWith('.')

export type Complement = 'nonHead'
export type Complements = Record<Complement, boolean>

const complementsDefault = (): Complements => ({
  nonHead: false,
})

type TrasFunc = (s: string) => string

export const preTrans = (query: string) => {
  const comps = complementsDefault()
  const transes: TrasFunc[] = []

  if (isStartOptional(query)) {
    comps.nonHead = true
    transes.push((q) => `$` + q)
  }
  return { query: transes.reduce((p, f) => f(p), query), comps }
}
