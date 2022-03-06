const globals = {
  window: null,
  document: null,
  console: null,
  process: null,
}

export const funcEval = (args: Record<string, unknown>, code: string) => {
  const argsAll = { ...args, ...globals }

  const func = Function(...Object.keys(argsAll), code)

  return func(...Object.values(argsAll))
}
