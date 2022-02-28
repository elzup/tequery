import { _count, _lineCount } from '../funcs'

test('_count', () => {
  expect(_count([])).toBe(0)
  expect(_count([1])).toBe(1)
  expect(_count([undefined, 2, '3'])).toBe(3)
  expect(_count('')).toBe(0)
  expect(_count('abc')).toBe(3)
  expect(_count('a\nc')).toBe(3)
})

test('_lineCount', () => {
  expect(_lineCount('')).toBe(1)
  expect(_lineCount('abc')).toBe(1)
  expect(_lineCount('a\nc')).toBe(2)
  expect(_lineCount('a\n\nc')).toBe(3)
})
