// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import * as fs from 'node:fs/promises'
import { join } from 'node:path'

import { assert } from '@voltiso/assertor'
import { createNestedSubject } from '@voltiso/observer'
import * as s from '@voltiso/schemar'
import { define } from '@voltiso/util'
import * as superjson from 'superjson'

import { getConfig } from './getConfig'

const sCliState = s.object({
	currentTask: s.string.minLength(1).optional,
	currentProgram: s.string.minLength(1).optional,
})

export type CliState = typeof sCliState.Type

const defaultCliState = define<CliState>().value({})

const stateFile = './.state.json'

export const cliState$ = createNestedSubject<CliState>(defaultCliState)

let initDone = false

async function init() {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const stateDataBuffer = await fs.readFile(stateFile)
	const stateData = superjson.parse(stateDataBuffer.toString())

	assert(sCliState.isValid(stateData))

	// console.log('init state', stateData)

	cliState$.patch(stateData)

	initDone = true
}

// eslint-disable-next-line unicorn/prefer-top-level-await
export const initCliStatePromise = init()

// eslint-disable-next-line rxjs/no-ignored-error
void cliState$.subscribe(value => {
	// console.log('subscription', value)
	if (!initDone) return

	// console.log('save state to file', value)

	const rawData = superjson.stringify(value)
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	void fs.writeFile(stateFile, rawData)
})

//

export async function getCurrentProgramPath(): Promise<string | undefined> {
	await initCliStatePromise
	const { currentTask, currentProgram } = cliState$.value
	if (!currentTask) return undefined
	if (!currentProgram) return undefined

	const config = await getConfig()

	return join(config.tasksDir, currentTask, currentProgram)
}
