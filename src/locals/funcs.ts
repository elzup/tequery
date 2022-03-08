/* eslint-disable @typescript-eslint/no-explicit-any */

type Shift<T extends unknown[]> = T extends [infer _, ...infer U] ? U : []

type TextFunc = (text: string, ...args: any[]) => any
type TextArgs<T extends TextFunc> = Shift<Parameters<T>>

const textCurry =
  <T extends TextFunc>(func: T) =>
  (...params: TextArgs<T>) =>
  (text: string): ReturnType<T> =>
    func(text, ...params)

export const len = (text: string | unknown[]) => text.length

export const count = (text: string, regexStr: string) =>
  (text.match(new RegExp(regexStr, 'g')) || []).length
export const _count = textCurry(count)

export const lineNum = (text: string) => text.split('\n').length
export const ln = lineNum

export const pack = (text: string, n = 1) =>
  text.replace(new RegExp(`\n{${n},}`, 'g'), '\n'.repeat(n))
export const _pack = textCurry(pack)

export const shiftl = (text: string, to = '\t', n = 1) =>
  text.split(to).slice(n).join(to)
export const _shiftl = textCurry(shiftl)

export const shiftr = (text: string, to = '\t', n = 1) =>
  text.split(to).slice(0, -n).join(to)
export const _shiftr = textCurry(shiftr)

export const json = JSON.stringify
export const jsonf = (v: unknown) => JSON.stringify(v, null, '\t')

/** cell query */
export const cq = (text: string, code: string) => {
  const splits = (code.match(/(.*?)[<>]/)?.[1] || ',st')
    .split('')
    .map((v) => ({ ',': ',', s: ' ', t: '\\t' }[v]))
    .filter(Boolean)
    .join('')
  const spRe = new RegExp(`[${splits}]`, 'g')
  const sps = text.match(spRe)?.map((v) => v) || []

  const cells = text.split(spRe)

  const lc = count(code, '<')
  const rc = count(code, '>')

  ;[...Array(lc)].forEach(() => {
    cells.shift()
    sps.shift()
  })
  ;[...Array(rc)].forEach(() => {
    cells.pop()
    sps.pop()
  })
  if (cells.length === 0) return ''
  return sps.reduce((p, c, i) => `${p}${c}${cells[i + 1]}`, cells[0])
}
