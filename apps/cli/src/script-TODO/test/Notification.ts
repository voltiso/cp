// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { assert } from '@voltiso/assertor'

//

export class Notification<T = void> implements Promise<T> {
	_resolve?: (value: T | PromiseLike<T>) => void
	_reject?: (reason?: any) => void

	_promise?: Promise<T>

	resolve(value: T | PromiseLike<T>) {
		if (this._resolve) this._resolve(value)
	}

	reject(error: unknown) {
		if (this._reject) this._reject(error)
	}

	//

	// eslint-disable-next-line unicorn/no-thenable
	then<TResult1 = T, TResult2 = never>(
		onfulfilled?:
			| ((value: T) => TResult1 | PromiseLike<TResult1>)
			| null
			| undefined,
		onrejected?:
			| ((reason: any) => TResult2 | PromiseLike<TResult2>)
			| null
			| undefined,
	): Promise<TResult1 | TResult2> {
		if (!this._promise) nextPromise(this)
		assert(this._promise)
		// eslint-disable-next-line promise/prefer-await-to-then
		return this._promise.then(onfulfilled, onrejected)
	}

	catch<TResult = never>(
		onrejected?:
			| ((reason: any) => TResult | PromiseLike<TResult>)
			| null
			| undefined,
	): Promise<T | TResult> {
		if (!this._promise) nextPromise(this)
		assert(this._promise)
		// eslint-disable-next-line promise/prefer-await-to-then
		return this._promise.catch(onrejected)
	}

	finally(onfinally?: (() => void) | null | undefined): Promise<T> {
		if (!this._promise) nextPromise(this)
		assert(this._promise)
		// eslint-disable-next-line promise/prefer-await-to-then, es-x/no-promise-prototype-finally
		return this._promise.finally(onfinally)
	}

	// eslint-disable-next-line class-methods-use-this
	get [Symbol.toStringTag]() {
		return 'Notification'
	}
}

//

function nextPromise<T>(notification: Notification<T>) {
	// eslint-disable-next-line promise/avoid-new
	notification._promise = new Promise((resolve, reject) => {
		notification._resolve = resolve
		notification._reject = reject
	})
}

export type ResolveListener<T = void> = (
	...args: T extends void ? [] : [T]
) => void

export type RejectListener<TResult = never> = (
	reason: unknown,
) => TResult | PromiseLike<TResult>
