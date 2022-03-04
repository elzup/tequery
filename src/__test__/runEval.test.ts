import { runEval, toReturnCode } from '../runEval'
import { builtInFuncKeys } from '../locals/constants'

test('build in funcs list', () => {
  expect(builtInFuncKeys).toMatchInlineSnapshot(`
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
  expect(runEval('hello', builtInFuncKeys.join('&&')).status).toBe('ok')
})

test('toReturnCode', () => {
  expect(toReturnCode('0 + 1')).toMatchInlineSnapshot(`"return 0 + 1"`)
  expect(toReturnCode(`';' + ';'`)).toMatchInlineSnapshot(`"return ';' + ';'"`)
})
