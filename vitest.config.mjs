/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { fileURLToPath, URL } from 'node:url';

import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const DEFAULT_TESTS = [
	'src/**/*.spec.ts'
];

const INTEGRATION_TESTS = [
	'src/app/**/*.spec.ts',
	'src/ckeditor/**/*.integration.spec.ts',
	'src/ckeditor/index.spec.ts'
];

export default defineConfig( {
	envPrefix: 'CKEDITOR_',

	resolve: {
		mainFields: [ 'module' ],
		alias: {
			src: fileURLToPath( new URL( './src', import.meta.url ) )
		}
	},
	plugins: [
		angular()
	],
	optimizeDeps: {
		include: [
			'zone.js',
			'zone.js/plugins/sync-test',
			'zone.js/plugins/proxy',
			'zone.js/testing'
		]
	},
	test: {
		globals: false,
		mockReset: true,
		restoreMocks: true,
		setupFiles: [
			'src/test-setup.ts'
		],
		// `integration` is a version-sensitive subset used by the CI matrix.
		// It intentionally overlaps with the full `all` suite.
		projects: [
			{
				extends: true,
				test: {
					name: 'all',
					include: DEFAULT_TESTS
				}
			},
			{
				extends: true,
				test: {
					name: 'integration',
					include: INTEGRATION_TESTS
				}
			}
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
				'src/generated/**',
				'src/**/*.spec.ts',
				'src/**/*.module.ts',
				'src/editor/**',
				'src/environments/**',
				'src/main.ts',
				'src/polyfills.ts',
				'src/test-setup.ts'
			],
			thresholds: {
				statements: 100,
				branches: 100,
				functions: 100,
				lines: 100
			}
		}
	}
} );
