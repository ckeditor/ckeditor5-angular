import { Component, signal } from '@angular/core';
import { form, required, minLength } from '@angular/forms/signals';
import type { EditorConfig } from 'ckeditor5';

import { AngularEditor } from 'src/editor/editor';

type PostDialogData = {
	post?: {
		title: string;
		content: string;
	};
};

@Component( {
	selector: 'app-demo-signal-form',
	templateUrl: './demo-signal-form.component.html',
	styleUrls: [ './demo-signal-form.component.css' ],
	standalone: false
} )
export class DemoSignalFormComponent {
	/**
	 * Simulates the data injected in the reporter's component (e.g. `MAT_DIALOG_DATA`).
	 * Must be declared before `postModel`, because field initializers run in order.
	 */
	private readonly data: PostDialogData = {
		post: {
			title: 'Initial title',
			content: '<p>Initial content from the model.</p>'
		}
	};

	/**
	 * Like in the report, the editor and its config are signals, so `<ckeditor>`
	 * is created later, inside `@if`, and not during the first render.
	 */
	public readonly editor = signal<typeof AngularEditor | null>( null );
	public readonly editorConfig = signal<EditorConfig | null>( null );

	public readonly postModel = signal( {
		title: this.data.post?.title ?? '',
		content: this.data.post?.content ?? ''
	} );

	public readonly postForm = form( this.postModel, s => {
		required( s.title );
		minLength( s.title, 2 );
		required( s.content );
		minLength( s.content, 3 );
	} );

	public editorInstance?: AngularEditor;

	constructor() {
		// Simulates asynchronous loading of the editor and its config.
		setTimeout( () => this.showEditor(), 300 );
	}

	public showEditor(): void {
		this.editor.set( AngularEditor );
		// Passing `config` replaces the component's default one, so the license key must be set here.
		// Adjust to whatever the other demos pass to `AngularEditor`.
		this.editorConfig.set( { licenseKey: 'GPL' } );
	}

	public hideEditor(): void {
		this.editor.set( null );
		this.editorConfig.set( null );
		this.editorInstance = undefined;
	}

	public onReady( editor: AngularEditor ): void {
		this.editorInstance = editor;
	}

	/**
	 * Model -> editor direction (`writeValue()` after the editor is ready).
	 */
	public setContentFromOutside(): void {
		this.postModel.update( model => ( {
			...model,
			content: `<p>Set from outside at ${ new Date().toLocaleTimeString() }.</p>`
		} ) );
	}

	public reset(): void {
		this.postModel.set( { title: '', content: '' } );
	}

	public onSubmit(): void {
		console.log( 'Form submit, model', this.postModel() );
		console.log( 'Editor data', this.editorInstance?.getData() );
	}
}
