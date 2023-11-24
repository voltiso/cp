// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import chalk from 'chalk'
import { findProgramPath } from '~/util'
import { shell } from '~/util/shell'

export async function watch(program: string) {
	// eslint-disable-next-line no-param-reassign, require-atomic-updates
	program = await findProgramPath(program)

	async function onChange() {
		// eslint-disable-next-line no-console
		console.clear()
		// eslint-disable-next-line no-console
		console.log('🔍', chalk.gray('Compile'), `${program}${chalk.gray('...')}`)
		// eslint-disable-next-line no-console
		console.log()

		const t0 = new Date()

		const { code } = await shell(await compileRelease(program))

		// eslint-disable-next-line unicorn/prefer-date-now
		const dt = +new Date() - +t0

		// eslint-disable-next-line no-console
		console.log()

		if (code === 0) {
			// eslint-disable-next-line no-console
			console.log(
				'🟢',
				chalk.gray('Compiled'),
				program,
				chalk.gray('in'),
				// eslint-disable-next-line no-magic-numbers
				`${(dt / 1000).toFixed(2)}s`
			)
		} else {
			// eslint-disable-next-line no-console
			console.log(
				'🔴',
				chalk.gray('Compilation failed after'),
				// eslint-disable-next-line no-magic-numbers
				`${(dt / 1000).toFixed(2)}s`
			)
		}
	}

	void onChange()

	nodeWatch(`${program}.cpp`, onChange)
}
