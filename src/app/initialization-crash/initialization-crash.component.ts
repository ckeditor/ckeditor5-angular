import { Component, ViewChild } from '@angular/core';
import type { EditorConfig, WatchdogConfig } from 'ckeditor5';
import { CKEditorComponent } from 'src/ckeditor';
import { AngularEditor } from 'src/editor/editor';

@Component( {
	selector: 'app-initialization-crash',
	templateUrl: './initialization-crash.component.html',
	standalone: false
} )
export class InitializationCrashComponent {
	public Editor = AngularEditor;
	public EditorWatchdog = AngularEditor;

	@ViewChild( CKEditorComponent ) public ckeditor?: CKEditorComponent;

	public config?: EditorConfig;
	public ready = false;

	public errorOccurred = false;
	public errorOccurredWatchdog = false;
	public editorWatchdogConfig: WatchdogConfig = {
		crashNumberLimit: 5,
		minimumNonErrorTimePeriod: 1000,
		saveInterval: 1200
	};

	public ngOnInit(): void {
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
			]
		};
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
