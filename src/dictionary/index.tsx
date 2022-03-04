type Dict = {
  name: string
  code: string
  desc: string
  docCode?: string
  goodInput: string
}

const funcs: Dict[] = [
  {
    name: `len`,
    code: `len`,
    desc: `length of str or array`,
    docCode: `len(text: string | unknown[])`,
    goodInput: `12345`,
  },
  {
    name: 'count',
    code: `count($, '-')`,
    desc: 'count q in text',
    docCode: `count(text: string, q: string)`,
    goodInput: `1-2-3-4-`,
  },
  {
    name: `lineNum`,
    code: `lineNum`,
    desc: `number of lines`,
    docCode: `lineNum(text: string)`,
    goodInput: `line1\nline2`,
  },
  {
    name: `ln`,
    code: `ln($$, '')`,
    desc: `alias of lineNum`,
    docCode: `ln(text: string)`,
    goodInput: `line1\nline2`,
  },
  {
    name: `pack`,
    code: `pack($, 1)`,
    desc: 'remove chained newline',
    docCode: `pack(text: string, n = 1)`,
    goodInput: `line1\n\nline2`,
  },
  {
    name: `shiftl`,
    code: `shiftl($$, '-', 1)`,
    desc: `trim left column`,
    docCode: `shiftl(text: string, to = '\t', n = 1)`,
    goodInput: `a-b-c`,
  },
  {
    name: `shiftr`,
    code: `shiftr($$, ',', 1)`,
    desc: `trim right column`,
    docCode: `shiftr(text: string, to = '\t', n = 1)`,
    goodInput: `a,b,c`,
  },
  {
    name: `json`,
    code: `json({ a: 1, b: 2 })`,
    desc: `to json string`,
    docCode: `json(value: any)`,
    goodInput: ``,
  },
  {
    name: `jsonf`,
    code: `jsonf({ a: 1, b: 2 })`,
    desc: `to json string with pretty`,
    docCode: `jsonf(value: any)`,
    goodInput: ``,
  },
]

const vars: Dict[] = [
  { name: `$`, code: `$`, desc: `text`, goodInput: `hello` },
  { name: `$$`, code: `$$`, desc: `each lines`, goodInput: `a\nb` },
  { name: '$lines', code: '$lines', desc: 'split by line', goodInput: `a\nb` },
  { name: '$ls', code: '$ls', desc: 'alias of $lines', goodInput: `a\nb` },
  { name: '$tsv', code: '$tsv', desc: 'split by tab', goodInput: `a\tb` },
  { name: '$csv', code: '$csv', desc: 'split by comma', goodInput: `a,b` },
  {
    name: `$sp`,
    code: `$sp(' ')`,
    desc: '[func]split by x',
    goodInput: `a b`,
  },
]

export const dictionaries = { funcs, vars }