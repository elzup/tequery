import { count } from '../locals/funcs'
import { Attrs, Suggestion } from '../types'

const suggests: Suggestion[] = [
  {
    key: 'multiline',
    check: ({ lines }) => lines.length > 1,
  },
  {
    key: 'csvLike',
    check: ({ line1 }) => count(line1 ?? '', ',') >= 2,
  },
  {
    key: 'tsvLike',
    check: ({ line1 }) => count(line1 ?? '', '\t') >= 2,
  },
  {
    key: 'cellLike',
    check: ({ line1 }) => count(line1 ?? '', /[\t,. -]/g) >= 3,
  },
]

export const attrKeys = suggests.map((v) => v.key)
const initialAttrs: Attrs = {
  multiline: false,
  csvLike: false,
  tsvLike: false,
  cellLike: false,
}

export const getAttrsStr = (text: string): Attrs => {
  const attrs = initialAttrs

  const lines = text.split('\n')
  const line1 = lines[0] || null

  suggests.forEach((s) => {
    attrs[s.key] = s.check({ text, line1, lines })
  })

  return attrs
}

export const suggester = (text: string) => {
  const attrs = getAttrsStr(text)

  return { attrs }
}
