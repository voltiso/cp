// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import * as s from '@voltiso/schemar'

const string = s.string.minLength(1)

export const sConfig = s.object({
	tasksDir: string,
	compiler: string,

	flags: {
		common: s.array(string),
		debug: s.array(string),
		release: s.array(string),
	},
})

export type Config = typeof sConfig.Type
