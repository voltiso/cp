// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { findProgramPath } from './findProgramPath'

export async function unlimited(program: string) {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	return ['ulimit -t unlimited', 'ulimit -s unlimited', `ulimit -s unlimited`]
}

export async function limit(program: string) {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	// eslint-disable-next-line no-magic-numbers
	const maxMemKb = 1_024 * 1_024 // 1GB
	const maxTimeSec = 1 // sec
	return [
		`ulimit -t ${maxTimeSec}`,
		'ulimit -s unlimited',
		`ulimit -m ${maxMemKb}`,
	]
}
