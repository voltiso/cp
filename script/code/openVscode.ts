// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import * as cp from 'node:child_process'
import { promisify } from 'node:util'

const exec = promisify(cp.exec)

export async function openVscode(file: string) {
	// if (file.endsWith('.cpp')) {
	// 	await exec(`code -g ${file}:91`)
	// } else {
	await exec(`code ${file}`)
	// }
}
