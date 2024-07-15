#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

'use strict';

const { Listr } = require( 'listr2' );
const releaseTools = require( '@ckeditor/ckeditor5-dev-release-tools' );
const { tools } = require( '@ckeditor/ckeditor5-dev-utils' );
const upath = require( 'upath' );
const fs = require( 'fs-extra' );
const parseArguments = require( './utils/parsearguments' );
const getListrOptions = require( './utils/getlistroptions' );

const latestVersion = releaseTools.getLastFromChangelog();
const versionChangelog = releaseTools.getChangesForVersion( latestVersion );
const CKEDITOR5_ANGULAR_ROOT_DIR = upath.join( __dirname, '..' );
const DIST_DIR = upath.join( CKEDITOR5_ANGULAR_ROOT_DIR, 'dist' );
const RELEASE_ANGULAR_DIR = upath.join( CKEDITOR5_ANGULAR_ROOT_DIR, 'release', 'ckeditor5-angular' );

const cliArguments = parseArguments( process.argv.slice( 2 ) );

const tasks = new Listr( [
	{
		title: 'Verifying the repository.',
		task: async () => {
			const errors = await releaseTools.validateRepositoryToRelease( {
				version: latestVersion,
				changes: versionChangelog,
				branch: cliArguments.branch
			} );

			if ( !errors.length ) {
				return;
			}

			return Promise.reject( 'Aborted due to errors.\n' + errors.map( message => `* ${ message }` ).join( '\n' ) );
		},
		skip: () => {
			// When compiling the packages only, do not validate the release.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Updating the `#version` field in the package\'s `package.json`.',
		task: () => {
			return releaseTools.updateVersions( {
				version: latestVersion
			} );
		},
		skip: () => {
			// When compiling the packages only, do not update any values.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Generating the `dist` directory.',
		task: () => {
			return tools.shExec( 'yarn run build-package', { async: true, verbosity: 'silent' } );
		}
	},
	{
		title: 'Copying dist to release directory.',
		task: () => {
			return fs.copy( DIST_DIR, RELEASE_ANGULAR_DIR );
		}
	},
	{
		title: 'Updating the `#version` field in the `package.json` in the release directory',
		task: () => {
			return tools.updateJSONFile(
				upath.join( RELEASE_ANGULAR_DIR, 'package.json' ),
				packageJson => {
					packageJson.version = latestVersion;

					return packageJson;
				} );
		},
		skip: () => {
			// When compiling the packages only, do not update any values.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	},
	{
		title: 'Copying required assets to the release directory.',
		task: () => {
			return [
				'LICENSE.md',
				'README.md',
				'CHANGELOG.md',
				'CONTRIBUTING.md'
			].forEach( file => {
				return fs.copy( upath.join( CKEDITOR5_ANGULAR_ROOT_DIR, file ), upath.join( RELEASE_ANGULAR_DIR, file ) );
			} );
		}
	},
	{
		title: 'Commit & tag.',
		task: () => {
			return releaseTools.commitAndTag( {
				version: latestVersion,
				files: [
					'package.json'
				]
			} );
		},
		skip: () => {
			// When compiling the packages only, do not update any values.
			if ( cliArguments.compileOnly ) {
				return true;
			}

			return false;
		}
	}
], getListrOptions( cliArguments ) );

tasks.run()
	.catch( err => {
		process.exitCode = 1;

		console.log( '' );
		console.error( err );
	} );
