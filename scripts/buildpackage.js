/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const fs = require( 'fs-extra' );
const childProcess = require( 'child_process' );
const path = require( 'path' );

// Build package using ng-packagr.
childProcess.spawnSync( 'ng-packagr', [ '-p', 'src/ckeditor/package.json' ] );

// And Copy markdown files.
const filesToCopy = [
	'LICENSE.md',
	'README.md',
	'CHANGELOG.md'
];

for ( const file of filesToCopy ) {
	const src = path.join( process.cwd(), file );
	const dest = path.join( process.cwd(), 'dist', file );

	if ( fs.existsSync( src ) ) {
		fs.copyFileSync( src, dest );
	}
}
