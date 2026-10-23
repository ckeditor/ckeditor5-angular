import '@angular/compiler';
import 'zone.js';
import 'zone.js/testing';
import { provideZoneChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { beforeEach } from 'vitest';

window.CKEDITOR_GLOBAL_LICENSE_KEY = import.meta.env.CKEDITOR_LICENSE_KEY || 'GPL';

// Since Angular 21, `TestBed` runs zoneless unless told otherwise. The demo application still uses zone.js
// (see `provideZoneChangeDetection()` in `AppModule`), so the `zone` and `integration` projects keep the same
// scheduler. The library specs run a second time without zone.js, see `test-setup-zoneless.ts`.
setupTestBed( {
	zoneless: false,
	providers: [
		provideZoneChangeDetection()
	]
} );

// Reset before every test as well. `setupTestBed()` resets after each test, but Vitest skips the remaining
// `afterEach` hooks once one of them throws, and the next test would then find the module already instantiated.
beforeEach( () => {
	getTestBed().resetTestingModule();
} );
