import rawGlob from 'glob'
import { promisify } from 'util'
import type { TestCase } from './TestCase'

const glob = promisify(rawGlob)

export async function getTestCases(task: string): Promise<TestCase[]> {
	const matches = await glob(`${task}/test/**/*.in`)
	return matches.map(match => ({
		inFile: match,
		outFile: `${match.slice(0, -3)}.out`,
	}))
}
