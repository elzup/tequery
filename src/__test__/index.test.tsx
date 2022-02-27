import { tequery as tq } from '..'

const multilineText = `line1
line2
line3`

test('text query', () => {
  expect(tq('base text', `@.split(" ").join(",")`).result).toBe('base,text')
  expect(tq('base text', `@.replace("base", "changed")`).result).toBe(
    'changed text'
  )
})

test('array end glue', () => {
  expect(tq('base text', '@.split(" ")').result).toBe('base\ntext')
})

test('multiline eval', () => {
  expect(tq(multilineText, '@').result).toBe(multilineText)
})

test('line sign query', () => {
  expect(tq(multilineText, '$.substring(4, 5)').result).toBe('1\n2\n3')
  expect(
    tq(
      ` hoge
    fuga`,
      '$.trim()'
    ).result
  ).toBe('hoge\nfuga')
})

test('queryFunc _count', () => {
  expect(tq('abcde', `_count(@)`).result).toBe('5')
  expect(tq('__\n__\n__', `_lcount(@)`).result).toBe('3')
})

test('optional comp', () => {
  const res1 = tq('abcde', `_count`)

  expect(res1.evalQuery).toMatchInlineSnapshot(`"_count(_$text)"`)
  expect(res1.comps).toMatchInlineSnapshot(`
    Object {
      "call@": true,
      "head@": false,
    }
  `)
  expect(tq('abcde', `_count`).result).toBe('5')

  const res2 = tq('base text', `.split(" ").join(",")`)

  expect(res2.evalQuery).toMatchInlineSnapshot(
    `"_$text.split(\\" \\").join(\\",\\")"`
  )
  expect(res2.comps).toMatchInlineSnapshot(`
    Object {
      "call@": false,
      "head@": true,
    }
  `)
})
