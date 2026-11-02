/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	Component,
	ChangeDetectionStrategy,
	ElementRef,
	inject,
	Renderer2,
	input,
	effect
} from '@angular/core';

import { normalizeClassList } from './utils/normalize-class-list';
import {
	type EditorElementDefinition,
	type EditorElementObjectDefinition,
	normalizeEditorElementDefinition
} from './utils/normalize-editor-element-definition';

/*
  A component that dynamically renders an HTML element based on an editor element definition.
*/
@Component( {
	selector: 'ckeditor-editor-element',
	template: '',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
} )
export class EditorElementComponent {
	private readonly _hostRef = inject( ElementRef ) as ElementRef<HTMLElement>;

	private readonly _renderer = inject( Renderer2 );

	public readonly definition = input<EditorElementDefinition | null>( null );

	public get element(): HTMLElement | null {
		return this._element;
	}

	private _element: HTMLElement | null = null;

	/**
	 * A pending operation that still needs the element, set with `holdUntil()`. Cleared once it settles.
	 */
	private _hold: Promise<unknown> | null = null;

	constructor() {
		effect( onCleanup => {
			const currentDefinition = this.definition();

			const normalized = normalizeEditorElementDefinition( currentDefinition ?? 'div' );
			const el: HTMLElement = this._renderer.createElement( normalized.name );

			this._applyDefinition( el, normalized );
			this._renderer.appendChild( this._hostRef.nativeElement, el );
			this._element = el;

			onCleanup( () => {
				const remove = () => this._renderer.removeChild( this._hostRef.nativeElement, el );

				this._element = null;

				// An editor that is still being created may be about to insert its UI next to this element
				// (`ElementReplacer#replace()` in `ClassicEditorUI#init()`), which needs the element to have a parent.
				// Removing it right away made such a creation fail with "Cannot read properties of null
				// (reading 'insertBefore')". The element is removed once the creation has settled instead.
				if ( this._hold ) {
					this._hold.then( remove, remove );
				} else {
					remove();
				}
			} );
		} );
	}

	/**
	 * Keeps the element in the host until the given promise settles, even if the component is destroyed
	 * (or the definition changes) in the meantime.
	 *
	 * @internal
	 */
	public holdUntil( promise: Promise<unknown> ): void {
		const release = () => {
			if ( this._hold === promise ) {
				this._hold = null;
			}
		};

		this._hold = promise;

		// Releasing as soon as it settles keeps the removal synchronous when nothing is pending any more.
		promise.then( release, release );
	}

	private _applyDefinition( el: HTMLElement, def: EditorElementObjectDefinition ): void {
		const classes = normalizeClassList( def.classes ?? [] );

		for ( const className of classes ) {
			this._renderer.addClass( el, className );
		}

		if ( def.styles ) {
			for ( const [ property, value ] of Object.entries( def.styles ) ) {
				el.style.setProperty( property, value );
			}
		}

		if ( def.attributes ) {
			for ( const [ name, value ] of Object.entries( def.attributes ) ) {
				this._renderer.setAttribute( el, name, value );
			}
		}
	}
}
