import '@angular/compiler';
import 'zone.js';
import 'zone.js/plugins/sync-test';
import 'zone.js/plugins/proxy';
import 'zone.js/testing';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
	BrowserTestingModule,
	platformBrowserTesting
} from '@angular/platform-browser/testing';
import { beforeEach } from 'vitest';

window.CKEDITOR_GLOBAL_LICENSE_KEY = import.meta.env.CKEDITOR_LICENSE_KEY || 'GPL';

const globalState = globalThis as typeof globalThis & {
	ckeditorTestBedInitialized?: boolean;
};

/**
 * Since Angular 21, `TestBed` runs zoneless unless told otherwise. The demo application still uses
 * zone.js (see `provideZoneChangeDetection()` in `AppModule`), so the tests keep the same scheduler.
 */
@NgModule( {
	providers: [
		provideZoneChangeDetection()
	]
} )
class ZoneChangeDetectionTestingModule {}

if ( !globalState.ckeditorTestBedInitialized ) {
	getTestBed().initTestEnvironment(
		[ BrowserTestingModule, ZoneChangeDetectionTestingModule ],
		platformBrowserTesting()
	);

	globalState.ckeditorTestBedInitialized = true;
}

beforeEach( () => {
	getTestBed().resetTestingModule();
} );
