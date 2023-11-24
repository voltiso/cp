// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { assert } from '@voltiso/assertor'
import type { Mutable } from '@voltiso/util'
import { AbortError, sleep } from '@voltiso/util'
// @ts-expect-error ESM
import ansi from 'ansi-escapes'
import chalk from 'chalk'
import type Denque from 'denque'

import type { RunTestCaseResult } from './runTestCase'
import { spinners } from './spinners'
import { stringFromTestCaseResult } from './stringFromResult'
import type { TestCase } from './TestCase'

const defaultOptions = {
	updateInterval: 100,
}

export namespace TestStatusDisplay {
	export type Options = {
		currentCases: Map<string, RunTestCaseResult>
		remainingCases: Denque<TestCase>
		casesDone: RunTestCaseResult[]

		/**
		 * Screen update interval
		 *
		 * @defaultValue 100
		 */
		updateInterval: number

		signal?: AbortSignal | undefined
	}

	export type OptionsInput = Partial<Options> &
		Pick<Options, 'currentCases' | 'remainingCases' | 'casesDone'>

	export type Controller = {
		update: () => void
		close: () => RunResult
		// log: (...messages: unknown[]) => void

		readonly numLines: number
	}

	export type RunResult = Promise<void> & Controller
}

function printLine({ controller }: { controller: RunTestCaseResult }) {
	const coloredInFile = controller.options.testCase.inFile
		.replace('task/', chalk.gray('task/'))
		.replace('/test/', chalk.gray('/test/'))

	// eslint-disable-next-line es-x/no-date-now
	const dt: number = Date.now() - +controller.t0

	const spinner = spinners.monkey

	const spinnerFrame: string =
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		spinner.frames[Math.floor(dt / spinner.interval) % spinner.frames.length]!

	const result = controller.result

	if (result) {
		const message = stringFromTestCaseResult(result, { t0: controller.t0 })
		const good = !result.diff && result.exitedWith?.code === 0
		const icon = result.cancelled ? '🟡' : good ? '🟢' : '🔴'
		process.stdout.write(`${icon} ${coloredInFile} ${message}`)
	} else {
		process.stdout.write(`${spinnerFrame} ${coloredInFile}...`)
	}
}

export function runTestStatusDisplay(
	optionsInput: TestStatusDisplay.OptionsInput,
): TestStatusDisplay.RunResult {
	const options: TestStatusDisplay.Options = {
		...defaultOptions,
		...optionsInput,
	}

	const state = {
		done: false,
		sleepPromise: undefined as ReturnType<typeof sleep> | undefined,

		result: undefined as
			| undefined
			| Mutable<Partial<TestStatusDisplay.RunResult>>,
	}

	if (options.signal) {
		options.signal.addEventListener(
			'abort',
			() => {
				state.sleepPromise?.abort()
			},
			{ once: true },
		)
	}

	state.result = (async () => {
		process.stdout.write(ansi.cursorHide)

		let numTestCasesDone = 0

		while (!state.done) {
			if (options.signal?.aborted) throw new AbortError()

			state.sleepPromise = sleep(options.updateInterval)
			// eslint-disable-next-line no-await-in-loop
			await state.sleepPromise

			//

			assert.defined(state.result?.numLines)

			process.stdout.write('\r')
			for (let i = 0; i < state.result.numLines - 1; ++i) {
				process.stdout.write(ansi.cursorPrevLine)
			}

			// print finished test cases
			for (let idx = numTestCasesDone; idx < options.casesDone.length; ++idx) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, security/detect-object-injection
				printLine({ controller: options.casesDone[idx]! })
				process.stdout.write('\n')
			}

			numTestCasesDone = options.casesDone.length

			let first = true

			for (const controller of options.currentCases.values()) {
				if (first) first = false
				else process.stdout.write('\n')

				printLine({ controller })
			}

			state.result.numLines = options.currentCases.size
		}

		process.stdout.write(ansi.cursorShow)
	})()

	// eslint-disable-next-line es-x/no-object-assign
	return Object.assign(state.result as TestStatusDisplay.RunResult, {
		update: () => {
			state.sleepPromise?.cancel() // resolve early
		},

		close: () => {
			state.done = true
			state.sleepPromise?.cancel()
			return state.result as never
		},

		numLines: 0,
	})
}
