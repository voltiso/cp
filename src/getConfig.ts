// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import path from 'node:path'

import { registerEsbuild } from '@voltiso/util.esbuild'

import type { Config } from './Config'
import { sConfig } from './Config'

const configFile = 'config.ts'

// eslint-disable-next-line @typescript-eslint/require-await
async function getConfigUncached(): Promise<Config> {
	registerEsbuild()
	const absoluteConfigFile = path.join(process.cwd(), configFile)

	// eslint-disable-next-line import/no-dynamic-require, n/global-require, unicorn/prefer-module
	const configModule = require(absoluteConfigFile) as { default: unknown }

	// // eslint-disable-next-line no-unsanitized/method, import/dynamic-import-chunkname
	// const configModule = (await import(absoluteConfigFile)) as {
	// 	default: unknown
	// }

	const config = configModule.default
	return sConfig.validate(config)
}

let config: Config | undefined

export async function getConfig() {
	// eslint-disable-next-line require-atomic-updates
	if (!config) config = await getConfigUncached()
	return config
}
