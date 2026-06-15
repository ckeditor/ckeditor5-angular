import { Component, signal, computed } from '@angular/core';
import { AngularEditor } from 'src/editor/editor';

@Component( {
	selector: 'app-simple-usage',
	templateUrl: './simple-usage.component.html',
	styleUrls: [ './simple-usage.component.css' ],
	standalone: false
} )
export class SimpleUsageComponent {
	public Editor = AngularEditor;

	public readonly isDisabled = signal( false );
	public readonly isInline = signal( false );
	public readonly isEditorVisible = signal( true );

	public readonly editorConfig = computed( () => ( {
		root: { modelElement: this.isInline() ? '$inlineRoot' : '$root' }
	} ) );

	public editorData =
		`<p>Getting used to an entirely different culture can be challenging.
While it's also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person.
You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>`;

	public componentEvents: Array<string> = [];

	public toggleDisableEditors(): void {
		this.isDisabled.update( v => !v );
	}

	public toggleInlineMode(): void {
		this.isEditorVisible.set( false );
		this.isInline.update( v => !v );

		setTimeout( () => this.isEditorVisible.set( true ) );
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
