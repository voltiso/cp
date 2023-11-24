// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { Config } from '@voltiso/cp.util'
import { define } from '@voltiso/util'

const std = 'c++17'

const warnings = [
	'all',
	'extra',
	'shadow',
	'fatal-errors',
	'no-unused-parameter',
	'invalid-pch',
]

const warningFlags = warnings.map(warning => `-W${warning}`)

//

const commonDefineFlags = ['LOCAL'].map(define => `-D${define}`)

//

const debugDefineFlags = [
	'DEBUG',
	// '_GLIBCXX_CONCEPT_CHECKS',
	// '_GLIBCXX_DEBUG',
	// '_GLIBCXX_DEBUG_PEDANTIC',
].map(define => `-D${define}`)

const debugFlags = ['-g', '-ggdb', ...debugDefineFlags]

//

const releaseFlags = ['RELEASE', 'NDEBUG'].map(define => `-D${define}`)

// eslint-disable-next-line import/no-default-export
export default define<Config>().value({
	compiler: 'g++',

	flags: {
		common: [`-std=${std}`, '-static', ...warningFlags, ...commonDefineFlags],
		release: ['-O3', '-I .pch/release', ...releaseFlags],
		debug: [...debugFlags, '-I .pch/debug'],
	},
})
