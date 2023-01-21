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

export const count = (text: string, regexStr: string | RegExp) =>
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

type OpShift = (typeof OP_SHIFT)[number]
type OpPick = (typeof OP_PICK)[number]
// type Op = OpShift | OpPick
// NOTE: | '=' | ':' | ',' | '|' | '&' | '!' | '+' | '*' | '/' | '%' | '^' | '~'

type CqOption = {
  spChars: string
  opsShift: OpShift[]
  opsPick: OpPick[]
}
type CqOptionArg = {
  spChars?: string
  opsShift?: OpShift[] | string
  opsPick?: OpPick[] | string
}

const isOpShift = (v: any): v is OpShift => OP_SHIFT.includes(v)
const isOpPick = (v: any): v is OpPick => OP_PICK.includes(v)
// const isOp = (v: string): v is Op => OPS.includes(v)
const defaultSpChars = ',st'

const toCqOption = (option: CqOptionArg): CqOption => {
  return {
    spChars: option.spChars ?? defaultSpChars,
    opsShift:
      typeof option.opsShift === 'string'
        ? option.opsShift?.split('').filter(isOpShift)
        : option.opsShift ?? [],
    opsPick:
      typeof option.opsPick === 'string'
        ? option.opsPick?.split('').filter(isOpPick)
        : option.opsPick ?? [],
  }
}

const emptyOr = (v: null | string | undefined, defaultValue: string): string =>
  Boolean(v) && typeof v === 'string' ? v : defaultValue

const cqOptionParse = (option: string | CqOptionArg): CqOption => {
  if (typeof option !== 'string') return toCqOption(option)

  const m = option.match(new RegExp(`^(.*?)([${OPS.join('')}]*)$`))
  const spChars = emptyOr(m?.[1], defaultSpChars)
  const opsShift = emptyOr(m?.[2], '').split('').filter(isOpShift)
  const opsPick = emptyOr(m?.[2], '').split('').filter(isOpPick)

  return { spChars, opsPick, opsShift }
}

export const cq = (text: string, option: string | CqOptionArg): string => {
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

  const [resCells, resSps] =
    opsPick.length === 0 ? [cells, sps] : [pickCells, pickSps]

  // if (resCells.length === 0) return ''

  const tail = resCells.pop() ?? ''

  return resCells.map((v, i) => `${v}${resSps[i]}`).join('') + tail
}
export const _cq = textCurry(cq)
