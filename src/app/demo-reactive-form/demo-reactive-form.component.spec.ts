import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CKEditorModule } from '../../ckeditor/ckeditor.module';
import { DemoReactiveFormComponent } from './demo-reactive-form.component';
import { By } from '@angular/platform-browser';

describe( 'DemoReactiveFormComponent', () => {
	let component: DemoReactiveFormComponent;
	let fixture: ComponentFixture<DemoReactiveFormComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ DemoReactiveFormComponent ],
			imports: [ CKEditorModule, FormsModule, ReactiveFormsModule ]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
		fixture = TestBed.createComponent( DemoReactiveFormComponent );
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

	it( 'should reset form after clicking the reset button', ( done: Function ) => {
		setTimeout( () => {
			const resetButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button[type=reset]' ) ).nativeElement;
			resetButton.click();

			fixture.detectChanges();

			expect( component.formDataPreview ).toEqual( '{"name":null,"surname":null,"description":""}' );

			done();
		} );
	} );
} );
