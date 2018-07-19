import { browser, by, element, promise } from 'protractor';

export class AppPage {
	navigateTo( url = '' ) {
		return browser.get( '/' + url );
	}

	getHeaderContent() {
		return element( by.css( 'app-root h1' ) ).getText();
	}

	getEditorContent(): promise.Promise<string> {
		return browser.executeScript( 'return arguments[0].innerHTML', element( by.css( 'app-root #classic-editor' ) ) );
	}

	getNameInputValue() {
		return element( by.css( 'app-root  input#name' ) ).getAttribute( 'value' );
	}

	async setNameInputValue( value: string ) {
		const el = element( by.css( 'app-root  input#name' ) );

		await el.clear();
		await el.sendKeys( value );
	}

	getSurnameInputValue() {
		return element( by.css( 'app-root  input#surname' ) ).getAttribute( 'value' );
	}

	async setSurnameInputValue( value: string ) {
		const el = element( by.css( 'app-root  input#surname' ) );

		await el.clear();
		await el.sendKeys( value );
	}

	getDescription() {
		return browser.executeScript( 'return arguments[0].innerHTML', element( by.css( 'app-root #description .ck-editor__editable' ) ) );
	}

	getFormDataPreview() {
		return element( by.css( 'app-root pre' ) ).getText();
	}

	async setDescription( value: string ) {
		const descEl = element( by.css( 'app-root #description .ck-editor__editable' ) );

		// Select the whole content.
		await descEl.click();
		await browser.executeScript( 'document.execCommand( "selectAll", false, null )' );

		// Update it.
		await descEl.sendKeys( value );
	}
}
