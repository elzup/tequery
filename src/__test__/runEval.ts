import { runEval, toReturnCode, builtInFuncs } from '../runEval'

test('build in funcs list', () => {
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
})
test('build in funcs', () => {
  expect(runEval('hello', builtInFuncs.join('&&')).status).toBe('ok')
})

test('toReturnCode', () => {
  expect(toReturnCode('0 + 1')).toMatchInlineSnapshot(`"return 0 + 1"`)
  expect(toReturnCode(`';' + ';'`)).toMatchInlineSnapshot(`"return ';' + ';'"`)
})
