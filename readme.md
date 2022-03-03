# <img src="logo.png" width="45" align="left">tequery

> text transform query

## Install

```bash
$ npm install tequery
```

## Usage

### basic `$`

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

### line-run `$$`

```js
const text = ` line1
   line2
 line3`

tq(text, '$$.trim()').result
// => 'line1\n'
// + 'line2\n'
// + 'line3'
```

## finalize

final process to string from returned value type.

| type                     | process          |
| ------------------------ | ---------------- |
| typeof v === 'function'  | `v($)`           |
| typeof v === 'string'    | `v`              |
| typeof v === 'number'    | `String(v)`      |
| typeof v === 'undefined' | `""`             |
| v === null               | `""`             |
| Array.isArray(v)         | `v.join("\n")`   |
| other                    | `String(v)`      |
| typeof v === 'object'    | `JSON.stringify` |

### built-in funcs

util functions in running scope.

```js
tq('', `len('abc')`).result
// => '3'
tq('abcde', 'len($)').result
// => '5'

// equaliy shorthand
tq('abcde', 'len').result
```

| func            | usage                       | return        |
| --------------- | --------------------------- | ------------- |
| `len`           | `len('aaa')`                | 3             |
| `lineNum`, `ln` | `ln('a\nb')`                | 2             |
| `count`         | `count('aaa-a-', 'a')`      | 4             |
| `pack`          | `pack('a\nb\n\nc\n\n\n')`   | `'a\nb\nc\n'` |
| `shiftl`        | `shiftl('a-b-c-d', '-', 1)` | `'b-c-d'`     |
| `shiftr`        | `shiftr('a-b-c-d', '-', 1)` | `'a-b-c'`     |

### built-in vars

util vars in running scope.

```js
tq('a,b,c', `$csv.join(':')`).result
// => 'a:b:c'
expect(tq('', `$tsv.join(':')`).result).toBe()
expect(tq('a+b+c', `$sp('+').join(':')`).result).toBe('a:b:c')
```

| vars            | $=        | is                |
| --------------- | --------- | ----------------- |
| `$tsv`          | `a\tb\tc` | `['a', 'b', 'c']` |
| `$csv`          | `a,b,c`   | `['a', 'b', 'c']` |
| `$ls`, `$lines` | `a\nb\nc` | `['a', 'b', 'c']` |
| `$sp('+')`      | `a+b+c`   | `['a', 'b', 'c']` |

#### more example

vars with line-run

```ts
const txt = `a,b,c
d,e,f`

tq(text, `$$csv.join(':')`).result
// => 'a:b:c\n'
//  + 'd:e:f'
```

## result object

```ts
type Result = {
  status: 'ok' | 'ng' // is changed
  result: string
  resultRaw: unknown
  evalQuery: string // compiled query
  errorText: string
  returnType: string
  comps: Complements // is shorthund enabled
}
```
