import { builtInFuncs, tequery as tq, toReturnCode } from '..'

const multilineText = `line1
line2
line3`

test('text query', () => {
  const res = tq('base text', `$.split(" ").join(",")`)

  expect(res.status).toBe('ok')
  expect(res.result).toBe('base,text')
  expect(tq('base text', `$.replace("base", "changed")`).result).toBe(
    'changed text'
  )
  expect(
    tq('https://example.com', `.replace('https://', '')`).result
  ).toMatchInlineSnapshot(`"example.com"`)
})
test('empty', () => {
  expect(tq('', ``).result).toBe('')
  expect(tq('a', ``).result).toBe('')
  expect(tq('', `a`).result).toBe('')
})

test('array end glue', () => {
  expect(tq('base text', '$.split(" ")').result).toBe('base\ntext')
})

test('multiline eval', () => {
  expect(tq(multilineText, '$').result).toBe(multilineText)
})

test('line sign query', () => {
  expect(tq(multilineText, '$$.substring(4, 5)').result).toBe('1\n2\n3')
  expect(
    tq(
      ` hoge
    fuga`,
      '$$.trim()'
    ).result
  ).toBe('hoge\nfuga')
})

test('optional comp', () => {
  const res1 = tq('abcde', `count`)

  expect(res1.evalQuery).toMatchInlineSnapshot(`"count"`)
  expect(res1.comps).toMatchInlineSnapshot(`
    Object {
      "call@": true,
      "head@": false,
    }
  `)
  expect(tq('abcde', `len`).result).toBe('5')

  const res2 = tq('base text', `.split(" ").join(",")`)

  expect(res2.evalQuery).toMatchInlineSnapshot(
    `"$.split(\\" \\").join(\\",\\")"`
  )
  expect(res2.comps).toMatchInlineSnapshot(`
    Object {
      "call@": false,
      "head@": true,
    }
  `)
})

test('errors invalid syntax', () => {
  const res = tq('base text', `$.split(`)

  expect(res.status).toBe('ng')
  expect(res.result).toMatchInlineSnapshot(`"base text"`)
  expect(res.errorText).toMatchInlineSnapshot(`"eval error"`)
})

test('errors return type', () => {
  const res = tq('base text', `$ && null`)

  expect(res.status).toBe('ng')
  expect(res.result).toMatchInlineSnapshot(`"base text"`)
  expect(res.errorText).toMatchInlineSnapshot(`"result type error"`)
})

test('lines some ok some erorr', () => {
  const res = tq(
    `
xo
x
xo
x
`.trim(),
    `$$[1]`
  )

  expect(res.status).toMatchInlineSnapshot(`"ok"`)
  expect(res.result).toMatchInlineSnapshot(`
    "o
    
    o
    "
  `)
})

test('build in funcs', () => {
  expect(builtInFuncs).toMatchInlineSnapshot(`
    Array [
      "len",
      "count",
      "lineCount",
      "lineNum",
      "nol",
      "pack",
    ]
  `)

  expect(tq('hello', builtInFuncs.join('&&')).status).toBe('ok')
})

test('toReturnCode', () => {
  expect(toReturnCode('0 + 1')).toMatchInlineSnapshot(`"return 0 + 1"`)
  expect(toReturnCode(`';' + ';'`)).toMatchInlineSnapshot(`"return ';' + ';'"`)
})

// test('strict query parse', () => {
//   const res = tq('hoge@example.com', '"hoge@$".replace(/[@$]/g, "_")')

//   expect(res).toMatchInlineSnapshot(`
//     Object {
//       "comps": Object {
//         "call@": false,
//         "head@": false,
//       },
//       "errorText": "",
//       "evalQuery": "\\"hoge_$text@\\".replace(/[@$]/g, \\"_\\")",
//       "result": "hoge__text_",
//       "status": "ok",
//     }
//   `)
// })
