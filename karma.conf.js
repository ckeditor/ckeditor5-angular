/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

/* eslint-env node */

module.exports = function( config ) {
	const karmaConfig = {
		basePath: '',
		frameworks: [ 'jasmine', '@angular-devkit/build-angular' ],
		plugins: [
			require( 'karma-jasmine' ),
			require( 'karma-chrome-launcher' ),
			require( 'karma-firefox-launcher' ),
			require( 'karma-jasmine-html-reporter' ),
			require( 'karma-coverage' ),
			require( '@angular-devkit/build-angular/plugins/karma' )
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageReporter: {
			reporters: [
				// Prints a table after tests result.
				{
					type: 'text-summary'
				},
				// Generates HTML tables with the results.
				{
					dir: './coverage',
					subdir: '.',
					type: 'html'
				},
				// Generates "lcov.info" file. It's used by external code coverage services.
				{
					dir: './coverage',
					subdir: '.',
					type: 'lcovonly'
				},
				{
					dir: './coverage',
					subdir: '.',
					type: 'json'
				}
			],
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
			CHROME_CI: {
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
	if ( process.env.CI ) {
		return [
			'CHROME_CI',
			'Firefox'
		];
	}

	return [ 'CHROME_LOCAL' ];
}
