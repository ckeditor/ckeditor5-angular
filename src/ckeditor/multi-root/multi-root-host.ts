/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { InjectionToken, type Signal } from '@angular/core';
import type { MultiRootEditor } from 'ckeditor5';

/**
 * What the toolbar, menu bar and editable components placed inside `<ckeditor-multi-root>` need from it.
 *
 * A token rather than the component class, so that the component can use them in its own template
 * without the files importing each other.
 */
export interface MultiRootEditorHost {

	/**
	 * The editor, once it is ready.
	 */
	readonly instance: Signal<MultiRootEditor | null>;

	/**
	 * The names of the attached roots.
	 */
	readonly roots: Signal<ReadonlyArray<string>>;
}

export const CKEDITOR_MULTI_ROOT_HOST = new InjectionToken<MultiRootEditorHost>( 'CKEDITOR_MULTI_ROOT_HOST' );
