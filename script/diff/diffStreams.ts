// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { Readable } from 'node:stream'

import { assert } from '@voltiso/assertor'
import { isPolluting } from '@voltiso/util'

import type { Diff } from './diff-types'
import { Uint8FromBufferQueue } from './Uint8FromBufferQueue'
import {
	isTokenCharCode,
	isWhitespaceCharCode,
	WhitespaceIgnorerAdapter,
} from './WhitespaceIgnorer'

// /** Max token length for token-level reporting */
// const maxTokenLength = 20

// export type DiffStreamsOptions = {
// 	onHaveStreamConfirmation: (success: boolean) => void
// }

// const defaultOptions = define<DiffStreamsOptions>().value({})

export type StreamInfoForDiff = {
	readable: Readable

	/**
	 * Need to confirm if e.g. process exited normally.
	 *
	 * Without it, we returned diff for missing data and killed the process before
	 * we were aware the process was already killed and it was the reason for the
	 * missing data.
	 */
	success?: Promise<void>
}

/**
 * 1. Tokenize input by using all whitespace as separators.
 * 2. Compare token-by-token
 */
export async function diffStreams(
	streams: {
		want: StreamInfoForDiff
		have: StreamInfoForDiff
	},
	// partialOptions?: Partial<DiffStreamsOptions> | undefined,
): Promise<Diff | undefined> {
	type MyQueue = {
		input: Uint8FromBufferQueue
		output: WhitespaceIgnorerAdapter
	}

	type Queues = {
		want: MyQueue
		have: MyQueue
	}

	function createMyQueue(): MyQueue {
		const input = new Uint8FromBufferQueue()
		const output = new WhitespaceIgnorerAdapter(input)
		return { input, output }
	}

	const queues: Queues = {
		want: createMyQueue(),
		have: createMyQueue(),
	}

	let lineIdx = 1
	let lineTokenIdx = 1
	let tokenCharIdx = 1

	let diff: Diff | undefined

	const processQueues = () => {
		while (
			!diff &&
			queues.want.output.peekFront() !== undefined &&
			queues.have.output.peekFront() !== undefined
		) {
			const wantCharCode = queues.want.output.shift()
			const haveCharCode = queues.have.output.shift()

			assert(wantCharCode !== undefined)
			assert(haveCharCode !== undefined)

			assert(!diff)

			if (wantCharCode === haveCharCode) {
				if (isTokenCharCode(wantCharCode)) {
					tokenCharIdx += 1
				} else {
					tokenCharIdx = 1

					if (isWhitespaceCharCode(wantCharCode)) {
						lineTokenIdx += 1
					} else {
						lineTokenIdx = 1

						// eslint-disable-next-line unicorn/prefer-code-point
						assert(wantCharCode === '\n'.charCodeAt(0))
						lineIdx += 1
					}
				}

				continue
			}

			diff = {
				type: 'wrong-char',

				wantCharCode,
				haveCharCode,

				lineIdx,
				lineTokenIdx,
				tokenCharIdx,
			}

			// if (options.onDiff) options.onDiff()

			break
		}
	}

	class DiffEncounteredError extends Error {
		constructor() {
			super()
			this.name = 'DiffEncounteredError'
		}
	}

	const streamsEnded = (['want', 'have'] as const).map(
		which =>
			// eslint-disable-next-line promise/avoid-new
			new Promise<void>((resolve, reject) => {
				assert(!isPolluting(which))
				// eslint-disable-next-line security/detect-object-injection
				const stream = streams[which]
				assert(stream)

				// eslint-disable-next-line security/detect-object-injection
				const queue = queues[which]
				assert(queue)

				// for (const event of [
				// 	'close',
				// 	'data',
				// 	'end',
				// 	'error',
				// 	'pause',
				// 	'readable',
				// 	'resume',
				// ]) {
				// 	stream.readable.on(event, () => console.log('!stream!', which, event))
				// }

				stream.readable.on('data', (chunk: Buffer) => {
					// eslint-disable-next-line security/detect-object-injection
					queues[which].input.push(chunk)
					processQueues()
					if (diff) reject(new DiffEncounteredError())
				})

				// eslint-disable-next-line promise/avoid-new
				const streamEnded = new Promise((resolve, reject) => {
					stream.readable.on('end', resolve)
					stream.readable.on('error', reject)
				})

				void Promise.all([streamEnded, stream.success])
					// eslint-disable-next-line promise/prefer-await-to-then
					.then(() => resolve())
					// eslint-disable-next-line promise/prefer-await-to-then
					.catch(reject)

				stream.readable.on('error', reject)
			}),
		// .then(() => {
		// 	/** Add newlines */
		// 	// eslint-disable-next-line unicorn/prefer-code-point, security/detect-object-injection
		// 	queues[which].input.push(Buffer.from(['\n'.charCodeAt(0)]))
		// 	processQueues()
		// }),
	)

	try {
		await Promise.all(streamsEnded)
	} catch (error) {
		if (!(error instanceof DiffEncounteredError)) throw error
	}

	return diff
}
