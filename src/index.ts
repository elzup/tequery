import { preTrans } from './pretrans'
import { runEval } from './runEval'
import { Complements, Option, OptionV3, Result } from './types'

export function tequeryLines(
  text: string,
  query: string,
  comps: Complements,
  option: OptionV3
): Result {
  const results = text
    .split('\n')
    .map((line, i) => runEval(line, query, option, i))

  /* istanbul ignore next */
  if (!results[0]) throw new Error('never reach') // always .split('\n').length > 0

  return {
    result: results.map((r) => r.result).join(option.glue),
    resultRaw: results.map((r) => r.resultRaw),
    status: results.some((r) => r.status === 'ok') ? 'ok' : 'ng',
    evalQuery: results[0].evalQuery,
    returnType: results[0].returnType,
    errorText: results.find((r) => r.status === 'ng')?.errorText ?? '',
    comps,
  }
}

const semanticPolifil = (option: Option): OptionV3 => {
  if (typeof option === 'string') return { glue: option }
  return option
}

export function tequery(
  text: string,
  query: string,
  option0: Option = { glue: '\n' }
): Result {
  const option = semanticPolifil(option0)

  const { query: compedQuery, comps } = preTrans(query)

  if (comps.lineRun) return tequeryLines(text, compedQuery, comps, option)

  const res = runEval(text, compedQuery, option)

  return { ...res, comps }
}
