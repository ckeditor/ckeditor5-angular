/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

/* eslint-env node */

const fs = require( 'fs-extra' );
const childProcess = require( 'child_process' );
const path = require( 'path' );

// Build package using ng-packagr.
const output = childProcess.execSync( 'ng-packagr -p src/ckeditor/package.json' );

console.log( output.toString() );

// And copy markdown files.
const filesToCopy = [
	'LICENSE.md',
	'README.md',
	'CHANGELOG.md',
	'CONTRIBUTING.md'
];

for ( const file of filesToCopy ) {
	const src = path.join( process.cwd(), file );
	const dest = path.join( process.cwd(), 'dist', file );

	if ( !fs.existsSync( src ) ) {
		throw new Error( `File ${ src } does not exist and cannot be copied.` );
	}

	fs.copyFileSync( src, dest );
}

// Update the version of package in dist/package.json
const srcPackageJsonPath = path.join( process.cwd(), 'package.json' );
const distPackageJsonPath = path.join( process.cwd(), 'dist', 'package.json' );

const srcPackageJson = fs.readJsonSync( srcPackageJsonPath );
const distPackageJson = fs.readJsonSync( distPackageJsonPath );

distPackageJson.version = srcPackageJson.version;

fs.writeJsonSync( distPackageJsonPath, distPackageJson, { spaces: 2 } );
