type Dict = {
  name: string
  code: string
  desc: string
  goodInput: string
}

const funcs: Dict[] = [
  {
    name: `len`,
    code: `len($)`,
    desc: `length of str or array`,
    goodInput: `12345`,
  },
  {
    name: `count`,
    code: `count($, '.')`,
    desc: 'count q in text',
    goodInput: `1.2.3.4.`,
  },
  {
    name: `lineNum`,
    code: `lineNum($)`,
    desc: `number of lines`,
    goodInput: `line1\nline2`,
  },
  {
    name: `ln`,
    code: `ln($$, '')`,
    desc: `alias of lineNum`,
    goodInput: `line1\nline2`,
  },
  {
    name: `pack`,
    code: `pack($, 1)`,
    desc: 'remove chained newline',
    goodInput: `line1\n\nline2`,
  },
  {
    name: `shiftl`,
    code: `shiftl($$, '-', 1)`,
    desc: `trim left column`,
    goodInput: `a-b-c`,
  },
  {
    name: `shiftr`,
    code: `shiftr($$, ',', 1)`,
    desc: `trim right column`,
    goodInput: `a,b,c`,
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
