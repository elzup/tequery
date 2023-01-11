import { suggester } from '../suggester'
import { getAttrsStr } from '../suggester/attrs'

test('getAttrs', () => {
  expect(getAttrsStr('hello')).toMatchInlineSnapshot(`
    {
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

describe('suggester', () => {
  it('basic sample', () => {
    const suggestResult = suggester('a,b,c,d,e').map((v) => [
      v.dict.name,
      v.point,
    ])

    expect(suggestResult).toMatchInlineSnapshot(`
      [
        [
          "shiftl",
          100,
        ],
        [
          "shiftr",
          100,
        ],
        [
          "cq",
          50,
        ],
        [
          "len",
          0,
        ],
        [
          "count",
          0,
        ],
        [
          "lineNum",
          0,
        ],
        [
          "ln",
          0,
        ],
        [
          "pack",
          -100,
        ],
        [
          "json",
          -100,
        ],
        [
          "jsonf",
          -100,
        ],
      ]
    `)
  })
  it('basic sample pack', () => {
    const suggestResult = suggester('a\n\nb\nc\nd\n\ne\n\nf').map((v) => [
      v.dict.name,
      v.point,
    ])

    expect(suggestResult).toMatchInlineSnapshot(`
      [
        [
          "pack",
          90,
        ],
        [
          "cq",
          50,
        ],
        [
          "len",
          0,
        ],
        [
          "count",
          0,
        ],
        [
          "lineNum",
          0,
        ],
        [
          "ln",
          0,
        ],
        [
          "shiftl",
          -100,
        ],
        [
          "shiftr",
          -100,
        ],
        [
          "json",
          -100,
        ],
        [
          "jsonf",
          -100,
        ],
      ]
    `)
  })
})
