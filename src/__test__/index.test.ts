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

test('finalize and return type', () => {
  expect(tq('', '() => 0').returnType).toBe('function')
  expect(tq('', '() => 0').result).toBe('0')
  expect(tq('', `"aa"`).returnType).toBe('string')
  expect(tq('', `"aa"`).result).toBe('aa')
  expect(tq('', `0`).returnType).toBe('number')
  expect(tq('', `0`).result).toBe('0')
  expect(tq('', `[1, 2]`).returnType).toBe('object')
  expect(tq('', `[1, 2]`).result).toBe('1\n2')
  expect(tq('', `{ a: 1}`).returnType).toBe('object')
  expect(tq('', `{ a: 1}`).result).toBe('{"a":1}')
  expect(tq('', `undefined`).returnType).toBe('undefined')
  expect(tq('', `undefined`).result).toBe('')
})

test('function return type', () => {
  const res = tq('base text', `(s) => 1`)

  expect(res.status).toMatchInlineSnapshot(`"ok"`)
  expect(res.errorText).toMatchInlineSnapshot(`""`)
  expect(res.result).toMatchInlineSnapshot(`"1"`)

  const recursiveError = tq('base text', `(s) => (() => 1)`)

  expect(recursiveError.status).toMatchInlineSnapshot(`"ng"`)
  expect(recursiveError.errorText).toMatchInlineSnapshot(`"result type error"`)
})

test('array end glue', () => {
  expect(tq('base text', '$.split(" ")').result).toBe('base\ntext')
  expect(tq('base text', '$.split(" ")')).toMatchInlineSnapshot(`
    Object {
      "comps": Object {
        "lineRun": false,
        "nonHead": false,
      },
      "errorText": "",
      "evalQuery": "$.split(\\" \\")",
      "result": "base
    text",
      "resultRaw": Array [
        "base",
        "text",
      ],
      "returnType": "object",
      "status": "ok",
    }
  `)
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
      "lineRun": false,
      "nonHead": false,
    }
  `)
  expect(tq('abcde', `len`).result).toBe('5')

  const res2 = tq('base text', `.split(" ").join(",")`)

  expect(res2.evalQuery).toMatchInlineSnapshot(
    `"$.split(\\" \\").join(\\",\\")"`
  )
  expect(res2.comps).toMatchInlineSnapshot(`
    Object {
      "lineRun": false,
      "nonHead": true,
    }
  `)
})

test('errors invalid syntax', () => {
  const res = tq('base text', `$.split(`)

  expect(res.status).toBe('ng')
  expect(res.result).toMatchInlineSnapshot(`"base text"`)
  expect(res.errorText).toMatchInlineSnapshot(`"eval error"`)
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
      "lineNum",
      "ln",
      "pack",
      "shiftl",
      "shiftr",
      "json",
      "jsonf",
    ]
  `)

  expect(tq('hello', builtInFuncs.join('&&')).status).toBe('ok')
})

test('build in vars', () => {
  expect(tq('a,b,c', `$csv.join(':')`).result).toBe('a:b:c')
  expect(tq('a\tb\tc', `$tsv.join(':')`).result).toBe('a:b:c')
  expect(tq('a\nb\nc', `$lines.join(':')`).result).toBe('a:b:c')
  expect(tq('a\nb\nc', `$ls.join(':')`).result).toBe('a:b:c')
  expect(tq('a+b+c', `$sp('+').join(':')`).result).toBe('a:b:c')
})

test('build in vars with line-run', () => {
  expect(tq('a,b,c\nd,e,f', `$$csv.join(':')`).result).toBe('a:b:c\nd:e:f')
})

test('toReturnCode', () => {
  expect(toReturnCode('0 + 1')).toMatchInlineSnapshot(`"return 0 + 1"`)
  expect(toReturnCode(`';' + ';'`)).toMatchInlineSnapshot(`"return ';' + ';'"`)
})
