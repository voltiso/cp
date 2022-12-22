// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import chalk from 'chalk'

import type { Diff, WrongChar } from './diff-types'

//

export function stringFromDiff(diff: Diff): string {
	if (diff.type === 'wrong-char') {
		return stringFromWrongChar(diff)
	} else {
		return 'unknown diff'
	}
}

//

export function stringFromWrongChar(diff: WrongChar) {
	/** Header */
	const h = (str: unknown) => chalk.gray(str)

	/** Value */
	const v = (str: unknown) => chalk.bgWhite.bold(str)

	const lineStr = `${h('L')}${v(diff.lineIdx)}`
	const tokenStr = `${h('T')}${v(diff.lineTokenIdx)}`
	const charStr = `${h('C')}${v(diff.tokenCharIdx)}}`

	const location = `${lineStr}${tokenStr}${charStr}`

	// eslint-disable-next-line unicorn/prefer-code-point
	const want = String.fromCharCode(diff.wantCharCode)
	// eslint-disable-next-line unicorn/prefer-code-point
	const have = String.fromCharCode(diff.haveCharCode)

	return `${location} ${chalk.gray('got')} ${chalk.red(have)} ${chalk.gray(
		'instead of',
	)} ${chalk.green(want)}`
}
