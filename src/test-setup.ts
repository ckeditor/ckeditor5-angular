import '@angular/compiler';
import 'zone.js';
import 'zone.js/plugins/sync-test';
import 'zone.js/plugins/proxy';
import 'zone.js/testing';
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
