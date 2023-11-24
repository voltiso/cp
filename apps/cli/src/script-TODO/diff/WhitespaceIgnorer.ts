// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { assert } from '@voltiso/assertor'
import type { AlsoAccept } from '@voltiso/util'

import type { Uint8FromBufferQueue } from './Uint8FromBufferQueue'

/** All whitespace except newlines */
// eslint-disable-next-line unicorn/prefer-code-point
const whitespaceCharCodes = [' ', '\t', '\r'].map(char => char.charCodeAt(0))

/** All whitespace except newlines */
export function isWhitespaceCharCode(
	charCode: number | AlsoAccept<unknown>,
): boolean {
	if (typeof charCode !== 'number') return false
	return whitespaceCharCodes.includes(charCode)
}

// eslint-disable-next-line unicorn/prefer-code-point, unicorn/prefer-set-has
const nonTokenCharCodes = [...whitespaceCharCodes, '\n'.charCodeAt(0)]

export function isTokenCharCode(
	charCode: number | AlsoAccept<unknown>,
): boolean {
	if (typeof charCode !== 'number') return false
	return !nonTokenCharCodes.includes(charCode)
}

//

/** An adapter for a synchronous (buffered) Uint8 read stream */
export class WhitespaceIgnorerAdapter {
	queue: Uint8FromBufferQueue

	/**
	 * Pending whitespace will be discarded on newline or more whitespace.
	 *
	 * This means:
	 *
	 * - Remove whitespace adjacent to newlines
	 * - Do not collapse adjacent newlines
	 * - Collapse all other whitespace into a single space
	 */
	pendingSpace = true // ignore whitespace at the beginning

	constructor(queue: Uint8FromBufferQueue) {
		this.queue = queue
	}

	peekFront(): number | undefined {
		while (isWhitespaceCharCode(this.queue.peekFront())) {
			this.pendingSpace = true
			this.queue.shift()
		}

		const next = this.queue.peekFront()
		if (!next) return undefined

		// eslint-disable-next-line unicorn/prefer-code-point
		if (this.pendingSpace && next !== '\n'.charCodeAt(0)) {
			this.pendingSpace = false
			// eslint-disable-next-line unicorn/prefer-code-point
			return ' '.charCodeAt(0)
		}

		assert(!isWhitespaceCharCode(next))
		return next
	}

	shift(): number | undefined {
		const next = this.peekFront()
		assert(next !== undefined)
		assert(!isWhitespaceCharCode(next))
		this.queue.shift()
		return next
	}
}
