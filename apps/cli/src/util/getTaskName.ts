// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { at } from '@voltiso/util'

export interface TaskAndProgramName {
	taskName: string
	programName: string
}

export function getTaskAndProgramNameFromPath(
	path: string,
): TaskAndProgramName {

	let segments = path.split('/')

	while (segments[0] === '.' || segments[0] === '..')
		segments = segments.slice(1)

	if (segments[0] === 'task') segments = segments.slice(1)

	return {
		taskName: segments.slice(0, -1).join('/'),
		programName: at(segments, -1),
	}
}
