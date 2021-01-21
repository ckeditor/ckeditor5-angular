/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

/* eslint-env node */
/* eslint-disable @typescript-eslint/camelcase */

module.exports = function( config ) {
	const karmaConfig = {
		basePath: '',
		frameworks: [ 'jasmine', '@angular-devkit/build-angular' ],
		plugins: [
			require( 'karma-jasmine' ),
			require( 'karma-chrome-launcher' ),
			require( 'karma-firefox-launcher' ),
			require( 'karma-jasmine-html-reporter' ),
			require( 'karma-coverage-istanbul-reporter' ),
			require( '@angular-devkit/build-angular/plugins/karma' )
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			dir: require( 'path' ).join( __dirname, './coverage' ),
			reports: [ 'html', 'lcovonly' ],
			fixWebpackSourcePaths: true,
			thresholds: {
				statements: 100,
				lines: 100,
				branches: 100,
				functions: 100
			}
		},
		reporters: [ 'progress', 'kjhtml' ],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: getBrowsers(),
		customLaunchers: {
			CHROME_TRAVIS_CI: {
				base: 'Chrome',
				flags: [ '--no-sandbox', '--disable-background-timer-throttling' ]
			},
			CHROME_LOCAL: {
				base: 'Chrome',
				flags: [ '--disable-background-timer-throttling' ]
			}
		},
		singleRun: false
	};

	config.set( karmaConfig );
};

function getBrowsers() {
	if ( process.env.TRAVIS_CI ) {
		return [
			'CHROME_TRAVIS_CI',
			'Firefox'
		];
	}

	return [ 'CHROME_LOCAL' ];
}
