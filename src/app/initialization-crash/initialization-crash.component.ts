import { Component, ViewChild } from '@angular/core';
import { CKEditorComponent } from 'src/ckeditor';
import AngularEditor from 'ckeditor/build/ckeditor';
import type { ContextWatchdog } from '@ckeditor/ckeditor5-watchdog';

@Component( {
	selector: 'app-initialization-crash',
	templateUrl: './initialization-crash.component.html',
	styleUrls: [ './initialization-crash.component.css' ]
} )
export class InitializationCrashComponent {
	public Editor = AngularEditor;
	public EditorWatchdog = AngularEditor;

	@ViewChild( CKEditorComponent ) public ckeditor?: CKEditorComponent;

	public config: any;
	public ready = false;

	public errorOccurred = false;
	public errorOccurredWatchdog = false;

	public watchdog?: ContextWatchdog;

	public ngOnInit(): void {
		const contextConfig: any = {
			foo: 'bar'
		};

		this.config = {
			extraPlugins: [
				function( editor: any ) {
					editor.data.on( 'init', () => {
						// Simulate an error.
						// Create a non-existing position, then try to get its parent.
						const position = editor.model.createPositionFromPath( editor.model.document.getRoot(), [ 1, 2, 3 ] );

						return position.parent;
					} );
				}
			],
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

	public onError( error: any ): void {
		console.error( 'Editor without watchdog threw an error which was caught', error );
		this.errorOccurred = true;
	}

	public onErrorWatchdog( error: any ): void {
		console.error( 'Editor with watchdog threw an error which was caught', error );
		this.errorOccurredWatchdog = true;
	}
}
