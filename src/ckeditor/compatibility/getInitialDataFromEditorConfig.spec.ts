/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { getInitialDataFromEditorConfig } from './getInitialDataFromEditorConfig.js';

describe( 'getInitialDataFromEditorConfig', () => {
	afterEach( () => {
		vi.stubGlobal( 'CKEDITOR_VERSION', undefined );
	} );

	afterEach( () => {
		vi.unstubAllGlobals();
	} );

	describe( 'when CKEditor >= 48 is loaded', () => {
		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '48.0.0' );
		} );

		it( 'should return initialData from roots.main', () => {
			const config = { roots: { main: { initialData: '<p>Hello</p>' } } };

			expect( getInitialDataFromEditorConfig( config ) ).toBe( '<p>Hello</p>' );
		} );

		it( 'should return undefined when roots is missing', () => {
			expect( getInitialDataFromEditorConfig( {} ) ).toBeUndefined();
		} );

		it( 'should return undefined when roots.main is missing', () => {
			const config = { roots: { secondary: { initialData: '<p>Data</p>' } } };

			expect( getInitialDataFromEditorConfig( config ) ).toBeUndefined();
		} );

		it( 'should return undefined when roots.main has no initialData', () => {
			expect( getInitialDataFromEditorConfig( { roots: { main: {} } } ) ).toBeUndefined();
		} );
	} );

	describe( 'when CKEditor 47.x LTS is loaded', () => {
		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '47.0.0' );
		} );

		it( 'should return top-level initialData', () => {
			expect( getInitialDataFromEditorConfig( { initialData: '<p>Hello</p>' } ) ).toBe( '<p>Hello</p>' );
		} );

		it( 'should return undefined when initialData is not present', () => {
			expect( getInitialDataFromEditorConfig( {} ) ).toBeUndefined();
		} );

		it( 'should not read from roots.main even if present', () => {
			const config = {
				initialData: '<p>Top level</p>',
				roots: { main: { initialData: '<p>Nested</p>' } }
			};

			expect( getInitialDataFromEditorConfig( config ) ).toBe( '<p>Top level</p>' );
		} );
	} );
} );
