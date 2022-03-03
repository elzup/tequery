import { preTrans } from '../pretrans'

test('no trans', () => {
  expect(preTrans('$.hello').query).toBe('$.hello')
  expect(preTrans('$[0]').query).toBe('$[0]')
})

test('non-head', () => {
  expect(preTrans('.hello')).toMatchInlineSnapshot(`
    Object {
      "comps": Object {
        "lineRun": false,
        "nonHead": true,
      },
      "query": "$.hello",
    }
  `)
})

test('line-run', () => {
  expect(preTrans('$$.length')).toMatchInlineSnapshot(`
    Object {
      "comps": Object {
        "lineRun": true,
        "nonHead": false,
      },
      "query": "$.length",
    }
  `)
})
