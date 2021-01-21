#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

'use strict';

const path = require( 'path' );
const { tools, logger } = require( '@ckeditor/ckeditor5-dev-utils' );
const versionUtils = require( '@ckeditor/ckeditor5-dev-env/lib/release-tools/utils/versions' );
const cli = require( '@ckeditor/ckeditor5-dev-env/lib/release-tools/utils/cli' );
const createGithubRelease = require( '@ckeditor/ckeditor5-dev-env/lib/release-tools/utils/creategithubrelease' );
const validatePackageToRelease = require( '@ckeditor/ckeditor5-dev-env/lib/release-tools/utils/validatepackagetorelease' );
const { getChangesForVersion } = require( '@ckeditor/ckeditor5-dev-env/lib/release-tools/utils/changelog' );

const log = logger();
const packageRoot = path.resolve( __dirname, '..' );
const distPath = path.resolve( packageRoot, 'dist' );

cli.provideToken()
	.then( token => {
		const gitVersion = versionUtils.getLastTagFromGit();
		const changelogVersion = versionUtils.getLastFromChangelog();

		log.info( 'Checking whether there is anything to release...' );

		// If the last tag is equal to version saved in changelog, we don't have new version for release.
		if ( gitVersion === changelogVersion ) {
			return reject( 'Before starting the release process, you should generate the changelog and then build the package.' );
		}

		const releaseDescription = getChangesForVersion( changelogVersion );

		log.info( 'Validating the repository for the release...' );

		const errors = validatePackageToRelease( {
			version: changelogVersion,
			changes: releaseDescription
		} );

		// Abort due to errors during validation.
		if ( errors.length ) {
			const log = logger();

			log.error( 'Unexpected errors occurred:' );
			errors.map( err => '* ' + err ).forEach( log.error.bind( log ) );

			return reject( 'Releasing has been aborted due to errors.' );
		}

		log.info( 'Bumping the version...' );

		// Bump the version.
		tools.shExec( `npm version ${ changelogVersion } --message "Release: v${ changelogVersion }."`, { verbosity: 'error' } );

		// Push the release to remote.
		tools.shExec( `git push origin master v${ changelogVersion }` );

		log.info( 'Publishing on npm...' );

		// Publish the package on npm.
		tools.shExec( `cd ${ distPath } && npm publish && cd ${ packageRoot }` );

		log.info( 'Creating a release on GitHub...' );

		// Create a release on GitHub.
		return createGithubRelease( token, {
			repositoryOwner: 'ckeditor',
			repositoryName: 'ckeditor5-angular',
			version: `v${ changelogVersion }`,
			description: releaseDescription
		} ).then( () => changelogVersion );
	} )
	.then( version => {
		const url = `https://github.com/ckeditor/ckeditor5-angular/releases/tag/v${ version }`;
		log.info( `Created the release: ${ url }` );
	} )
	.catch( err => {
		log.error( err.stack );
	} );

function reject( message ) {
	return Promise.reject( new Error( message ) );
}
