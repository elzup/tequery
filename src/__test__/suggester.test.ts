import { suggester } from '../suggester'
import { getAttrsStr } from '../suggester/attrs'

test('getAttrs', () => {
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

describe('suggester', () => {
  it('basic sample', () => {
    const suggestResult = suggester('a,b,c,d,e').map((v) => [
      v.dict.name,
      v.point,
    ])

    expect(suggestResult).toMatchInlineSnapshot(`
          Array [
            Array [
              "shiftl",
              100,
            ],
            Array [
              "shiftr",
              100,
            ],
            Array [
              "cq",
              50,
            ],
            Array [
              "len",
              0,
            ],
            Array [
              "count",
              0,
            ],
            Array [
              "lineNum",
              0,
            ],
            Array [
              "ln",
              0,
            ],
            Array [
              "pack",
              -100,
            ],
            Array [
              "json",
              -100,
            ],
            Array [
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
      Array [
        Array [
          "pack",
          90,
        ],
        Array [
          "cq",
          50,
        ],
        Array [
          "len",
          0,
        ],
        Array [
          "count",
          0,
        ],
        Array [
          "lineNum",
          0,
        ],
        Array [
          "ln",
          0,
        ],
        Array [
          "shiftl",
          -100,
        ],
        Array [
          "shiftr",
          -100,
        ],
        Array [
          "json",
          -100,
        ],
        Array [
          "jsonf",
          -100,
        ],
      ]
    `)
  })
})
