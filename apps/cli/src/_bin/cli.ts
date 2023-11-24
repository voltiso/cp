// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { HandlersTree } from '@voltiso/handler'
import type { AlsoAccept, ReadonlyPropertyPath } from '@voltiso/util'
import { $AssumeType, define, tryGet } from '@voltiso/util'
import chalk from 'chalk'

import * as commands from '../commands'

export const handlers = define<HandlersTree>().value({
	...commands,
})

export type MyHandlers = typeof handlers

export function run<H extends HandlersTree>(
	handlers: H,
	...args: ReadonlyPropertyPath<H> | AlsoAccept<(keyof any)[]>
) {
	if (typeof handlers === 'function') return handlers(...args) as never

	const [arg, ...rest] = args

	const availableCommandsStr = Object.keys(handlers)
		.map(name => chalk.green(name))
		.join(', ')

	if (!arg) {
		// console.log('Available commands:', availableCommandsStr)
		// process.exit(1)
		throw new Error(
			`${chalk.red(
				`No command provided`,
			)}. Available commands: ${availableCommandsStr}`,
		)
	}

	$AssumeType<keyof typeof handlers>(arg)

	const subHandlers = tryGet(handlers, arg)

	if (!subHandlers) {
		// console.log('Unknown command:', arg)
		// console.log('Available commands:', availableCommandsStr)
		// process.exit(1)
		const errorMessage = chalk.red(`Unknown command: ${arg}`)
		const helpMessage = `Available commands: ${availableCommandsStr}`
		throw new Error(`${errorMessage}. ${helpMessage}.`)
	}

	return run(subHandlers, ...rest)
}

const cliArguments = process.argv.slice(2)
run(handlers, ...cliArguments)
