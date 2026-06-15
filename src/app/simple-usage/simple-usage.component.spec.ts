import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CKEditorModule } from '../../ckeditor/ckeditor.module';
import { SimpleUsageComponent } from './simple-usage.component';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';

describe( 'SimpleUsageComponent', () => {
	let component: SimpleUsageComponent;
	let fixture: ComponentFixture<SimpleUsageComponent>;
	let ckeditorComponent: CKEditorComponent;
	let debugElement: DebugElement;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			declarations: [ SimpleUsageComponent ],
			imports: [ CKEditorModule ]
		} )
			.compileComponents();

		fixture = TestBed.createComponent( SimpleUsageComponent );
		component = fixture.componentInstance;

		fixture.detectChanges();

		debugElement = fixture.debugElement.query( By.directive( CKEditorComponent ) );
		ckeditorComponent = debugElement.componentInstance;
	} );

	afterEach( () => {
		fixture.destroy();
	} );

	it( 'should create', () => {
		expect( component ).toBeTruthy();
	} );

	describe( 'disabled state', () => {
		it( 'should be set to false at start', () => {
			expect( component.isDisabled() ).toBeFalsy();
		} );

		it( 'should be synced', () => {
			component.toggleDisableEditors();
			fixture.detectChanges();

			expect( component.isDisabled() ).toBeTruthy();
			expect( ckeditorComponent.disabled ).toBeTruthy();

			component.toggleDisableEditors();
			fixture.detectChanges();

			expect( component.isDisabled() ).toBeFalsy();
			expect( ckeditorComponent.disabled ).toBeFalsy();
		} );
	} );

	describe( 'data', () => {
		it( 'should set initial data on the `<ckeditor>` component', () => {
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
			ckeditorComponent.ready.emit();

			expect( component.componentEvents ).toContain( 'The editor is ready.' );
		} );

		it( 'change should be called on ckeditorComponent.change()', () => {
			ckeditorComponent.change.emit();

			expect( component.componentEvents ).toContain( 'Editor model changed.' );
		} );

		it( 'focus should be called on ckeditorComponent.focus()', () => {
			ckeditorComponent.focus.emit();

			expect( component.componentEvents ).toContain( 'Focused the editing view.' );
		} );

		it( 'blur should be called on ckeditorComponent.blur()', () => {
			ckeditorComponent.blur.emit();

			expect( component.componentEvents ).toContain( 'Blurred the editing view.' );
		} );

		it( 'error should be called on ckeditorComponent.error()', () => {
			ckeditorComponent.error.emit();

			expect( component.componentEvents ).toContain( 'The editor crashed.' );
		} );
	} );

	describe( 'inline mode', () => {
		afterEach( () => {
			vi.useRealTimers();
		} );

		it( 'should have isInline false by default', () => {
			expect( component.isInline() ).toBeFalsy();
		} );

		it( 'should have isEditorVisible true by default', () => {
			expect( component.isEditorVisible() ).toBeTruthy();
		} );

		it( 'should derive $root modelElement from isInline by default', () => {
			expect( component.editorConfig().root.modelElement ).toBe( '$root' );
		} );

		it( 'should toggle isInline and hide the editor immediately', () => {
			vi.useFakeTimers();

			component.toggleInlineMode();

			expect( component.isInline() ).toBeTruthy();
			expect( component.isEditorVisible() ).toBeFalsy();
		} );

		it( 'should derive $inlineRoot modelElement from isInline after toggle', () => {
			vi.useFakeTimers();

			component.toggleInlineMode();

			expect( component.editorConfig().root.modelElement ).toBe( '$inlineRoot' );
		} );

		it( 'should restore isEditorVisible after the setTimeout fires', () => {
			vi.useFakeTimers();

			component.toggleInlineMode();
			expect( component.isEditorVisible() ).toBeFalsy();

			vi.runAllTimers();
			fixture.detectChanges();

			expect( component.isEditorVisible() ).toBeTruthy();
		} );

		it( 'should remount the <ckeditor> component after the timer fires', () => {
			vi.useFakeTimers();

			component.toggleInlineMode();
			fixture.detectChanges();

			expect( fixture.debugElement.query( By.directive( CKEditorComponent ) ) ).toBeNull();

			vi.runAllTimers();
			fixture.detectChanges();

			expect( fixture.debugElement.query( By.directive( CKEditorComponent ) ) ).not.toBeNull();
		} );

		it( 'should toggle back to $root when called a second time', () => {
			vi.useFakeTimers();

			component.toggleInlineMode();
			vi.runAllTimers();

			component.toggleInlineMode();

			expect( component.isInline() ).toBeFalsy();
			expect( component.editorConfig().root.modelElement ).toBe( '$root' );
		} );
	} );
} );
