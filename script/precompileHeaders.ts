// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { mkdir } from 'node:fs/promises'
import * as fs from 'node:fs/promises'
import { dirname, join } from 'node:path'

import type { Script } from '@voltiso/script.lib'
import { isDefined } from '@voltiso/util'
import chalk from 'chalk'

import { getConfig } from '../src/getConfig'
import { getHeaderPath } from '../src/getHeaderPath'
import { shell } from '../src/shell'

//

async function exists(path: string): Promise<boolean> {
	try {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		const stat = await fs.lstat(path)
		return stat.isFile()
	} catch {
		return false
	}
}

export const precompileHeaders: Script = async () => {
	const config = await getConfig()

	const pchDir = '.pch'

	const compileTasks = (
		await Promise.all(
			(['debug', 'release'] as const).map(async name => {
				const out = join(pchDir, name, 'bits', `stdc++.h.gch`)

				if (await exists(out)) {
					// eslint-disable-next-line no-console
					console.log(
						chalk.gray('Not compiling into existing precompiled header'),
						out,
						// resolve(out),
					)
					return undefined
				}

				const commonFlagsStr = config.flags.common.join(' ')

				// eslint-disable-next-line security/detect-object-injection
				const additionalFlagsStr = config.flags[name].join(' ')

				const flags = `${commonFlagsStr} ${additionalFlagsStr}`

				return { name, out, flags }
			}),
		)
	)
		// eslint-disable-next-line unicorn/no-await-expression-member, unicorn/no-array-callback-reference
		.filter(isDefined)

	if (compileTasks.length === 0) return

	const headerPath = await getHeaderPath()

	// eslint-disable-next-line no-console
	console.log(chalk.gray('bits/stdc++.h location:'), headerPath)

	await mkdir(pchDir, { recursive: true })

	await Promise.all(
		compileTasks.map(async task => {
			await mkdir(dirname(task.out), { recursive: true })
			const compile = `${config.compiler} ${task.flags}`
			await shell(`${compile} ${headerPath} -o ${task.out}`)
			// await shell(`ln -s ${headerPath}`, { cwd: dirname(task.out) })
			// await shell(`${compile} ${dirname(task.out)}/stdc++.h`)
		}),
	)
}
