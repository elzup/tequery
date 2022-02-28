import * as funcs from './funcs'
// import { _count } from './funcs'
import { Complements, preTrans } from './pretrans'

export const builtInFuncs = Object.keys(funcs)

type ResultTypes = string | number | (string | number)[]
type RunInfo = {
  status: 'ok' | 'ng'
  result: ResultTypes
  evalQuery: string
  errorText: string
}

type Result = {
  status: 'ok' | 'ng'
  result: string
  evalQuery: string
  errorText: string
  comps: Complements
}

const allowTypes = ['string', 'number']

export const isAllowType = (result: unknown): result is ResultTypes =>
  allowTypes.includes(typeof (Array.isArray(result) ? result[0] : result))

const _$text = '_$text'

export const toReturnCode = (code: string) => {
  if (code.includes(';')) return code.replace(/.*;/, '$&return ')
  return `return ${code}`
}

const runEval = (embed: string, query: string): RunInfo => {
  const evalQuery = query.replace('@', _$text)

  // NOTE: any ideas smartly send context to eval
  const { _count, _lineCount, _packLine } = funcs // for eval
  const resBase = { status: 'ok', result: embed, evalQuery, errorText: '' }

  try {
    const result = Function(
      '_$text',
      ...builtInFuncs,
      toReturnCode(evalQuery)
    )(embed, ...Object.values(funcs)) as unknown

    if (!isAllowType(result))
      return { ...resBase, status: 'ng', errorText: 'result type error' }

    return { ...resBase, status: 'ok', result }
  } catch (_e) {
    return {
      ...resBase,
      status: 'ng',
      errorText: 'eval error',
    }
  }
}

export function tequeryLines(
  text: string,
  query: string,
  comps: Complements,
  glue = '\n'
): Result {
  const results = text
    .split('\n')
    .map((line) => runEval(line, query.replace('$', '@')))

  return {
    result: results.map((r) => r.result).join(glue),
    status: results.some((r) => r.status === 'ok') ? 'ok' : 'ng',
    evalQuery: results[0]?.evalQuery || '',
    errorText: results.find((r) => r.status === 'ng')?.errorText ?? '',
    comps,
  }
}

export function tequery(text: string, query: string, glue = '\n'): Result {
  const { query: compedQuery, comps } = preTrans(query)

  if (query.includes('$')) return tequeryLines(text, compedQuery, comps, glue)

  const res = runEval(text, compedQuery)

  const result = Array.isArray(res.result)
    ? res.result.join(glue)
    : String(res.result)

  return { ...res, result, comps }
}
