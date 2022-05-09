import { toReturnCode } from './runEval'
import { funcEval } from './utils'

export const finalize = (
  v: unknown,
  text: string,
  { glue }: { glue: string },
  args: Record<string, unknown>,
  end = false
): string | false => {
  if (v === null || v === undefined) {
    return ''
  } else if (Array.isArray(v)) {
    return v.join(glue)
  }

  if (typeof v === 'function') {
    if (end) return false

    try {
      const resultRaw = funcEval(
        {
          ...args,
          _f: v,
          text,
        },
        toReturnCode('_f(text)')
      )

      return finalize(resultRaw, text, { glue }, args, true)
    } catch (_e) {
      return false
    }
  }
  if (typeof v === 'object') {
    return JSON.stringify(v)
  }
  return String(v)
}
