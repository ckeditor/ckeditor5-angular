/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import path from 'node:path';

describe( 'scripts/postinstall', () => {
	const rootDirectory = process.cwd();
	const generatedFilePath = path.join( rootDirectory, 'src', 'generated', 'license-key.ts' );
	const generatedFileDirectory = path.dirname( generatedFilePath );
	let fileSystem;
	let installHusky;
	let runPostinstall;

	beforeEach( async () => {
		vi.resetModules();

		( { runPostinstall } = await import( '../scripts/postinstall.js' ) );

		fileSystem = {
			existsSync: vi.fn(),
			mkdirSync: vi.fn(),
			writeFileSync: vi.fn()
		};
		installHusky = vi.fn();
	} );

	it( 'creates the default GPL license-key module and installs husky in a git repository', () => {
		fileSystem.existsSync.mockReturnValue( true );

		runPostinstall( { fileSystem, installHusky, rootDirectory } );

		expect( fileSystem.mkdirSync ).toHaveBeenCalledWith( generatedFileDirectory, { recursive: true } );
		expect( fileSystem.writeFileSync ).toHaveBeenCalledWith(
			generatedFilePath,
			'export const GENERATED_CKEDITOR_LICENSE_KEY = \'GPL\';\n'
		);
		expect( installHusky ).toHaveBeenCalledTimes( 1 );
		expect( fileSystem.existsSync ).toHaveBeenCalledWith( path.join( rootDirectory, '.git' ) );
	} );

	it( 'still creates the default GPL license-key module when the repository has no .git directory', () => {
		fileSystem.existsSync.mockReturnValue( false );

		runPostinstall( { fileSystem, installHusky, rootDirectory } );

		expect( fileSystem.writeFileSync ).toHaveBeenCalledWith(
			generatedFilePath,
			'export const GENERATED_CKEDITOR_LICENSE_KEY = \'GPL\';\n'
		);
		expect( installHusky ).not.toHaveBeenCalled();
	} );
} );
