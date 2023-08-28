/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type { promise } from 'protractor';
import { browser, by, element, Key } from 'protractor';

export class AppPage {
	public navigateTo( url = '' ) {
		return browser.get( '/' + url );
	}

	public getHeaderContent() {
		return cy.get( 'app-root h1' ).getText();
	}

	public getEditorContent(): promise.Promise<string> {
		return browser.executeScript( 'return arguments[0].innerHTML', cy.get( 'app-root #classic-editor' ) );
	}

	public getNameInputValue() {
		return cy.get( 'app-root  input#name' ).getAttribute( 'value' );
	}

	public async setNameInputValue( value: string ) {
		const el = cy.get( 'app-root  input#name' );

		await el.clear();
		await el.sendKeys( value );
	}

	public getSurnameInputValue() {
		return cy.get( 'app-root  input#surname' ).getAttribute( 'value' );
	}

	public async setSurnameInputValue( value: string ) {
		const el = cy.get( 'app-root  input#surname' );

		await el.clear();
		await el.sendKeys( value );
	}

	public getDescription() {
		return browser.executeScript( 'return arguments[0].innerHTML', cy.get( 'app-root #description .ck-editor__editable' ) );
	}

	public getFormDataPreview() {
		return cy.get( 'app-root pre' ).getText();
	}

	public async setDescription( value: string ) {
		const descEl = cy.get( 'app-root #description .ck-editor__editable' );

		// Select the whole content.
		await descEl.click();
		await browser.executeScript( 'document.execCommand( "selectAll", false, null )' );

		// Delete the content.
		await browser.actions().sendKeys( Key.DELETE ).perform();

		// Update it.
		await descEl.sendKeys( value );
	}
}
