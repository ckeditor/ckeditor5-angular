import '@angular/compiler';
import { getTestBed } from '@angular/core/testing';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { beforeAll, beforeEach } from 'vitest';

window.CKEDITOR_GLOBAL_LICENSE_KEY = import.meta.env.CKEDITOR_LICENSE_KEY || 'GPL';

// The zoneless counterpart of `test-setup-zone.ts`: zone.js is not loaded at all, the way a default Angular 21+
// application is set up. The component has to work with both schedulers, so the `zoneless` Vitest project
// runs the library specs (`src/ckeditor/**`) with this file.
setupTestBed();

// Reset before every test as well. `setupTestBed()` resets after each test, but Vitest skips the remaining
// `afterEach` hooks once one of them throws, and the next test would then find the module already instantiated.
beforeEach( () => {
	getTestBed().resetTestingModule();
} );

// Checked once the spec file and its imports are loaded, so a spec that pulls in zone.js is caught too.
beforeAll( () => {
	if ( 'Zone' in globalThis ) {
		throw new Error( 'zone.js is loaded, but the `zoneless` project must run without it.' );
	}
} );
