/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	computed,
	effect,
	inject,
	input
} from '@angular/core';
import type { MultiRootEditor } from 'ckeditor5';

import { CKEDITOR_MULTI_ROOT_HOST } from './multi-root-host';
import type { MultiRootEditableOptions } from './types';

/**
 * Renders the editable of one root of a multi-root editor.
 *
 * ```html
 * <ckeditor-multi-root-editable rootName="intro" />
 * ```
 *
 * The editable element is created by the editor, from `editableOptions` or, when they are not given, from the options
 * stored in the root (see `AddRootOptions#editableOptions`). Nothing is rendered until the editor is ready and the root
 * is attached, and the editable goes away when the root is detached, e.g. by `removeRoot()` or undo.
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
@Component( {
	selector: 'ckeditor-multi-root-editable',
	template: '',
	styles: ':host { display: contents; }',
	changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CKEditorMultiRootEditableComponent {
	/**
	 * The name of the root to render.
	 */
	public readonly rootName = input.required<string>();

	/**
	 * The editor whose root to render. Can be left out inside `<ckeditor-multi-root>`, which provides its own editor.
	 */
	public readonly editor = input<MultiRootEditor | null>( null );

	/**
	 * Describes the editable element. Takes precedence over the options stored in the root.
	 */
	public readonly editableOptions = input<MultiRootEditableOptions | null>( null );

	private readonly host = inject( CKEDITOR_MULTI_ROOT_HOST, { optional: true } );

	private readonly element = inject( ElementRef ) as ElementRef<HTMLElement>;

	private readonly resolvedEditor = computed( () => this.editor() ?? this.host?.instance() ?? null );

	/**
	 * A computed boolean rather than the list itself, so that adding or detaching another root does not recreate
	 * this editable. Without a host, there is nothing to watch, and the root is checked when the editable is created.
	 */
	private readonly isRootListed = computed( () => this.host?.roots().includes( this.rootName() ) ?? true );

	constructor() {
		effect( onCleanup => {
			const editor = this.resolvedEditor();
			const rootName = this.rootName();
			const options = this.editableOptions();

			if ( !editor || !this.isRootListed() ) {
				return;
			}

			const root = editor.model.document.getRoot( rootName );

			if ( !root || !root.isAttached() ) {
				return;
			}

			// The editor creates an editable for every root it starts with, and another component may have
			// rendered this root before. A root can have one editable only.
			if ( editor.ui.getEditableElement( rootName ) ) {
				editor.detachEditable( root );
			}

			const editableElement = editor.createEditable( root, { ...options } );
			const container = this.element.nativeElement;

			container.appendChild( editableElement );

			onCleanup( () => {
				if ( editor.state !== 'destroyed' && editor.ui.getEditableElement( rootName ) === editableElement ) {
					editor.detachEditable( root );
				}

				editableElement.remove();
			} );
		} );
	}
}
