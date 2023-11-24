// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

/* eslint-disable no-console */
/* eslint-disable unicorn/no-await-expression-member */

import * as cp from 'node:child_process'
import { promisify } from 'node:util'

import chalk from 'chalk'

const exec = promisify(cp.exec)

export function execChild(command: string) {
	console.log(
		'🏃',
		chalk.bold(command.split(' ')[0]),
		chalk.gray(command.split(' ').slice(1).join(' ')),
	)

	const promise = exec(command)
	// eslint-disable-next-line promise/prefer-await-to-then
	return promise.then(result => {
		if (promise.child.exitCode !== 0)
			throw new Error(`exit code ${promise.child.exitCode}`)

		return {
			...result,
			child: promise.child,
			code: promise.child.exitCode,
			signal: promise.child.signalCode,
		}
	})
}

export async function installLinuxHeaders() {
	const unameR = (await execChild('uname -r')).stdout.trim()
	console.log(chalk.gray('uname -r:'), unameR)

	//

	await execChild('sudo apt-get update')

	// 'sudo apt install gcc-multilib'
}
