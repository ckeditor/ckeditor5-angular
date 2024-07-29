import { Component, type OnInit } from '@angular/core';
import type { ClassicEditor } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';

import { createCdnEditor } from 'src/editor/create-cdn-editor';
import loadCKEditorCloud from 'src/ckeditor/cloud/load-ckeditor-cloud';

@Component( {
	selector: 'app-simple-cdn-usage',
	templateUrl: './simple-cdn-usage.component.html',
	styleUrls: [ './simple-cdn-usage.component.css' ]
} )
export class SimpleCdnUsageComponent implements OnInit {
	public Editor: typeof ClassicEditor | null = null;

	public isDisabled = false;
	public editorData =
		`<p>Getting used to an entirely different culture can be challenging.
While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person.
You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>`;

	public componentEvents: Array<string> = [];

	public toggleDisableEditors(): void {
		this.isDisabled = !this.isDisabled;
	}

	public ngOnInit(): void {
		loadCKEditorCloud( {
			version: '42.0.2'
		} )
			.then( cloud => {
				this.Editor = createCdnEditor( {
					cloud
				} );
			} );
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

	public onError(): void {
		this.componentEvents.push( 'The editor crashed.' );
	}
}
