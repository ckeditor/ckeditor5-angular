/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const licenseKey = process.env.CKEDITOR_LICENSE_KEY || getLicenseKeyFromEnvFile() || 'GPL';
const forwardedArgs = process.argv.slice( 2 );
const pnpmExecutable = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const generatedFilePath = resolve( process.cwd(), 'src/generated/license-key.ts' );
const originalGeneratedFileContent = existsSync( generatedFilePath ) ? readFileSync( generatedFilePath, 'utf8' ) : null;

mkdirSync( dirname( generatedFilePath ), { recursive: true } );
writeFileSync( generatedFilePath, createGeneratedLicenseKeyModule( licenseKey ) );

const child = spawn(
	pnpmExecutable,
	[
		'exec',
		'ng',
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
	process.exit( code ?? 0 );
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
	return `export const GENERATED_CKEDITOR_LICENSE_KEY = '${ escapeForTypeScriptString( value ) }';\n`;
}

function restoreGeneratedLicenseKeyModule() {
	if ( originalGeneratedFileContent !== null ) {
		writeFileSync( generatedFilePath, originalGeneratedFileContent );
	}
}

function escapeForTypeScriptString( value ) {
	return value.replaceAll( '\\', '\\\\' ).replaceAll( '\'', '\\\'' );
}
