/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

describe( 'App', () => {
	describe( 'simple-usage', () => {
		beforeEach( () => {
			cy.visit( '/' );
		} );

		it( 'should display header message', () => {
			const heading = cy.get( 'app-root h1' );

			heading.should( 'have.text', 'CKEditor 5 integration with Angular' );
		} );

		it( 'should display editor with set content', () => {
			const editor = cy.get( 'app-root #classic-editor' );

			editor.should( $el => {
				expect( $el.text() ).to.includes( 'Getting used to an entirely different culture can be challenging.' );
			} );
		} );
	} );

	describe( 'demo-form', () => {
		beforeEach( () => {
			cy.visit( '/forms' );
		} );

		it( 'should set initial values for name and surname fields', () => {
			cy.get( 'app-root input#name' ).should( 'have.value', 'John' );
			cy.get( 'app-root input#surname' ).should( 'have.value', 'Doe' );
		} );

		it( 'should set initial value for the description', () => {
			const description = cy.get( 'app-root #description .ck-editor__editable' );

			description.should( $el => {
				expect( $el.html() ).to.includes( '<p>A <strong>really</strong> nice fellow.</p>' );
			} );
		} );

		it( 'should show and update json data preview', () => {
			cy.get( 'app-root pre' ).should( $el => {
				expect( $el.text() ).to.includes( '{"name":"John","surname":"Doe","description":"<p>A <b>really</b> nice fellow.</p>"}' );
			} );

			cy.get( 'app-root input#name' ).clear().type( 'Jessica' );
			cy.get( 'app-root input#surname' ).clear().type( 'Jones' );
			cy.get( 'app-root #description' ).within( () => {
				cy.window().should( window => {
					const { ckeditorInstance } = window.document.querySelector( 'app-root #description .ck-editor__editable' ) as any;

					ckeditorInstance.setData( 'A superhero!' );
				} );
			} );

			cy.get( 'app-root pre' ).should( $el => {
				expect( $el.text() ).to.includes( '{"name":"Jessica","surname":"Jones","description":"<p>A superhero!</p>"}' );
			} );
		} );
	} );
} );
