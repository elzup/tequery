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
  returnType: string
  endReturnType: string
}

type Result = {
  status: 'ok' | 'ng'
  result: string
  evalQuery: string
  errorText: string
  comps: Complements
  returnType: string
  endReturnType: string
}

const allowTypes = ['string', 'number']

export const isAllowType = (result: unknown): result is ResultTypes =>
  allowTypes.includes(typeof (Array.isArray(result) ? result[0] : result))

export const toReturnCode = (code: string) => {
  return `return ${code}`
}

const finalize = (
  result: unknown,
  text: string
): {
  result: ResultTypes
  ok: boolean
} => {
  if (typeof result === 'function') {
    const endResult = result(text)

    return { ok: true, result: endResult }
  }
  if (typeof result === 'undefined') {
    return { ok: true, result: '' }
  }
  if (isAllowType(result)) {
    return { ok: true, result }
  }
  return { ok: false, result: '' }
}

const runEval = (embed: string, query: string): RunInfo => {
  const resBase = {
    status: 'ok',
    result: embed,
    evalQuery: query,
    errorText: '',
    returnType: 'string',
    endReturnType: 'string',
  }

  try {
    const result0 = funcEval(
      {
        $: embed,
        ...funcs,
      },
      toReturnCode(query)
    )

    const returnType = typeof result0
    const { result, ok } = finalize(result0, embed)
    const endReturnType = typeof result

    if (ok) {
      return { ...resBase, status: 'ok', result, returnType, endReturnType }
    }
    return {
      ...resBase,
      status: 'ng',
      errorText: 'result type error',
    }
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

  return {
    result: results.map((r) => r.result).join(glue),
    status: results.some((r) => r.status === 'ok') ? 'ok' : 'ng',
    evalQuery: results[0]?.evalQuery || '',
    returnType: results[0]?.returnType || 'string',
    endReturnType: results[0]?.endReturnType || 'string',
    errorText: results.find((r) => r.status === 'ng')?.errorText ?? '',
    comps: { ...comps },
  }
}

export function tequery(text: string, query: string, glue = '\n'): Result {
  const { query: compedQuery, comps } = preTrans(query)

  if (query.includes('$$')) return tequeryLines(text, compedQuery, comps, glue)

  const res = runEval(text, compedQuery)

  const result = Array.isArray(res.result)
    ? res.result.map(String).join(glue)
    : String(res.result)

  return { ...res, result, comps: { ...comps } }
}
