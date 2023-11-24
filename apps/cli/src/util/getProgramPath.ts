// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import path from 'node:path'

import { isDirectory } from '@voltiso/cp.util/src/isDirectory'

function removePrefix(str: string, prefix: string): string {
	// eslint-disable-next-line no-param-reassign
	while (str.startsWith(prefix)) str = str.slice(prefix.length)
	return str
}

async function getProgramPathUncached(name: string) {
	// eslint-disable-next-line no-param-reassign
	name = removePrefix(name, `task/`)
	// eslint-disable-next-line no-param-reassign
	name = path.join('task', name)
	if (name.split('/').length === 2 || (await isDirectory(name)))
		// eslint-disable-next-line no-param-reassign
		name = path.join(name, path.basename(name))
	return name
}

const problemNameValidation = new Map<string, string>()

export async function getProgramPath(name: string): Promise<string> {
	let result = problemNameValidation.get(name)

	if (!result) {
		result = await getProgramPathUncached(name)
		problemNameValidation.set(name, result)
	}

	return result
}
