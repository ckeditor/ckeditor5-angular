/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CKEditorComponent } from './ckeditor.component';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic/build/ckeditor.js'

describe('CKEditorComponent', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ CKEditorComponent ]
		} )
		.compileComponents();
		console.log( 'bef1' );
	} ) );

	beforeEach(() => {
		fixture = TestBed.createComponent( CKEditorComponent );
		component = fixture.componentInstance;
		component.build = ClassicEditorBuild;
		fixture.detectChanges();
		console.log( 'bef2' );
	} );

	it( 'should create', () => {
		console.log( 'test' );
		expect( component ).toBeTruthy();
	} );
} );
