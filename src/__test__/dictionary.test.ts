import { dictionaries } from '../dictionary'
import { builtInFuncKeys } from '../locals/constants'
import { tequery } from '..'

test('all built-in funcs libraried', () => {
  expect(dictionaries.funcs.map(({ name }) => name)).toStrictEqual(
    builtInFuncKeys
  )
})

test('dictionary sample test', () => {
  const runs = dictionaries.funcs.map(
    ({ code, goodInput }) =>
      `${goodInput} |> ${code} => ${tequery(goodInput, code).result}`
  )

  expect(runs).toMatchInlineSnapshot(`
    Array [
      "12345 |> len => 5",
      "1-2-3-4- |> count($, '-') => 4",
      "line1
    line2 |> lineNum => 2",
      "line1
    line2 |> ln($$, '') => 1
    1",
      "line1

    line2 |> pack($, 1) => line1
    line2",
      "a-b-c |> shiftl($$, '-', 1) => b-c",
      "a,b,c |> shiftr($$, ',', 1) => a,b",
      " |> json({ a: 1, b: 2 }) => {\\"a\\":1,\\"b\\":2}",
      " |> jsonf({ a: 1, b: 2 }) => {
    	\\"a\\": 1,
    	\\"b\\": 2
    }",
    ]
  `)
})
