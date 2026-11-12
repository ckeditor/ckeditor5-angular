/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { EventEmitter } from '@angular/core';

/**
 * Checks whether anything listens to the given emitter, e.g. `(error)="onError( $event )"` in a template.
 */
export function hasObservers<T>( emitter: EventEmitter<T> ): boolean {
	// Cast to `any` because `observed` property is available in RxJS >= 7.2.0.
	// Fallback to checking `observers` list if this property is not defined.
	return ( emitter as any ).observed || emitter.observers.length > 0;
}
