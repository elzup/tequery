import { dictionaries } from '../dictionary'
import { Suggestion } from '../types'
import { getAttrsStr } from './attrs'

export const suggester = (v: unknown): Suggestion[] => {
  const attrs = getAttrsStr(v)
  const suggestions = dictionaries.funcs.map((dict) => {
    const ptAny = dict.suggestAny?.(v) ?? 0
    const ptStr = typeof v !== 'string' ? 0 : dict.suggestText?.(v, attrs) ?? 0

    return { dict, point: ptStr + ptAny }
  })

  suggestions.sort((a, b) => b.point - a.point)

  return suggestions
}
