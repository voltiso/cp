// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import chalk from 'chalk'
import * as fs from 'node:fs/promises'

import { findProgramPath } from '~/util'

export async function submit(program?: string) {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	//
	const cppFile = `${program}.cpp`

	const data = await fs.readFile(cppFile)

	// eslint-disable-next-line import/dynamic-import-chunkname
	const clipboardyModule = await import('clipboardy')
	const clipboard = clipboardyModule.default
	await clipboard.write(data.toString())

	// eslint-disable-next-line no-console
	console.log(
		'📋',
		chalk.gray('Copied to clipboard:'),
		chalk.greenBright(cppFile),
	)
}
