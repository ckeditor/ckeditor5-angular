/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CKEditorComponent } from './ckeditor.component';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';

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
		it( 'data set by ControlValueAccessor', () => {
			return wait().then( () => {
				expect( component.data ).toEqual( '' );
				expect( component.editor.getData() ).toEqual( '<p>&nbsp;</p>' );
			} );
		} );

		it( 'should be writeable', () => {
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
} );

function wait( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
