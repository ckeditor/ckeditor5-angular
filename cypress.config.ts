/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { defineConfig } from 'cypress';

export default defineConfig( {
	e2e: {
		baseUrl: 'http://localhost:4200',
		supportFile: false,
		video: false
	},

	component: {
		devServer: {
			framework: 'angular',
			bundler: 'webpack'
		},
		specPattern: '**/*.cy.ts'
	}
} );
