// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { assert } from '@voltiso/util'
import chalk from 'chalk'

const t0 = new Date()

export const getLogFunction =
	(type: 'log' | 'warn' | 'error' | 'debug') =>
	(...messages: unknown[]): void => {
		// eslint-disable-next-line unicorn/prefer-date-now
		const dt = +new Date() - +t0
		// eslint-disable-next-line no-magic-numbers
		const dtStr = (dt / 1_000).toFixed(3)

		const [s, ms] = dtStr.split('.')

		assert(s)
		assert(ms)

		const message = messages.join(' ')

		// message = message.trimEnd()

		// if (message.endsWith('\n')) message = message.slice(0, -1)

		// eslint-disable-next-line no-console, security/detect-object-injection
		console[type](chalk.bgGray(`[${s}.${ms}]`), message)
	}

export const log = getLogFunction('log')
export const warn = getLogFunction('warn')
export const error = getLogFunction('error')
export const debug = getLogFunction('debug')
