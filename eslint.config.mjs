/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import globals from 'globals';
import { defineConfig } from 'eslint/config';
import ckeditor5Rules from 'eslint-plugin-ckeditor5-rules';
import ckeditor5Config from 'eslint-config-ckeditor5';
import tsPlugin from 'typescript-eslint';

export default defineConfig( [
	{
		ignores: [
			'dist/**',
			'coverage/**',
			'src/polyfills.ts'
		]
	},
	{
		extends: ckeditor5Config,

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module'
		},

		linterOptions: {
			reportUnusedDisableDirectives: 'warn',
			reportUnusedInlineConfigs: 'warn'
		},

		plugins: {
			'ckeditor5-rules': ckeditor5Rules,
			'@typescript-eslint': tsPlugin.plugin
		},

		files: [
			'**/*.ts',
			'**/*.mjs',
			'**/*.js'
		],

		rules: {
			'new-cap': 'off',
			'no-duplicate-imports': 'off',
			'@typescript-eslint/explicit-function-return-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-unused-vars': 'error',
			'@typescript-eslint/no-var-requires': 'off',
			'@typescript-eslint/no-use-before-define': [ 'error', { functions: false } ],
			'@stylistic/indent': [ 'error', 'tab' ],
			'ckeditor5-rules/allow-imports-only-from-main-package-entry-point': 'off',
			'ckeditor5-rules/prevent-license-key-leak': 'error',
			'ckeditor5-rules/license-header': [ 'error', {
				headerLines: [
					'/**',
					' * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.',
					' * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options',
					' */'
				]
			} ]
		}
	},
	{
		// Disable license header requirement for the entire `src` directory, except the `src/ckeditor` subdirectory.
		files: [ 'src/**/*' ],
		ignores: [ 'src/ckeditor/**/*' ],
		rules: {
			'ckeditor5-rules/license-header': 'off'
		}
	},
	{
		files: [
			'**/*.{js,mjs}',
			'scripts/**/*.{js,mjs}'
		],

		languageOptions: {
			globals: {
				...globals.node
			}
		}
	},

	// Rules specific to changelog files.
	{
		extends: ckeditor5Config,

		files: [ '.changelog/**/*.md' ],

		plugins: {
			'ckeditor5-rules': ckeditor5Rules
		},

		rules: {
			'ckeditor5-rules/validate-changelog-entry': [ 'error', {
				repositoryType: 'single'
			} ]
		}
	}
] );
