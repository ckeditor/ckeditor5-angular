import { Component, Inject, NgZone } from '@angular/core';
import type { ContextWatchdog, EditorConfig } from 'ckeditor5';
import { AngularEditor } from 'src/editor/editor';

@Component( {
	selector: 'watchdog-demo',
	templateUrl: './reuse-watchdog-demo.html',
	styleUrls: [ './reuse-watchdog-demo.css' ]
} )
export class ReuseWatchdogDemoComponent {
	public Editor = AngularEditor;

	public config?: EditorConfig;
	public watchdog?: ContextWatchdog;
	public ready = false;

	public isDisabled = false;
	public errors: Array<{ timestamp: Date; message: string }> = [];
	private editor?: AngularEditor;
	private ngZone: NgZone;

	constructor( @Inject( NgZone ) ngZone: NgZone ) {
		this.ngZone = ngZone;
	}

	public onReady( editor: AngularEditor ): void {
		console.log( 'Editor initialized', editor );
		this.editor = editor;
	}

	public ngOnInit(): void {
		this.config = {
			collaboration: {
				channelId: 'foobar-baz'
			}
		};

		this.watchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context, {
			crashNumberLimit: 500,
			minimumNonErrorTimePeriod: 1000,
			saveInterval: 1200
		} );

		this.watchdog.create().then( () => {
			this.ready = true;
		} );
	}

	public toggle(): void {
		this.isDisabled = !this.isDisabled;
	}

	public simulateError(): void {
		if ( !this.editor ) {
			return;
		}

		this.ngZone.runOutsideAngular( () => {
			setTimeout( () => {
				const err: any = new Error( 'foo' );

				err.context = this.editor;
				err.is = () => true;

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
