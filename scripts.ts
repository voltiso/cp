// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { Script } from '@voltiso/script.lib'

import { precompileHeaders } from './script'

export * from './script'

//

export const patchTs = 'ts-patch install -s'

export const prepare = [patchTs, precompileHeaders]

//

export const buildCjs: Script = [
	'rimraf dist/cjs',
	'tsc -b tsconfig.build.cjs.json',
]

export const build: Script = [buildCjs]

//

export const cleanPch = 'rimraf .pch'
