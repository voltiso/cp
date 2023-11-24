// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { Writable } from 'node:stream'

const blocks = [' ', '▏', '▎', '▍', '▌', '▋', '▊', '▉', '█']

export function progressBar(params: {
	width: number
	current: number
	max?: number | undefined
	stream?: Writable
}) {
	const max = params.max ?? 1
	const current = params.current / max
	const stream: Writable = params.stream ?? process.stdout

	stream.write('[')

	for (let x = 0; x < params.width; ++x) {
		const a = x / params.width
		const b = (x + 1) / params.width

		const local = (current - a) / (b - a)

		const idx = Math.floor(local / blocks.length)

		// eslint-disable-next-line security/detect-object-injection
		stream.write(blocks[idx])
	}

	stream.write(']')
}
