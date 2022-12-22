// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import * as fs from 'node:fs/promises'

import chalk from 'chalk'

import { findProgramPath } from '../src/findProgramPath'

export const submit = async (program?: string) => {
	// eslint-disable-next-line no-param-reassign
	program = await findProgramPath(program)
	//
	const cppFile = `${program}.cpp`

	// eslint-disable-next-line security/detect-non-literal-fs-filename
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
