import { Component, signal } from '@angular/core';
import type { ClassicEditor, EditorConfig } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';

import {
	loadCKEditorCloud,
	type CKEditorCloudResult
} from '@ckeditor/ckeditor5-integrations-common';

const EDITOR_VERSION = 'nightly';

@Component( {
	selector: 'app-shadow-dom-cdn-usage',
	templateUrl: './shadow-dom-cdn-usage.component.html',
	standalone: false
} )
export class ShadowDomCdnUsageComponent {
	public Editor: typeof ClassicEditor | null = null;

	public config: EditorConfig | null = null;

	public readonly mode = signal<ShadowRootMode>( 'open' );

	public readonly isDisabled = signal( false );

	public editorData =
		`<p>This editor lives in a shadow root, and so do its stylesheets.
Nothing is added to the document head.</p>`;

	public componentEvents: Array<string> = [];

	public toggleDisableEditors(): void {
		this.isDisabled.update( v => !v );
	}

	public onShadowRootAttached( shadowRoot: ShadowRoot ): void {
		this.Editor = null;

		loadCKEditorCloud( {
			version: EDITOR_VERSION,
			injectedStylesheetsLocation: {
				targetNode: shadowRoot
			}
		} )
			.then( this._setupEditor.bind( this ) );
	}

	private _setupEditor( cloud: CKEditorCloudResult<{ version: typeof EDITOR_VERSION }> ) {
		const {
			ClassicEditor, Essentials, Autoformat, Bold, Italic, BlockQuote, Heading,
			Indent, Link, List, Paragraph, PasteFromOffice, Table, TableToolbar, TextTransformation
		} = cloud.CKEditor;

		this.config = {
			licenseKey: window.CKEDITOR_GLOBAL_LICENSE_KEY || 'GPL',
			plugins: [
				Essentials, Autoformat, Bold, Italic, BlockQuote, Heading, Indent,
				Link, List, Paragraph, PasteFromOffice, Table, TableToolbar, TextTransformation
			],
			toolbar: {
				items: [
					'undo', 'redo', '|', 'heading', '|', 'bold', 'italic',
					'|', 'link', 'insertTable', 'blockQuote',
					'|', 'bulletedList', 'numberedList', 'outdent', 'indent'
				]
			},
			table: {
				contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
			},
			language: 'en'
		};

		this.Editor = ClassicEditor;
	}

	public onReady(): void {
		this.componentEvents.push( 'The editor is ready.' );
	}

	public onChange(): void {
		this.componentEvents.push( 'Editor model changed.' );
	}

	public onFocus(): void {
		this.componentEvents.push( 'Focused the editing view.' );
	}

	public onBlur(): void {
		this.componentEvents.push( 'Blurred the editing view.' );
	}

	public onError( err: any ): void {
		this.componentEvents.push( 'The editor crashed.' );
		console.error( err );
	}
}
