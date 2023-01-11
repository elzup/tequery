import { tequery as tq } from '..'

test.todo('global polish')
// with mock
// expect(tq("('$$')", 'document')).toMatchInlineSnapshot()

test('invalid line-run query', () => {
  // TODO
  expect(tq("('$$')", "('$$')")).toMatchInlineSnapshot(`
    {
      "comps": {
        "lineRun": true,
        "nonHead": false,
      },
      "errorText": "",
      "evalQuery": "('$')",
      "result": "$",
      "resultRaw": [
        "$",
      ],
      "returnType": "string",
      "status": "ok",
    }
  `)
})
