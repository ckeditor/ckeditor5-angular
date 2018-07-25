import { Component } from '@angular/core';

import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { CKEditor5 } from '../../ckeditor/ckeditor';

@Component( {
	selector: 'app-simple-usage',
	templateUrl: './simple-usage.component.html',
	styleUrls: [ './simple-usage.component.css' ]
} )
export class SimpleUsageComponent {
	public Editor = ClassicEditorBuild;

	public isDisabled = false;
	public editorData =
		`<p>Getting used to an entirely different culture can be challenging.
While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person.
You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>`;

	public componentEvents: string[] = [];

	toggleDisableEditors() {
		this.isDisabled = !this.isDisabled;
	}

	onReady( editor: CKEditor5.Editor ): void {
		this.componentEvents.push( 'The editor is ready.' );
	}

	onChange( event: { event: CKEditor5.EventInfo<'change:data'>, editor: CKEditor5.Editor } ): void {
		this.componentEvents.push( 'Editor model changed.' );
	}

	onFocus( event: { event: CKEditor5.EventInfo<'change:data'>, editor: CKEditor5.Editor} ): void {
		this.componentEvents.push( 'Focused the editing view.' );
	}

	onBlur( event: { event: CKEditor5.EventInfo<'change:data'>, editor: CKEditor5.Editor} ): void {
		this.componentEvents.push( 'Blurred the editing view.' );
	}
}
