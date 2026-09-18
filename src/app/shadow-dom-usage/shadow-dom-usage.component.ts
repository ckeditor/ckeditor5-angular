import { Component, signal, type OnInit } from '@angular/core';
import { AngularEditor } from 'src/editor/editor';
import { getCKEditorStyleSheet } from '../shared/get-ckeditor-stylesheet';

@Component( {
	selector: 'app-shadow-dom-usage',
	templateUrl: './shadow-dom-usage.component.html',
	standalone: false
} )
export class ShadowDomUsageComponent implements OnInit {
	public readonly Editor = AngularEditor;

	public readonly modes: Array<ShadowRootMode> = [ 'open', 'closed' ];

	public readonly mode = signal<ShadowRootMode>( 'open' );
	public readonly isDisabled = signal( false );
	public readonly styleSheets = signal<Array<CSSStyleSheet>>( [] );

	public editorData =
		`<p>This editor lives in a shadow root, and so do its styles.
Nothing is added to the document head.</p>`;

	public componentEvents: Array<string> = [];

	public ngOnInit(): void {
		getCKEditorStyleSheet().then( sheet => this.styleSheets.set( [ sheet ] ) );
	}

	public toggleDisableEditors(): void {
		this.isDisabled.update( v => !v );
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
