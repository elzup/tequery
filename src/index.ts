import { finalize } from './finalize'
import * as funcs from './funcs'
import { Complements, preTrans } from './pretrans'
import { funcEval } from './utils'

export const builtInFuncs = Object.keys(funcs)

type RunInfo = {
  status: 'ok' | 'ng'
  resultRaw: unknown
  result: string
  evalQuery: string
  errorText: string
  returnType: string
}

type Result = RunInfo & {
  comps: Complements
}

export const toReturnCode = (code: string) => `return ${code}`

const runEval = (embed: string, query: string): RunInfo => {
  const resBase = {
    status: 'ok',
    result: embed,
    resultRaw: embed,
    evalQuery: query,
    errorText: '',
    returnType: 'string',
  }

  try {
    const resultRaw = funcEval(
      {
        $: embed,
        ...funcs,
      },
      toReturnCode(query)
    )

    const returnType = typeof resultRaw
    const result = finalize(resultRaw, embed)

    if (typeof result === 'string') {
      return { ...resBase, status: 'ok', result, returnType, resultRaw }
    }

    const r: RunInfo = {
      ...resBase,
      status: 'ng',
      errorText: 'result type error',
    }

    return r
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
    resultRaw: results.map((r) => r.resultRaw),
    status: results.some((r) => r.status === 'ok') ? 'ok' : 'ng',
    evalQuery: results[0]?.evalQuery || '',
    returnType: results[0]?.returnType || 'string',
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
