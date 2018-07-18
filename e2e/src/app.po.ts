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
		return element( by.css( 'input#name' ) ).getAttribute( 'value' );
	}

	setNameInputValue( value: string ) {
		const el = element( by.css( 'input#name' ) );

		return el.clear().then( () => el.sendKeys( value ) );
	}

	getSurnameInputValue() {
		return element( by.css( 'input#surname' ) ).getAttribute( 'value' );
	}

	setSurnameInputValue( value: string ) {
		const el = element( by.css( 'input#surname' ) );

		return el.clear().then( () => el.sendKeys( value ) );
	}

	getDescription() {
		return browser.executeScript( 'return arguments[0].innerHTML', element( by.css( 'app-root #description .ck-editor__editable' ) ) );
	}
}
