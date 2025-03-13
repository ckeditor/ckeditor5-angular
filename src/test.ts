// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.CKEDITOR_GLOBAL_LICENSE_KEY = 'GPL';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting()
);
