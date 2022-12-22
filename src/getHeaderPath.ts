// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import * as cp from 'node:child_process'
import { promisify } from 'node:util'

import { assert } from '@voltiso/assertor'

import { getConfig } from './getConfig'

const exec = promisify(cp.exec)

export async function getHeaderPath(): Promise<string> {
	const config = await getConfig()
	const commonFlagsStr = config.flags.common.join(' ')
	const cmd = `${config.compiler} ${commonFlagsStr} -Wno-invalid-pch`

	const { stderr } = await exec(`${cmd} templates/solution.cpp -o /dev/null -H`)

	let firstLine = stderr.split('\n')[0]
	assert(firstLine)
	// eslint-disable-next-line es-x/no-string-prototype-trim
	firstLine = firstLine.trim()

	if (firstLine.startsWith('.')) firstLine = firstLine.slice(1)

	// eslint-disable-next-line es-x/no-string-prototype-trim
	firstLine = firstLine.trim()

	return firstLine
}
