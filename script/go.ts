// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { Script } from '@voltiso/script.lib'

import { compileDebug } from '../scripts'
import { findProgramPath } from '../src/findProgramPath'

export const goOnly: Script = async (program: string | undefined, ...args) => {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	return `runner ${program} ${args.join(' ')}`
}

export const go = async (program: string) => {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	return [compileDebug(program), goOnly(program)]
}
