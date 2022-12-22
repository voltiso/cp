// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { lstat } from 'node:fs/promises'

export async function isDirectory(p: string): Promise<boolean> {
	try {
		const stat = await lstat(p)
		return stat.isDirectory()
	} catch {}
	return false
}
