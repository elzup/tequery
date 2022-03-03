export const transpose = <T>(a: T[][]) => {
  if (a[0] === undefined) return []
  return a[0].map((_, i) => a.map((_, j) => a[j]?.[i]))
}

export const funcEval = (args: Record<string, unknown>, code: string) => {
  const func = Function(...Object.keys(args), code)

  return func(...Object.values(args))
}
export const kindof = (v: unknown) => {
  if (v === null) {
    return { v, t: 'null' }
  } else if (Array.isArray(v)) {
    return { v, t: 'array ' }
  }
  switch (typeof v) {
    case 'string':
      return { v, t: 'string' }
    case 'number':
      return { v, t: 'number' }
    case 'function':
      return { v, t: 'function' }
    case 'boolean':
      return { v, t: 'boolean' }
    case 'undefined':
      return { v, t: 'undefined' }
    default:
      return { v, t: 'objeact' }
  }
}
