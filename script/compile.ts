// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { findProgramPath } from '../src/findProgramPath'
import { getConfig } from '../src/getConfig'

//

const compile =
	(stage: 'debug' | 'release') => async (program?: string | undefined) => {
		// eslint-disable-next-line no-param-reassign
		program = await findProgramPath(program)
		const config = await getConfig()
		// eslint-disable-next-line security/detect-object-injection
		const flagsStr = [...config.flags.common, ...config.flags[stage]].join(' ')
		return `${config.compiler} ${flagsStr} ${program}.cpp -o ${program}`
	}

export const compileRelease = compile('release')
export const compileDebug = compile('debug')
