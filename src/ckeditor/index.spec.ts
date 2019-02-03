/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';

import {
	CKEditorComponent,
	CKEditorModule,
	CKEditor5
} from './index';

describe( 'index.ts - the entry file', () => {
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
		component.editor = ClassicEditorBuild;
	} );

	it( 'should expose the CKEditorComponent', () => {
		fixture.detectChanges();

		return wait().then( () => {
			const componentInstance: CKEditor5.Editor = component.editorInstance!;

			expect( componentInstance ).toBeTruthy();
		} );
	} );

	it( 'should expose the CKEditorModule', () => {
		expect( CKEditorModule ).toBeTruthy();
	} );
} );

function wait( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
