export const _count = (text: string | unknown[]) => text.length
export const _lineCount = (text: string) => text.split('\n').length

export const _packLine = (text: string, n = 1) =>
  text.replace(new RegExp(`\n{${n},}`, 'g'), '\n'.repeat(n))
