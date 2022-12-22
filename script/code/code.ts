// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import * as path from 'node:path'

import { findProgramPath } from '../../src/findProgramPath'
import { loggedCopyFile, loggedMkdir } from './log'
import { openVscode } from './openVscode'

//

/** Open program or test in `vscode` */
export const code = async (programOrTest?: string) => {
	// eslint-disable-next-line no-param-reassign
	programOrTest = await findProgramPath(programOrTest)

	if (programOrTest.includes('/test/')) {
		await codeProblemTest(programOrTest)
	} else {
		await codeProblem(programOrTest)
	}
}

//

//

export async function codeProblem(problem: string) {
	const problemPath = await findProgramPath(problem)
	const problemDir = path.dirname(problemPath)

	await loggedMkdir(problemDir)

	await loggedCopyFile('templates/solution.cpp', `${problemPath}.cpp`)

	const testDir = path.join(problemDir, 'test')
	await loggedMkdir(testDir)

	await loggedCopyFile('templates/0.in', path.join(testDir, '0.in'))
	await loggedCopyFile('templates/0.out', path.join(testDir, '0.out'))

	await openVscode(`${problemPath}.cpp`)
}

//

export async function codeProblemTest(name: string) {
	const inFile = path.join('problems', `${name}.in`)
	const outFile = path.join('problems', `${name}.out`)

	await loggedCopyFile(path.join('problems', '0.out'), outFile)
	await loggedCopyFile(path.join('problems', '0.in'), inFile)

	await openVscode(outFile)
	await openVscode(inFile)
}
