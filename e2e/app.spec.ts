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
	test.describe( 'multi-root-usage', () => {
		test.beforeEach( async ( { page } ) => {
			await page.goto( '/multi-root-usage' );
		} );

		test( 'should display the toolbar and an editable for every root', async ( { page } ) => {
			const editor = page.locator( 'app-root #multi-root-editor' );

			await expect( editor.locator( '.ck-toolbar' ) ).toBeVisible();
			await expect( editor.locator( '.ck-editor__editable' ) ).toHaveCount( 3 );
			await expect( editor.locator( '[data-root="intro"] .ck-editor__editable' ) )
				.toContainText( 'This is an instance of the multi-root editor type.' );
			await expect( editor.locator( '[data-root="outro"] .ck-editor__editable' ) ).toContainText( 'CKEditor Builder' );
		} );

		test( 'should update the data when typing in a root', async ( { page } ) => {
			const editable = page.locator( 'app-root #multi-root-editor [data-root="content"] .ck-editor__editable' );

			await editable.click();
			await page.keyboard.press( 'End' );
			await page.keyboard.type( ' Typed in Angular.' );

			await expect( page.locator( 'app-root #multi-root-data' ) ).toContainText( 'It is the custom content. Typed in Angular.' );
		} );

		test( 'should add and remove roots', async ( { page } ) => {
			const editor = page.locator( 'app-root #multi-root-editor' );
			const data = page.locator( 'app-root #multi-root-data' );

			await page.locator( 'app-root #add-root' ).click();

			await expect( editor.locator( '.ck-editor__editable' ) ).toHaveCount( 4 );
			await expect( editor.locator( '[data-root="root-1"] .ck-editor__editable' ) ).toContainText( 'Root 1' );
			await expect( data ).toContainText( '"root-1": "<p>Root 1</p>"' );

			await editor.locator( '[data-root="intro"] .remove-root' ).click();

			await expect( editor.locator( '.ck-editor__editable' ) ).toHaveCount( 3 );
			await expect( editor.locator( '[data-root="intro"]' ) ).toHaveCount( 0 );
			await expect( data ).not.toContainText( '"intro"' );
		} );

		test( 'should replace the data from the application', async ( { page } ) => {
			const editor = page.locator( 'app-root #multi-root-editor' );

			await page.locator( 'app-root #reset-data' ).click();

			await expect( editor.locator( '.ck-editor__editable' ) ).toHaveCount( 2 );
			await expect( editor.locator( '[data-root="content"] .ck-editor__editable' ) )
				.toContainText( 'The data was replaced from the application.' );
			await expect( editor.locator( '[data-root="outro"]' ) ).toHaveCount( 0 );
		} );
	} );

	test.describe( 'multi-root-cdn-usage', () => {
		test.beforeEach( async ( { page } ) => {
			await page.goto( '/multi-root-cdn-usage' );
		} );

		test( 'should display the default layout with the menu bar, the toolbar and the editables', async ( { page } ) => {
			const editor = page.locator( 'app-root #multi-root-cdn-editor' );

			await expect( editor.locator( '.ck-menu-bar' ) ).toBeVisible();
			await expect( editor.locator( '.ck-toolbar' ) ).toBeVisible();
			await expect( editor.locator( '.ck-editor__editable' ) ).toHaveCount( 3 );
			await expect( editor.locator( '.ck-editor__editable' ).first() ).toContainText( 'Multi-root editor from CDN' );
		} );
	} );
} );
