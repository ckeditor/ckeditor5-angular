import { Component, Inject, NgZone } from '@angular/core';
import type { WatchdogConfig } from 'ckeditor5';
import { AngularEditor } from 'src/editor/editor';

@Component( {
	selector: 'watchdog-demo',
	templateUrl: './editor-watchdog-demo.html',
	styleUrls: [ './editor-watchdog-demo.css' ]
} )
export class EditorWatchdogDemoComponent {
	public Editor = AngularEditor;

	public ready = false;
	public isDisabled = false;
	public errors: Array<{ timestamp: Date; message: string }> = [];
	public editorWatchdogConfig: WatchdogConfig = {
		crashNumberLimit: 500,
		minimumNonErrorTimePeriod: 1000,
		saveInterval: 1200
	};

	private editor?: AngularEditor;
	private ngZone: NgZone;

	constructor( @Inject( NgZone ) ngZone: NgZone ) {
		this.ngZone = ngZone;
	}

	public onReady( editor: AngularEditor ): void {
		console.log( 'Editor initialized', editor );
		this.editor = editor;
	}

	public toggle(): void {
		this.isDisabled = !this.isDisabled;
	}

	public simulateError(): void {
		this.ngZone.runOutsideAngular( () => {
			setTimeout( () => {
				const err: any = new Error( 'foo' );

				err.context = this.editor;
				err.is = () => !!this.editor;

				throw err;
			} );
		} );
	}

	public onError( error: any ): void {
		// Watchdog should return undefined error when it restarts the editor.
		this.errors.unshift( {
			timestamp: new Date(),
			message: error?.toString() ?? 'Watchdog restarted editor.'
		} );
	}
}
