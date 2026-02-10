import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { beforeEach } from 'vitest';

window.CKEDITOR_GLOBAL_LICENSE_KEY = 'GPL';

const globalState = globalThis as typeof globalThis & {
	ckeditorTestBedInitialized?: boolean;
};

if ( !globalState.ckeditorTestBedInitialized ) {
	getTestBed().initTestEnvironment(
		BrowserDynamicTestingModule,
		platformBrowserDynamicTesting()
	);

	globalState.ckeditorTestBedInitialized = true;
}

beforeEach( () => {
	getTestBed().resetTestingModule();
} );
