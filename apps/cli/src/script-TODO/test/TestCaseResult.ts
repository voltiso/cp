// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { Diff } from '../diff/diff-types'

export type TestCaseExitedWith = {
	code: number | null
	signal: NodeJS.Signals | null
}

export type TestCaseResult = {
	cancelled?: boolean
	exitedWith?: TestCaseExitedWith
	diff?: Diff | undefined
}
