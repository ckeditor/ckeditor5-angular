/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ApplicationRef, Component, SimpleChange, ViewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CKEditorError } from 'ckeditor5';
import { AngularEditor } from 'src/editor/editor';

import { CKEditorComponent } from './ckeditor.component';
import { EditorElementComponent } from './editor-element.component';

describe( 'CKEditorComponent integration', () => {
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

	describe( 'component features', () => {
		beforeEach( async () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = AngularEditor as any;
		} );

		afterEach( () => {
			fixture.destroy();
		} );

		describe( 'disabled state', () => {
			it( 'simple usage', () => {
				fixture.detectChanges();

				return waitCycle().then( () => {
					expect( component.disabled ).toBeFalsy();
					expect( component.editorInstance!.isReadOnly ).toBeFalsy();

					component.disabled = true;

					expect( component.disabled ).toBeTruthy();
					expect( component.editorInstance!.isReadOnly ).toBeTruthy();

					component.disabled = false;

					expect( component.disabled ).toBeFalsy();
					expect( component.editorInstance!.isReadOnly ).toBeFalsy();
				} );
			} );

			it( 'editor disabled by the ControlValueAccessor', () => {
				fixture.detectChanges();
				component.setDisabledState( true );

				return waitCycle().then( () => {
					expect( component.disabled ).toBeTruthy();
					expect( component.editorInstance!.isReadOnly ).toBeTruthy();
				} );
			} );
		} );

		describe( 'tagName', () => {
			it( 'should enable creating component on textarea element', async () => {
				component.tagName = 'textarea';
				fixture.detectChanges();

				await waitCycle();

				expect( fixture.nativeElement.querySelector( 'textarea' ) ).toBeDefined();
			} );
		} );

		describe( 'component data', () => {
			it( 'initial data should be empty', async () => {
				fixture.detectChanges();

				await waitCycle();

				expect( component.data ).toEqual( '' );
				expect( component.editorInstance!.data.get() ).toEqual( '' );
			} );

			it( 'should be configurable at the start of the component using the data property', async () => {
				component.data = 'foo';

				fixture.detectChanges();

				await waitCycle();

				expect( component.data ).toEqual( 'foo' );
				expect( component.editorInstance!.data.get() ).toEqual( '<p>foo</p>' );
			} );

			it( 'should be configurable at the start of the component using the config.initialData property', async () => {
				component.config = { initialData: 'foo' };

				fixture.detectChanges();

				await waitCycle();

				expect( component.config.initialData ).toEqual( 'foo' );
				expect( component.editorInstance!.data.get() ).toEqual( '<p>foo</p>' );
			} );

			it( 'should be provided using both config.initialData or data properties', async () => {
				component.config = { initialData: 'foo' };
				component.data = 'bar';

				await expect( () => {
					fixture.detectChanges();
				} ).not.to.throw();
			} );

			it( 'should be writeable by ControlValueAccessor', async () => {
				component.writeValue( '<p>foo</p>' );
				fixture.detectChanges();

				await waitCycle();

				expect( component.editorInstance!.data.get() ).toEqual( '<p>foo</p>' );

				component.writeValue( '<p>bar</p>' );

				expect( component.editorInstance!.data.get() ).toEqual( '<p>bar</p>' );
			} );

			it( 'should be set during the initialization step if the editor was not initialized yet', async () => {
				fixture.detectChanges();

				expect( component.editorInstance ).toBeFalsy();

				component.writeValue( '<p>foo</p>' );

				await waitCycle();

				expect( component.editorInstance!.data.get() ).toEqual( '<p>foo</p>' );
			} );

			it( 'should update editor instance data when the data input property changes', async () => {
				const updatedText = '<p>Updated data</p>';

				component.ngOnChanges( {
					data: new SimpleChange( '', updatedText, false )
				} );

				fixture.detectChanges();
				await waitCycle();

				expect( component.editorInstance!.data.get() ).toEqual( updatedText );
			} );
		} );

		describe( 'emitters', () => {
			it( 'ready', () => {
				fixture.detectChanges();
				const spy = vi.fn();
				component.ready.subscribe( spy );

				return waitCycle().then( () => {
					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy ).toHaveBeenCalledWith( component.editorInstance );
				} );
			} );

			it( 'change', () => {
				fixture.detectChanges();
				const spy = vi.fn();
				component.change.subscribe( spy );

				return waitCycle().then( () => {
					component.editorInstance!.execute( 'input', { text: 'foo' } );

					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy.mock.calls[ 0 ][ 0 ].editor ).toEqual( component.editorInstance );
					expect( typeof spy.mock.calls[ 0 ][ 0 ].event ).toEqual( 'object' );
				} );
			} );

			it( 'change - should not calculate editor data when the control value ancestor is not specified', () => {
				fixture.detectChanges();
				const spy = vi.fn();
				component.change.subscribe( spy );

				return waitCycle().then( () => {
					vi.spyOn( component.editorInstance!.data, 'get' );

					component.editorInstance!.execute( 'input', { text: 'foo' } );
					component.editorInstance!.execute( 'input', { text: 'foo' } );
					component.editorInstance!.execute( 'input', { text: 'foo' } );

					expect( spy ).toHaveBeenCalledTimes( 3 );
				} );
			} );

			it( 'change - should not calculate editor data when the two way data binding is disabled', () => {
				component.disableTwoWayDataBinding = true;

				fixture.detectChanges();
				const spy = vi.fn();
				component.change.subscribe( spy );

				return waitCycle().then( () => {
					vi.spyOn( component.editorInstance!.data, 'get' );

					component.editorInstance!.execute( 'input', { text: 'foo' } );

					expect( spy ).toHaveBeenCalledTimes( 0 );
				} );
			} );

			it( 'focus', () => {
				fixture.detectChanges();
				const spy = vi.fn();
				component.focus.subscribe( spy );

				return waitCycle().then( () => {
					component.editorInstance!.editing.view.document.fire( 'focus' );

					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy.mock.calls[ 0 ][ 0 ].editor ).toEqual( component.editorInstance );
					expect( typeof spy.mock.calls[ 0 ][ 0 ].event ).toEqual( 'object' );
				} );
			} );

			it( 'blur', () => {
				fixture.detectChanges();
				const spy = vi.fn();
				component.blur.subscribe( spy );

				return waitCycle().then( () => {
					component.editorInstance!.editing.view.focus();

					component.editorInstance!.editing.view.document.fire( 'blur', { target: null } );

					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy.mock.calls[ 0 ][ 0 ].editor ).toEqual( component.editorInstance );
					expect( typeof spy.mock.calls[ 0 ][ 0 ].event ).toEqual( 'object' );
				} );
			} );
		} );

		describe( 'control value accessor callbacks', () => {
			it( 'onTouched callback should be called when editor is blurred', () => {
				fixture.detectChanges();

				return waitCycle().then( () => {
					const spy = vi.fn();

					component.registerOnTouched( spy );
					component.editorInstance!.editing.view.focus();

					component.editorInstance!.editing.view.document.fire( 'blur', { target: null } );

					expect( spy ).toHaveBeenCalled();
				} );
			} );

			it( 'onChange callback should be called when editor model changes with editor data', () => {
				fixture.detectChanges();

				return waitCycle().then( () => {
					const spy = vi.fn();
					component.registerOnChange( spy );

					component.editorInstance!.execute( 'input', { text: 'foo' } );

					expect( spy ).toHaveBeenCalledWith( '<p>foo</p>' );
				} );
			} );

			it( 'onChange callback should not be called when the change is coming from outside of the editor', () => {
				fixture.detectChanges();

				return waitCycle().then( () => {
					const spy = vi.fn();
					component.registerOnChange( spy );

					component.writeValue( 'foo' );

					expect( spy ).not.toHaveBeenCalled();
				} );
			} );
		} );
	} );

	describe( 'initialization errors are catched', () => {
		let config: any;

		beforeEach( () => {
			config = {
				extraPlugins: [
					function( editor: any ) {
						editor.data.on( 'init', () => {
							const position = editor.model.createPositionFromPath( editor.model.document.getRoot(), [ 1, 2, 3 ] );

							return position.parent;
						} );
					}
				],
				collaboration: {
					channelId: 'foobar-baz'
				}
			};
		} );

		it( 'should report an editor that failed to start', async () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			const component = fixture.componentInstance;
			const errorSpy = vi.fn();
			component.error.subscribe( errorSpy );
			component.editor = AngularEditor;
			component.config = config;

			fixture.detectChanges();
			await waitCycle();

			expect( errorSpy ).toHaveBeenCalledTimes( 1 );

			fixture.destroy();
		} );
	} );

	describe( 'error reporting', () => {
		// A real editor, unlike the mock used elsewhere: reporting finds the editor an error belongs to
		// among the editors that are actually running, and a mock is not one of them.
		async function mountReal(): Promise<{ fixture: ComponentFixture<CKEditorComponent>; editor: any; errors: Array<any> }> {
			const created = TestBed.createComponent( CKEditorComponent );
			const component = created.componentInstance;
			const errors: Array<any> = [];

			component.error.subscribe( ( error: unknown ) => errors.push( error ) );
			component.editor = AngularEditor;

			created.detectChanges();

			await vi.waitFor( () => {
				expect( component.editorInstance ).not.toBeNull();
			} );

			return { fixture: created, editor: component.editorInstance, errors };
		}

		beforeEach( () => {
			// The dispatched errors are meant for the reporter; without this the runner picks them up too.
			window.onerror = null;
		} );

		function throwFrom( editor: any ): CKEditorError {
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

		it( 'should emit an error that escaped a running editor, and keep the editor', async () => {
			const { fixture: created, editor, errors } = await mountReal();
			const error = throwFrom( editor );

			await waitCycle();

			expect( errors ).to.deep.equal( [ error ] );

			// Nothing restarts, so the editor the component holds is the one that threw.
			expect( created.componentInstance.editorInstance ).to.equal( editor );

			created.destroy();
		} );

		// One registration serves the whole page, so every component hears about every editor. This is
		// what keeps an error with the component whose editor it came from.
		it( 'should not emit an error that came from another editor', async () => {
			const first = await mountReal();
			const second = await mountReal();
			const error = throwFrom( second.editor );

			await waitCycle();

			// The component the error came from heard about it. Without this, the assertion below would
			// hold just as well for an error that was never reported to anyone.
			expect( second.errors ).to.deep.equal( [ error ] );
			expect( first.errors ).to.deep.equal( [] );

			first.fixture.destroy();
			second.fixture.destroy();
		} );

		// The reporter drops errors from an editor that is no longer ready, so a silent component proves
		// nothing about the unsubscribe. What it costs is the page-level listeners, which come down only
		// when the last registration goes, so that is what is asserted.
		it( 'should unregister the reporting when the component is destroyed', async () => {
			const off = vi.fn();
			const register = vi.spyOn( AngularEditor, 'onEditorError' ).mockReturnValue( off );
			const { fixture: created } = await mountReal();

			expect( register ).toHaveBeenCalledOnce();
			expect( off ).not.toHaveBeenCalled();

			created.destroy();
			await waitCycle();

			expect( off ).toHaveBeenCalledOnce();
		} );

		it( 'should destroy an editor that finished starting after the component was destroyed', async () => {
			const created = TestBed.createComponent( CKEditorComponent );
			const component = created.componentInstance;

			component.editor = AngularEditor;
			created.detectChanges();

			// Destroyed while `create()` is still in flight.
			created.destroy();
			await waitCycle();

			expect( component.editorInstance ).toBeNull();
		} );

		// An integrator who owns the context destroys it themselves, and that takes its editors with it.
		// The component must not then destroy an editor that is already down.
		it( 'should not destroy an editor the context has already taken down', async () => {
			const context = await ( AngularEditor as any ).Context.create( {} );
			const created = TestBed.createComponent( CKEditorComponent );
			const component = created.componentInstance;

			component.editor = AngularEditor;
			component.config = { context } as any;
			created.detectChanges();

			await vi.waitFor( () => {
				expect( component.editorInstance ).not.toBeNull();
			} );

			const editor = component.editorInstance!;
			const destroySpy = vi.spyOn( editor, 'destroy' );

			await context.destroy();

			expect( editor.state ).to.equal( 'destroyed' );

			created.destroy();
			await waitCycle();

			// Once, by the context. The component saw it was already down and left it alone.
			expect( destroySpy ).toHaveBeenCalledTimes( 1 );

			// It still let go of it: a destroyed component names no editor.
			expect( component.editorInstance ).toBeNull();
		} );

		it( 'should stop emitting once the component is destroyed', async () => {
			const { fixture: created, editor, errors } = await mountReal();

			created.destroy();
			await waitCycle();

			throwFrom( editor );

			await waitCycle();

			expect( errors ).to.deep.equal( [] );
		} );
	} );

	describe( 'change detection', () => {
		it( 'should NOT run change detection if error does not have listeners', async () => {
			window.onerror = null;

			@Component( {
				template: '<ckeditor [editor]="editor"></ckeditor>',
				standalone: false
			} )
			class TestComponent {
				public editor = AngularEditor;

				@ViewChild( CKEditorComponent, { static: true } ) public ckEditorComponent!: CKEditorComponent;
			}

			TestBed.configureTestingModule( {
				declarations: [ TestComponent, CKEditorComponent ]
			} );

			const appRef = TestBed.inject( ApplicationRef );

			const fixture = TestBed.createComponent( TestComponent );
			fixture.detectChanges();

			await waitCycle();

			const tickSpy = vi.spyOn( appRef as unknown as { _tick(): void }, '_tick' ).mockImplementation( () => {} );

			const oldEditor = fixture.componentInstance.ckEditorComponent.editorInstance;

			const error: any = new Error( 'foo' );
			error.is = () => true;
			error.context = oldEditor;
			Promise.resolve().then( () => {
				// The error is meant for the reporter. Swallowing the event keeps the test runner from
				// treating it as an unhandled failure of the run.
				window.addEventListener( 'error', evt => evt.preventDefault(), { capture: true, once: true } );
				window.dispatchEvent( new ErrorEvent( 'error', { error } ) );
			} );

			await waitCycle();

			// Nothing re-enters the Angular zone: there is no listener to notify, and no restart to render.
			expect( tickSpy ).toHaveBeenCalledTimes( 0 );
		} );

		it( 'should run change detection if error has listeners', async () => {
			window.onerror = null;

			@Component( {
				template: '<ckeditor [editor]="editor" (error)="onError()"></ckeditor>',
				standalone: false
			} )
			class TestComponent {
				public editor = AngularEditor;

				@ViewChild( CKEditorComponent, { static: true } ) public ckEditorComponent!: CKEditorComponent;

				public onError(): void {}
			}

			TestBed.configureTestingModule( {
				declarations: [ TestComponent, CKEditorComponent ]
			} );

			const appRef = TestBed.inject( ApplicationRef );

			const fixture = TestBed.createComponent( TestComponent );
			fixture.detectChanges();

			await waitCycle();

			const tickSpy = vi.spyOn( appRef as unknown as { _tick(): void }, '_tick' ).mockImplementation( () => {} );

			const oldEditor = fixture.componentInstance.ckEditorComponent.editorInstance;

			const error: any = new Error( 'foo' );
			error.is = () => true;
			error.context = oldEditor;
			Promise.resolve().then( () => {
				// The error is meant for the reporter. Swallowing the event keeps the test runner from
				// treating it as an unhandled failure of the run.
				window.addEventListener( 'error', evt => evt.preventDefault(), { capture: true, once: true } );
				window.dispatchEvent( new ErrorEvent( 'error', { error } ) );
			} );

			await waitCycle();

			// Once, for emitting the error to the listener. Under the Watchdog there was a second cycle,
			// for rendering the editor it had just rebuilt.
			expect( tickSpy ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );

function waitCycle( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
