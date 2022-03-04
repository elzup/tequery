import { preTrans } from './pretrans'
import { runEval } from './runEval'
import { Complements, Result } from './types'

export function tequeryLines(
  text: string,
  query: string,
  comps: Complements,
  glue = '\n'
): Result {
  const results = text.split('\n').map((line) => runEval(line, query))

  return {
    result: results.map((r) => r.result).join(glue),
    resultRaw: results.map((r) => r.resultRaw),
    status: results.some((r) => r.status === 'ok') ? 'ok' : 'ng',
    evalQuery: results[0]?.evalQuery || '',
    returnType: results[0]?.returnType || 'string',
    errorText: results.find((r) => r.status === 'ng')?.errorText || '',
    comps,
  }
}

export function tequery(text: string, query: string, glue = '\n'): Result {
  const { query: compedQuery, comps } = preTrans(query)

  if (comps.lineRun) return tequeryLines(text, compedQuery, comps, glue)

  const res = runEval(text, compedQuery)

  return { ...res, comps }
}
