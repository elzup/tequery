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

const OP_SHIFT = ['<', '>'] as const
const OP_PICK = ['_', '.'] as const
const OPS = [OP_SHIFT, OP_PICK].flat()

type OpShift = typeof OP_SHIFT[number]
type OpPick = typeof OP_PICK[number]
// type Op = OpShift | OpPick
// NOTE: | '=' | ':' | ',' | '|' | '&' | '!' | '+' | '*' | '/' | '%' | '^' | '~'

type CqOption = {
  spChars: string
  opsShift: OpShift[]
  opsPick: OpPick[]
}

const isOpShift = (v: any): v is OpShift => OP_SHIFT.includes(v)
const isOpPick = (v: any): v is OpPick => OP_PICK.includes(v)
// const isOp = (v: string): v is Op => OPS.includes(v)

const cqOptionParse = (option: string | CqOption): CqOption => {
  if (typeof option !== 'string') return option

  const m = option.match(new RegExp(`^(.*?)([${OPS.join('')}]*)$`))
  const spChars = m?.[1] || ',st'
  const opsShift = (m?.[2] || '').split('').filter(isOpShift)
  const opsPick = (m?.[2] || '').split('').filter(isOpPick)

  return { spChars, opsPick, opsShift }
}

export const cq = (text: string, option: string | CqOption): string => {
  const { spChars, opsShift, opsPick } = cqOptionParse(option)

  const splits = spChars
    .split('')
    .map((v) => ({ ',': ',', s: ' ', t: '\\t' }[v]))
    .filter(Boolean)
    .join('')
  // sps 追加
  const spRe = new RegExp(`[${splits}]`, 'g')
  const sps = text.match(spRe)?.map((v) => v) || []

  const cells = text.split(spRe)

  opsShift.forEach((op) => {
    switch (op) {
      case '<': {
        cells.shift()
        sps.shift()
        break
      }
      case '>': {
        cells.pop()
        sps.pop()
        break
      }
    }
  })

  const pickCells: (string | undefined)[] = []
  const pickSps: (string | undefined)[] = []

  console.log({ opsPick })

  opsPick.forEach((op) => {
    switch (op) {
      case '.': {
        pickCells.push(cells.shift())
        pickSps.push(sps.shift())
        break
      }
      case '_': {
        cells.shift()
        sps.shift()
        break
      }
    }
  })

  if (opsPick.length > 0) {
    return pickCells.map((v, i) => `${v}${pickSps[i + 1] || ''}`).join('')
  }
  if (cells.length === 0) return ''
  return sps.reduce((p, c, i) => `${p}${c}${cells[i + 1]}`, cells[0]) || ''
}
export const _cq = textCurry(cq)
