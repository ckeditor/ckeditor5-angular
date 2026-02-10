/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { fileURLToPath, URL } from 'node:url';

import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig( {
	resolve: {
		mainFields: [ 'module' ],
		alias: {
			src: fileURLToPath( new URL( './src', import.meta.url ) )
		}
	},
	plugins: [
		angular()
	],
	test: {
		globals: true,
		mockReset: true,
		restoreMocks: true,
		setupFiles: [
			'src/test-setup.ts'
		],
		include: [
			'src/**/*.spec.ts'
		],
		exclude: [
			'scripts-tests/**'
		],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright( {
				launchOptions: {
					channel: 'chrome'
				}
			} ),
			instances: [
				{
					browser: 'chromium'
				}
			]
		},
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage',
			reporter: [
				'text-summary',
				'html',
				'lcov',
				'json'
			],
			include: [
				'src/**/*.ts'
			],
			exclude: [
				'src/**/*.spec.ts',
				'src/**/*.module.ts',
				'src/editor/**',
				'src/environments/**',
				'src/main.ts',
				'src/polyfills.ts',
				'src/test-setup.ts'
			]
		}
	}
} );
