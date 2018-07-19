import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CKEditorModule } from '../../../lib/ckeditor.module';
import { DemoFormComponent } from './demo-form.component';
import { By } from '@angular/platform-browser';
import { CKEditorComponent } from 'lib/ckeditor.component';

describe( 'DemoFormComponent', () => {
	let component: DemoFormComponent;
	let fixture: ComponentFixture<DemoFormComponent>;

	beforeEach( async( () => {
		TestBed.configureTestingModule( {
			declarations: [ DemoFormComponent ],
			imports: [ FormsModule, CKEditorModule ]
		} )
			.compileComponents();
	} ) );

	beforeEach( () => {
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

		const submitButton: HTMLButtonElement = fixture.debugElement.query( By.css( 'button' ) ).nativeElement;
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

	it( 'should show form data preview after change', ( done: Function ) => {
		const debugElement = fixture.debugElement.query( By.directive( CKEditorComponent ) );
		const ckeditorComponent: CKEditorComponent = debugElement.componentInstance;

		setTimeout( () => {
			ckeditorComponent.editor!.setData( '<p>An unidentified person</p>' );

			fixture.detectChanges();

			expect( component.formDataPreview ).toEqual( '{"name":"John","surname":"Doe","description":"<p>An unidentified person</p>"}' );

			done();
		} );
	} );
} );
