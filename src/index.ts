import * as funcs from './funcs'
// import { _count } from './funcs'
import { Complements, preTrans } from './pretrans'
import { funcEval } from './utils'

export const builtInFuncs = Object.keys(funcs)
type AllowType = string | number
type ResultTypes = AllowType | AllowType[]
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

export const toReturnCode = (code: string) => {
  return `return ${code}`
}

const runEval = (embed: string, query: string): RunInfo => {
  const resBase = {
    status: 'ok',
    result: embed,
    evalQuery: query,
    errorText: '',
    isResultFunc: false,
  }

  try {
    const result0 = funcEval(
      {
        $: embed,
        ...funcs,
      },
      toReturnCode(query)
    )

    const isResultFunc = typeof result0 === 'function'
    const result = isResultFunc
      ? result0(embed)
      : typeof result0 === 'undefined'
      ? ''
      : result0

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
    .map((line) => runEval(line, query.replace('$$', '$')))

  const isResultFunc = results[0]?.isResultFunc || false

  return {
    result: results.map((r) => r.result).join(glue),
    status: results.some((r) => r.status === 'ok') ? 'ok' : 'ng',
    evalQuery: results[0]?.evalQuery || '',
    errorText: results.find((r) => r.status === 'ng')?.errorText ?? '',
    comps: { ...comps, 'call@': isResultFunc },
  }
}

const finalize = (res: AllowType): string => {
  return String(res)
}

export function tequery(text: string, query: string, glue = '\n'): Result {
  const { query: compedQuery, comps } = preTrans(query)

  if (query.includes('$$')) return tequeryLines(text, compedQuery, comps, glue)

  const res = runEval(text, compedQuery)

  const result = Array.isArray(res.result)
    ? res.result.map(finalize).join(glue)
    : finalize(res.result)

  return { ...res, result, comps: { ...comps, 'call@': res.isResultFunc } }
}
