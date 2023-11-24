// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { findProgramPath, limit, unlimited } from '~/util'

export async function goOnly(program: string | undefined, ...args: string[]) {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	return `runner ${program} ${args.join(' ')}`
}

export async function goDebug(program: string) {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	return [compileDebug(program), unlimited(program), goOnly(program)]
}

export async function goRelease(program: string) {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	return [compileRelease(program), limit(program), goOnly(program)]
}

export const go = goDebug
