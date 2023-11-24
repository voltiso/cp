// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { spawn } from 'node:child_process'

import chalk from 'chalk'

import { findProgramPath } from '../../../cli/src/util/findProgramPath'
import { error, log } from '../../../cli/src/log/log'

// if (!process.stdin.isTTY) {
// 	console.log('non-tty', { isRaw: process.stdin.isRaw })
// 	process.stdin.setRawMode(true)
// }

async function main(): Promise<number> {
	// eslint-disable-next-line prefer-const
	let [program, ...args] = process.argv.slice(2)

	if (!program) {
		program = await findProgramPath(program)
	}

	if (!program) {
		// eslint-disable-next-line no-console, @typescript-eslint/no-non-null-assertion
		console.log(`Usage: ${process.argv[1]!} COMMAND [...ARGS]`)
		return 1
	}

	const cp = spawn([program, ...args].join(' '), { shell: true })

	process.stdin.on('data', (data: Buffer) => {
		// eslint-disable-next-line es-x/no-string-prototype-trimstart-trimend
		log(chalk.gray(data.toString().trimEnd()))
		cp.stdin.write(data)
	})

	cp.stdout.on('data', (data: Buffer) => {
		// '➡️  '
		// eslint-disable-next-line es-x/no-string-prototype-trimstart-trimend
		log(chalk.yellow(data.toString().trimEnd()))
	})

	cp.stderr.on('data', (data: Buffer) => {
		// '⚠️ '
		// eslint-disable-next-line es-x/no-string-prototype-trimstart-trimend
		error(chalk.red(data.toString().trimEnd()))
	})

	cp.on('exit', (code, signal) => {
		// console.log('program close', { code, signal })
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (process.stdin.unref) process.stdin.unref()

		if (signal) log(chalk.gray('signal'), signal)
		log(code ? '🔴 ' : '🟢 ', chalk.gray('exit code'), code)
	})

	return 0
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void main().then(code => {
	if (code) process.exitCode = code
	return undefined
})
