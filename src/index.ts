import * as funcs from './funcs'

const { _count, _lcount } = funcs

const runEval = (embed: string, query: string) => {
  if (!query.includes('@')) throw Error('Invalid query: @ sign not find')

  const _$text = embed
  const x = query.replace('@', '_$text')

  try {
    return eval(x)
  } catch (_e) {
    return `error ${x}`
  }
}

const isSingleFuncQuery = (query: string) =>
  !query.includes('@') && !query.includes('.') && !query.includes('.')
const isStartOptional = (query: string) => query.startsWith('.')

export function tequery(text: string, query: string, glue = '\n'): string {
  if (query.includes('$')) {
    return text
      .split('\n')
      .map((line) => tequery(line, query.replace('$', '@')))
      .join(glue)
  }
  if (isSingleFuncQuery(query)) return tequery(text, query + '(@)')
  if (isStartOptional(query)) return tequery(text, `@` + query)

  const result = runEval(text, query)

  if (Array.isArray(result)) return result.join(glue)

  return String(result)
}
