/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CKEditorComponent } from './ckeditor.component';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import * as sinon from 'sinon';

describe( 'CKEditorComponent', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ CKEditorComponent ]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( CKEditorComponent );
		component = fixture.componentInstance;
		component.build = ClassicEditorBuild;
		fixture.detectChanges();
	} );

	afterEach( () => {
		fixture.destroy();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	describe( 'disabled state', () => {
		it( 'simple usage', () => {
			return wait().then( () => {
				expect( component.disabled ).toBeFalsy();
				expect( component.editor.isReadOnly ).toBeFalsy();

				component.disabled = true;

				expect( component.disabled ).toBeTruthy();
				expect( component.editor.isReadOnly ).toBeTruthy();

				component.disabled = false;

				expect( component.disabled ).toBeFalsy();
				expect( component.editor.isReadOnly ).toBeFalsy();
			} );
		} );

		it( 'editor disabled by the ControlValueAccessor', () => {
			component.setDisabledState( true );

			return wait().then( () => {
				expect( component.disabled ).toBeTruthy();
				expect( component.editor.isReadOnly ).toBeTruthy();
			} );
		} );
	} );

	describe( 'component data', () => {
		it( 'initial data should be empty', () => {
			return wait().then( () => {
				expect( component.data ).toEqual( '' );
				expect( component.editor.getData() ).toEqual( '<p>&nbsp;</p>' );
			} );
		} );

		it( 'should be configurable at the start of the component', () => {
			component.data = 'foo';

			return wait().then( () => {
				expect( component.data ).toEqual( 'foo' );
				expect( component.editor.getData() ).toEqual( '<p>foo</p>' );
			} );
		} );

		it( 'should be writeable by ControlValueAccessor', () => {
			component.writeValue( 'foo' );

			return wait().then( () => {
				expect( component.editor.getData() ).toEqual( '<p>foo</p>' );

				component.writeValue( 'bar' );

				expect( component.editor.getData() ).toEqual( '<p>bar</p>' );
			} );
		} );
	} );

	describe( 'emitters', () => {
		it( 'ready', () => {
			const spy = sinon.spy();
			component.ready.subscribe( spy );

			return wait().then( () => {
				sinon.assert.calledOnce( spy );
				sinon.assert.calledWithExactly( spy, component.editor );
			} );
		} );

		it( 'change', () => {
			const spy = sinon.spy();
			component.change.subscribe( spy );

			return wait().then( () => {
				component.editor.execute( 'input', { text: 'foo' } );

				sinon.assert.calledOnce( spy );
				sinon.assert.calledWith( spy, { editor: component.editor, data: '<p>foo</p>', evt: sinon.match.object } );
			} );
		} );

		it( 'focus', () => {
			const spy = sinon.spy();
			component.focus.subscribe( spy );

			return wait().then( () => {
				component.editor.editing.view.document.fire( 'focus' );

				sinon.assert.calledOnce( spy );
				sinon.assert.calledWith( spy, { editor: component.editor, evt: sinon.match.object } );
			} );
		} );

		it( 'blur', () => {
			const spy = sinon.spy();
			component.blur.subscribe( spy );

			return wait().then( () => {
				component.editor.editing.view.focus();

				component.editor.editing.view.document.fire( 'blur', { target: null } );

				sinon.assert.calledOnce( spy );
				sinon.assert.calledWith( spy, { editor: component.editor, evt: sinon.match.object } );
			} );
		} );
	} );
} );

function wait( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
