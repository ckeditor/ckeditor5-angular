/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	ChangeDetectionStrategy,
	Component,
	Directive,
	ElementRef,
	computed,
	effect,
	inject,
	input
} from '@angular/core';
import type { MultiRootEditor } from 'ckeditor5';

import { CKEDITOR_MULTI_ROOT_HOST } from './multi-root-host';

/**
 * Moves a part of the editor UI, rendered by the editor itself, into the host element.
 */
@Directive()
abstract class CKEditorMultiRootUIElement {
	/**
	 * The editor whose UI to render. Can be left out inside `<ckeditor-multi-root>`, which provides its own editor.
	 */
	public readonly editor = input<MultiRootEditor | null>( null );

	private readonly host = inject( CKEDITOR_MULTI_ROOT_HOST, { optional: true } );

	private readonly element = inject( ElementRef ) as ElementRef<HTMLElement>;

	private readonly resolvedEditor = computed( () => this.editor() ?? this.host?.instance() ?? null );

	constructor() {
		effect( onCleanup => {
			const editor = this.resolvedEditor();

			if ( !editor ) {
				return;
			}

			const uiElement = this.getUIElement( editor );
			const container = this.element.nativeElement;

			container.appendChild( uiElement );

			onCleanup( () => {
				// Another component may have taken the element over already.
				if ( uiElement.parentNode === container ) {
					uiElement.remove();
				}
			} );
		} );
	}

	protected abstract getUIElement( editor: MultiRootEditor ): HTMLElement;
}

/**
 * Renders the toolbar of a multi-root editor.
 *
 * ```html
 * <ckeditor-multi-root-toolbar />
 * ```
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
@Component( {
	selector: 'ckeditor-multi-root-toolbar',
	template: '',
	styles: ':host { display: block; }',
	changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CKEditorMultiRootToolbarComponent extends CKEditorMultiRootUIElement {
	protected getUIElement( editor: MultiRootEditor ): HTMLElement {
		return editor.ui.view.toolbar.element!;
	}
}

/**
 * Renders the menu bar of a multi-root editor.
 *
 * ```html
 * <ckeditor-multi-root-menu-bar />
 * ```
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
@Component( {
	selector: 'ckeditor-multi-root-menu-bar',
	template: '',
	styles: ':host { display: block; }',
	changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CKEditorMultiRootMenuBarComponent extends CKEditorMultiRootUIElement {
	protected getUIElement( editor: MultiRootEditor ): HTMLElement {
		return editor.ui.view.menuBarView.element!;
	}
}
