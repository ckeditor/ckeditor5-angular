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
			require( 'karma-jasmine-html-reporter' ),
			require( 'karma-coverage-istanbul-reporter' ),
			require( '@angular-devkit/build-angular/plugins/karma' )
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			dir: require( 'path' ).join( __dirname, '../coverage' ),
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
			},
			BrowserStack_Edge: {
				base: 'BrowserStack',
				os: 'Windows',
				os_version: '10',
				browser: 'edge'
			},
			BrowserStack_Safari: {
				base: 'BrowserStack',
				os: 'OS X',
				os_version: 'High Sierra',
				browser: 'safari'
			}
		},
		singleRun: false
	};

	if ( shouldEnableBrowserStack() ) {
		karmaConfig.browserStack = {
			username: process.env.BROWSER_STACK_USERNAME,
			accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
			build: getBuildName(),
			project: 'ckeditor5'
		};

		karmaConfig.reporters = [ 'dots', 'BrowserStack' ];
	}

	config.set( karmaConfig );
};

// Formats name of the build for BrowserStack. It merges a repository name and current timestamp.
// If env variable `TRAVIS_REPO_SLUG` is not available, the function returns `undefined`.
//
// @returns {String|undefined}
function getBuildName() {
	const repoSlug = process.env.TRAVIS_REPO_SLUG;

 	if ( !repoSlug ) {
		return;
	}

 	const repositoryName = repoSlug.split( '/' )[ 1 ].replace( /-/g, '_' );
	const date = new Date().getTime();

 	return `${ repositoryName } ${ date }`;
}

function getBrowsers() {
	if ( shouldEnableBrowserStack() ) {
		return [
			'Firefox',
			'BrowserStack_Edge',
			'BrowserStack_Safari',
			'CHROME_TRAVIS_CI'
		];
	}

	return [ 'CHROME_LOCAL' ];
}

function shouldEnableBrowserStack() {
	if ( !process.env.BROWSER_STACK_USERNAME ) {
		return false;
	}

	if ( !process.env.BROWSER_STACK_ACCESS_KEY ) {
		return false;
	}

	// If the repository slugs are different, the pull request comes from the community (forked repository).
	// For such builds, BrowserStack will be disabled. Read more: https://github.com/ckeditor/ckeditor5-dev/issues/358.
	return ( process.env.TRAVIS_EVENT_TYPE !== 'pull_request' || process.env.TRAVIS_PULL_REQUEST_SLUG === process.env.TRAVIS_REPO_SLUG );
}
