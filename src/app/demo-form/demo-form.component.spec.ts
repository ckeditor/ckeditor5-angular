import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CKEditorModule } from '../../ckeditor/ckeditor.module';
import { DemoFormComponent } from './demo-form.component';
import { By } from '@angular/platform-browser';

describe( 'DemoFormComponent', () => {
	let component: DemoFormComponent;
	let fixture: ComponentFixture<DemoFormComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			declarations: [ DemoFormComponent ],
			imports: [ FormsModule, CKEditorModule ]
		} )
			.compileComponents();

		fixture = TestBed.createComponent( DemoFormComponent );
		component = fixture.componentInstance;
		fixture.detectChanges();
	} );

	afterEach( () => {
		fixture.destroy();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	it( 'should log the model to the console when user submits the form', () => {
		const spy = vi.spyOn( console, 'log' ).mockImplementation( () => {} );

		const submitButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=submit]' ) ).nativeElement;
		submitButton.click();

		expect( spy ).toHaveBeenCalledTimes( 1 );
		expect( spy.mock.calls[ 0 ] ).toEqual( expect.arrayContaining( [
			'Form submit, model',
			expect.objectContaining( {
				name: 'John',
				surname: 'Doe',
				description: '<p>A <b>really</b> nice fellow.</p>'
			} )
		] ) );
	} );

	it( 'should reset form after clicking the reset button', async () => {
		await waitCycle();

		const resetButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=reset]' ) ).nativeElement;
		resetButton.click();

		fixture.detectChanges();

		expect( component.formDataPreview ).toEqual( '{"name":null,"surname":null,"description":null}' );
	} );

	it( 'should assign editor data to the model description if two way binding is disabled', async () => {
		await waitCycle();

		const spy = vi.spyOn( console, 'log' ).mockImplementation( () => {} );

		const toggleButton: HTMLButtonElement = fixture.debugElement.query( By.css( '#toggleBinding' ) ).nativeElement;
		const submitButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=submit]' ) ).nativeElement;
		const editorDataPreview: HTMLTextAreaElement = fixture.debugElement.query( By.css( 'textarea' ) ).nativeElement;

		toggleButton.click();
		component.editorInstance!.setData( '<p>Foo bar baz.</p>' );
		submitButton.click();

		expect( editorDataPreview.value ).toEqual( '<p>A <b>really</b> nice fellow.</p>' );

		expect( spy ).toHaveBeenCalledTimes( 1 );
		expect( spy.mock.calls[ 0 ][ 0 ] ).toEqual( 'Form submit, model' );
		expect( spy.mock.calls[ 0 ][ 1 ] ).toEqual( {
			name: 'John',
			surname: 'Doe',
			description: '<p>Foo bar baz.</p>'
		} );
	} );
} );

function waitCycle( time?: number ) {
	return new Promise<void>( resolve => {
		setTimeout( resolve, time );
	} );
}
