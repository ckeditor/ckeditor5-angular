import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

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
		const spy = spyOn( console, 'log' );

		const submitButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=submit]' ) ).nativeElement;
		submitButton.click();

		expect( spy ).toHaveBeenCalledTimes( 1 );
		expect( spy.calls.first().args ).toEqual( jasmine.arrayContaining( [
			'Form submit, model',
			jasmine.objectContaining( {
				name: 'John',
				surname: 'Doe',
				description: '<p>A <b>really</b> nice fellow.</p>'
			} )
		] ) );
	} );

	it( 'should reset form after clicking the reset button', done => {
		setTimeout( () => {
			const resetButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=reset]' ) ).nativeElement;
			resetButton.click();

			fixture.detectChanges();

			expect( component.formDataPreview ).toEqual( '{"name":null,"surname":null,"description":null}' );

			done();
		} );
	} );

	it( 'should assign editor data to the model description if two way binding is disabled', done => {
		setTimeout( () => {
			const spy = spyOn( console, 'log' );

			const toggleButton: HTMLButtonElement = fixture.debugElement.query( By.css( '#toggleBinding' ) ).nativeElement;
			const submitButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=submit]' ) ).nativeElement;
			const editorDataPreview: HTMLTextAreaElement = fixture.debugElement.query( By.css( 'textarea' ) ).nativeElement;

			toggleButton.click();
			component.editorInstance!.setData( '<p>Foo bar baz.</p>' );
			submitButton.click();

			expect( editorDataPreview.value ).toEqual( '<p>A <b>really</b> nice fellow.</p>' );

			expect( spy ).toHaveBeenCalledTimes( 1 );
			expect( spy.calls.first().args[ 0 ] ).toEqual( 'Form submit, model' );
			expect( spy.calls.first().args[ 1 ] ).toEqual( {
				name: 'John',
				surname: 'Doe',
				description: '<p>Foo bar baz.</p>'
			} );

			done();
		} );
	} );
} );
