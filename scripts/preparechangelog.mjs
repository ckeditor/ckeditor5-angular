/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import upath from 'upath';
import { fileURLToPath } from 'url';
import { generateChangelogForSingleRepository } from '@ckeditor/ckeditor5-dev-changelog';
import parseArguments from './utils/parsearguments.mjs';

const __filename = fileURLToPath( import.meta.url );
const __dirname = upath.dirname( __filename );
const ROOT_DIRECTORY = upath.join( __dirname, '..' );

const cliOptions = parseArguments( process.argv.slice( 2 ) );

const changelogOptions = {
	cwd: ROOT_DIRECTORY,
	disableFilesystemOperations: cliOptions.dryRun
};

if ( cliOptions.date ) {
	changelogOptions.date = cliOptions.date;
}

generateChangelogForSingleRepository( changelogOptions )
	.then( maybeChangelog => {
		if ( maybeChangelog ) {
			console.log( maybeChangelog );
		}
	} );
