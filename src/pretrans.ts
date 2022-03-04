import { Complements, TrasFunc } from './types'

const isStartOptional = (query: string) => query.startsWith('.')
const isLineRun = (query: string) => query.includes('$$')
const complementsDefault = (): Complements => ({
  nonHead: false,
  lineRun: false,
})

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
