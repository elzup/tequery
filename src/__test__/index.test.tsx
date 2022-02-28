import { builtInFuncs, tequery as tq } from '..'

const multilineText = `line1
line2
line3`

test('text query', () => {
  expect(tq('base text', `@.split(" ").join(",")`).status).toBe('ok')
  expect(tq('base text', `@.split(" ").join(",")`).result).toBe('base,text')
  expect(tq('base text', `@.replace("base", "changed")`).result).toBe(
    'changed text'
  )
  expect(
    tq('https://example.com', `.replace('https://', '')`).result
  ).toMatchInlineSnapshot(`"example.com"`)
})
test('empty', () => {
  expect(tq('', ``).result).toMatchInlineSnapshot(`""`)
  expect(tq('a', ``).result).toMatchInlineSnapshot(`"a"`)
  expect(tq('', `a`).result).toMatchInlineSnapshot(`""`)
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

test('errors invalid syntax', () => {
  const res = tq('base text', `@.split(`)

  expect(res.status).toBe('ng')
  expect(res.result).toMatchInlineSnapshot(`"base text"`)
  expect(res.errorText).toMatchInlineSnapshot(`"eval error"`)
})

test('errors return type', () => {
  const res = tq('base text', `@ && undefined`)

  expect(res.status).toBe('ng')
  expect(res.result).toMatchInlineSnapshot(`"base text"`)
  expect(res.errorText).toMatchInlineSnapshot(`"result type error"`)
})

test('lines some ok some erorr', () => {
  const res = tq(
    `
_o
_
_k
_
`.trim(),
    `$[1]`
  )

  expect(res.status).toMatchInlineSnapshot(`"ok"`)
  expect(res.result).toMatchInlineSnapshot(`
    "o
    _
    k
    _"
  `)
})

test('build in funcs', () => {
  expect(builtInFuncs).toMatchInlineSnapshot(`
    Array [
      "_count",
      "_lineCount",
      "_packLine",
    ]
  `)

  expect(tq('hello', builtInFuncs.join(';')).status).toBe('ok')
})
