/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MockEditor } from 'src/editor/mock-editor';

import { CKEditorComponent } from './ckeditor.component';
import { AngularIntegrationUsageDataPlugin } from './plugins/angular-integration-usage-data.plugin';
import { EditorElementComponent } from './editor-element.component';

describe( 'CKEditorComponent', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			imports: [ EditorElementComponent ],
			declarations: [ CKEditorComponent ]
		} ).compileComponents();
	} );

	afterEach( () => {
		vi.unstubAllGlobals();
	} );

	describe( 'component initialization', () => {
		beforeEach( () => {
			vi.spyOn( console, 'warn' ).mockImplementation( () => {} );
		} );

		afterEach( () => {
			fixture.destroy();
			vi.unstubAllGlobals();
		} );

		it( 'should create', () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;

			expect( component ).toBeTruthy();
		} );

		it( 'should print a warning if the "window.CKEDITOR_VERSION" variable is not available', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', undefined );

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;

			expect( console.warn ).toHaveBeenCalledWith( 'Cannot find the "CKEDITOR_VERSION" in the "window" scope.' );
		} );

		it( 'should print a warning if using CKEditor 5 in version lower than 49', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '30.0.0' );

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;

			expect( console.warn ).toHaveBeenCalledWith(
				'The <CKEditor> component requires using CKEditor 5 in version 49+ or nightly build.'
			);
		} );

		it( 'should not print any warning if using CKEditor 5 in version 49 or higher', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '49.0.0' );

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;

			expect( console.warn ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'component features', () => {
		beforeEach( async () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;
		} );

		afterEach( () => {
			fixture.destroy();
		} );

		describe( 'disabled state', () => {
			it( 'uses the initial disabled state before editor initialization', () => {
				component.setDisabledState( true );
				expect( component.disabled ).toBeTruthy();

				component.setDisabledState( false );
				expect( component.disabled ).toBeFalsy();
			} );
		} );

		describe( 'getConfig', () => {
			it( 'should return config with AngularIntegrationUsageDataPlugin if non-free license passed', async () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '44.0.0' );

				component.config.licenseKey = 'foo';
				fixture.detectChanges();

				await waitCycle();

				const config = ( component as any ).getConfig();

				expect( config.extraPlugins ).toContain( AngularIntegrationUsageDataPlugin );
			} );

			it( 'should not append AngularIntegrationUsageDataPlugin for the GPL license', async () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '44.0.0' );

				component.config.licenseKey = 'GPL';
				fixture.detectChanges();

				await waitCycle();

				const config = ( component as any ).getConfig();

				expect( config.extraPlugins ).not.toContain( AngularIntegrationUsageDataPlugin );
			} );
		} );

		describe( 'component data', () => {
			it( 'should pass config with initialData when using CKEditor 5 v47', async () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '47.0.0' );

				component.data = 'foo';
				fixture.detectChanges();

				await waitCycle();

				expect( ( component.editorInstance as any ).config.initialData ).toBe( 'foo' );
				expect( ( component.editorInstance as any ).config.roots ).toBeUndefined();
			} );

			it( 'should pass config with roots.main.initialData when using CKEditor 5 v48', async () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '48.0.0' );

				component.data = 'foo';
				fixture.detectChanges();

				await waitCycle();

				expect( ( component.editorInstance as any ).config.roots?.main?.initialData ).toBe( 'foo' );
				expect( ( component.editorInstance as any ).config.initialData ).toBeUndefined();
			} );

			it( 'should return component id', () => {
				expect( component.getId() ).toMatch( /e[0-9a-z]{32}/ );
			} );
		} );

		describe( 'elementDefinition', () => {
			it( 'should return defaultTag if editor has no name or is ClassicEditor', () => {
				component.editor = { ...MockEditor, editorName: undefined } as any;
				component.tagName = 'section';
				expect( component.elementDefinition ).toBe( 'section' );

				component.editor = { ...MockEditor, editorName: 'ClassicEditor' } as any;
				expect( component.elementDefinition ).toBe( 'section' );
			} );

			it( 'should return custom tag from config.roots.main.element if provided for non-classic editor', () => {
				component.editor = { ...MockEditor, editorName: 'DecoupledEditor' } as any;
				component.tagName = 'div';
				component.config = {
					roots: {
						main: {
							element: 'article'
						}
					}
				} as any;

				expect( component.elementDefinition ).toBe( 'article' );
			} );

			it( 'should return custom tag from config.root.element if config.roots.main.element is not provided', () => {
				component.editor = { ...MockEditor, editorName: 'InlineEditor' } as any;
				component.tagName = 'div';
				component.config = {
					root: {
						element: 'aside'
					}
				} as any;

				expect( component.elementDefinition ).toBe( 'aside' );
			} );

			it( 'should fallback to defaultTag if neither roots.main.element nor root.element is provided', () => {
				component.editor = { ...MockEditor, editorName: 'InlineEditor' } as any;
				component.tagName = 'span';
				component.config = {} as any;

				expect( component.elementDefinition ).toBe( 'span' );
			} );
		} );
	} );

	describe( 'destroying the component', () => {
		let pending: ReturnType<typeof createPendingEditor>;

		beforeEach( () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '49.0.0' );
			vi.spyOn( console, 'error' ).mockImplementation( () => {} );

			pending = createPendingEditor();

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = pending.Editor as any;
		} );

		afterEach( () => {
			// Safe to call twice: the fixture ignores a second destroy.
			fixture.destroy();
			vi.restoreAllMocks();
		} );

		describe( 'while the editor is still being created', () => {
			it( 'should destroy the editor once its creation completes', async () => {
				fixture.detectChanges();
				expect( pending.Editor.create ).toHaveBeenCalledTimes( 1 );

				fixture.destroy();
				await waitCycle();

				// Nothing to destroy yet, the creation is still pending.
				expect( pending.instance.destroy ).not.toHaveBeenCalled();

				pending.resolve();
				await waitCycle();

				expect( pending.instance.destroy ).toHaveBeenCalledTimes( 1 );
				expect( pending.instance.state ).toBe( 'destroyed' );
				expect( component.editorInstance ).toBeNull();
			} );

			it( 'should not emit "ready" for an editor whose creation completes after destroy', async () => {
				const readySpy = vi.fn();
				component.ready.subscribe( readySpy );

				fixture.detectChanges();
				fixture.destroy();

				pending.resolve();
				await waitCycle();

				expect( readySpy ).not.toHaveBeenCalled();
			} );

			it( 'should not integrate an editor whose creation completes after destroy', async () => {
				fixture.detectChanges();
				fixture.destroy();

				pending.resolve();
				await waitCycle();

				expect( pending.Editor.onEditorError ).not.toHaveBeenCalled();
				expect( pending.instance.model.document.on ).not.toHaveBeenCalled();
				expect( pending.instance.editing.view.document.on ).not.toHaveBeenCalled();
			} );

			it( 'should not report a creation failure after destroy', async () => {
				const errorSpy = vi.fn();
				component.error.subscribe( errorSpy );

				fixture.detectChanges();
				fixture.destroy();

				pending.reject( new Error( 'Creation failed.' ) );
				await waitCycle();

				expect( errorSpy ).not.toHaveBeenCalled();
				expect( console.error ).not.toHaveBeenCalled();
			} );

			it( 'should keep the editor element attached to a parent until the creation completes', async () => {
				fixture.detectChanges();

				const element: HTMLElement = ( component as any ).editorElementComponent.element;

				fixture.destroy();
				await waitCycle();

				// `ElementReplacer#replace()` in `ClassicEditorUI#init()` inserts the editor UI next to this
				// element, so a creation still running at this point needs it to have a parent.
				expect( element.parentNode ).not.toBeNull();

				pending.resolve();
				await waitCycle();

				expect( pending.instance.destroy ).toHaveBeenCalledTimes( 1 );

				// Removed only after the editor created for nobody has been destroyed.
				expect( element.parentNode ).toBeNull();
			} );

			it( 'should remove the editor element once a failed creation settles', async () => {
				fixture.detectChanges();

				const element: HTMLElement = ( component as any ).editorElementComponent.element;

				fixture.destroy();
				await waitCycle();

				expect( element.parentNode ).not.toBeNull();

				pending.reject( new Error( 'Creation failed.' ) );
				await waitCycle();

				expect( element.parentNode ).toBeNull();
			} );
		} );

		describe( 'while the component is alive', () => {
			it( 'should still report a creation failure', async () => {
				const error = new Error( 'Creation failed.' );
				const errorSpy = vi.fn();
				component.error.subscribe( errorSpy );

				fixture.detectChanges();

				pending.reject( error );
				await waitCycle();

				expect( errorSpy ).toHaveBeenCalledWith( error );
			} );

			it( 'should print a creation failure to the console when nothing listens to "error"', async () => {
				const error = new Error( 'Creation failed.' );

				fixture.detectChanges();

				pending.reject( error );
				await waitCycle();

				expect( console.error ).toHaveBeenCalledWith( error );
			} );
		} );

		describe( 'after the editor is ready', () => {
			it( 'should destroy the editor and unregister the error callback', async () => {
				const readySpy = vi.fn();
				component.ready.subscribe( readySpy );

				fixture.detectChanges();

				pending.resolve();
				await waitCycle();

				expect( readySpy ).toHaveBeenCalledWith( pending.instance );
				expect( component.editorInstance ).toBe( pending.instance );

				fixture.destroy();
				await waitCycle();

				expect( pending.offEditorError ).toHaveBeenCalledTimes( 1 );
				expect( pending.instance.destroy ).toHaveBeenCalledTimes( 1 );
				expect( component.editorInstance ).toBeNull();
			} );

			it( 'should not destroy an editor that is already destroyed (e.g. together with its context)', async () => {
				fixture.detectChanges();

				pending.resolve();
				await waitCycle();

				pending.instance.state = 'destroyed';

				fixture.destroy();
				await waitCycle();

				expect( pending.instance.destroy ).not.toHaveBeenCalled();
				expect( pending.offEditorError ).toHaveBeenCalledTimes( 1 );
				expect( component.editorInstance ).toBeNull();
			} );
		} );
	} );
} );

function waitCycle( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}

/**
 * An editor class whose `create()` settles only when the test says so, to make the window
 * between starting the creation and `ready` controllable.
 */
function createPendingEditor() {
	let settle: { resolve: () => void; reject: ( error: unknown ) => void } | undefined;

	const offEditorError = vi.fn();

	const instance = {
		state: 'initializing' as 'initializing' | 'ready' | 'destroyed',
		isReadOnly: false,
		model: { document: { on: vi.fn() } },
		editing: { view: { document: { on: vi.fn() } } },
		data: { get: vi.fn( () => '' ), set: vi.fn() },
		enableReadOnlyMode: vi.fn(),
		disableReadOnlyMode: vi.fn(),
		destroy: vi.fn( async () => {
			instance.state = 'destroyed';
		} )
	};

	const Editor = {
		editorName: 'ClassicEditor',
		create: vi.fn( () => new Promise( ( resolve, reject ) => {
			settle = {
				resolve: () => {
					instance.state = 'ready';
					resolve( instance );
				},
				reject
			};
		} ) ),
		onEditorError: vi.fn( () => offEditorError )
	};

	return {
		Editor,
		instance,
		offEditorError,
		resolve: () => settle!.resolve(),
		reject: ( error: unknown ) => settle!.reject( error )
	};
}
