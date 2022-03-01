import * as funcs from './funcs'
// import { _count } from './funcs'
import { Complements, preTrans } from './pretrans'
import { transpose } from './utils'

export const builtInFuncs = Object.keys(funcs)
const [builtInFuncNames, buitlIntFuncs] = transpose(Object.entries(funcs)) as [
  string[],
  unknown[]
]

type ResultTypes = string | number | (string | number)[]
type RunInfo = {
  status: 'ok' | 'ng'
  result: ResultTypes
  evalQuery: string
  errorText: string
  isResultFunc: boolean
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

  const resBase = {
    status: 'ok',
    result: embed,
    evalQuery,
    errorText: '',
    isResultFunc: false,
  }

  try {
    const result0 = Function(
      '_$text',
      ...builtInFuncNames,
      toReturnCode(evalQuery)
    )(embed, ...buitlIntFuncs)

    const isResultFunc = typeof result0 === 'function'
    const result = isResultFunc ? result0(embed) : result0

    if (!isAllowType(result))
      return {
        ...resBase,
        status: 'ng',
        errorText: 'result type error',
        isResultFunc,
      }

    return { ...resBase, status: 'ok', result, isResultFunc }
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

  const isResultFunc = results[0]?.isResultFunc || false

  return {
    result: results.map((r) => r.result).join(glue),
    status: results.some((r) => r.status === 'ok') ? 'ok' : 'ng',
    evalQuery: results[0]?.evalQuery || '',
    errorText: results.find((r) => r.status === 'ng')?.errorText ?? '',
    comps: { ...comps, 'call@': isResultFunc },
  }
}

export function tequery(text: string, query: string, glue = '\n'): Result {
  const { query: compedQuery, comps } = preTrans(query)

  if (query.includes('$')) return tequeryLines(text, compedQuery, comps, glue)

  const res = runEval(text, compedQuery)

  const result = Array.isArray(res.result)
    ? res.result.join(glue)
    : String(res.result)

  return { ...res, result, comps: { ...comps, 'call@': res.isResultFunc } }
}
