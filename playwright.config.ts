/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { defineConfig } from '@playwright/test';

const baseURL = 'http://localhost:4200';

export default defineConfig( {
	testDir: './e2e',
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? 'list' : 'line',
	use: {
		baseURL,
		channel: 'chrome'
	},
	webServer: {
		command: 'pnpm run start',
		url: baseURL,
		reuseExistingServer: !process.env.CI,
		// Without it, Playwright kills the server with SIGKILL and `scripts/start.mjs` cannot restore `src/generated/license-key.ts`.
		gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
		// The first `ng serve` build of the demo app may take a while.
		timeout: 180_000
	}
} );
