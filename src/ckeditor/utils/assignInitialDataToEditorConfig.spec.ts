/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	assignInitialDataToEditorConfig,
	getInitialDataFromEditorConfig,
	isRootsMapConfigurationSupported
} from './assignInitialDataToEditorConfig';

describe( 'assignInitialDataToEditorConfig', () => {
	afterEach( () => {
		vi.unstubAllGlobals();
	} );

	describe( 'isRootsMapConfigurationSupported()', () => {
		it( 'should return false when CKEDITOR_VERSION is not set', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', undefined );

			expect( isRootsMapConfigurationSupported() ).toBe( false );
		} );

		it( 'should return false for version 47.x', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '47.0.0' );

			expect( isRootsMapConfigurationSupported() ).toBe( false );
		} );

		it( 'should return false for version below 48', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '47.9.9' );

			expect( isRootsMapConfigurationSupported() ).toBe( false );
		} );

		it( 'should return true for version 48.0.0', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '48.0.0' );

			expect( isRootsMapConfigurationSupported() ).toBe( true );
		} );

		it( 'should return true for versions above 48', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '50.3.1' );

			expect( isRootsMapConfigurationSupported() ).toBe( true );
		} );

		it( 'should return true for non-semantic (nightly/internal) versions', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', 'nightly' );

			expect( isRootsMapConfigurationSupported() ).toBe( true );
		} );
	} );

	describe( 'legacy path (CKEditor 47.x)', () => {
		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '47.0.0' );
		} );

		it( 'should assign data to initialData field', () => {
			const result = assignInitialDataToEditorConfig( {}, 'hello' );

			expect( result ).toMatchObject( { initialData: 'hello' } );
		} );

		it( 'should preserve existing config fields', () => {
			const result = assignInitialDataToEditorConfig( { toolbar: [ 'bold' ] }, 'hello' );

			expect( result ).toMatchObject( { toolbar: [ 'bold' ], initialData: 'hello' } );
		} );

		it( 'should use config.initialData when data is empty', () => {
			const result = assignInitialDataToEditorConfig( { initialData: 'from config' }, '' );

			expect( result ).toMatchObject( { initialData: 'from config' } );
		} );

		it( 'should set initialData to empty string when neither data nor config.initialData is provided', () => {
			const result = assignInitialDataToEditorConfig( {}, '' );

			expect( result ).toMatchObject( { initialData: '' } );
		} );

		it( 'should throw when both data and config.initialData are provided', () => {
			expect( () => {
				assignInitialDataToEditorConfig( { initialData: 'from config' }, 'from prop' );
			} ).toThrow(
				'Editor data should be provided either using `config.initialData` or `data` properties.'
			);
		} );

		it( 'should not add roots field to the result', () => {
			const result = assignInitialDataToEditorConfig( {}, 'hello' ) as any;

			expect( result.roots ).toBeUndefined();
		} );
	} );

	describe( 'roots-map path (CKEditor 48.x+)', () => {
		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '48.0.0' );
		} );

		it( 'should assign data to roots.main.initialData', () => {
			const result = assignInitialDataToEditorConfig( {}, 'hello' ) as any;

			expect( result.roots?.main?.initialData ).toBe( 'hello' );
		} );

		it( 'should preserve existing config.root properties under roots.main', () => {
			const result = assignInitialDataToEditorConfig(
				{ root: { someRootOption: true } },
				'hello'
			) as any;

			expect( result.roots.main ).toMatchObject( {
				someRootOption: true,
				initialData: 'hello'
			} );
		} );

		it( 'should merge with existing config.roots.main, with config taking precedence', () => {
			const result = assignInitialDataToEditorConfig(
				{ roots: { main: { initialData: 'old', someOption: 42 } } },
				'new'
			) as any;

			expect( result.roots.main ).toMatchObject( {
				someOption: 42,
				initialData: 'old'
			} );
		} );

		it( 'should merge with existing config.root, with config taking precedence', () => {
			const result = assignInitialDataToEditorConfig(
				{ root: { initialData: 'old', someRootOption: true } },
				'new'
			) as any;

			expect( result.roots.main ).toMatchObject( {
				someRootOption: true,
				initialData: 'old'
			} );
		} );

		it( 'should remove root and initialData top-level fields from the result', () => {
			const result = assignInitialDataToEditorConfig(
				{ root: { someRootOption: true }, initialData: 'ignored' },
				'hello'
			) as any;

			expect( result.root ).toBeUndefined();
			expect( result.initialData ).toBeUndefined();
		} );

		it( 'should preserve other top-level config fields', () => {
			const result = assignInitialDataToEditorConfig(
				{ toolbar: [ 'bold' ] },
				'hello'
			) as any;

			expect( result.toolbar ).toEqual( [ 'bold' ] );
		} );

		it( 'should not throw when both data and config.initialData are provided', () => {
			expect( () => {
				assignInitialDataToEditorConfig( { initialData: 'ignored' }, 'hello' );
			} ).not.toThrow();
		} );

		it( 'should preserve non-main roots', () => {
			const result = assignInitialDataToEditorConfig(
				{ roots: { secondary: { initialData: 'secondary data' } } },
				'hello'
			) as any;

			expect( result.roots.secondary ).toMatchObject( { initialData: 'secondary data' } );
		} );
	} );

	describe( 'getInitialDataFromEditorConfig()', () => {
		describe( 'legacy path (CKEditor 47.x)', () => {
			beforeEach( () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '47.0.0' );
			} );

			it( 'should return config.initialData', () => {
				expect( getInitialDataFromEditorConfig( { initialData: 'hello' } ) ).toBe( 'hello' );
			} );

			it( 'should return undefined when config.initialData is absent', () => {
				expect( getInitialDataFromEditorConfig( {} ) ).toBeUndefined();
			} );
		} );

		describe( 'roots-map path (CKEditor 48.x+)', () => {
			beforeEach( () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '48.0.0' );
			} );

			it( 'should return roots.main.initialData', () => {
				expect(
					getInitialDataFromEditorConfig( { roots: { main: { initialData: 'hello' } } } )
				).toBe( 'hello' );
			} );

			it( 'should return undefined when roots.main is absent', () => {
				expect( getInitialDataFromEditorConfig( {} ) ).toBeUndefined();
			} );

			it( 'should return undefined when roots.main.initialData is absent', () => {
				expect( getInitialDataFromEditorConfig( { roots: { main: {} } } ) ).toBeUndefined();
			} );
		} );
	} );
} );
