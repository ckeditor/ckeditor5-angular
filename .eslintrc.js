/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

module.exports = {
	extends: [
		'ckeditor5',
		'plugin:@typescript-eslint/recommended'
	],
	env: {
		browser: true
	},
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint/eslint-plugin'
	],
	rules: {
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/indent': [ 'error', 'tab' ],
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unused-vars': 'error',
		'@typescript-eslint/no-use-before-define': [ 'error', 'nofunc' ],
		'@typescript-eslint/no-var-requires': 'off',
		'new-cap': 'off',
		// The `no-duplicate-imports` rule has been deprecated in favour of the `import/no-duplicates` rule.
		'no-duplicate-imports': 'off',
		'ckeditor5-rules/license-header': [ 'error', {
			headerLines: [
				'/**',
				' * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.',
				' * For licensing, see LICENSE.md.',
				' */'
			]
		} ]
	},
	overrides: [
		{
			files: [ '*.ts' ],
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: [
					'./tsconfig.json'
				]
			}
		},
		{
			files: [ '**/*.spec.ts' ],
			env: {
				jasmine: true
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: 'tsconfig.spec.json'
			}
		},
		{ // Disable license header requirement for entire `src` directory...
			files: [ 'src/**/*.ts', 'src/**/*.js' ],
			rules: {
				'ckeditor5-rules/license-header': 0
			}
		},
		{ // ...and enable it back again for `ckeditor` directory only.
			files: [ 'src/ckeditor/**/*.ts', 'src/ckeditor/**/*.js' ],
			rules: {
				'ckeditor5-rules/license-header': 2
			}
		},
		{ // ...and enable it back again for `ckeditor` directory only.
			files: [ 'e2e/**/*.ts' ],
			rules: {
				'@typescript-eslint/explicit-module-boundary-types': 0
			}
		}
	]
};
