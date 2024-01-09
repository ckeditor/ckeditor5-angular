/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { CKEditorComponent } from './ckeditor.component';
import AngularEditor from '../../ckeditor/build/ckeditor';
import { ApplicationRef, Component, SimpleChange, ViewChild } from '@angular/core';

describe( 'CKEditorComponent', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			declarations: [ CKEditorComponent ]
		} ).compileComponents();
	} );

	describe( 'component initialization', () => {
		let CKEDITOR_VERSION: string | undefined;

		beforeEach( () => {
			spyOn( console, 'warn' );

			CKEDITOR_VERSION = ( window as any ).CKEDITOR_VERSION;
		} );

		afterEach( () => {
			fixture.destroy();

			( window as any ).CKEDITOR_VERSION = CKEDITOR_VERSION;
		} );

		it( 'should create', () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = AngularEditor;

			expect( component ).toBeTruthy();
		} );

		it( 'should print a warning if the "window.CKEDITOR_VERSION" variable is not available', () => {
			delete ( window as any ).CKEDITOR_VERSION;

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = AngularEditor;

			expect( console.warn ).toHaveBeenCalledWith( 'Cannot find the "CKEDITOR_VERSION" in the "window" scope.' );
		} );

		it( 'should print a warning if using CKEditor 5 in version lower than 37', () => {
			( window as any ).CKEDITOR_VERSION = '30.0.0';

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = AngularEditor;

			expect( console.warn ).toHaveBeenCalledWith( 'The <CKEditor> component requires using CKEditor 5 in version 37 or higher.' );
		} );

		it( 'should not print any warning if using CKEditor 5 in version 37 or higher', () => {
			( window as any ).CKEDITOR_VERSION = '37.0.0';

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = AngularEditor;

			expect( console.warn ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'component features', () => {
		beforeEach( async () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = AngularEditor;
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

			it( 'should be configurable at the start of the component using the `data` property', async () => {
				component.data = 'foo';

				fixture.detectChanges();

				await waitCycle();

				expect( component.data ).toEqual( 'foo' );
				expect( component.editorInstance!.data.get() ).toEqual( '<p>foo</p>' );
			} );

			it( 'should be configurable at the start of the component using the `config.initialData` property', async () => {
				component.config = { initialData: 'foo' };

				fixture.detectChanges();

				await waitCycle();

				expect( component.config.initialData ).toEqual( 'foo' );
				expect( component.editorInstance!.data.get() ).toEqual( '<p>foo</p>' );
			} );

			it( 'should not be provided using both `config.initialData` or `data` properties', async () => {
				component.config = { initialData: 'foo' };
				component.data = 'bar';

				await expect( () => {
					fixture.detectChanges();
				} ).toThrowError( 'Editor data should be provided either using `config.initialData` or `data` properties.' );
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

			it( 'should update editor instance data when \'data\' input property changes', async () => {
				const updatedText = '<p>Updated data</p>';

				component.ngOnChanges( {
					data: new SimpleChange( '', updatedText, false )
				} );

				fixture.detectChanges();
				await waitCycle();

				expect( component.editorInstance!.data.get() ).toEqual( updatedText );
			} );

			it( 'should return component id', async () => {
				expect( component.getId() ).toMatch( /e[0-9a-z]{32}/ );
			} );
		} );

		describe( 'emitters', () => {
			it( 'ready', () => {
				fixture.detectChanges();
				const spy = jasmine.createSpy();
				component.ready.subscribe( spy );

				return waitCycle().then( () => {
					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy ).toHaveBeenCalledWith( component.editorInstance );
				} );
			} );

			it( 'change', () => {
				fixture.detectChanges();
				const spy = jasmine.createSpy();
				component.change.subscribe( spy );

				return waitCycle().then( () => {
					component.editorInstance!.execute( 'input', { text: 'foo' } );

					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy.calls.first().args[ 0 ].editor ).toEqual( component.editorInstance );
					expect( typeof spy.calls.first().args[ 0 ].event ).toEqual( 'object' );
				} );
			} );

			it( 'change - should not calculate editor data when the control value ancestor is not specified', () => {
				fixture.detectChanges();
				const spy = jasmine.createSpy();
				component.change.subscribe( spy );

				return waitCycle().then( () => {
					spyOn( component.editorInstance!.data, 'get' ).and.callThrough();

					component.editorInstance!.execute( 'input', { text: 'foo' } );
					component.editorInstance!.execute( 'input', { text: 'foo' } );
					component.editorInstance!.execute( 'input', { text: 'foo' } );

					expect( spy ).toHaveBeenCalledTimes( 3 );
				} );
			} );

			it( 'change - should not calculate editor data when the two way data binding is disabled', () => {
				component.disableTwoWayDataBinding = true;

				fixture.detectChanges();
				const spy = jasmine.createSpy();
				component.change.subscribe( spy );

				return waitCycle().then( () => {
					spyOn( component.editorInstance!.data, 'get' ).and.callThrough();

					component.editorInstance!.execute( 'input', { text: 'foo' } );

					expect( spy ).toHaveBeenCalledTimes( 0 );
				} );
			} );

			it( 'focus', () => {
				fixture.detectChanges();
				const spy = jasmine.createSpy();
				component.focus.subscribe( spy );

				return waitCycle().then( () => {
					component.editorInstance!.editing.view.document.fire( 'focus' );

					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy.calls.first().args[ 0 ].editor ).toEqual( component.editorInstance );
					expect( typeof spy.calls.first().args[ 0 ].event ).toEqual( 'object' );
				} );
			} );

			it( 'blur', () => {
				fixture.detectChanges();
				const spy = jasmine.createSpy();
				component.blur.subscribe( spy );

				return waitCycle().then( () => {
					component.editorInstance!.editing.view.focus();

					component.editorInstance!.editing.view.document.fire( 'blur', { target: null } );

					expect( spy ).toHaveBeenCalledTimes( 1 );
					expect( spy.calls.first().args[ 0 ].editor ).toEqual( component.editorInstance );
					expect( typeof spy.calls.first().args[ 0 ].event ).toEqual( 'object' );
				} );
			} );
		} );

		describe( 'control value accessor callbacks', () => {
			it( 'onTouched callback should be called when editor is blurred', () => {
				fixture.detectChanges();

				return waitCycle().then( () => {
					const spy = jasmine.createSpy();

					component.registerOnTouched( spy );
					component.editorInstance!.editing.view.focus();

					component.editorInstance!.editing.view.document.fire( 'blur', { target: null } );

					expect( spy ).toHaveBeenCalled();
				} );
			} );

			it( 'onChange callback should be called when editor model changes with editor data', () => {
				fixture.detectChanges();

				return waitCycle().then( () => {
					const spy = jasmine.createSpy();
					component.registerOnChange( spy );

					component.editorInstance!.execute( 'input', { text: 'foo' } );

					expect( spy ).toHaveBeenCalledWith( '<p>foo</p>' );
				} );
			} );

			it( 'onChange callback should not be called when the change is coming from outside of the editor', () => {
				fixture.detectChanges();

				return waitCycle().then( () => {
					const spy = jasmine.createSpy();
					component.registerOnChange( spy );

					component.writeValue( 'foo' );

					expect( spy ).not.toHaveBeenCalled();
				} );
			} );
		} );

		describe( 'in case of the context watchdog integration', () => {
			it( 'should create an editor internally', async () => {
				const contextWatchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );
				const spy = jasmine.createSpy();

				await contextWatchdog.create();

				component.watchdog = contextWatchdog;
				component.ready.subscribe( spy );

				fixture.detectChanges();

				await waitCycle();

				expect( spy ).toHaveBeenCalledTimes( 1 );
				expect( spy ).toHaveBeenCalledWith( component.editorInstance );
			} );

			it( 'should fire the `error` event when an error occurs and the `ready` event afterwards #2', async () => {
				// Create a second component to test whether the `error` event will be fired only
				// on the proper component.
				const fixture2 = TestBed.createComponent( CKEditorComponent );
				const component2 = fixture2.componentInstance;

				component2.editor = AngularEditor;

				window.onerror = null;

				const contextWatchdog = new AngularEditor.ContextWatchdog( AngularEditor.Context );

				await contextWatchdog.create();

				component.watchdog = contextWatchdog;
				component2.watchdog = contextWatchdog;

				fixture.detectChanges();
				fixture2.detectChanges();
				await waitCycle();

				const errorSpy = jasmine.createSpy( 'errorSpy' );
				const error2Spy = jasmine.createSpy( 'errorSpy' );
				const readySpy = jasmine.createSpy( 'readySpy' );

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

				expect( error2Spy ).toHaveBeenCalledTimes( 0 );

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

			it( 'should fire the `error` event when an error occurs and the `ready` event afterwards', async () => {
				window.onerror = null;

				fixture.detectChanges();
				await waitCycle();

				const errorSpy = jasmine.createSpy( 'errorSpy' );
				const readySpy = jasmine.createSpy( 'readySpy' );

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
	} );

	describe( 'initialization errors are catched', () => {
		let config: any;

		beforeEach( () => {
			config = {
				extraPlugins: [
					function( editor: any ) {
						editor.data.on( 'init', () => {
							// Simulate an error.
							// Create a non-existing position, then try to get its parent.
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
			const errorSpy = jasmine.createSpy( 'errorSpy' );
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
			const errorSpy = jasmine.createSpy( 'errorSpy' );
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
} );

describe( 'change detection', () => {
	it( 'should NOT run change detection if `error` does not have listeners', async () => {
		window.onerror = null;

		@Component( {
			template: '<ckeditor [editor]="editor"></ckeditor>'
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

		spyOn( appRef, 'tick' );

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

	it( 'should run change detection if `error` has listeners', async () => {
		window.onerror = null;

		@Component( {
			template: '<ckeditor [editor]="editor" (error)="onError()"></ckeditor>'
		} )
		class TestComponent {
			public editor = AngularEditor;

			@ViewChild( CKEditorComponent, { static: true } ) public ckEditorComponent!: CKEditorComponent;

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			public onError(): void {}
		}

		TestBed.configureTestingModule( {
			declarations: [ TestComponent, CKEditorComponent ]
		} );

		const appRef = TestBed.inject( ApplicationRef );

		const fixture = TestBed.createComponent( TestComponent );
		fixture.detectChanges();

		await waitCycle();

		spyOn( appRef, 'tick' );

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

function waitCycle( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
