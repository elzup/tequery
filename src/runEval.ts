import { finalize } from './finalize'
import * as funcs from './locals/funcs'
import { OptionV3, RunInfo } from './types'
import { funcEval } from './utils'
import { vars } from './locals/vars'

export const toReturnCode = (code: string) => `return ${code}`

export const runEval = (
  embed: string,
  query: string,
  option: OptionV3 = { glue: '\n' },
  lineNum: number | undefined = undefined
): RunInfo => {
  const resBase = {
    status: 'ok',
    result: embed,
    resultRaw: embed,
    evalQuery: query,
    errorText: '',
    returnType: 'string',
  }

  try {
    const args = {
      $: embed,
      ...funcs,
      ...vars(embed, lineNum),
    }
    const resultRaw = funcEval(args, toReturnCode(query))

    const returnType = typeof resultRaw
    const result = finalize(resultRaw, embed, { glue: option.glue }, args)

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
