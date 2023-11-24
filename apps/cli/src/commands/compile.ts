// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { getConfig } from '~/config'
import { findProgramPath } from '~/util'

async function _compile(stage: 'debug' | 'release', program?: string) {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	const config = await getConfig()

	const flagsStr = [...config.flags.common, ...config.flags[stage]].join(' ')
	return `${config.compiler} ${flagsStr} ${program}.cpp -o ${program}`
}

export function compile(program?: string) {
	return _compile('release', program)
}

export function compileDebug(program?: string) {
	return _compile('debug', program)
}
