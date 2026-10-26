/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const licenseKey = process.env.CKEDITOR_LICENSE_KEY || getLicenseKeyFromEnvFile() || 'GPL';
const forwardedArgs = process.argv.slice( 2 );
// The Angular CLI is started with Node directly. Spawning `pnpm` would need a shell for `pnpm.cmd` on Windows,
// and a shell neither escapes the forwarded arguments nor passes the termination signals on to `ng serve`.
const ngCliPath = createRequire( import.meta.url ).resolve( '@angular/cli/bin/ng.js' );
const generatedFilePath = resolve( process.cwd(), 'src/generated/license-key.ts' );
const originalGeneratedFileContent = existsSync( generatedFilePath ) ? readFileSync( generatedFilePath, 'utf8' ) : null;

mkdirSync( dirname( generatedFilePath ), { recursive: true } );
writeFileSync( generatedFilePath, createGeneratedLicenseKeyModule( licenseKey ) );

const child = spawn(
	process.execPath,
	[
		ngCliPath,
		'serve',
		...forwardedArgs
	],
	{
		stdio: 'inherit'
	}
);

for ( const signal of [ 'SIGINT', 'SIGTERM', 'SIGHUP' ] ) {
	process.on( signal, () => {
		restoreGeneratedLicenseKeyModule();
		child.kill( signal );
		process.exit( 0 );
	} );
}

child.on( 'exit', code => {
	restoreGeneratedLicenseKeyModule();

	// A child killed by a signal has no exit code. It did not finish on its own, so report a failure.
	process.exit( code ?? 1 );
} );

function getLicenseKeyFromEnvFile() {
	for ( const fileName of [ '.env.local', '.env' ] ) {
		const filePath = resolve( process.cwd(), fileName );

		if ( !existsSync( filePath ) ) {
			continue;
		}

		const match = readFileSync( filePath, 'utf8' )
			.split( /\r?\n/u )
			.map( line => line.trim() )
			.find( line => line.startsWith( 'CKEDITOR_LICENSE_KEY=' ) );

		if ( match ) {
			return match.slice( 'CKEDITOR_LICENSE_KEY='.length ).trim().replace( /^(?:"|')|(?:"|')$/gu, '' );
		}
	}

	return null;
}

function createGeneratedLicenseKeyModule( value ) {
	return `export const GENERATED_CKEDITOR_LICENSE_KEY = ${ JSON.stringify( value ) };\n`;
}

function restoreGeneratedLicenseKeyModule() {
	if ( originalGeneratedFileContent !== null ) {
		writeFileSync( generatedFilePath, originalGeneratedFileContent );
		return;
	}

	if ( existsSync( generatedFilePath ) ) {
		unlinkSync( generatedFilePath );
	}
}
