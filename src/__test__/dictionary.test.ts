import { dictionaries } from '../dictionary'
import { builtInFuncKeys } from '../locals/constants'

test('all built-in funcs libraried', () => {
  expect(dictionaries.funcs.map(({ name }) => name)).toStrictEqual(
    builtInFuncKeys
  )
})
