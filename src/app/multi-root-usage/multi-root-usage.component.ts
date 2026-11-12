import { Component, signal } from '@angular/core';
import type { MultiRootEditor } from 'ckeditor5';

import type {
	CKEditorMultiRootComponent,
	MultiRootEditorData,
	MultiRootEditorRootsAttributes
} from 'src/ckeditor';
import { AngularMultiRootEditor } from 'src/editor/multi-root-editor';

@Component( {
	selector: 'app-multi-root-usage',
	templateUrl: './multi-root-usage.component.html',
	styleUrls: [ './multi-root-usage.component.css' ],
	standalone: false
} )
export class MultiRootUsageComponent {
	public readonly Editor = AngularMultiRootEditor;

	public readonly isDisabled = signal( false );

	public readonly isInlineRoot = signal( false );

	public data: MultiRootEditorData = {
		intro: '<h2>Sample</h2><p>This is an instance of the multi-root editor type.</p>',
		content: '<p>It is the custom content.</p>',
		outro: '<p>You can use CKEditor Builder to create a custom configuration with your favorite features.</p>'
	};

	public rootsAttributes: MultiRootEditorRootsAttributes = {
		intro: { order: 10 },
		content: { order: 20 },
		outro: { order: 30 }
	};

	public readonly componentEvents: Array<string> = [];

	private nextRootId = 1;

	public toggleDisabled(): void {
		this.isDisabled.update( value => !value );
	}

	public toggleInlineRoot(): void {
		this.isInlineRoot.update( value => !value );
	}

	public async addRoot( multiRoot: CKEditorMultiRootComponent ): Promise<void> {
		const isInline = this.isInlineRoot();
		const id = this.nextRootId++;

		await multiRoot.addRoot( {
			name: `root-${ id }`,
			data: isInline ? `Inline root ${ id }` : `<p>Root ${ id }</p>`,
			attributes: {
				order: ( Object.keys( this.data ).length + 1 ) * 10
			},
			editableOptions: {
				placeholder: `Type something in root ${ id }…`,
				label: `Root ${ id }`,
				element: isInline ? { name: 'span', styles: { display: 'block' } } : 'div'
			},
			...isInline && {
				modelElement: '$inlineRoot'
			}
		} );
	}

	public async removeRoot( multiRoot: CKEditorMultiRootComponent, rootName: string ): Promise<void> {
		await multiRoot.removeRoot( rootName );
	}

	public resetData(): void {
		this.data = {
			intro: '<h2>Reset</h2>',
			content: '<p>The data was replaced from the application.</p>'
		};
	}

	public getOrderedRoots( roots: ReadonlyArray<string> ): Array<string> {
		return [ ...roots ].sort( ( a, b ) => this.getOrder( a ) - this.getOrder( b ) );
	}

	public onReady( editor: MultiRootEditor ): void {
		( window as any ).editor = editor;

		this.componentEvents.push( 'The editor is ready.' );
	}

	public onEditorChange(): void {
		this.componentEvents.push( 'Editor model changed.' );
	}

	public onFocus(): void {
		this.componentEvents.push( 'Focused the editing view.' );
	}

	public onBlur(): void {
		this.componentEvents.push( 'Blurred the editing view.' );
	}

	public onError( error: unknown ): void {
		this.componentEvents.push( 'The editor reported an error.' );
		console.error( error );
	}

	private getOrder( rootName: string ): number {
		const order = this.rootsAttributes[ rootName ]?.order;

		return typeof order === 'number' ? order : 0;
	}
}
