// â â¥ 2022     ð©    ð©     â    â 
// â          ð© VÍoÍÍÍltÍÍÍiÍÍÍÍsoÍÍÍ.comâ   â â â 

import type { Writable } from 'node:stream'

const blocks = [' ', 'â', 'â', 'â', 'â', 'â', 'â', 'â', 'â']

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
