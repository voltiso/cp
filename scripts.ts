// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import type { Script } from '@voltiso/script'

//

const env = {
	FORCE_COLOR: 1 as const,
}

const envStr = Object.entries(env)
	.map(([key, value]) => `${key}=${value}`)
	.join(' ')

const finalEnvStr = `cross-env ${envStr}`

//

function turboAllPackages(
	scriptName: string,
	options?: { concurrency?: number },
) {
	const turboOptions = {} as Record<string, string | number>

	if (options?.concurrency !== undefined) {
		turboOptions['concurrency'] = Math.round(options.concurrency)
	}

	const turboOptionsStr = Object.entries(turboOptions)
		.map(([key, value]) => `--${key} ${value}`)
		.join(' ')

	return `${finalEnvStr} pnpm -w exec turbo run ${turboOptionsStr} ${scriptName} --output-logs=new-only`
}

//

export const patchTs = 'ts-patch install -s'

const _buildWorkspaceDependencies = `pnpm -w exec turbo run build:cjs --filter=//^... --output-logs=new-only`

export const prepareWorkspace = [patchTs, _buildWorkspaceDependencies]

export const buildWorkspace = turboAllPackages('build:cjs')

// per-package

export const buildCjs: Script = [
	'rimraf dist/cjs',
	'tsc -b tsconfig.build.cjs.json',
]

export const build: Script = [buildCjs]
