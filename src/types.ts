export type RunInfo = {
  status: 'ok' | 'ng'
  resultRaw: unknown
  result: string
  evalQuery: string
  errorText: string
  returnType: string
}

export type Result = RunInfo & {
  comps: Complements
}

export type TrasFunc = (s: string) => string

export type Complement = 'nonHead' | 'lineRun'
export type Complements = Record<Complement, boolean>
