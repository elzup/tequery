export const len = (text: string | unknown[]) => text.length

export const count = (text: string, regexStr: string) =>
  (text.match(new RegExp(regexStr, 'g')) || []).length

export const lineNum = (text: string) => text.split('\n').length
export const ln = lineNum

export const pack = (text: string, n = 1) =>
  text.replace(new RegExp(`\n{${n},}`, 'g'), '\n'.repeat(n))

export const shiftl = (text: string, to = '\t', n = 1) =>
  text.split(to).slice(n).join(to)

export const shiftr = (text: string, to = '\t', n = 1) =>
  text.split(to).slice(0, -n).join(to)

export const json = JSON.stringify
export const jsonf = (v: unknown) => JSON.stringify(v, null, '\t')
