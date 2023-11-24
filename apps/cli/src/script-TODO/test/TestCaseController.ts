// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { RunTestCaseOptions } from './runTestCase'
import type { TestCaseResult } from './TestCaseResult'

export interface TestCaseController {
	readonly options: Readonly<RunTestCaseOptions>
	// readonly result: TestCaseResult

	readonly t0: Date

	readonly cancel: () => void

	readonly result?: TestCaseResult
}
