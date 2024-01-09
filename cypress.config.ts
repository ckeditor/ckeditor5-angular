/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
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
