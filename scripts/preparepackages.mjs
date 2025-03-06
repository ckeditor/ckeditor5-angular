#!/usr/bin/env node

/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/* eslint-env node */

import fs from 'fs-extra';
import upath from 'upath';
import { Listr } from 'listr2';
import { fileURLToPath } from 'url';
import * as releaseTools from '@ckeditor/ckeditor5-dev-release-tools';
import * as devUtils from '@ckeditor/ckeditor5-dev-utils';
import parseArguments from './utils/parsearguments.mjs';
import getListrOptions from './utils/getlistroptions.mjs';

const __filename = fileURLToPath( import.meta.url );
const __dirname = upath.dirname( __filename );

const latestVersion = releaseTools.getLastFromChangelog();
const versionChangelog = releaseTools.getChangesForVersion( latestVersion );
const CKEDITOR5_ANGULAR_ROOT_DIR = upath.join( __dirname, '..' );
const SOURCE_DIR = upath.join( CKEDITOR5_ANGULAR_ROOT_DIR, 'src', 'ckeditor' );
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
		title: 'Updating version in usage data plugin.',
		task: async () => {
			const pluginPath = upath.join( SOURCE_DIR, 'plugins', 'angular-integration-usage-data.plugin.ts' );
			const content = await fs.readFile( pluginPath, 'utf8' );
			const updated = content.replace(
				/(?<=\/\* replace-version:start \*\/).*?(?=\/\* replace-version:end \*\/)/,
				` '${ latestVersion }' `
			);

			await fs.writeFile( pluginPath, updated );
		}
	},
	{
		title: 'Generating the `dist` directory.',
		task: () => {
			return devUtils.tools.shExec( 'yarn run build-package', { async: true, verbosity: 'silent' } );
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
			return devUtils.tools.updateJSONFile(
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
				dryRun: cliArguments.compileOnly,
				files: [
					'package.json',
					'src/ckeditor/plugins/angular-integration-usage-data.plugin.ts'
				]
			} );
		}
	}
], getListrOptions( cliArguments ) );

tasks.run()
	.catch( err => {
		process.exitCode = 1;

		console.log( '' );
		console.error( err );
	} );
