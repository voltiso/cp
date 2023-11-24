// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import { constants, copyFile, mkdir } from 'node:fs/promises'

import chalk from 'chalk'

export async function loggedMkdir(dir: string) {
	// eslint-disable-next-line no-console
	console.log(chalk.gray('mkdir', dir))
	await mkdir(dir, { recursive: true })
}

export async function loggedCopyFile(from: string, to: string) {
	// eslint-disable-next-line no-console
	console.log(chalk.gray('copy'), from, chalk.gray('to'), to)
	try {
		await copyFile(from, to, constants.COPYFILE_EXCL)
	} catch {
		// eslint-disable-next-line no-console
		console.log(chalk.gray('already exists:'), to)
	}
}
