import * as funcs from './funcs'
import { vars } from './vars'

export const builtInFuncKeys = Object.keys(funcs)
/** @deprecated */
export const builtInFuncs = builtInFuncKeys
export const builtInVarKeys = Object.keys(vars(''))
