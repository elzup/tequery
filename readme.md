#  <img src="logo.png" width="45" align="left">tequery

> text transform query

## Install

```bash
$ npm install tequery
```

## Usage

### basic (@)

Basic text transform query.
`@` is text body variable.

```js
import { tequery as tq } from 'tequery'

tq(' hoge ', '@.trim()').result
// => 'hoge'
// equaliy shorthand
tq(' hoge ', '.trim()').result

tq('https://example.com', `.replace('https://', '')`).result
// => 'example.com'
```

### lines ($)

```js
const text = ` line1
   line2
 line3`

tq(text, '$.trim()').result
// => 'line1\n'
// + 'line2\n'
// + 'line3'
```

### built-in funcs

**\_count**

```js
tq('abcde', '_count(@)').result
// => '5'

// equaliy shorthand
tq('abcde', '_count').result
```

**\_lineCount**

```js
tq('__\n__\n__', `_lineCount(@)`).result
// => '3'
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
