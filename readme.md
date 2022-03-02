# <img src="logo.png" width="45" align="left">tequery

> text transform query

## Install

```bash
$ npm install tequery
```

## Usage

### basic ($)

Basic text transform query.
`$` is text body variable.

```js
import { tequery as tq } from 'tequery'

tq(' hoge ', '$.trim()').result
// => 'hoge'
// equaliy shorthand
tq(' hoge ', '.trim()').result

tq('https://example.com', `.replace('https://', '')`).result
// => 'example.com'
```

### lines ($$)

```js
const text = ` line1
   line2
 line3`

tq(text, '$$.trim()').result
// => 'line1\n'
// + 'line2\n'
// + 'line3'
```

### built-in funcs

**len**

```js
tq('abcde', 'len($)').result
// => '5'

// equaliy shorthand
tq('abcde', 'len').result
```

**lineCount**

```js
tq('__\n__\n__', `lineCount($)`).result
// => '3'
```

**count**

```js
tq('aaa-a-', `a`).result
// => '4'
```

alias `lineNum`, `nol`

**pack**

```js
tq(
  `a
b

c

`,
  `pack($)`
).result
// => 'a\nb\nc\n'
```

## other return

```ts
type Result = {
  status: 'ok' | 'ng'
  result: string
  evalQuery: string // compiled query
  errorText: string
  comps: Complements // is shorthund enabled
}
```

## finalize

final process by return value type.

| type                     | process        |
| ------------------------ | -------------- |
| typeof v === 'string'    | `v`            |
| typeof v === 'number'    | `String(v)`    |
| typeof v === 'function'  | `v($)`         |
| typeof v === 'undefined' | `""`           |
| Array.isArray(v)         | `v.join("\n")` |
