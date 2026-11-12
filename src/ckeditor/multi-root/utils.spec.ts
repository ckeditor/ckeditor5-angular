/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { describe, expect, it } from 'vitest';

import { areArraysEqual, isDeepEqual, isInternalRootAttribute, pickUserAttributes } from './utils';

describe( 'multi-root utils', () => {
	describe( 'isInternalRootAttribute()', () => {
		it( 'should tell the attributes of the editor from the ones of the integrator', () => {
			expect( isInternalRootAttribute( '$rootEditableOptions' ) ).toBe( true );
			expect( isInternalRootAttribute( 'order' ) ).toBe( false );
		} );
	} );

	describe( 'pickUserAttributes()', () => {
		it( 'should leave out the attributes of the editor, and the ones the root does not have', () => {
			expect( pickUserAttributes( { order: 10, row: null, $rootEditableOptions: {} } ) ).toEqual( { order: 10 } );
		} );
	} );

	describe( 'areArraysEqual()', () => {
		it( 'should compare the values in order', () => {
			expect( areArraysEqual( [ 'a', 'b' ], [ 'a', 'b' ] ) ).toBe( true );
			expect( areArraysEqual( [ 'a', 'b' ], [ 'b', 'a' ] ) ).toBe( false );
			expect( areArraysEqual( [ 'a' ], [ 'a', 'b' ] ) ).toBe( false );
		} );
	} );

	describe( 'isDeepEqual()', () => {
		it( 'should compare primitives', () => {
			expect( isDeepEqual( 1, 1 ) ).toBe( true );
			expect( isDeepEqual( 'a', 'b' ) ).toBe( false );
			expect( isDeepEqual( null, {} ) ).toBe( false );
			expect( isDeepEqual( {}, null ) ).toBe( false );
			expect( isDeepEqual( 1, {} ) ).toBe( false );
			expect( isDeepEqual( {}, 1 ) ).toBe( false );
		} );

		it( 'should compare objects regardless of the order of keys', () => {
			expect( isDeepEqual( { a: 1, b: { c: [ 1, 2 ] } }, { b: { c: [ 1, 2 ] }, a: 1 } ) ).toBe( true );
			expect( isDeepEqual( { a: 1 }, { a: 2 } ) ).toBe( false );
			expect( isDeepEqual( { a: 1 }, { a: 1, b: 2 } ) ).toBe( false );
			expect( isDeepEqual( { a: 1 }, { b: 1 } ) ).toBe( false );
		} );

		it( 'should compare arrays', () => {
			expect( isDeepEqual( [ 1, { a: 1 } ], [ 1, { a: 1 } ] ) ).toBe( true );
			expect( isDeepEqual( [ 1, 2 ], [ 2, 1 ] ) ).toBe( false );
			expect( isDeepEqual( [ 1 ], { 0: 1 } ) ).toBe( false );
		} );
	} );
} );
