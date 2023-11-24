export async function runWithRawStdin(run: () => Promise<void>) {
	const wasRaw = process.stdin.isRaw
	try {
		process.stdin.setRawMode(true)
		await run()
	} finally {
		process.stdin.setRawMode(wasRaw)
	}
}
