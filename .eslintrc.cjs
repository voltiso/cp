// ⠀ⓥ 2023     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

'use strict'

const { defineEslintConfig } = require('@voltiso/config.eslint.lib')

const project = [
	'tsconfig.json',
	//
	'apps/*/tsconfig.json',
	'packages/*/tsconfig.json',
	//
	'apps/cli/workspace-template/tsconfig.json',
]

module.exports = defineEslintConfig({
	extends: ['@voltiso/eslint-config'],

	root: true,

	parserOptions: {
		project,
		tsconfigRootDir: __dirname,
	},

	settings: {
		'import/resolver': {
			typescript: {
				project,
				tsconfigRootDir: __dirname,
			},
		},
	},
})
