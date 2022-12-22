// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { getConfig } from '../src/getConfig'

/** Print config from `config.ts` */
export const config = async () => {
	const config = await getConfig()
	// eslint-disable-next-line no-console
	console.log(config)
}
