export const vars = (text: string, lineNum?: number) => {
  const $sp = (v: string) => text.split(v)
  const $lines = $sp('\n')
  const $tsv = $sp('\t')
  const $csv = $sp(',')
  const $i = lineNum

  return {
    $lines,
    $ls: $lines,
    $tsv,
    $csv,
    $sp,
    $i,
  }
}
