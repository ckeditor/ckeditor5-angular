/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { fileURLToPath, URL } from 'node:url';

import angular from '@analogjs/vite-plugin-angular';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

const ZONE_SETUP = 'src/test-setup-zone.ts';
const ZONELESS_SETUP = 'src/test-setup-zoneless.ts';

const ALL_TESTS = [
	'src/**/*.spec.ts'
];

const LIBRARY_TESTS = [
	'src/ckeditor/**/*.spec.ts'
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
			'zone.js/testing'
		]
	},
	test: {
		globals: false,
		mockReset: true,
		restoreMocks: true,
		projects: [
			// The full suite with zone.js, the way the demo application is set up.
			project( 'zone', ALL_TESTS, ZONE_SETUP ),
			// The library specs without zone.js, the way a default Angular 21+ application is set up.
			project( 'zoneless', LIBRARY_TESTS, ZONELESS_SETUP ),
			// A version-sensitive subset used by the CI editor-version matrix. The overlap with `zone` is intentional.
			project( 'integration', INTEGRATION_TESTS, ZONE_SETUP )
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
				'src/app/**',
				'src/editor/**',
				'src/environments/**',
				'src/main.ts',
				'src/polyfills.ts',
				'src/test-setup*.ts'
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

/**
 * `setupFiles` is set per project, because `extends: true` concatenates arrays with the root config.
 */
function project( name, include, setupFile ) {
	return {
		extends: true,
		test: {
			name,
			include,
			setupFiles: [ setupFile ]
		}
	};
}
