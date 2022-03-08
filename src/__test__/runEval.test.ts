import { runEval, toReturnCode } from '../runEval'
import { builtInFuncKeys } from '../locals/constants'

test('build in funcs list', () => {
  expect(builtInFuncKeys).toMatchInlineSnapshot(`
    Array [
      "len",
      "count",
      "_count",
      "lineNum",
      "ln",
      "pack",
      "_pack",
      "shiftl",
      "_shiftl",
      "shiftr",
      "_shiftr",
      "json",
      "jsonf",
      "cq",
      "_cq",
    ]
  `)
})

test('build in funcs', () => {
  expect(runEval('hello', builtInFuncKeys.join('&&') + ' && true').status).toBe(
    'ok'
  )
})

test('toReturnCode', () => {
  expect(toReturnCode('0 + 1')).toMatchInlineSnapshot(`"return 0 + 1"`)
  expect(toReturnCode(`';' + ';'`)).toMatchInlineSnapshot(`"return ';' + ';'"`)
})
