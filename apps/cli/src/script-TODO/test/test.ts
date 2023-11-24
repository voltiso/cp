// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import os from 'node:os'
import { dirname } from 'node:path'

import { assert } from '@voltiso/assertor'
import { findProgramPath } from '@voltiso/cp.util'
import type { Script } from '@voltiso/script.lib'
import chalk from 'chalk'
import Denque from 'denque'

import { compileRelease } from '../compile'
import { getTestCases } from './getTestCases'
import type { RunTestCaseResult } from './runTestCase'
import { runTestCase } from './runTestCase'
import { runTestStatusDisplay } from './runTestStatusDisplay'
import { runWithRawStdin } from './runWithRawStdin'
import type { TestCase } from './TestCase'

//

export const testOnly: Script = async program => {
	// eslint-disable-next-line no-param-reassign, require-atomic-updates
	program = await findProgramPath(program)

	const testCases = await getTestCases(dirname(program))

	const cpus = os.cpus()
	const poolSize = cpus.length

	const currentCases = new Map<string, RunTestCaseResult>()
	const remainingCases = new Denque<TestCase>()
	const casesDone: RunTestCaseResult[] = []

	for (const testCase of testCases) {
		remainingCases.push(testCase)
	}

	const testStatusDisplay = runTestStatusDisplay({
		currentCases,
		remainingCases,
		casesDone,
	})

	const promises: Promise<void>[] = []

	function process() {
		while (currentCases.size < poolSize && !remainingCases.isEmpty()) {
			const testCase = remainingCases.shift()
			assert(testCase)
			const name = testCase.inFile
			assert(!currentCases.has(name))

			const result = runTestCase({ program, testCase })

			currentCases.set(name, result)

			// eslint-disable-next-line promise/prefer-await-to-then, promise/always-return
			const promise = result.then(() => {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				casesDone.push(currentCases.get(name)!)
				currentCases.delete(name)
				testStatusDisplay.update()
				process()
			})
			promises.push(promise)
		}
	}

	await runWithRawStdin(async () => {
		const g = chalk.gray
		const help = g(`(${chalk.white.bold('S')}kip?)`)
		// eslint-disable-next-line no-console
		console.log(
			`🧪 ${g('Running')} ${testCases.length} ${g('test cases...')} ${help}`,
		)

		process()

		await Promise.all(promises)
	})

	await testStatusDisplay.close()
}

export const test: Script = async program => {
	// eslint-disable-next-line no-param-reassign, require-atomic-updates
	program = await findProgramPath(program)
	return [() => compileRelease(program), () => testOnly(program)]
}
