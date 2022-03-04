export const finalize = (
  v: unknown,
  text: string,
  { glue }: { glue: string },
  end = false
): string | false => {
  if (v === null || v === undefined) {
    return ''
  } else if (Array.isArray(v)) {
    return v.join(glue)
  }

  if (typeof v === 'function') {
    if (end) {
      return false
    }
    try {
      const endResult = v(text)

      return finalize(endResult, text, { glue }, true)
    } catch (_e) {
      return false
    }
  }
  if (typeof v === 'object') {
    return JSON.stringify(v)
  }
  return String(v)
}
