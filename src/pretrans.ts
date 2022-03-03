const isStartOptional = (query: string) => query.startsWith('.')
const isLineRun = (query: string) => query.includes('$$')

export type Complement = 'nonHead' | 'lineRun'
export type Complements = Record<Complement, boolean>

const complementsDefault = (): Complements => ({
  nonHead: false,
  lineRun: false,
})

type TrasFunc = (s: string) => string

export const preTrans = (query: string) => {
  const comps = complementsDefault()
  const transes: TrasFunc[] = []

  if (isStartOptional(query)) {
    comps.nonHead = true
    transes.push((q) => `$` + q)
  }
  if (isLineRun(query)) {
    comps.lineRun = true
    transes.push((q) => q.replace(`$$`, '$'))
  }
  return { query: transes.reduce((p, f) => f(p), query), comps }
}
