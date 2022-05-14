type Attrs = Record<AttrType, boolean>
type Suggestion = {
  key: AttrType
  check: (part: {
    text: string
    line1: string | null
    lines: string[]
  }) => boolean
}

export type AttrType = 'multiline' | 'csvLike' | 'tsvLike'
const suggests: Suggestion[] = [
  {
    key: 'multiline',
    check: ({ lines }) => lines.length > 1,
  },
  {
    key: 'csvLike',
    check: ({ line1 }) => (line1 ?? '').split(',').length >= 3,
  },
  {
    key: 'tsvLike',
    check: ({ line1 }) => (line1 ?? '').split('\t').length >= 3,
  },
]

export const attrTypes = suggests.map((v) => v.key)

export const getAttrs = (text: string): Attrs => {
  const attrs: Attrs = {
    multiline: false,
    csvLike: false,
    tsvLike: false,
  }

  const lines = text.split('\n')
  const line1 = lines[0] || null

  suggests.forEach((s) => {
    attrs[s.key] = s.check({ text, line1, lines })
  })

  return attrs
}

export const suggester = (text: string) => {
  const attrs = getAttrs(text)

  return { attrs }
}
