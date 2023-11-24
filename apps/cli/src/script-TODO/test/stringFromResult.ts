// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import chalk from 'chalk'

import { stringFromDiff } from '../diff/stringFromDiff'
import type { TestCaseResult } from './TestCaseResult'

export function stringFromTestCaseResult(
	result: TestCaseResult,
	options: { t0: Date },
): string {
	if (result.cancelled) {
		return `🟡 ${chalk.yellow('cancelled')}`
	} else if (result.diff) {
		return `🔴 ${stringFromDiff(result.diff)}`
	} else if (result.exitedWith?.signal) {
		return `🔴 ${chalk.red(result.exitedWith.signal)}`
	} else if (result.exitedWith?.code) {
		return `🔴 exit code ${result.exitedWith.code}`
	} else {
		// eslint-disable-next-line unicorn/prefer-date-now
		const dt = +new Date() - +options.t0
		// eslint-disable-next-line no-magic-numbers
		const timeStr = `${(dt / 1_000).toFixed(3)}s`
		return `🟢 ${chalk.green(timeStr)}`
	}
}
