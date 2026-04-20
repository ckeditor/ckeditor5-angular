/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dirname, resolve } from 'node:path';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

const mocks = vi.hoisted( () => {
	const childHandlers = new Map();
	const signalHandlers = new Map();

	const child = {
		on: vi.fn(),
		kill: vi.fn()
	};

	return {
		child,
		childHandlers,
		signalHandlers
	};
} );

vi.mock( 'node:child_process' );
vi.mock( 'node:fs' );

describe( 'scripts/start', () => {
	const generatedFilePath = resolve( process.cwd(), 'src/generated/license-key.ts' );
	const generatedFileDirectory = dirname( generatedFilePath );
	const originalGeneratedFileContent = 'export const GENERATED_CKEDITOR_LICENSE_KEY = \'OLD\';\n';

	beforeEach( () => {
		vi.resetModules();
		vi.unstubAllEnvs();

		vi.spyOn( process, 'on' ).mockImplementation( ( eventName, callback ) => {
			mocks.signalHandlers.set( eventName, callback );

			return process;
		} );
		vi.spyOn( process, 'exit' ).mockImplementation( vi.fn() );
		vi.spyOn( process, 'argv', 'get' ).mockReturnValue( [ 'node', 'scripts/start.mjs' ] );

		vi.mocked( spawn ).mockReturnValue( mocks.child );
		vi.mocked( existsSync ).mockImplementation( filePath => filePath === generatedFilePath );
		vi.mocked( readFileSync ).mockImplementation( filePath => {
			if ( filePath === generatedFilePath ) {
				return originalGeneratedFileContent;
			}

			throw new Error( `Unexpected read for ${ filePath }.` );
		} );

		mocks.child.on.mockImplementation( ( eventName, callback ) => {
			mocks.childHandlers.set( eventName, callback );

			return mocks.child;
		} );
	} );

	it( 'uses CKEDITOR_LICENSE_KEY from the environment and forwards extra arguments', async () => {
		vi.stubEnv( 'CKEDITOR_LICENSE_KEY', 'foo\'bar\\baz' );
		vi.spyOn( process, 'argv', 'get' ).mockReturnValue( [ 'node', 'scripts/start.mjs', '--host', '0.0.0.0' ] );

		await import( '../scripts/start.mjs' );

		expect( vi.mocked( mkdirSync ) ).toHaveBeenCalledWith( generatedFileDirectory, { recursive: true } );
		expect( vi.mocked( writeFileSync ) ).toHaveBeenCalledWith(
			generatedFilePath,
			'export const GENERATED_CKEDITOR_LICENSE_KEY = "foo\'bar\\\\baz";\n'
		);
		expect( vi.mocked( spawn ) ).toHaveBeenCalledWith(
			process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm',
			[ 'exec', 'ng', 'serve', '--host', '0.0.0.0' ],
			{ stdio: 'inherit' }
		);
		expect( Array.from( mocks.signalHandlers.keys() ) ).toEqual( [ 'SIGINT', 'SIGTERM', 'SIGHUP' ] );
	} );

	it( 'prefers .env.local over .env when the environment variable is missing', async () => {
		vi.mocked( existsSync ).mockImplementation( filePath => [
			generatedFilePath,
			resolve( process.cwd(), '.env.local' ),
			resolve( process.cwd(), '.env' )
		].includes( filePath ) );

		vi.mocked( readFileSync ).mockImplementation( filePath => {
			if ( filePath === generatedFilePath ) {
				return originalGeneratedFileContent;
			}

			if ( filePath === resolve( process.cwd(), '.env.local' ) ) {
				return 'CKEDITOR_LICENSE_KEY=\'local-license-key\'\n';
			}

			if ( filePath === resolve( process.cwd(), '.env' ) ) {
				return 'CKEDITOR_LICENSE_KEY=env-license-key\n';
			}

			throw new Error( `Unexpected read for ${ filePath }.` );
		} );

		await import( '../scripts/start.mjs' );

		expect( vi.mocked( writeFileSync ) ).toHaveBeenCalledWith(
			generatedFilePath,
			'export const GENERATED_CKEDITOR_LICENSE_KEY = "local-license-key";\n'
		);
	} );

	it( 'serializes control characters in the generated module', async () => {
		vi.stubEnv( 'CKEDITOR_LICENSE_KEY', 'line1\nline2\t\\' );

		await import( '../scripts/start.mjs' );

		expect( vi.mocked( writeFileSync ) ).toHaveBeenCalledWith(
			generatedFilePath,
			'export const GENERATED_CKEDITOR_LICENSE_KEY = "line1\\nline2\\t\\\\";\n'
		);
	} );

	it( 'restores the generated license-key file when the child process exits', async () => {
		await import( '../scripts/start.mjs' );

		mocks.childHandlers.get( 'exit' )( 5 );

		expect( vi.mocked( writeFileSync ) ).toHaveBeenNthCalledWith( 2, generatedFilePath, originalGeneratedFileContent );
		expect( vi.mocked( process.exit ) ).toHaveBeenCalledWith( 5 );
	} );

	it( 'restores the generated license-key file and stops the child on termination signals', async () => {
		await import( '../scripts/start.mjs' );

		mocks.signalHandlers.get( 'SIGTERM' )();

		expect( vi.mocked( writeFileSync ) ).toHaveBeenNthCalledWith( 2, generatedFilePath, originalGeneratedFileContent );
		expect( mocks.child.kill ).toHaveBeenCalledWith( 'SIGTERM' );
		expect( vi.mocked( process.exit ) ).toHaveBeenCalledWith( 0 );
	} );

	it( 'deletes the generated license-key file if it did not exist before the script started', async () => {
		vi.mocked( existsSync ).mockReturnValue( false );

		await import( '../scripts/start.mjs' );

		vi.mocked( existsSync ).mockImplementation( filePath => filePath === generatedFilePath );
		mocks.childHandlers.get( 'exit' )( 0 );

		expect( vi.mocked( unlinkSync ) ).toHaveBeenCalledWith( generatedFilePath );
	} );
} );
