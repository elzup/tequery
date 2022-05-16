import { getAttrsStr } from '../suggester'

test('suggester', () => {
  expect(getAttrsStr('hello')).toMatchInlineSnapshot(`
    Object {
      "cellLike": false,
      "csvLike": false,
      "multiline": false,
      "tsvLike": false,
    }
  `)

  expect(getAttrsStr('a\nb').multiline).toBe(true)
  expect(getAttrsStr('a,b,c\nd,e,n').csvLike).toBe(true)
  expect(getAttrsStr('a\tb\tc').tsvLike).toBe(true)
  expect(getAttrsStr('a,b,c,d,e').cellLike).toBe(true)
})
