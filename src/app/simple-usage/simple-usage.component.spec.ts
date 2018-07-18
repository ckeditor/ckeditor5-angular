import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CKEditorModule } from '../../../lib/ckeditor.module';
import { SimpleUsageComponent } from './simple-usage.component';
import { By } from '@angular/platform-browser';
import { CKEditorComponent } from 'lib/ckeditor.component';
import { DebugElement } from '@angular/core';

describe( 'SimpleUsageComponent', () => {
	let component: SimpleUsageComponent;
	let fixture: ComponentFixture<SimpleUsageComponent>;
	let ckeditorComponent: CKEditorComponent;
	let debugElement: DebugElement;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ SimpleUsageComponent ],
			imports: [ CKEditorModule ]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( SimpleUsageComponent );
		component = fixture.componentInstance;
		debugElement = fixture.debugElement.query( By.directive( CKEditorComponent ) );
		ckeditorComponent = debugElement.componentInstance;

		fixture.detectChanges();
	} );

	afterEach( () => {
		fixture.destroy();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	describe( 'disabled state', () => {
		it( 'should be set to false at start', () => {
			expect( component.isDisabled ).toBeFalsy();
		} );

		it( 'should be synced', () => {
			component.toggleDisableEditors();
			fixture.detectChanges();

			expect( component.isDisabled ).toBeTruthy();
			expect( ckeditorComponent.disabled ).toBeTruthy();

			component.toggleDisableEditors();
			fixture.detectChanges();

			expect( component.isDisabled ).toBeFalsy();
			expect( ckeditorComponent.disabled ).toBeFalsy();
		} );
	} );

	describe( 'data', () => {
		it( 'should set initial data on the CKEditor component', () => {
			expect( ckeditorComponent.data )
				.toContain( '<p>Getting used to an entirely different culture can be challenging.' );
		} );

		it( 'should be synced with editorData property', () => {
			component.editorData = '<p>foo</p>';

			fixture.detectChanges();

			expect( ckeditorComponent.data ).toEqual( '<p>foo</p>' );
		} );
	} );

	describe( 'listeners', () => {
		it( 'ready should be called on ckeditorComponent.ready()', () => {
			const spy = spyOn( component, 'onReady' );

			ckeditorComponent.ready.emit();

			expect( spy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'change should be called on ckeditorComponent.change()', () => {
			const spy = spyOn( component, 'onChange' );

			ckeditorComponent.change.emit();

			expect( spy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'focus should be called on ckeditorComponent.focus()', () => {
			const spy = spyOn( component, 'onFocus' );

			ckeditorComponent.focus.emit();

			expect( spy ).toHaveBeenCalledTimes( 1 );
		} );

		it( 'blur should be called on ckeditorComponent.blur()', () => {
			const spy = spyOn( component, 'onBlur' );

			ckeditorComponent.blur.emit();

			expect( spy ).toHaveBeenCalledTimes( 1 );
		} );
	} );
} );
