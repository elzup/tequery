type CharactType = 'multiline' | 'csvLike' | 'tsvLike'

// TODO: commandLike '$ '
// TODO: hasColon

type Characts = Record<CharactType, boolean>
export const getCharacts = (text: string): Characts => {
  const characts: Characts = {
    multiline: false,
    csvLike: false,
    tsvLike: false,
  }

  if (text.includes('\n')) characts.multiline = true
  const firstLine = text.split('\n')[0]

  if (firstLine) {
    if (firstLine.split(',').length >= 3) characts.csvLike = true
    if (firstLine.split('\t').length >= 3) characts.tsvLike = true
  }

  return characts
}

export const suggester = (text: string) => {
  const characts = getCharacts(text)

  return { characts }
}
