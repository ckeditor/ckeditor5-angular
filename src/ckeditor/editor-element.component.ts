/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	Component,
	ChangeDetectionStrategy,
	ElementRef,
	Input,
	inject,
	Renderer2,
	type OnChanges,
	type OnDestroy,
	type SimpleChanges
} from '@angular/core';

import {
	type EditorElementDefinition,
	type EditorElementObjectDefinition,
	normalizeEditorElementDefinition
} from './utils/normalize-editor-element-definition';

/**
 * A component that dynamically renders an HTML element based on an editor element definition.
 */
@Component( {
	selector: 'ckeditor-editor-element',
	template: '',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
} )
export class EditorElementComponent implements OnChanges, OnDestroy {
	/**
     * Definition of the element to render. Accepts a tag-name string or a
     * full element object definition object.
	 *
	 * Defaults to `'div'` when `null` or `undefined` is provided.
     */
	@Input() public definition: EditorElementDefinition | null = null;

	/**
     * The rendered DOM element.
     */
	public get element(): HTMLElement | null {
		return this._element;
	}

	private _element: HTMLElement | null = null;

	private readonly _hostRef = inject( ElementRef ) as ElementRef<HTMLElement>;

	private readonly _renderer = inject( Renderer2 );

	public ngOnChanges( changes: SimpleChanges ): void {
		if ( changes.definition ) {
			this._createOrUpdateElement();
		}
	}

	public ngOnDestroy(): void {
		this._removeElement();
	}

	/**
     * (Re-)creates the target element according to the current definition.
     * Any previously rendered element is removed first.
     */
	private _createOrUpdateElement(): void {
		this._removeElement();

		const normalized = normalizeEditorElementDefinition( this.definition ?? 'div' );
		const el: HTMLElement = this._renderer.createElement( normalized.name );

		this._applyDefinition( el, normalized );

		this._renderer.appendChild( this._hostRef.nativeElement, el );
		this._element = el;
	}

	/**
     * Removes the current target element from the DOM, if present.
     */
	private _removeElement(): void {
		if ( this._element ) {
			this._renderer.removeChild( this._hostRef.nativeElement, this._element );
			this._element = null;
		}
	}

	/**
     * Applies classes, styles and attributes from the definition to the element.
     */
	private _applyDefinition( el: HTMLElement, def: EditorElementObjectDefinition ): void {
		for ( const cls of [ def.classes ].flat().filter( Boolean ) as Array<string> ) {
			this._renderer.addClass( el, cls );
		}

		for ( const [ property, value ] of Object.entries( def.styles ?? {} ) ) {
			this._renderer.setStyle( el, property, value );
		}

		for ( const [ name, value ] of Object.entries( def.attributes ?? {} ) ) {
			this._renderer.setAttribute( el, name, value );
		}
	}
}
