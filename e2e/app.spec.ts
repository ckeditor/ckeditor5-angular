/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { test, expect } from '@playwright/test';

test.describe( 'App', () => {
	test.describe( 'simple-usage', () => {
		test.beforeEach( async ( { page } ) => {
			await page.goto( '/' );
		} );

		test( 'should display header message', async ( { page } ) => {
			await expect( page.locator( 'app-root h1' ) ).toHaveText( 'CKEditor 5 integration with Angular' );
		} );

		test( 'should display editor with set content', async ( { page } ) => {
			await expect( page.locator( 'app-root #classic-editor' ) )
				.toContainText( 'Getting used to an entirely different culture can be challenging.' );
		} );
	} );

	test.describe( 'demo-form', () => {
		test.beforeEach( async ( { page } ) => {
			await page.goto( '/forms' );
		} );

		test( 'should set initial values for name and surname fields', async ( { page } ) => {
			await expect( page.locator( 'app-root input#name' ) ).toHaveValue( 'John' );
			await expect( page.locator( 'app-root input#surname' ) ).toHaveValue( 'Doe' );
		} );

		test( 'should set initial value for the description', async ( { page } ) => {
			const description = page.locator( 'app-root #description .ck-editor__editable' );

			await expect.poll( () => description.innerHTML() ).toContain( '<p>A <strong>really</strong> nice fellow.</p>' );
		} );

		test( 'should show and update json data preview', async ( { page } ) => {
			const preview = page.locator( 'app-root pre' );

			await expect( preview ).toContainText(
				'{"name":"John","surname":"Doe","description":"<p>A <b>really</b> nice fellow.</p>"}'
			);

			await page.locator( 'app-root input#name' ).fill( 'Jessica' );
			await page.locator( 'app-root input#surname' ).fill( 'Jones' );
			await page.locator( 'app-root #description .ck-editor__editable' ).evaluate( ( element: any ) => {
				element.ckeditorInstance.setData( 'A superhero!' );
			} );

			await expect( preview ).toContainText( '{"name":"Jessica","surname":"Jones","description":"<p>A superhero!</p>"}' );
		} );
	} );
} );
