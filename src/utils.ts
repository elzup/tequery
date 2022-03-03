export const funcEval = (args: Record<string, unknown>, code: string) => {
  const func = Function(...Object.keys(args), code)

  return func(...Object.values(args))
}
