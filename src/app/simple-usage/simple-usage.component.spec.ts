import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CKEditorModule } from '../../../lib/ckeditor.module';
import { SimpleUsageComponent } from './simple-usage.component';

describe( 'SimpleUsageComponent', () => {
	let component: SimpleUsageComponent;
	let fixture: ComponentFixture<SimpleUsageComponent>;

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
		fixture.detectChanges();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	describe( 'isDisabled', () => {
		it( 'should equal to true when editor is disabled', () => {
			expect( component.isDisabled ).toBeFalsy();

			component.toggleDisableEditors();

			expect( component.isDisabled ).toBeTruthy();

			component.toggleDisableEditors();

			expect( component.isDisabled ).toBeFalsy();
		} );
	} );
} );
