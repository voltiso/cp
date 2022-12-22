// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { at } from '@voltiso/util'

import { getConfig } from './getConfig'

export interface TaskAndProgramName {
	taskName: string
	programName: string
}

export async function getTaskAndProgramNameFromPath(
	path: string,
): Promise<TaskAndProgramName> {
	const config = await getConfig()

	let segments = path.split('/')

	while (segments[0] === '.' || segments[0] === '..')
		segments = segments.slice(1)

	if (segments[0] === config.tasksDir) segments = segments.slice(1)

	return {
		taskName: segments.slice(0, -1).join('/'),
		programName: at(segments, -1),
	}
}
