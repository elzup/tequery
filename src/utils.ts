export const transpose = <T>(a: T[][]) => {
  if (a[0] === undefined) return []
  return a[0].map((_, i) => a.map((_, j) => a[j]?.[i]))
}

export const funcEval = (args: Record<string, unknown>, code: string) => {
  const func = Function(...Object.keys(args), code)

  return func(...Object.values(args))
}
