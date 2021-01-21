/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/* eslint-env node */
/* globals jasmine */

const { SpecReporter } = require( 'jasmine-spec-reporter' );

exports.config = {
	allScriptsTimeout: 30000,
	specs: [
		'./src/**/*.e2e-spec.ts'
	],
	capabilities: {
		browserName: 'chrome'
	},
	directConnect: true,
	baseUrl: 'http://localhost:4200/',
	framework: 'jasmine',
	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		/* eslint-disable-next-line */
		print() {}
	},
	onPrepare() {
		require( 'ts-node' ).register( {
			project: require( 'path' ).join( __dirname, './tsconfig.json' )
		} );
		jasmine.getEnv().addReporter( new SpecReporter( { spec: { displayStacktrace: 'pretty' } } ) );
	},
	useAllAngular2AppRoots: true
};
