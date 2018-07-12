import { Component, OnInit } from '@angular/core';

import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';

@Component( {
	selector: 'app-simple-usage',
	templateUrl: './simple-usage.component.html',
	styleUrls: [ './simple-usage.component.css' ]
} )
export class SimpleUsageComponent {
	public ClassicEditorBuild = ClassicEditorBuild;

	public isDisabled = false;
	public editorData =
		`<p>Getting used to an entirely different culture can be challenging.
While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person.
You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>`;

	constructor() {}

	toggleDisableEditors() {
		this.isDisabled = !this.isDisabled;
	}

	onFocus( evt: any ): void {
		console.log( 'Focused the editing view', evt );
	}

	onBlur( evt: any ): void {
		console.log( 'Blurred the editing view', evt );
	}

	change( evt: any ): void {
		console.log( 'Editor model changed', evt );
	}

	ready( evt: any ): void {
		console.log( 'The editor is ready', evt );
	}
}
