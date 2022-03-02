import { preTrans } from '../pretrans'

test('no trans', () => {
  expect(preTrans('$.hello').query).toBe('$.hello')
  expect(preTrans('$$.length').query).toBe('$$.length')
  expect(preTrans('$[0]').query).toBe('$[0]')
})

test('head @', () => {
  expect(preTrans('.hello')).toMatchInlineSnapshot(`
    Object {
      "comps": Object {
        "call@": false,
        "head@": true,
      },
      "query": "$.hello",
    }
  `)
})
