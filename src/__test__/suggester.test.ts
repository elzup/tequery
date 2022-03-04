import { getCharacts } from '../suggester'

test('suggester', () => {
  expect(getCharacts('hello')).toMatchInlineSnapshot(`
    Object {
      "csvLike": false,
      "multiline": false,
      "tsvLike": false,
    }
  `)

  expect(getCharacts('a\nb')).toMatchInlineSnapshot(`
    Object {
      "csvLike": false,
      "multiline": true,
      "tsvLike": false,
    }
  `)

  expect(getCharacts('a,b,c\nd,e,n')).toMatchInlineSnapshot(`
    Object {
      "csvLike": true,
      "multiline": true,
      "tsvLike": false,
    }
  `)

  expect(getCharacts('a\tb\tc')).toMatchInlineSnapshot(`
    Object {
      "csvLike": false,
      "multiline": false,
      "tsvLike": true,
    }
  `)

  expect(getCharacts('ab\tc')).toMatchInlineSnapshot(`
    Object {
      "csvLike": false,
      "multiline": false,
      "tsvLike": false,
    }
  `)
})
