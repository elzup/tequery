import { getAttrs } from '../suggester'

test('suggester', () => {
  expect(getAttrs('hello')).toMatchInlineSnapshot(`
    Object {
      "cellLike": false,
      "csvLike": false,
      "multiline": false,
      "tsvLike": false,
    }
  `)

  expect(getAttrs('a\nb').multiline).toBe(true)
  expect(getAttrs('a,b,c\nd,e,n').csvLike).toBe(true)
  expect(getAttrs('a\tb\tc').tsvLike).toBe(true)
  expect(getAttrs('a,b,c,d,e').cellLike).toBe(true)
})
