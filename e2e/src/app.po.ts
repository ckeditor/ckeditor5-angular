import { browser, by, element } from 'protractor';

export class AppPage {
	navigateTo() {
		return browser.get( '/' );
	}

	getHeaderContent() {
		return element( by.css( 'app-root h1' ) ).getText();
	}

	getEditorContent() {
		return browser.executeScript( 'return arguments[0].innerHTML', element( by.css( 'app-simple-usage #classic-editor' ) ) );
	}
}
