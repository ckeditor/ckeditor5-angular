import { Component, type OnInit } from '@angular/core';
import type { EditorConfig, MultiRootEditor } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';

import {
	loadCKEditorCloud,
	type CKEditorCloudResult
} from '@ckeditor/ckeditor5-integrations-common';

import type { MultiRootEditorData } from 'src/ckeditor';

// The multi-root integration needs CKEditor 5 v49+.
const EDITOR_VERSION = 'nightly';

@Component( {
	selector: 'app-multi-root-cdn-usage',
	templateUrl: './multi-root-cdn-usage.component.html',
	styleUrls: [ './multi-root-cdn-usage.component.css' ],
	standalone: false
} )
export class MultiRootCdnUsageComponent implements OnInit {
	public Editor: typeof MultiRootEditor | null = null;

	public config: EditorConfig | null = null;

	public data: MultiRootEditorData = {
		header: '<h2>Multi-root editor from CDN</h2>',
		content: '<p>This editor is loaded from the CDN and uses the default layout of the component.</p>',
		footer: '<p>The menu bar, the toolbar and the editables of all roots are rendered by <code>&lt;ckeditor-multi-root&gt;</code>.</p>'
	};

	public readonly componentEvents: Array<string> = [];

	public ngOnInit(): void {
		loadCKEditorCloud( {
			version: EDITOR_VERSION
		} )
			.then( this._setupEditor.bind( this ) );
	}

	public onReady(): void {
		this.componentEvents.push( 'The editor is ready.' );
	}

	public onError( error: unknown ): void {
		this.componentEvents.push( 'The editor reported an error.' );
		console.error( error );
	}

	private _setupEditor( cloud: CKEditorCloudResult<{ version: typeof EDITOR_VERSION }> ) {
		const {
			MultiRootEditor, Essentials, Autoformat, Bold, Italic, BlockQuote, Heading,
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
			menuBar: {
				isVisible: true
			},
			table: {
				contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
			},
			language: 'en'
		};

		this.Editor = MultiRootEditor;
	}
}
