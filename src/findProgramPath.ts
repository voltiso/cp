// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import {
	cliState$,
	getCurrentProgramPath,
	initCliStatePromise,
} from './CliState'
import { getProgramPath } from './getProgramPath'
import { getTaskAndProgramNameFromPath } from './getTaskName'

export async function findProgramPath(name: string | undefined) {
	// console.log('findProgramPath', name)

	if (!name) {
		// eslint-disable-next-line no-param-reassign
		name = await getCurrentProgramPath()
	} else {
		// eslint-disable-next-line no-param-reassign
		name = await getProgramPath(name)
		await initCliStatePromise
		const { taskName, programName } = await getTaskAndProgramNameFromPath(name)
		// console.log('patch', taskName, programName)
		cliState$.patch({
			currentTask: taskName,
			currentProgram: programName,
		})
	}

	if (!name) {
		throw new Error('No program name provided and no current default program')
	}

	return getProgramPath(name)
}
