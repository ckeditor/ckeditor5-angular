/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { Component, ViewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CKEditorError, type EditorConfig, type MultiRootEditor } from 'ckeditor5';
import { AngularMultiRootEditor } from 'src/editor/multi-root-editor';

import { CKEditorMultiRootComponent } from './ckeditor-multi-root.component';
import { CKEditorMultiRootEditableComponent } from './ckeditor-multi-root-editable.component';
import { CKEditorMultiRootMenuBarComponent, CKEditorMultiRootToolbarComponent } from './ckeditor-multi-root-ui-element';
import type { MultiRootEditableOptions, MultiRootEditorData, MultiRootEditorRootsAttributes } from './types';

const INITIAL_DATA: MultiRootEditorData = {
	intro: '<p>Intro</p>',
	content: '<p>Content</p>'
};

@Component( {
	imports: [
		CKEditorMultiRootComponent,
		CKEditorMultiRootEditableComponent,
		CKEditorMultiRootMenuBarComponent,
		CKEditorMultiRootToolbarComponent
	],
	template: `
		<ckeditor-multi-root
			#multiRoot
			[editor]="Editor"
			[config]="config"
			[(data)]="data"
			[(rootsAttributes)]="rootsAttributes"
			[disabled]="disabled"
			[disableTwoWayDataBinding]="disableTwoWayDataBinding"
			(ready)="onReady( $event )"
			(change)="changes.push( $event )"
			(focus)="focusEvents.push( $event )"
			(blur)="blurEvents.push( $event )"
			(error)="errors.push( $event )"
			(dataChange)="dataChanges.push( $event )"
			(rootsAttributesChange)="rootsAttributesChanges.push( $event )"
		>
			<div class="toolbar-container">
				<ckeditor-multi-root-toolbar />
			</div>

			@for ( rootName of multiRoot.roots(); track rootName ) {
				<ckeditor-multi-root-editable
					[rootName]="rootName"
					[editableOptions]="editableOptions[ rootName ] ?? null"
					[attr.data-root]="rootName"
				/>
			}
		</ckeditor-multi-root>
	`
} )
class CustomLayoutComponent {
	@ViewChild( 'multiRoot', { static: true } ) public multiRoot!: CKEditorMultiRootComponent;

	public Editor: any = AngularMultiRootEditor;
	public config: EditorConfig = { licenseKey: 'GPL' };
	public data: MultiRootEditorData = { ...INITIAL_DATA };
	public rootsAttributes: MultiRootEditorRootsAttributes = {};
	public disabled = false;
	public disableTwoWayDataBinding = false;
	public editableOptions: Record<string, MultiRootEditableOptions> = {};

	public changes: Array<unknown> = [];
	public focusEvents: Array<unknown> = [];
	public blurEvents: Array<unknown> = [];
	public errors: Array<unknown> = [];
	public dataChanges: Array<MultiRootEditorData> = [];
	public rootsAttributesChanges: Array<MultiRootEditorRootsAttributes> = [];

	public readonly ready: Promise<MultiRootEditor>;

	private resolveReady!: ( editor: MultiRootEditor ) => void;

	constructor() {
		this.ready = new Promise( resolve => {
			this.resolveReady = resolve;
		} );
	}

	public onReady( editor: MultiRootEditor ): void {
		this.resolveReady( editor );
	}
}

@Component( {
	imports: [ CKEditorMultiRootComponent ],
	template: '<ckeditor-multi-root #multiRoot [editor]="Editor" [config]="config" [data]="data" (ready)="onReady( $event )" />'
} )
class DefaultLayoutComponent {
	@ViewChild( 'multiRoot', { static: true } ) public multiRoot!: CKEditorMultiRootComponent;

	public Editor: any = AngularMultiRootEditor;
	public config: EditorConfig = { licenseKey: 'GPL' };
	public data: MultiRootEditorData = { ...INITIAL_DATA };

	public readonly ready: Promise<MultiRootEditor>;

	private resolveReady!: ( editor: MultiRootEditor ) => void;

	constructor() {
		this.ready = new Promise( resolve => {
			this.resolveReady = resolve;
		} );
	}

	public onReady( editor: MultiRootEditor ): void {
		this.resolveReady( editor );
	}
}

@Component( {
	imports: [
		CKEditorMultiRootComponent,
		CKEditorMultiRootEditableComponent,
		CKEditorMultiRootMenuBarComponent,
		CKEditorMultiRootToolbarComponent
	],
	template: `
		<ckeditor-multi-root [editor]="Editor" [config]="config" [data]="data" (ready)="editor = $event">
			<span class="inside"></span>
		</ckeditor-multi-root>

		<div class="outside">
			<ckeditor-multi-root-menu-bar [editor]="editor" />
			<ckeditor-multi-root-toolbar [editor]="editor" />

			@for ( rootName of rootNames; track rootName ) {
				<ckeditor-multi-root-editable [editor]="editor" [rootName]="rootName" [attr.data-root]="rootName" />
			}
		</div>
	`
} )
class OutsideLayoutComponent {
	public Editor: any = AngularMultiRootEditor;
	public config: EditorConfig = { licenseKey: 'GPL' };
	public data: MultiRootEditorData = { ...INITIAL_DATA };
	public editor: MultiRootEditor | null = null;
	public rootNames: Array<string> = [ 'intro', 'content' ];
}

describe( 'CKEditorMultiRootComponent', () => {
	afterEach( () => {
		vi.unstubAllGlobals();
	} );

	describe( 'version check', () => {
		it( 'should print a warning if using CKEditor 5 in version lower than 49', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '30.0.0' );
			vi.spyOn( console, 'warn' ).mockImplementation( () => {} );

			const fixture = TestBed.createComponent( CKEditorMultiRootComponent );

			expect( console.warn ).toHaveBeenCalledWith(
				'The <CKEditor> component requires using CKEditor 5 in version 49+ or nightly build.'
			);

			fixture.destroy();
		} );
	} );

	describe( 'custom layout', () => {
		let fixture: ComponentFixture<CustomLayoutComponent>;
		let host: CustomLayoutComponent;

		beforeEach( () => {
			fixture = TestBed.createComponent( CustomLayoutComponent );
			host = fixture.componentInstance;
		} );

		afterEach( () => {
			fixture.destroy();
		} );

		async function render(): Promise<MultiRootEditor> {
			detectChanges( fixture );

			const editor = await host.ready;

			await settle();

			return editor;
		}

		async function settle(): Promise<void> {
			detectChanges( fixture );
			await fixture.whenStable();
			detectChanges( fixture );
		}

		function getEditable( rootName: string ): HTMLElement | null {
			return fixture.nativeElement.querySelector( `[data-root="${ rootName }"] .ck-editor__editable` );
		}

		it( 'should list the roots of the data before the editor is ready', () => {
			detectChanges( fixture );

			expect( host.multiRoot.roots() ).toEqual( [ 'intro', 'content' ] );
			expect( host.multiRoot.instance() ).toBeNull();
			expect( host.multiRoot.editorInstance ).toBeNull();
		} );

		it( 'should create the editor with the data and render an editable for every root', async () => {
			const editor = await render();

			expect( host.multiRoot.editorInstance ).toBe( editor );
			expect( host.multiRoot.instance() ).toBe( editor );
			expect( editor.getFullData() ).toEqual( INITIAL_DATA );

			expect( getEditable( 'intro' )!.innerHTML ).toContain( 'Intro' );
			expect( getEditable( 'content' )!.innerHTML ).toContain( 'Content' );
			expect( editor.ui.getEditableElement( 'intro' ) ).toBe( getEditable( 'intro' ) );
		} );

		it( 'should render the toolbar', async () => {
			const editor = await render();

			expect( fixture.nativeElement.querySelector( '.toolbar-container' ).contains( editor.ui.view.toolbar.element ) ).toBe( true );
		} );

		it( 'should create the editor with the roots attributes', async () => {
			host.rootsAttributes = { intro: { order: 10 }, content: { order: 20 } };

			const editor = await render();

			expect( editor.getRootAttributes( 'intro' ) ).toMatchObject( { order: 10 } );
			expect( host.multiRoot.rootsAttributes.content ).toMatchObject( { order: 20 } );
		} );

		it( 'should not emit the data the editor was created with', async () => {
			await render();

			expect( host.dataChanges ).toEqual( [] );
			expect( host.rootsAttributesChanges ).toEqual( [] );
		} );

		describe( 'editor to application', () => {
			it( 'should emit the data of the changed root', async () => {
				const editor = await render();

				editor.data.set( { intro: '<p>Changed</p>' } );

				expect( host.dataChanges ).toEqual( [ { intro: '<p>Changed</p>', content: '<p>Content</p>' } ] );
				expect( host.data ).toEqual( { intro: '<p>Changed</p>', content: '<p>Content</p>' } );
				expect( host.changes.length ).toBe( 1 );
				expect( ( host.changes[ 0 ] as any ).editor ).toBe( editor );
			} );

			it( 'should only read the roots the change touched', async () => {
				const editor = await render();
				const getData = vi.spyOn( editor, 'getData' );

				editor.model.change( writer => {
					writer.insertText( 'Foo', editor.model.document.getRoot( 'content' )!.getChild( 0 ) as any, 0 );
				} );

				expect( getData ).toHaveBeenCalledTimes( 1 );
				expect( getData ).toHaveBeenCalledWith( { rootName: 'content' } );
				expect( host.data.content ).toBe( '<p>FooContent</p>' );
			} );

			it( 'should read the root that an attribute changed in', async () => {
				const editor = await render();

				const paragraph = editor.model.document.getRoot( 'intro' )!.getChild( 0 ) as any;

				editor.model.change( writer => {
					writer.setAttribute( 'bold', true, writer.createRangeIn( paragraph ) );
				} );

				expect( host.data.intro ).toBe( '<p><strong>Intro</strong></p>' );
			} );

			it( 'should emit the attributes of the changed root', async () => {
				const editor = await render();

				editor.model.change( writer => {
					editor.registerRootAttribute( 'order' );
					writer.setAttribute( 'order', 30, editor.model.document.getRoot( 'content' )! );
				} );

				expect( host.rootsAttributesChanges.length ).toBe( 1 );
				expect( host.rootsAttributes.content ).toMatchObject( { order: 30 } );
				expect( host.dataChanges ).toEqual( [] );
			} );

			it( 'should not emit a change that does not touch the data or the attributes', async () => {
				const editor = await render();

				editor.model.change( writer => {
					writer.addMarker( 'foo', {
						range: writer.createRangeIn( editor.model.document.getRoot( 'intro' )! ),
						usingOperation: true,
						affectsData: true
					} );
				} );

				expect( host.changes.length ).toBe( 1 );
				expect( host.dataChanges ).toEqual( [] );
				expect( host.rootsAttributesChanges ).toEqual( [] );
			} );

			it( 'should not push the emitted data back into the editor', async () => {
				const editor = await render();

				editor.data.set( { intro: '<p>Changed</p>' } );

				const getFullData = vi.spyOn( editor, 'getFullData' );

				await settle();

				expect( getFullData ).not.toHaveBeenCalled();
			} );

			it( 'should emit nothing when the two-way data binding is disabled, but keep the roots listed', async () => {
				host.disableTwoWayDataBinding = true;

				const editor = await render();

				editor.data.set( { intro: '<p>Changed</p>' } );
				editor.addRoot( 'outro', { initialData: '<p>Outro</p>' } );

				expect( host.dataChanges ).toEqual( [] );
				expect( host.rootsAttributesChanges ).toEqual( [] );
				expect( host.changes.length ).toBe( 2 );
				expect( host.multiRoot.roots() ).toEqual( [ 'intro', 'content', 'outro' ] );
			} );

			it( 'should emit the focus and blur events', async () => {
				const editor = await render();
				const viewDocument = editor.editing.view.document;

				viewDocument.fire( 'focus', { domTarget: getEditable( 'intro' ) } as any );
				viewDocument.fire( 'blur', { domTarget: getEditable( 'intro' ) } as any );

				expect( host.focusEvents.length ).toBe( 1 );
				expect( host.blurEvents.length ).toBe( 1 );
				expect( ( host.focusEvents[ 0 ] as any ).editor ).toBe( editor );
				expect( ( host.blurEvents[ 0 ] as any ).editor ).toBe( editor );
			} );
		} );

		describe( 'application to editor', () => {
			it( 'should set the data of the changed roots', async () => {
				const editor = await render();

				host.data = { intro: '<p>New intro</p>', content: '<p>Content</p>' };
				await settle();

				expect( editor.getFullData() ).toEqual( { intro: '<p>New intro</p>', content: '<p>Content</p>' } );
				expect( getEditable( 'intro' )!.innerHTML ).toContain( 'New intro' );
				expect( host.dataChanges ).toEqual( [] );
			} );

			it( 'should add and detach roots, and render their editables', async () => {
				const editor = await render();

				host.data = { content: '<p>Content</p>', outro: '<p>Outro</p>' };
				await settle();

				expect( editor.model.document.getRootNames() ).toEqual( [ 'content', 'outro' ] );
				expect( host.multiRoot.roots() ).toEqual( [ 'content', 'outro' ] );
				expect( getEditable( 'intro' ) ).toBeNull();
				expect( getEditable( 'outro' )!.innerHTML ).toContain( 'Outro' );
				expect( host.dataChanges ).toEqual( [] );
			} );

			it( 'should emit the attributes of the roots that the data added or detached, but not the data', async () => {
				host.rootsAttributes = { intro: { order: 10 }, content: { order: 20 } };

				const editor = await render();

				const consoleError = vi.spyOn( console, 'error' );

				host.data = { content: '<p>Content</p>', outro: '<p>Outro</p>' };
				await settle();

				expect( consoleError ).not.toHaveBeenCalled();
				expect( editor.model.document.getRootNames() ).toEqual( [ 'content', 'outro' ] );
				expect( host.dataChanges ).toEqual( [] );
				expect( host.rootsAttributesChanges.length ).toBe( 1 );
				expect( Object.keys( host.rootsAttributes ) ).toEqual( [ 'content', 'outro' ] );
				expect( host.rootsAttributes.content ).toMatchObject( { order: 20 } );
				expect( host.rootsAttributes.outro ).toEqual( editor.getRootAttributes( 'outro' ) );

				// The emitted object comes back through `[(rootsAttributes)]`, and must not be pushed into the editor.
				const change = vi.spyOn( editor.model, 'change' );

				await settle();

				expect( change ).not.toHaveBeenCalled();
			} );

			it( 'should emit the data of a root added after the data was set to null', async () => {
				await render();

				host.data = null as any;
				await settle();

				await host.multiRoot.addRoot( { name: 'outro', data: '<p>Outro</p>' } );
				await settle();

				expect( host.data ).toEqual( { outro: '<p>Outro</p>' } );
			} );

			it( 'should emit the attributes of all roots after the attributes were set to null', async () => {
				host.rootsAttributes = { intro: { order: 10 } };

				const editor = await render();

				host.rootsAttributes = null as any;
				await settle();

				editor.data.set( { intro: '<p>Changed</p>' } );
				await settle();

				expect( Object.keys( host.rootsAttributes ) ).toEqual( [ 'intro', 'content' ] );
				expect( host.rootsAttributes.intro ).toMatchObject( { order: 10 } );
			} );

			it( 'should not emit the attributes when the data changed without adding or detaching roots', async () => {
				await render();

				host.data = { intro: '<p>New intro</p>', content: '<p>Content</p>' };
				await settle();

				expect( host.rootsAttributesChanges ).toEqual( [] );
			} );

			it( 'should not emit the attributes of the roots that the data added when the two-way data binding is disabled', async () => {
				host.disableTwoWayDataBinding = true;

				const editor = await render();

				host.data = { ...INITIAL_DATA, outro: '<p>Outro</p>' };
				await settle();

				expect( editor.model.document.getRootNames() ).toEqual( [ 'intro', 'content', 'outro' ] );
				expect( host.rootsAttributesChanges ).toEqual( [] );
			} );

			it( 'should add a root with its attributes', async () => {
				const editor = await render();

				host.data = { ...INITIAL_DATA, outro: '<p>Outro</p>' };
				host.rootsAttributes = { ...host.rootsAttributes, outro: { order: 30 } };
				await settle();

				expect( editor.getRootAttributes( 'outro' ) ).toMatchObject( { order: 30 } );
			} );

			it( 'should set the attributes of the kept roots only, when the data and the attributes change together', async () => {
				const editor = await render();
				const setAttribute = vi.fn();

				editor.model.on( 'applyOperation', ( evt, [ operation ] ) => {
					if ( operation.type == 'changeRootAttribute' || operation.type == 'addRootAttribute' ) {
						setAttribute( ( operation as any ).root.rootName, ( operation as any ).key );
					}
				} );

				host.data = { content: '<p>Content</p>' };
				host.rootsAttributes = { intro: { order: 10 }, content: { order: 20 } };
				await settle();

				expect( editor.model.document.getRootNames() ).toEqual( [ 'content' ] );
				expect( editor.getRootAttributes( 'content' ) ).toMatchObject( { order: 20 } );
				expect( setAttribute ).toHaveBeenCalledExactlyOnceWith( 'content', 'order' );
			} );

			it( 'should set the changed attributes, and remove the missing ones, but not the ones of the editor', async () => {
				host.rootsAttributes = { intro: { order: 10, row: 1 }, content: { order: 20 } };

				const editor = await render();

				host.rootsAttributes = { intro: { order: 15 }, content: { order: 20 } };
				await settle();

				// The editor reports every registered attribute, the ones a root does not have as `null`.
				expect( editor.getRootAttributes( 'intro' ) ).toEqual( { order: 15, row: null, $rootEditableOptions: {} } );
				expect( editor.getRootAttributes( 'content' ) ).toEqual( { order: 20, row: null, $rootEditableOptions: {} } );
				expect( host.rootsAttributesChanges ).toEqual( [] );
			} );

			it( 'should remove the attributes set to null', async () => {
				host.rootsAttributes = { intro: { order: 10 } };

				const editor = await render();

				host.rootsAttributes = { intro: { order: null } };
				await settle();

				expect( editor.getRootAttributes( 'intro' ) ).toEqual( { order: null, $rootEditableOptions: {} } );
				expect( editor.model.document.getRoot( 'intro' )!.hasAttribute( 'order' ) ).toBe( false );
			} );

			it( 'should leave the attributes alone when they are set to null', async () => {
				host.rootsAttributes = { intro: { order: 10 } };

				const editor = await render();

				host.rootsAttributes = null as any;
				await settle();

				expect( editor.getRootAttributes( 'intro' ) ).toMatchObject( { order: 10 } );
			} );

			it( 'should not push the data when only the attributes changed, so that the edits survive ' +
				'with the two-way data binding disabled', async () => {
				host.disableTwoWayDataBinding = true;

				const editor = await render();

				editor.data.set( { intro: '<p>Typed</p>' } );
				await host.multiRoot.addRoot( { name: 'outro', data: '<p>Outro</p>' } );
				await settle();

				host.rootsAttributes = { intro: { order: 10 } };
				await settle();

				expect( editor.getFullData() ).toEqual( {
					intro: '<p>Typed</p>',
					content: '<p>Content</p>',
					outro: '<p>Outro</p>'
				} );
				expect( editor.getRootAttributes( 'intro' ) ).toMatchObject( { order: 10 } );
				expect( editor.getRootAttributes( 'outro' ) ).toMatchObject( { order: null } );
			} );

			it( 'should not push the attributes when only the data changed, so that the edits survive ' +
				'with the two-way data binding disabled', async () => {
				host.disableTwoWayDataBinding = true;
				host.rootsAttributes = { intro: { order: 10 } };

				const editor = await render();

				editor.model.change( writer => {
					writer.setAttribute( 'order', 15, editor.model.document.getRoot( 'intro' )! );
				} );
				await settle();

				host.data = { intro: '<p>New intro</p>', content: '<p>Content</p>' };
				await settle();

				expect( editor.getData( { rootName: 'intro' } ) ).toBe( '<p>New intro</p>' );
				expect( editor.getRootAttributes( 'intro' ) ).toMatchObject( { order: 15 } );
			} );

			it( 'should ignore the attributes of roots that are not in the data', async () => {
				const editor = await render();

				host.rootsAttributes = { intro: undefined as any, unknown: { order: 10 } };
				await settle();

				expect( editor.model.document.getRoot( 'unknown' ) ).toBeNull();
				expect( editor.getRootAttributes( 'intro' ) ).toEqual( { $rootEditableOptions: {} } );
			} );

			it( 'should do nothing when the data matches the editor', async () => {
				const editor = await render();
				const change = vi.spyOn( editor.model, 'change' );

				host.data = { ...INITIAL_DATA };
				await settle();

				expect( change ).toHaveBeenCalledTimes( 1 );
				expect( host.changes ).toEqual( [] );
			} );

			it( 'should detach all roots when the data is set to null', async () => {
				const editor = await render();

				host.data = null as any;
				await settle();

				expect( editor.model.document.getRootNames() ).toEqual( [] );
			} );

			it( 'should push the data that changed while the editor was starting', async () => {
				detectChanges( fixture );

				host.data = { intro: '<p>Changed early</p>' };
				detectChanges( fixture );

				expect( host.multiRoot.roots() ).toEqual( [ 'intro' ] );

				const editor = await host.ready;

				expect( editor.getFullData() ).toEqual( { intro: '<p>Changed early</p>' } );
			} );

			it( 'should list no roots when the data is set to null before the editor is ready', () => {
				host.data = null as any;
				detectChanges( fixture );

				expect( host.multiRoot.roots() ).toEqual( [] );
			} );

			it( 'should push the attributes that changed while the editor was starting', async () => {
				detectChanges( fixture );

				host.rootsAttributes = { intro: { order: 10 } };
				detectChanges( fixture );

				const editor = await host.ready;

				expect( editor.getRootAttributes( 'intro' ) ).toMatchObject( { order: 10 } );
			} );
		} );

		describe( 'addRoot()', () => {
			it( 'should add a root, and render its editable', async () => {
				const editor = await render();

				await host.multiRoot.addRoot( { name: 'outro', data: '<p>Outro</p>', attributes: { order: 30 } } );
				await settle();

				expect( editor.getData( { rootName: 'outro' } ) ).toBe( '<p>Outro</p>' );
				expect( getEditable( 'outro' )!.innerHTML ).toContain( 'Outro' );
				expect( host.data.outro ).toBe( '<p>Outro</p>' );
				expect( host.rootsAttributes.outro ).toMatchObject( { order: 30 } );
			} );

			it( 'should add an empty root by default', async () => {
				const editor = await render();

				await host.multiRoot.addRoot( { name: 'outro' } );

				expect( editor.getData( { rootName: 'outro' } ) ).toBe( '' );
			} );

			it( 'should create the editable from the editable options stored in the root', async () => {
				const editor = await render();

				await host.multiRoot.addRoot( {
					name: 'title',
					data: 'Title',
					modelElement: '$inlineRoot',
					editableOptions: {
						element: { name: 'h1', classes: 'title' },
						placeholder: 'Type the title',
						label: 'Title'
					}
				} );
				await settle();

				const editable = getEditable( 'title' )!;

				expect( editable.tagName ).toBe( 'H1' );
				expect( editable.classList.contains( 'title' ) ).toBe( true );
				expect( editable.getAttribute( 'aria-label' ) ).toBe( 'Title' );
				expect( editor.getData( { rootName: 'title' } ) ).toBe( 'Title' );
			} );

			it( 'should be undoable', async () => {
				const editor = await render();

				await host.multiRoot.addRoot( { name: 'outro' } );
				await settle();

				editor.execute( 'undo' );
				await settle();

				expect( host.multiRoot.roots() ).toEqual( [ 'intro', 'content' ] );
				expect( getEditable( 'outro' ) ).toBeNull();
				expect( host.data ).toEqual( INITIAL_DATA );
			} );

			it( 'should wait for the editor', async () => {
				detectChanges( fixture );

				await host.multiRoot.addRoot( { name: 'outro', data: '<p>Outro</p>' } );

				expect( host.multiRoot.editorInstance!.getData( { rootName: 'outro' } ) ).toBe( '<p>Outro</p>' );
			} );

			it( 'should reject once the component is destroyed', async () => {
				await render();

				fixture.destroy();

				await expect( host.multiRoot.addRoot( { name: 'outro' } ) ).rejects.toThrow( 'was destroyed' );
			} );

			it( 'should reject when the component is destroyed before the editor is ready', async () => {
				detectChanges( fixture );

				const adding = host.multiRoot.addRoot( { name: 'outro' } );

				fixture.destroy();

				await expect( adding ).rejects.toThrow( 'was destroyed' );
			} );
		} );

		describe( 'removeRoot()', () => {
			it( 'should detach a root, and remove its editable', async () => {
				const editor = await render();

				await host.multiRoot.removeRoot( 'intro' );
				await settle();

				expect( editor.model.document.getRootNames() ).toEqual( [ 'content' ] );
				expect( getEditable( 'intro' ) ).toBeNull();
				expect( host.data ).toEqual( { content: '<p>Content</p>' } );
				expect( Object.keys( host.rootsAttributes ) ).toEqual( [ 'content' ] );
			} );

			it( 'should be undoable, and bring the editable back', async () => {
				const editor = await render();

				await host.multiRoot.removeRoot( 'intro' );
				await settle();

				editor.execute( 'undo' );
				await settle();

				expect( host.multiRoot.roots() ).toEqual( [ 'intro', 'content' ] );
				expect( getEditable( 'intro' )!.innerHTML ).toContain( 'Intro' );
				expect( host.data ).toEqual( INITIAL_DATA );
			} );
		} );

		describe( 'disabled state', () => {
			it( 'should switch the editor to read-only mode', async () => {
				const editor = await render();

				expect( host.multiRoot.disabled ).toBe( false );

				host.disabled = true;
				detectChanges( fixture );

				expect( editor.isReadOnly ).toBe( true );
				expect( host.multiRoot.disabled ).toBe( true );

				host.disabled = false;
				detectChanges( fixture );

				expect( editor.isReadOnly ).toBe( false );
			} );

			it( 'should start the editor in read-only mode', async () => {
				host.disabled = true;
				detectChanges( fixture );

				expect( host.multiRoot.disabled ).toBe( true );

				const editor = await host.ready;

				expect( editor.isReadOnly ).toBe( true );
			} );
		} );

		describe( 'editable', () => {
			it( 'should prefer the editable options of the component', async () => {
				host.editableOptions = { intro: { element: 'section', label: 'Intro label' } };

				await render();

				const editable = getEditable( 'intro' )!;

				expect( editable.tagName ).toBe( 'SECTION' );
				expect( editable.getAttribute( 'aria-label' ) ).toBe( 'Intro label' );
			} );

			it( 'should recreate the editable when the editable options change', async () => {
				const editor = await render();
				const previous = getEditable( 'intro' );

				host.editableOptions = { intro: { element: 'section' } };
				await settle();

				expect( previous!.isConnected ).toBe( false );
				expect( getEditable( 'intro' )!.tagName ).toBe( 'SECTION' );
				expect( editor.ui.getEditableElement( 'intro' ) ).toBe( getEditable( 'intro' ) );
			} );

			it( 'should not recreate the other editables when a root is added', async () => {
				await render();
				const intro = getEditable( 'intro' );

				await host.multiRoot.addRoot( { name: 'outro' } );
				await settle();

				expect( getEditable( 'intro' ) ).toBe( intro );
			} );
		} );
	} );

	describe( 'default layout', () => {
		let fixture: ComponentFixture<DefaultLayoutComponent>;
		let host: DefaultLayoutComponent;

		beforeEach( () => {
			fixture = TestBed.createComponent( DefaultLayoutComponent );
			host = fixture.componentInstance;
		} );

		afterEach( () => {
			fixture.destroy();
		} );

		async function render(): Promise<MultiRootEditor> {
			detectChanges( fixture );

			const editor = await host.ready;

			detectChanges( fixture );
			await fixture.whenStable();
			detectChanges( fixture );

			return editor;
		}

		it( 'should render the toolbar and the editables of all roots', async () => {
			const editor = await render();
			const element: HTMLElement = fixture.nativeElement;

			expect( element.querySelector( 'ckeditor-multi-root-toolbar' )!.contains( editor.ui.view.toolbar.element ) ).toBe( true );
			expect( element.querySelector( 'ckeditor-multi-root-menu-bar' ) ).toBeNull();

			const editables = element.querySelectorAll( 'ckeditor-multi-root-editable .ck-editor__editable' );

			expect( editables.length ).toBe( 2 );
			expect( editables[ 0 ].innerHTML ).toContain( 'Intro' );
			expect( editables[ 1 ].innerHTML ).toContain( 'Content' );
		} );

		it( 'should render the menu bar when it is enabled in the configuration', async () => {
			host.config = { licenseKey: 'GPL', menuBar: { isVisible: true } };

			const editor = await render();
			const menuBar = fixture.nativeElement.querySelector( 'ckeditor-multi-root-menu-bar' );

			expect( menuBar.contains( editor.ui.view.menuBarView.element ) ).toBe( true );
		} );

		it( 'should use the GPL license key by default', () => {
			const component = TestBed.createComponent( CKEditorMultiRootComponent );

			expect( component.componentInstance.config.licenseKey ).toBe( window.CKEDITOR_GLOBAL_LICENSE_KEY || 'GPL' );

			component.destroy();
		} );
	} );

	describe( 'components outside of <ckeditor-multi-root>', () => {
		let fixture: ComponentFixture<OutsideLayoutComponent>;
		let host: OutsideLayoutComponent;

		beforeEach( () => {
			fixture = TestBed.createComponent( OutsideLayoutComponent );
			host = fixture.componentInstance;
		} );

		afterEach( () => {
			fixture.destroy();
		} );

		async function settle(): Promise<void> {
			detectChanges( fixture );
			await fixture.whenStable();
			detectChanges( fixture );
		}

		async function waitForEditor(): Promise<MultiRootEditor> {
			detectChanges( fixture );

			await vi.waitFor( () => {
				if ( !host.editor ) {
					throw new Error( 'Not ready yet.' );
				}
			} );

			await settle();

			return host.editor!;
		}

		it( 'should take the editor from the input', async () => {
			const editor = await waitForEditor();
			const outside: HTMLElement = fixture.nativeElement.querySelector( '.outside' );

			expect( outside.querySelector( 'ckeditor-multi-root-toolbar' )!.contains( editor.ui.view.toolbar.element ) ).toBe( true );
			expect( outside.querySelector( 'ckeditor-multi-root-menu-bar' )!.contains( editor.ui.view.menuBarView.element ) ).toBe( true );
			expect( outside.querySelector( '[data-root="intro"] .ck-editor__editable' )!.innerHTML ).toContain( 'Intro' );
		} );

		it( 'should not render the default layout when the component has content', async () => {
			await waitForEditor();

			const multiRoot: HTMLElement = fixture.nativeElement.querySelector( 'ckeditor-multi-root' );

			expect( multiRoot.querySelector( '.inside' ) ).not.toBeNull();
			expect( multiRoot.querySelector( 'ckeditor-multi-root-toolbar' ) ).toBeNull();
		} );

		it( 'should render nothing for a root the editor does not have', async () => {
			await waitForEditor();

			host.rootNames = [ 'intro', 'unknown' ];
			await settle();

			expect( fixture.nativeElement.querySelector( '[data-root="unknown"]' ).children.length ).toBe( 0 );
		} );

		it( 'should render nothing for a detached root', async () => {
			const editor = await waitForEditor();

			editor.detachRoot( 'content' );
			host.rootNames = [ 'intro' ];
			await settle();

			host.rootNames = [ 'intro', 'content' ];
			await settle();

			expect( fixture.nativeElement.querySelector( '[data-root="content"]' ).children.length ).toBe( 0 );
		} );

		it( 'should leave the UI alone when the editor is gone', async () => {
			const editor = await waitForEditor();
			const toolbar = editor.ui.view.toolbar.element!;

			host.editor = null;
			await settle();

			expect( toolbar.isConnected ).toBe( false );
			expect( fixture.nativeElement.querySelector( '.outside .ck-editor__editable' ) ).toBeNull();
		} );

		it( 'should let another component take over the toolbar and the editable', async () => {
			const editor = await waitForEditor();
			const toolbar = editor.ui.view.toolbar.element!;
			const other = document.createElement( 'div' );

			other.appendChild( toolbar );

			const editable = editor.ui.getEditableElement( 'intro' )!;

			editor.detachEditable( editor.model.document.getRoot( 'intro' )! );
			const replacement = editor.createEditable( editor.model.document.getRoot( 'intro' )! );

			host.rootNames = [ 'content' ];
			host.editor = null;
			await settle();

			expect( other.contains( toolbar ) ).toBe( true );
			expect( editable.isConnected ).toBe( false );
			expect( editor.ui.getEditableElement( 'intro' ) ).toBe( replacement );
		} );

		it( 'should not detach the editables of a destroyed editor', async () => {
			const editor = await waitForEditor();

			await editor.destroy();

			host.rootNames = [];
			await settle();

			expect( fixture.nativeElement.querySelector( '.outside .ck-editor__editable' ) ).toBeNull();
		} );
	} );

	describe( 'errors', () => {
		beforeEach( () => {
			vi.spyOn( console, 'error' ).mockImplementation( () => {} );
		} );

		it( 'should emit an editor that failed to start', async () => {
			const error = new Error( 'Failed to start.' );
			const fixture = TestBed.createComponent( CustomLayoutComponent );

			fixture.componentInstance.Editor = createFailingEditor( error );
			detectChanges( fixture );

			await vi.waitFor( () => {
				expect( fixture.componentInstance.errors ).toEqual( [ error ] );
			} );

			expect( console.error ).not.toHaveBeenCalled();

			// The editor never came, so waiting for it fails.
			await expect( fixture.componentInstance.multiRoot.removeRoot( 'intro' ) ).rejects.toBe( error );

			fixture.destroy();
		} );

		it( 'should log an editor that failed to start when nothing listens to the errors', async () => {
			const error = new Error( 'Failed to start.' );
			const fixture = TestBed.createComponent( DefaultLayoutComponent );

			fixture.componentInstance.Editor = createFailingEditor( error );
			detectChanges( fixture );

			await vi.waitFor( () => {
				expect( console.error ).toHaveBeenCalledWith( error );
			} );

			fixture.destroy();
		} );

		it( 'should emit an error that escaped the running editor', async () => {
			const fixture = TestBed.createComponent( CustomLayoutComponent );

			detectChanges( fixture );

			const editor = await fixture.componentInstance.ready;
			const error = throwFrom( editor );

			await vi.waitFor( () => {
				expect( fixture.componentInstance.errors ).toEqual( [ error ] );
			} );

			fixture.destroy();
		} );

		it( 'should not emit an error that came from another editor', async () => {
			const fixture = TestBed.createComponent( CustomLayoutComponent );

			detectChanges( fixture );

			await fixture.componentInstance.ready;

			const other = await AngularMultiRootEditor.create( { licenseKey: 'GPL', roots: { main: {} } } as any );

			throwFrom( other );
			await waitCycle();

			expect( fixture.componentInstance.errors ).toEqual( [] );

			await other.destroy();
			fixture.destroy();
		} );

		it( 'should stop reporting once the component is destroyed', async () => {
			const fixture = TestBed.createComponent( DefaultLayoutComponent );

			detectChanges( fixture );

			const editor = await fixture.componentInstance.ready;
			const offEditorError = vi.fn();

			( fixture.componentInstance.multiRoot as any ).offEditorError = offEditorError;

			fixture.destroy();
			await waitCycle();

			expect( offEditorError ).toHaveBeenCalledTimes( 1 );
			expect( editor.state ).toBe( 'destroyed' );
		} );
	} );

	describe( 'destroying', () => {
		it( 'should destroy the editor', async () => {
			const fixture = TestBed.createComponent( DefaultLayoutComponent );

			detectChanges( fixture );

			const editor = await fixture.componentInstance.ready;

			fixture.destroy();
			await waitCycle();

			expect( editor.state ).toBe( 'destroyed' );
			expect( fixture.componentInstance.multiRoot.editorInstance ).toBeNull();
			expect( fixture.componentInstance.multiRoot.instance() ).toBeNull();
		} );

		it( 'should destroy an editor that finished starting after the component was destroyed', async () => {
			const fixture = TestBed.createComponent( DefaultLayoutComponent );
			const created: Array<MultiRootEditor> = [];

			fixture.componentInstance.Editor = class extends AngularMultiRootEditor {
				public static override async create( config: any ): Promise<any> {
					const editor = await super.create( config );

					created.push( editor );

					return editor;
				}
			};

			detectChanges( fixture );
			fixture.destroy();

			await vi.waitFor( () => {
				expect( created.length ).toBe( 1 );
				expect( created[ 0 ].state ).toBe( 'destroyed' );
			} );

			expect( fixture.componentInstance.multiRoot.editorInstance ).toBeNull();
		} );

		// The editor that started too late is destroyed inside the pending creation. Should that fail, the rejection
		// must not stop the teardown that is waiting for it.
		it( 'should finish the teardown when the editor that started too late fails to destroy', async () => {
			let finishCreating!: ( editor: any ) => void;

			const fixture = TestBed.createComponent( DefaultLayoutComponent );

			fixture.componentInstance.Editor = class extends AngularMultiRootEditor {
				public static override create(): Promise<any> {
					return new Promise( resolve => {
						finishCreating = resolve;
					} );
				}
			};

			detectChanges( fixture );

			const component = fixture.componentInstance.multiRoot;
			const teardown = component.ngOnDestroy();
			const destroy = vi.fn().mockRejectedValue( new Error( 'Cannot destroy.' ) );

			finishCreating( { destroy } );

			await expect( teardown ).resolves.toBeUndefined();

			expect( destroy ).toHaveBeenCalledOnce();
			expect( component.editorInstance ).toBeNull();

			fixture.destroy();
		} );

		it( 'should not destroy an editor that is already destroyed', async () => {
			const fixture = TestBed.createComponent( DefaultLayoutComponent );

			detectChanges( fixture );

			const editor = await fixture.componentInstance.ready;

			await editor.destroy();

			const destroy = vi.spyOn( editor, 'destroy' );

			fixture.destroy();
			await waitCycle();

			expect( destroy ).not.toHaveBeenCalled();
		} );

		it( 'should give the editables without a DOM element a fake one, so that the editor can be destroyed', async () => {
			const fixture = TestBed.createComponent( DefaultLayoutComponent );

			detectChanges( fixture );

			const editor = await fixture.componentInstance.ready;

			// Detached by the application, without the editable being detached.
			editor.editing.view.detachDomRoot( 'intro' );

			const attachDomRoot = vi.spyOn( editor.editing.view, 'attachDomRoot' );

			await fixture.componentInstance.multiRoot.ngOnDestroy();

			expect( attachDomRoot ).toHaveBeenCalledTimes( 1 );
			expect( attachDomRoot.mock.calls[ 0 ][ 1 ] ).toBe( 'intro' );
			expect( editor.state ).toBe( 'destroyed' );

			fixture.destroy();
		} );
	} );
} );

/**
 * The test hosts keep their state in plain fields, which zoneless change detection does not see changing.
 */
function detectChanges( fixture: ComponentFixture<unknown> ): void {
	fixture.componentRef.changeDetectorRef.markForCheck();
	fixture.detectChanges();
}

function createFailingEditor( error: Error ): any {
	return class extends AngularMultiRootEditor {
		// An `async` method, so that the rejection is a native one. Zone.js would report a rejected `Promise.reject()`
		// as unhandled, because `await` attaches its handler a microtask later.
		public static override async create(): Promise<any> {
			throw error;
		}
	};
}

function throwFrom( editor: MultiRootEditor ): CKEditorError {
	/**
	 * Thrown on purpose by this test, so that there is something to report.
	 *
	 * @error a-custom-error
	 */
	const error = new CKEditorError( 'a-custom-error', editor );

	Promise.resolve().then( () => {
		// The error is meant for the reporter. Swallowing the event keeps the test runner from
		// treating it as an unhandled failure of the run.
		window.addEventListener( 'error', evt => evt.preventDefault(), { capture: true, once: true } );
		window.dispatchEvent( new ErrorEvent( 'error', { error } ) );
	} );

	return error;
}

function waitCycle( time?: number ): Promise<void> {
	return new Promise( resolve => {
		setTimeout( resolve, time );
	} );
}
