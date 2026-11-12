/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { MultiRootEditorRootAttributes } from './types';

/**
 * Whether the root attribute is one the editor keeps for itself, e.g. `$rootEditableOptions`. Binding `rootsAttributes`
 * without them must not remove them from the roots.
 */
export function isInternalRootAttribute( key: string ): boolean {
	return key.startsWith( '$' );
}

/**
 * The attributes the integrator manages, without the editor's own, and without the ones set to `null`. The editor
 * reports every registered attribute, so `null` is what it gives for an attribute the root does not have.
 */
export function pickUserAttributes( attributes: MultiRootEditorRootAttributes ): MultiRootEditorRootAttributes {
	return Object.fromEntries(
		Object.entries( attributes ).filter( ( [ key, value ] ) => !isInternalRootAttribute( key ) && value != null )
	);
}

export function areArraysEqual( first: ReadonlyArray<string>, second: ReadonlyArray<string> ): boolean {
	return first.length === second.length && first.every( ( value, index ) => value === second[ index ] );
}

/**
 * Compares plain data (strings, numbers, booleans, `null`, arrays and plain objects) regardless of the order of keys.
 */
export function isDeepEqual( first: unknown, second: unknown ): boolean {
	if ( first === second ) {
		return true;
	}

	if ( !first || !second || typeof first !== 'object' || typeof second !== 'object' ) {
		return false;
	}

	if ( Array.isArray( first ) !== Array.isArray( second ) ) {
		return false;
	}

	const firstKeys = Object.keys( first );
	const secondKeys = Object.keys( second );

	return firstKeys.length === secondKeys.length && firstKeys.every( key =>
		Object.prototype.hasOwnProperty.call( second, key ) &&
		isDeepEqual( ( first as Record<string, unknown> )[ key ], ( second as Record<string, unknown> )[ key ] )
	);
}
