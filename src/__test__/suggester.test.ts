import { getAttrs } from '../suggester'

test('suggester', () => {
  expect(getAttrs('hello')).toMatchInlineSnapshot(`
    Object {
      "csvLike": false,
      "multiline": false,
      "tsvLike": false,
    }
  `)

  expect(getAttrs('a\nb')).toMatchInlineSnapshot(`
    Object {
      "csvLike": false,
      "multiline": true,
      "tsvLike": false,
    }
  `)

  expect(getAttrs('a,b,c\nd,e,n')).toMatchInlineSnapshot(`
    Object {
      "csvLike": true,
      "multiline": true,
      "tsvLike": false,
    }
  `)

  expect(getAttrs('a\tb\tc')).toMatchInlineSnapshot(`
    Object {
      "csvLike": false,
      "multiline": false,
      "tsvLike": true,
    }
  `)

  expect(getAttrs('ab\tc')).toMatchInlineSnapshot(`
    Object {
      "csvLike": false,
      "multiline": false,
      "tsvLike": false,
    }
  `)
})
