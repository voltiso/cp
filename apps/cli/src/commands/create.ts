// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

import * as fs from 'node:fs/promises'
import path from 'node:path'

import { assert } from '@voltiso/assertor'

import { openVscode } from '~/util'

function parentDir(pathStr: string, levels = 1) {
	let currentPath = pathStr
	for (let i = 0; i < levels; i++) {
		currentPath = path.dirname(currentPath)
	}
	return currentPath
}

function getCliDir(): string {
	const cliLocation = process.argv[1]
	assert(cliLocation)

	// eslint-disable-next-line no-magic-numbers
	const cliDir = parentDir(cliLocation, 4)
	return cliDir
}

function getWorkspaceTemplateDir() {
	const cliDir = getCliDir()
	const workspaceTemplateDir = path.join(cliDir, 'workspace-template')
	return workspaceTemplateDir
}

export async function create(name = 'cp') {
	// console.log('create', {name })

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	await fs.mkdir(name)

	// console.log('dir', process.argv[1])
	const source = getWorkspaceTemplateDir()
	const destination = name

	await fs.cp(source, destination, { recursive: true })

	await openVscode(destination)
}
