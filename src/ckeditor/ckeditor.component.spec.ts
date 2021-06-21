/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CKEditorComponent } from './ckeditor.component';
import * as CKSource from '../../ckeditor/build/cksource';

describe( 'CKEditorComponent', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			declarations: [ CKEditorComponent ]
		} )
			.compileComponents();

		fixture = TestBed.createComponent( CKEditorComponent );
		component = fixture.componentInstance;
		component.editor = CKSource.ClassicEditor;
	} );

	afterEach( () => {
		fixture.destroy();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
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
			expect( component.editorInstance!.getData() ).toEqual( '' );
		} );

		it( 'should be configurable at the start of the component using the `data` property', async () => {
			component.data = 'foo';

			fixture.detectChanges();

			await waitCycle();

			expect( component.data ).toEqual( 'foo' );
			expect( component.editorInstance!.getData() ).toEqual( '<p>foo</p>' );
		} );

		it( 'should be configurable at the start of the component using the `config.initialData` property', async () => {
			component.config = { initialData: 'foo' };

			fixture.detectChanges();

			await waitCycle();

			expect( component.config.initialData ).toEqual( 'foo' );
			expect( component.editorInstance!.getData() ).toEqual( '<p>foo</p>' );
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

			expect( component.editorInstance!.getData() ).toEqual( '<p>foo</p>' );

			component.writeValue( '<p>bar</p>' );

			expect( component.editorInstance!.getData() ).toEqual( '<p>bar</p>' );
		} );

		it( 'should be set during the initialization step if the editor was not initialized yet', async () => {
			fixture.detectChanges();

			expect( component.editorInstance ).toBeFalsy();

			component.writeValue( '<p>foo</p>' );

			await waitCycle();

			expect( component.editorInstance!.getData() ).toEqual( '<p>foo</p>' );
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

			const changeSpy = jasmine.createSpy();
			component.change.subscribe( changeSpy );

			return waitCycle().then( () => {
				spyOn( component.editorInstance!, 'getData' ).and.callThrough();

				component.editorInstance!.execute( 'input', { text: 'foo' } );
				component.editorInstance!.execute( 'input', { text: 'foo' } );
				component.editorInstance!.execute( 'input', { text: 'foo' } );

				expect( component.editorInstance!.getData ).toHaveBeenCalledTimes( 0 );
				expect( changeSpy ).toHaveBeenCalledTimes( 3 );
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
			const contextWatchdog = new CKSource.ContextWatchdog( CKSource.Context );
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

			component2.editor = CKSource.ClassicEditor;

			window.onerror = null;

			const contextWatchdog = new CKSource.ContextWatchdog( CKSource.Context );

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
			const contextWatchdog = new CKSource.ContextWatchdog( CKSource.Context );

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

function waitCycle( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
