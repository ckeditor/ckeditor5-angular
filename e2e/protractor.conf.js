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
		print() {}
	},
	onPrepare() {
		require( 'ts-node' ).register( {
			project: require( 'path' ).join( __dirname, './tsconfig.e2e.json' )
		} );
		jasmine.getEnv().addReporter( new SpecReporter( { spec: { displayStacktrace: true } } ) );
	},
	useAllAngular2AppRoots: true,
};
