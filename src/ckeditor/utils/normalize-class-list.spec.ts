/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, it, expect } from 'vitest';
import { normalizeClassList } from './normalize-class-list';

describe( 'normalizeClassList()', () => {
	describe( 'when given a string', () => {
		it( 'should return an array containing the string', () => {
			expect( normalizeClassList( 'foo-class' ) ).toEqual( [ 'foo-class' ] );
		} );

		it( 'should return an empty array if the string is empty', () => {
			expect( normalizeClassList( '' ) ).toEqual( [] );
		} );
	} );

	describe( 'when given an array', () => {
		it( 'should return the exact same array instance', () => {
			const input = [ 'class-a', 'class-b' ];
			const result = normalizeClassList( input );

			expect( result ).toEqual( [ 'class-a', 'class-b' ] );
			expect( result ).toBe( input );
		} );

		it( 'should return an empty array if the input array is empty', () => {
			expect( normalizeClassList( [] ) ).toEqual( [] );
		} );
	} );

	describe( 'when given a nullish value', () => {
		it( 'should return an empty array for null', () => {
			expect( normalizeClassList( null ) ).toEqual( [] );
		} );

		it( 'should return an empty array for undefined', () => {
			expect( normalizeClassList( undefined ) ).toEqual( [] );
		} );
	} );
} );
