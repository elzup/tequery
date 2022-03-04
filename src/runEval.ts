import { finalize } from './finalize'
import * as funcs from './funcs'
import { RunInfo } from './types'
import { funcEval } from './utils'
import { vars } from './vars'

export const builtInFuncs = Object.keys(funcs)
export const toReturnCode = (code: string) => `return ${code}`

export const runEval = (embed: string, query: string): RunInfo => {
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
        ...vars(embed),
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
