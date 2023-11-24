// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import * as fs from 'node:fs/promises'
import { Readable } from 'node:stream'

import type { TestCase } from './TestCase'

/** Stream in/out files from disk */
export async function streamFiles(testCase: TestCase) {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const inFd = await fs.open(testCase.inFile, 'r')
	const inStream = inFd.createReadStream()

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const outFd = await fs.open(testCase.outFile, 'r')
	const outStream = outFd.createReadStream()

	return { inStream, outStream }
}

/** Read in/out files into memory and stream from memory */
export async function readAndStreamFiles(testCase: TestCase) {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const inBuffer = await fs.readFile(testCase.inFile)
	const inStream = Readable.from(inBuffer)

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const outBuffer = await fs.readFile(testCase.outFile)
	const outStream = Readable.from(outBuffer)

	return { inStream, outStream }
}
