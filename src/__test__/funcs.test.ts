import {
  count,
  json,
  jsonf,
  len,
  lineNum,
  ln,
  pack,
  shiftl,
  shiftr,
  cq,
  _cq,
  _count,
  _pack,
  _shiftr,
} from '../locals/funcs'

test('len', () => {
  expect(len([])).toBe(0)
  expect(len([1])).toBe(1)
  expect(len([undefined, 2, '3'])).toBe(3)
  expect(len('')).toBe(0)
  expect(len('abc')).toBe(3)
  expect(len('a\nc')).toBe(3)
})

test('lineCount', () => {
  expect(lineNum('')).toBe(1)
  expect(lineNum('')).toBe(1)
  expect(ln('abc')).toBe(1)
  expect(ln('a\nc')).toBe(2)
  expect(ln('a\n\nc')).toBe(3)
})

test('count', () => {
  expect(count('aaaa', 'a')).toBe(4)
  expect(count('-hoge-', '-')).toBe(2)
  expect(_count('-')('-hoge-')).toBe(2)
  expect(count('abc', 'd')).toBe(0)
})

test('pack', () => {
  expect(pack('a\nb\n\nc\n\n\n\n')).toBe('a\nb\nc\n')
  expect(pack('a\nb\n\nc\n\n\n\n', 2)).toBe('a\nb\n\nc\n\n')
  expect(_pack(2)('a\nb\n\nc\n\n\n\n')).toBe('a\nb\n\nc\n\n')
})

test('shiftl shiftr', () => {
  expect(shiftl('a\tb\tc')).toBe('b\tc')
  expect(shiftr('a\tb\tc')).toBe('a\tb')
  expect(shiftl('a,b,c,d', ',', 2)).toBe('c,d')
  expect(shiftr('a,b,c,d', ',', 2)).toBe('a,b')
  expect(_shiftr(',', 2)('a,b,c,d')).toBe('a,b')
})

test('json jsonf', () => {
  expect(json({ a: 1, b: 2 })).toBe('{"a":1,"b":2}')
  expect(jsonf({ a: 1, b: 2 })).toBe(
    `
{
	"a": 1,
	"b": 2
}
`.trim()
  )
})

describe('cq', () => {
  it('cq shift', () => {
    expect(cq('a,b,c,d,e', '>')).toBe('a,b,c,d')
    expect(cq('a,b,c,d,e', '<')).toBe('b,c,d,e')
    expect(cq('a,b,c,d,e', '><')).toBe('b,c,d')
    expect(cq('a,b,c,d,e', '<>')).toBe('b,c,d')
    expect(cq('a,b,c,d,e', '<>>')).toBe('b,c')
    expect(cq('a,b\tc,d e', '<>>')).toBe('b\tc')
    expect(cq('a,b', '>>')).toBe('')
    expect(cq('a,b', '>>>')).toBe('')
  })
  it('cq last one', () => {
    expect(cq('a', '')).toBe('a')
    expect(cq('b,a,b', '><')).toBe('a')
  })

  it('cq pick', () => {
    expect(cq('a,b,c,d,e', '.')).toBe('a')
    expect(cq('a,b,c,d,e', '..')).toBe('a,b')
    expect(cq('a,b,c,d,e', '_.')).toBe('b')
    expect(cq('a,b,c,d,e', '_._.')).toBe('b,d')
    expect(cq('a,b,c,d,e', '_')).toBe('')
  })

  it('cq separator', () => {
    expect(cq('a\tb,c', 't>')).toBe('a')
    expect(cq('a b,c', 's>')).toBe('a')
    expect(cq('a b,c', ',>')).toBe('a b')
    expect(cq('a,b c\td', 'st>>')).toBe('a,b')
    expect(_cq('st>>')('a,b c\td')).toBe('a,b')
  })

  it('complex query', () => {
    expect(cq('a,b,c,d,e', '<<._.')).toBe('c,e')
  })

  it('obj arg', () => {
    const res = cq('a,b,c,d', {
      spChars: ',',
      opsShift: ['>', '<'],
      opsPick: [],
    })
    const comped = cq('a,b,c,d', { opsShift: ['>', '<'] })

    expect(res).toBe('b,c')
    expect(comped).toBe('b,c')
    expect(cq('a,b,c,d', { opsShift: '><' })).toBe('b,c')
    expect(cq('a,b,c,d', { opsPick: '..' })).toBe('a,b')
  })
})
