import { tequery as tq } from '..'

const multilineText = `line1
line2
line3`

test('text query', () => {
  expect(tq('base text', `@.split(" ").join(",")`)).toBe('base,text')
  expect(tq('base text', `@.replace("base", "changed")`)).toBe('changed text')
})

test('optional @', () => {
  expect(tq('base text', `.split(" ").join(",")`)).toBe('base,text')
})

test('array end glue', () => {
  expect(tq('base text', '@.split(" ")')).toBe('base\ntext')
})

test('multiline eval', () => {
  expect(tq(multilineText, '@')).toBe(multilineText)
})

test('line sign query', () => {
  expect(tq(multilineText, '$.substring(4, 5)')).toBe('1\n2\n3')
  expect(
    tq(
      ` hoge
    fuga`,
      '$.trim()'
    )
  ).toBe('hoge\nfuga')
})

test('queryFunc _count', () => {
  expect(tq('abcde', `_count(@)`)).toBe('5')
  expect(tq('__\n__\n__', `_lcount(@)`)).toBe('3')
})

test('single func optional', () => {
  expect(tq('abcde', `_count`)).toBe('5')
})
