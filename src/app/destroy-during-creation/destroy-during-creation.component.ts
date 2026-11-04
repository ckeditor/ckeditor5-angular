import { Component, signal } from '@angular/core';
import { Plugin } from 'ckeditor5';
import { AngularEditor } from 'src/editor/editor';

/**
 * Makes `Editor.create()` take 3 seconds and, like real-time collaboration, keeps a "connection"
 * (a heartbeat in the console) open until the editor is destroyed.
 */
class SlowStartPlugin extends Plugin {
	private heartbeat?: ReturnType<typeof setInterval>;

	public async init(): Promise<void> {
		this.heartbeat = setInterval( () => console.log( 'Heartbeat: the editor still exists.' ), 1000 );

		await new Promise( resolve => setTimeout( resolve, 3000 ) );
	}

	public override destroy(): void {
		clearInterval( this.heartbeat );
		console.log( 'The editor was destroyed.' );

		super.destroy();
	}
}

@Component( {
	selector: 'app-destroy-during-creation',
	templateUrl: './destroy-during-creation.component.html',
	standalone: false
} )
export class DestroyDuringCreationComponent {
	public Editor = AngularEditor;

	public config = {
		extraPlugins: [ SlowStartPlugin ]
	};

	public isVisible = signal( false );

	public showAndRemoveDuringCreation(): void {
		this.isVisible.set( true );

		setTimeout( () => this.isVisible.set( false ), 500 );
	}
}
