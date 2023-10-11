import { Component } from '@angular/core';
import AngularEditor from '../../../ckeditor/build/ckeditor';
import type { ContextWatchdog } from '@ckeditor/ckeditor5-watchdog';

@Component( {
	selector: 'watchdog-demo',
	templateUrl: './watchdog-demo.html',
	styleUrls: [ './watchdog-demo.css' ]
} )
export class WatchdogDemoComponent {
	public Editor = AngularEditor;

	public config: any;
	public watchdog?: ContextWatchdog;
	public ready = false;

	public isDisabled = false;
	public errorOccurred = false;

	public onReady( editor: AngularEditor ): void {
		console.log( editor );

		const inputCommand = editor.commands.get( 'input' )!;

		inputCommand.on( 'execute', ( evt, data ) => {
			const commandArgs = data[ 0 ];

			if ( commandArgs.text === '1' ) {
				// Simulate an error.
				throw new Error( 'a-custom-editor-error' );
			}

			if ( commandArgs.text === '2' ) {
				// Simulate an error.
				throw 'foobar';
			}
		} );
	}

	public ngOnInit(): void {
		const contextConfig: any = {
			foo: 'bar'
		};

		this.config = {
			collaboration: {
				channelId: 'foobar-baz'
			}
		};

		this.watchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );

		this.watchdog.create( contextConfig )
			.then( () => {
				this.ready = true;
			} );
	}

	public toggle(): void {
		this.isDisabled = !this.isDisabled;
	}

	public onError(): void {
		this.errorOccurred = true;
	}
}
