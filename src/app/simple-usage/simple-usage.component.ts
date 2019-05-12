import { Component } from '@angular/core';

import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';

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

	public toggleDisableEditors() {
		this.isDisabled = !this.isDisabled;
	}

	public onReady() {
		this.componentEvents.push( 'The editor is ready.' );
	}

	public onChange() {
		this.componentEvents.push( 'Editor model changed.' );
	}

	public onFocus() {
		this.componentEvents.push( 'Focused the editing view.' );
	}

	public onBlur() {
		this.componentEvents.push( 'Blurred the editing view.' );
	}
}
