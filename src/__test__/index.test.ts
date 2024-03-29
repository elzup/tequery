import { tequery as tq } from '..'

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
  expect(tq('', '() => Array(-1)').status).toBe('ng')
  expect(tq('', '() => () => 1').status).toBe('ng')
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
    {
      "comps": {
        "lineRun": false,
        "nonHead": false,
      },
      "errorText": "",
      "evalQuery": "$.split(" ")",
      "result": "base
    text",
      "resultRaw": [
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
    {
      "lineRun": false,
      "nonHead": false,
    }
  `)
  expect(tq('abcde', `len`).result).toBe('5')

  const res2 = tq('base text', `.split(" ").join(",")`)

  expect(res2.evalQuery).toMatchInlineSnapshot(`"$.split(" ").join(",")"`)
  expect(res2.comps).toMatchInlineSnapshot(`
    {
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

test('build in vars', () => {
  expect(tq('a,b,c', `$csv.join(':')`).result).toBe('a:b:c')
  expect(tq('a\tb\tc', `$tsv.join(':')`).result).toBe('a:b:c')
  expect(tq('a\nb\nc', `$lines.join(':')`).result).toBe('a:b:c')
  expect(tq('a\nb\nc', `$ls.join(':')`).result).toBe('a:b:c')
  expect(tq('a+b+c', `$sp('+').join(':')`).result).toBe('a:b:c')
  expect(tq('a\nb\nc', `($i + 1) + '.' + $$`).result).toBe('1.a\n2.b\n3.c')
  expect(tq('a\nb\nc', `$$i`).result).toBe('0\n1\n2')
})

test('build in vars with line-run', () => {
  expect(tq('a,b,c\nd,e,f', `$$csv.join(':')`).result).toBe('a:b:c\nd:e:f')
})

test('option glue', () => {
  expect(tq('a,b,c\nd,e,f', `$$csv`, '_').result).toBe('a_b_c_d_e_f')
  expect(tq('a,b,c\nd,e,f', `$$csv`, { glue: '_' }).result).toBe('a_b_c_d_e_f')
})

test('every ng', () => {
  const res = tq('a\na', `$$.split(',')[1][1]`)

  expect(res.status).toBe('ng')
})
