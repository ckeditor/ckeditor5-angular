import { Component, ViewChild } from '@angular/core';
import type { EditorConfig } from 'ckeditor5';
import { CKEditorComponent } from 'src/ckeditor';
import { AngularEditor } from 'src/editor/editor';

@Component( {
	selector: 'app-initialization-crash',
	templateUrl: './initialization-crash.component.html',
	standalone: false
} )
export class InitializationCrashComponent {
	public Editor = AngularEditor;

	@ViewChild( CKEditorComponent ) public ckeditor?: CKEditorComponent;

	public config?: EditorConfig;
	public ready = false;

	public errorOccurred = false;

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
		console.error( 'The editor failed to start and the error was caught', error );
		this.errorOccurred = true;
	}
}
