/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* eslint-env node */

import { generateChangelogForSinglePackage } from '@ckeditor/ckeditor5-dev-release-tools';
import parseArguments from './utils/parsearguments.mjs';

const cliArguments = parseArguments( process.argv.slice( 2 ) );

generateChangelogForSinglePackage( {
	releaseBranch: cliArguments.branch
} );
