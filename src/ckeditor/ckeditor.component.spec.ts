/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MockEditor } from 'src/editor/mock-editor';

import { CKEditorComponent } from './ckeditor.component';
import { AngularIntegrationUsageDataPlugin } from './plugins/angular-integration-usage-data.plugin';

describe( 'CKEditorComponent', () => {
	let component: CKEditorComponent;
	let fixture: ComponentFixture<CKEditorComponent>;

	beforeEach( async () => {
		await TestBed.configureTestingModule( {
			declarations: [ CKEditorComponent ]
		} ).compileComponents();
	} );

	afterEach( () => {
		vi.unstubAllGlobals();
	} );

	describe( 'component initialization', () => {
		beforeEach( () => {
			vi.spyOn( console, 'warn' ).mockImplementation( () => {} );
		} );

		afterEach( () => {
			fixture.destroy();
			vi.unstubAllGlobals();
		} );

		it( 'should create', () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;

			expect( component ).toBeTruthy();
		} );

		it( 'should print a warning if the "window.CKEDITOR_VERSION" variable is not available', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', undefined );

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;

			expect( console.warn ).toHaveBeenCalledWith( 'Cannot find the "CKEDITOR_VERSION" in the "window" scope.' );
		} );

		it( 'should print a warning if using CKEditor 5 in version lower than 37', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '30.0.0' );

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;

			expect( console.warn ).toHaveBeenCalledWith(
				'The <CKEditor> component requires using CKEditor 5 in version 42+ or nightly build.'
			);
		} );

		it( 'should not print any warning if using CKEditor 5 in version 37 or higher', () => {
			vi.stubGlobal( 'CKEDITOR_VERSION', '42.0.0' );

			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;

			expect( console.warn ).not.toHaveBeenCalled();
		} );
	} );

	describe( 'component features', () => {
		beforeEach( async () => {
			fixture = TestBed.createComponent( CKEditorComponent );
			component = fixture.componentInstance;
			component.editor = MockEditor as any;
		} );

		afterEach( () => {
			fixture.destroy();
		} );

		describe( 'disabled state', () => {
			it( 'uses the initial disabled state before editor initialization', () => {
				component.setDisabledState( true );
				expect( component.disabled ).toBeTruthy();

				component.setDisabledState( false );
				expect( component.disabled ).toBeFalsy();
			} );
		} );

		describe( 'getConfig', () => {
			it( 'should return config with AngularIntegrationUsageDataPlugin if non-free license passed', async () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '44.0.0' );

				component.config.licenseKey = 'foo';
				fixture.detectChanges();

				await waitCycle();

				const config = ( component as any ).getConfig();

				expect( config.extraPlugins ).toContain( AngularIntegrationUsageDataPlugin );
			} );

			it( 'should not append AngularIntegrationUsageDataPlugin for the GPL license', async () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '44.0.0' );

				component.config.licenseKey = 'GPL';
				fixture.detectChanges();

				await waitCycle();

				const config = ( component as any ).getConfig();

				expect( config.extraPlugins ).not.toContain( AngularIntegrationUsageDataPlugin );
			} );
		} );

		describe( 'component data', () => {
			it( 'should pass config with initialData when using CKEditor 5 v47', async () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '47.0.0' );

				component.data = 'foo';
				fixture.detectChanges();

				await waitCycle();

				expect( ( component.editorInstance as any ).config.initialData ).toBe( 'foo' );
				expect( ( component.editorInstance as any ).config.roots ).toBeUndefined();
			} );

			it( 'should pass config with roots.main.initialData when using CKEditor 5 v48', async () => {
				vi.stubGlobal( 'CKEDITOR_VERSION', '48.0.0' );

				component.data = 'foo';
				fixture.detectChanges();

				await waitCycle();

				expect( ( component.editorInstance as any ).config.roots?.main?.initialData ).toBe( 'foo' );
				expect( ( component.editorInstance as any ).config.initialData ).toBeUndefined();
			} );

			it( 'should return component id', () => {
				expect( component.getId() ).toMatch( /e[0-9a-z]{32}/ );
			} );
		} );
	} );
} );

function waitCycle( time?: number ) {
	return new Promise( res => {
		setTimeout( res, time );
	} );
}
