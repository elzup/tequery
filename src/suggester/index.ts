// TODO: commandLike '$ '
// TODO: hasColon

type Characts = Record<CharactType, boolean>
type Suggestion = {
  key: CharactType
  check: (part: {
    text: string
    line1: string | null
    lines: string[]
  }) => boolean
}

type CharactType = 'multiline' | 'csvLike' | 'tsvLike'
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
// const charactTypes = suggests.map((v) => v.key)

export const getCharacts = (text: string): Characts => {
  const characts: Characts = {
    multiline: false,
    csvLike: false,
    tsvLike: false,
  }

  const lines = text.split('\n')
  const line1 = lines[0] || null

  suggests.forEach((s) => {
    characts[s.key] = s.check({ text, line1, lines })
  })

  return characts
}

export const suggester = (text: string) => {
  const characts = getCharacts(text)

  return { characts }
}
