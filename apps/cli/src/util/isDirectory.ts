// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { lstat } from 'node:fs/promises'

export async function isDirectory(p: string): Promise<boolean> {
	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const stat = await lstat(p)
		return stat.isDirectory()
	} catch {}
	return false
}
