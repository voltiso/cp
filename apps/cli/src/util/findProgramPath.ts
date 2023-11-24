// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { cliState$, getCurrentProgramPath, initCliStatePromise } from '~/state'

import { getProgramPath } from './getProgramPath'
import { getTaskAndProgramNameFromPath } from './getTaskName'

export async function findProgramPath(name: string | undefined) {
	// console.log('findProgramPath', name)

	if (name) {
		// eslint-disable-next-line no-param-reassign
		name = await getProgramPath(name)
		await initCliStatePromise
		const { taskName, programName } = getTaskAndProgramNameFromPath(name)
		// console.log('patch', taskName, programName)
		cliState$.patch({
			currentTask: taskName,
			currentProgram: programName,
		})
	} else {
		// eslint-disable-next-line no-param-reassign
		name = await getCurrentProgramPath()
	}

	if (!name) {
		throw new Error('No program name provided and no current default program')
	}

	return getProgramPath(name)
}
