import { preTrans } from '../pretrans'

test('head @', () => {
  expect(preTrans('.hello')).toMatchInlineSnapshot(`
    Object {
      "comps": Object {
        "call@": false,
        "head@": true,
      },
      "query": "@.hello",
    }
  `)
})
test('call @', () => {
  expect(preTrans('_trim')).toMatchInlineSnapshot(`
    Object {
      "comps": Object {
        "call@": true,
        "head@": false,
      },
      "query": "_trim(@)",
    }
  `)
})
