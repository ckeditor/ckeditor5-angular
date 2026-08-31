import { Component, Inject, NgZone } from '@angular/core';
import { CKEditorError, type Context, type EditorConfig } from 'ckeditor5';
import { AngularEditor } from 'src/editor/editor';

type Mode = 'single' | 'two' | 'context';

type DemoEditor = {
	name: string;
	data: string;
	instance?: AngularEditor;
};

@Component( {
	selector: 'error-handling-demo',
	templateUrl: './error-handling-demo.html',
	styleUrls: [ './error-handling-demo.css' ],
	standalone: false
} )
export class ErrorHandlingDemoComponent {
	public Editor = AngularEditor;

	public mode: Mode = 'single';
	public errors: Array<{ timestamp: Date; from: string; message: string }> = [];

	/**
	 * The editors of the current mode. Switching modes replaces the list, which destroys the components
	 * that are gone and creates the new ones.
	 */
	public editors: Array<DemoEditor> = createEditors( 'single' );

	/**
	 * Always an object, never `undefined` — the component's `config` input has a default, and binding
	 * `undefined` would replace that default rather than fall back to it.
	 *
	 * It carries the context in the context mode, and is filled in only once that context is ready,
	 * because the editors must not be created before it.
	 */
	public sharedConfig: EditorConfig = {};

	private context?: Context;

	/**
	 * Which mode switch is the current one. Creating a context is asynchronous, so a switch that started
	 * earlier must not write its result over a later one.
	 */
	private generation = 0;

	private isDestroyed = false;
	private ngZone: NgZone;

	constructor( @Inject( NgZone ) ngZone: NgZone ) {
		this.ngZone = ngZone;
	}

	public async setMode( mode: Mode ): Promise<void> {
		const generation = ++this.generation;

		this.mode = mode;
		this.editors = [];
		this.sharedConfig = {};

		if ( mode !== 'context' ) {
			this.editors = createEditors( mode );

			return;
		}

		if ( !this.context ) {
			const context = await AngularEditor.Context.create( {} );

			// Another mode was chosen, or the demo went away, while the context was being created. Nobody
			// is going to use it and nobody else knows about it, so it has to go here.
			if ( generation !== this.generation || this.isDestroyed ) {
				await context.destroy();

				return;
			}

			this.context = context;
		}

		this.sharedConfig = { context: this.context };
		this.editors = createEditors( mode );
	}

	public onReady( editor: DemoEditor, instance: AngularEditor ): void {
		editor.instance = instance;
	}

	/**
	 * Throws from a timeout, so that the error escapes as an uncaught one — the path a real error takes.
	 * The editor is what ties it to its own component.
	 *
	 * Remove it in an actual integration; it exists only to give this demo something to report.
	 */
	public simulateError( editor: DemoEditor ): void {
		const instance = editor.instance;

		if ( !instance ) {
			return;
		}

		this.ngZone.runOutsideAngular( () => {
			setTimeout( () => {
				/**
				 * Thrown on purpose by this demo, so that there is something to report.
				 *
				 * @error demo-simulated-error
				 */
				throw new CKEditorError( 'demo-simulated-error', instance );
			} );
		} );
	}

	public onError( editor: DemoEditor, error: any ): void {
		this.errors.unshift( {
			timestamp: new Date(),
			from: editor.name,
			message: error?.message?.split( '\n' )[ 0 ] ?? String( error )
		} );
	}

	public clear(): void {
		this.errors = [];
	}

	public async ngOnDestroy(): Promise<void> {
		this.isDestroyed = true;

		// The demo created the context, so the demo destroys it. Leaving the route takes the editors down,
		// not the context they shared.
		await this.context?.destroy();
	}
}

function createEditors( mode: Mode ): Array<DemoEditor> {
	const editors: Array<DemoEditor> = [
		{ name: 'Editor 1', data: 'Type something here, then break it and see that this stays.' }
	];

	if ( mode !== 'single' ) {
		editors.push( { name: 'Editor 2', data: 'And something else here.' } );
	}

	return editors;
}
