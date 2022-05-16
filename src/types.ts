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

/** @deprecated glue */
export type OptionV2 = string
export type OptionV3 = {
  glue: string
}
export type Option = OptionV2 | OptionV3

export type AttrType = 'multiline' | 'csvLike' | 'tsvLike' | 'cellLike'
export type Dict = {
  name: string
  code: string
  bindCode?: string
  desc: string
  docCode?: string
  goodInput: string
  suggestAny?: (input: unknown) => number
  suggestText?: (
    text: string,
    attrs: Partial<Record<AttrType, boolean>>
  ) => number /* 100 best match ~ -100 worst */
}

export type Attrs = Record<AttrType, boolean>
export type AttrChecker = {
  key: AttrType
  check: (part: {
    text: string
    line1: string | null
    lines: string[]
  }) => boolean
}

export type Suggestion = {
  dict: Dict
  point: number
}
