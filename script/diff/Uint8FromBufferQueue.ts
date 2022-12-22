// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { assert } from '@voltiso/assertor'
import Denque from 'denque'

/**
 * - Buffered synchronous read stream
 * - Write stream
 */
export class Uint8FromBufferQueue {
	chunks = new Denque<Buffer>()

	/**
	 * If `chunks` is not empty, `firstChunkPos` points to the next character to
	 * be read (always in the first chunk of the queue).
	 */
	firstChunkPos: number | undefined = undefined

	push(chunk: Buffer) {
		assert(chunk.length > 0) // not supported
		this.chunks.push(chunk)

		if (this.firstChunkPos === undefined) {
			this.firstChunkPos = 0
		}
	}

	peekFront(): number | undefined {
		if (this.firstChunkPos === undefined) return undefined

		const chunk = this.chunks.peekFront()
		assert(chunk)

		// eslint-disable-next-line es-x/no-array-string-prototype-at
		const value = chunk.at(this.firstChunkPos)
		assert(value)

		return value
	}

	shift(): number | undefined {
		const chunk = this.chunks.peekFront()
		assert(chunk)

		assert(this.firstChunkPos !== undefined)
		// eslint-disable-next-line es-x/no-array-string-prototype-at
		const value = chunk.at(this.firstChunkPos)
		assert(value)

		this.firstChunkPos += 1
		if (this.firstChunkPos === chunk.length) {
			this.chunks.shift()

			if (this.chunks.length > 0) this.firstChunkPos = 0
			else this.firstChunkPos = undefined
		}

		return value
	}
}
