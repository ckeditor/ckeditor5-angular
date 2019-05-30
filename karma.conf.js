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
		browsers: [ 'CHROME_TRAVIS_CI' ],
		customLaunchers: {
			CHROME_TRAVIS_CI: {
				base: 'Chrome',
				flags: [ '--no-sandbox', '--disable-background-timer-throttling' ]
			}
		},
		singleRun: false
	};

	config.set( karmaConfig );
};
