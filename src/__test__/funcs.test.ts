import { len, lineNum, nol, pack, lineCount } from '../funcs'

test('len', () => {
  expect(len([])).toBe(0)
  expect(len([1])).toBe(1)
  expect(len([undefined, 2, '3'])).toBe(3)
  expect(len('')).toBe(0)
  expect(len('abc')).toBe(3)
  expect(len('a\nc')).toBe(3)
})

test('lineCount', () => {
  expect(lineCount('')).toBe(1)
  expect(lineNum('')).toBe(1)
  expect(nol('abc')).toBe(1)
  expect(nol('a\nc')).toBe(2)
  expect(nol('a\n\nc')).toBe(3)
})

test('pack', () => {
  expect(pack('a\nb\n\nc\n\n\n\n')).toBe('a\nb\nc\n')
  expect(pack('a\nb\n\nc\n\n\n\n', 2)).toBe('a\nb\n\nc\n\n')
})
