export const vars = (text: string) => {
  const $sp = (v: string) => text.split(v)
  const $lines = $sp('\n')
  const $tsv = $sp('\t')
  const $csv = $sp(',')

  return {
    $lines,
    $ls: $lines,
    $tsv,
    $csv,
    $sp,
  }
}
