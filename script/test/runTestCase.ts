// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { spawn } from 'node:child_process'

import { assert } from '@voltiso/assertor'
import type { MaybePromise, Mutable } from '@voltiso/util'

import { diffStreams } from '../diff/diffStreams'
import { readAndStreamFiles, streamFiles } from './streamFiles'
import type { TestCase } from './TestCase'
import type { TestCaseController } from './TestCaseController'
import type { TestCaseExitedWith, TestCaseResult } from './TestCaseResult'

export type RunTestCaseResult = Promise<TestCaseResult> & TestCaseController

export type RunTestCaseOptions = {
	program: string
	testCase: TestCase
	stream: boolean
}

export type RunTestCaseOptionsInput = Partial<RunTestCaseOptions> &
	Pick<RunTestCaseOptions, 'program' | 'testCase'>

const defaultOptions = {
	/**
	 * Stream in/out files from disk (may affect program execution time)
	 *
	 * @defaultValue false
	 */
	stream: false,
}

export function runTestCase(
	optionsInput: RunTestCaseOptionsInput,
): RunTestCaseResult {
	const options: RunTestCaseOptions = { ...defaultOptions, ...optionsInput }

	const state: {
		result?: Promise<TestCaseResult> & Mutable<Partial<TestCaseController>>
	} = {}

	let _resolve: undefined | ((value: MaybePromise<TestCaseResult>) => void)

	state.result =
		// eslint-disable-next-line promise/avoid-new
		new Promise<TestCaseResult>((resolve, reject) => {
			_resolve = resolve

			//
			;(async () => {
				const cp = spawn(options.program, {
					stdio: ['pipe', 'pipe', 'ignore'],
					detached: true,
				})

				const { inStream, outStream } = await (options.stream
					? streamFiles(options.testCase)
					: readAndStreamFiles(options.testCase))

				// eslint-disable-next-line promise/avoid-new
				const exitedWith = new Promise<TestCaseExitedWith>(
					(resolve, reject) => {
						cp.on('exit', (code, signal) => resolve({ code, signal }))
						cp.on('error', reject)
					},
				)

				// eslint-disable-next-line promise/prefer-await-to-then
				exitedWith.then(result => resolve({ exitedWith: result })).catch(reject)

				assert(state.result)

				state.result.t0 = new Date()
				inStream.pipe(cp.stdin)

				const diff = await diffStreams({
					want: { readable: outStream },

					have: {
						readable: cp.stdout,

						success: exitedWith.then(status => {
							// eslint-disable-next-line promise/always-return
							if (status.code !== 0) throw new Error('NZEC')
						}),
					},
				})

				if (diff) {
					// console.log('!CP! got diff so kill')
					cp.kill()
				}

				resolve({ diff })

				// eslint-disable-next-line promise/prefer-await-to-then
			})().catch(reject)
			// eslint-disable-next-line promise/prefer-await-to-then
		}).then(result => {
			assert(state.result)
			state.result.result = result
			return result
		})

	// eslint-disable-next-line es-x/no-object-assign
	return Object.assign(state.result, {
		options,
		t0: new Date(),

		cancel: () => {
			assert(_resolve)
			_resolve({ cancelled: true })
		},
	})

	// // eslint-disable-next-line prefer-const
	// let resultPromise: Promise<TestCaseResult> | undefined

	// let result: TestCaseResult | undefined

	// const runLinePrinter = async () => {
	// 	// eslint-disable-next-line no-unmodified-loop-condition
	// 	while (!result) {
	// 		printLine()

	// 		// eslint-disable-next-line no-magic-numbers, no-await-in-loop
	// 		await Promise.race([sleep(100), resultPromise].filter(Boolean))
	// 	}

	// 	printLine()
	// }

	// const linePrinter = runLinePrinter()

	// type ListenerInfo = {
	// 	event: NodeJS.Signals
	// 	listener: () => void
	// }

	// const processListeners: ListenerInfo[] = []

	// const addProcessListener = (info: ListenerInfo) => {
	// 	process.on(info.event, info.listener)
	// 	processListeners.push(info)
	// }

	// 	addProcessListener({ event: 'SIGINT', listener: cancel })

	// for (const entry of processListeners) {
	// 	process.removeListener(entry.event, entry.listener)
	// }
}
