// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { SpawnOptions } from 'node:child_process'
import { spawn } from 'node:child_process'

import chalk from 'chalk'

export async function shell(command: string, options?: SpawnOptions) {
	// eslint-disable-next-line no-console
	console.log(
		'🏃',
		chalk.bold(command.split(' ')[0]),
		chalk.gray(command.split(' ').slice(1).join(' ')),
	)

	const cp = spawn(command, { shell: true, stdio: 'inherit', ...options })

	// eslint-disable-next-line promise/avoid-new
	const { code, signal } = await new Promise<{
		code: number | null
		signal: NodeJS.Signals | null
	}>((resolve, reject) => {
		cp.on('error', reject)
		cp.on('exit', (code, signal) => {
			resolve({ code, signal })
		})
	})

	return { code, signal }
}
