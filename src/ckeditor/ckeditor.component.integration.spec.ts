/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { ApplicationRef, Component, SimpleChange, ViewChild } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AngularEditor } from 'src/editor/editor';
import { MockEditor } from 'src/editor/mock-editor';

import { CKEditorComponent } from './ckeditor.component';

describe( 'CKEditorComponent integration', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
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

		describe( 'in case of the context watchdog integration', () => {
			it( 'should create an editor internally', async () => {
				const contextWatchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );
				const spy = vi.fn();

				await contextWatchdog.create();

				component.watchdog = contextWatchdog;
				component.ready.subscribe( spy );

				fixture.detectChanges();

				await waitCycle();

				expect( spy ).toHaveBeenCalledTimes( 1 );
				expect( spy ).toHaveBeenCalledWith( component.editorInstance );
			} );

			it( 'should fire the error event when an error occurs and the ready event afterwards #2', async () => {
				fixture.destroy();

				fixture = TestBed.createComponent( CKEditorComponent );
				component = fixture.componentInstance;
				component.editor = MockEditor as any;

				const fixture2 = TestBed.createComponent( CKEditorComponent );
				const component2 = fixture2.componentInstance;

				component2.editor = MockEditor as any;

				window.onerror = null;

				const contextWatchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );

				await contextWatchdog.create();

				component.watchdog = contextWatchdog;
				component2.watchdog = contextWatchdog;

				fixture.detectChanges();
				fixture2.detectChanges();
				await waitCycle();

				const errorSpy = vi.fn();
				const error2Spy = vi.fn();
				const readySpy = vi.fn();

				component.error.subscribe( errorSpy );
				component2.error.subscribe( error2Spy );
				component.ready.subscribe( readySpy );

				await waitCycle();

				const oldEditor = component.editorInstance;

				setTimeout( () => {
					const error: any = new Error( 'foo' );
					error.is = () => true;
					error.context = oldEditor;

					throw error;
				} );

				await waitCycle();

				expect( errorSpy ).toHaveBeenCalledTimes( 1 );
				expect( readySpy ).toHaveBeenCalledTimes( 1 );

				// TODO: https://github.com/ckeditor/ckeditor5-angular/issues/420
				// expect( error2Spy ).toHaveBeenCalledTimes( 0 );

				fixture2.destroy();
			} );

			it( 'should update the editor once the editor is ready', async () => {
				const contextWatchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );

				await contextWatchdog.create();

				component.watchdog = contextWatchdog;
				component.disabled = true;

				fixture.detectChanges();
				await waitCycle();

				expect( component.editorInstance ).toBeTruthy();
				expect( component.editorInstance!.isReadOnly ).toEqual( true );
			} );

			it( 'should destroy editor when item error listener is missing', async () => {
				const contextWatchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );

				await contextWatchdog.create();

				component.watchdog = contextWatchdog;
				fixture.detectChanges();
				await waitCycle();

				const removeSpy = vi.spyOn( contextWatchdog, 'remove' );
				const offSpy = vi.spyOn( contextWatchdog, 'off' );

				( component as any ).watchdogItemErrorListener = undefined;

				await component.ngOnDestroy();

				expect( removeSpy ).toHaveBeenCalledTimes( 1 );
				expect( offSpy ).not.toHaveBeenCalled();
			} );
		} );

		describe( 'in case of the editor watchdog integration', () => {
			it( 'should use the provided configuration', async () => {
				component.editorWatchdogConfig = { crashNumberLimit: 678 };

				fixture.detectChanges();

				expect( ( component as any ).editorWatchdog ).not.toBeUndefined();
				expect( ( component as any ).editorWatchdog._crashNumberLimit ).toEqual( 678 );
			} );

			it( 'should restart the editor when the editor crashes', async () => {
				window.onerror = null;

				fixture.detectChanges();
				await waitCycle();

				const oldEditor = component.editorInstance;
				expect( oldEditor ).toBeTruthy();

				setTimeout( () => {
					const error: any = new Error( 'foo' );
					error.is = () => true;
					error.context = oldEditor;

					throw error;
				} );

				await waitCycle();

				expect( oldEditor ).not.toEqual( component.editorInstance );
				expect( component.editorInstance ).toBeTruthy();
			} );

			it( 'should fire the error event when an error occurs and the ready event afterwards', async () => {
				window.onerror = null;

				fixture.detectChanges();
				await waitCycle();

				const errorSpy = vi.fn();
				const readySpy = vi.fn();

				component.error.subscribe( errorSpy );
				component.ready.subscribe( readySpy );

				await waitCycle();

				const oldEditor = component.editorInstance;

				setTimeout( () => {
					const error: any = new Error( 'foo' );
					error.is = () => true;
					error.context = oldEditor;

					throw error;
				} );

				await waitCycle();

				expect( errorSpy ).toHaveBeenCalledTimes( 1 );
				expect( readySpy ).toHaveBeenCalledTimes( 1 );
			} );
		} );

		describe( 'disableWatchdog', () => {
			it( 'should allow toggling the watchdog', async () => {
				const contextWatchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );
				await contextWatchdog.create();
				const watchdogAddSpy = vi.spyOn( contextWatchdog, 'add' );
				const watchdogRemoveSpy = vi.spyOn( contextWatchdog, 'remove' );

				component.watchdog = contextWatchdog;
				component.disableWatchdog = false;
				fixture.detectChanges();
				await waitCycle();

				expect( watchdogAddSpy ).toHaveBeenCalledTimes( 1 );
				expect( component.editorInstance ).toBeTruthy();

				component.disableWatchdog = true;
				component.ngOnChanges( {
					disableWatchdog: new SimpleChange( false, true, false )
				} );
				await waitCycle();

				expect( watchdogRemoveSpy ).toHaveBeenCalledTimes( 1 );
				expect( component.editorInstance ).toBeTruthy();
				expect( watchdogAddSpy ).toHaveBeenCalledTimes( 1 );

				component.disableWatchdog = false;
				component.ngOnChanges( {
					disableWatchdog: new SimpleChange( true, false, false )
				} );
				await waitCycle();

				expect( watchdogAddSpy ).toHaveBeenCalledTimes( 2 );
				expect( component.editorInstance ).toBeTruthy();
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

		it( 'when internal watchdog is created', async () => {
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

		it( 'when external watchdog is provided', async () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			const component = fixture.componentInstance;
			const errorSpy = vi.fn();
			component.error.subscribe( errorSpy );
			const contextWatchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );

			await contextWatchdog.create();

			component.watchdog = contextWatchdog;
			component.editor = AngularEditor;
			component.config = config;

			fixture.detectChanges();
			await waitCycle();

			expect( errorSpy ).toHaveBeenCalledTimes( 1 );

			fixture.destroy();
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

			vi.spyOn( appRef, 'tick' ).mockImplementation( () => {} );

			const oldEditor = fixture.componentInstance.ckEditorComponent.editorInstance;

			const error: any = new Error( 'foo' );
			error.is = () => true;
			error.context = oldEditor;
			Promise.resolve().then( () => {
				window.dispatchEvent( new ErrorEvent( 'error', { error } ) );
			} );

			await waitCycle();

			expect( appRef.tick ).toHaveBeenCalledTimes( 1 );
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

			vi.spyOn( appRef, 'tick' ).mockImplementation( () => {} );

			const oldEditor = fixture.componentInstance.ckEditorComponent.editorInstance;

			const error: any = new Error( 'foo' );
			error.is = () => true;
			error.context = oldEditor;
			Promise.resolve().then( () => {
				window.dispatchEvent( new ErrorEvent( 'error', { error } ) );
			} );

			await waitCycle();

			expect( appRef.tick ).toHaveBeenCalledTimes( 2 );
		} );
	} );
} );

function waitCycle( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
