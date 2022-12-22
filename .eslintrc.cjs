// ⠀ⓥ 2022     🌩    🌩     ⠀   ⠀
// ⠀         🌩 V͛o͛͛͛lt͛͛͛i͛͛͛͛so͛͛͛.com⠀  ⠀⠀⠀

'use strict'

const { defineEslintConfig } = require('@voltiso/config.eslint.lib')

module.exports = defineEslintConfig({
	extends: ['@voltiso/eslint-config'],

	root: true,

	rules: {
		'no-restricted-imports': 0,
	},

	// parserOptions: {
	// 	project,
	// 	tsconfigRootDir: __dirname,
	// },

	// settings: {
	// 	"import/resolver": {
	// 		typescript: {
	// 			project,
	// 			tsconfigRootDir: __dirname,
	// 		},
	// 	},
	// },
})
