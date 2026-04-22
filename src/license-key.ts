/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { GENERATED_CKEDITOR_LICENSE_KEY } from './generated/license-key';

export function initializeGlobalLicenseKey(): void {
	if ( typeof window !== 'undefined' && !window.CKEDITOR_GLOBAL_LICENSE_KEY ) {
		window.CKEDITOR_GLOBAL_LICENSE_KEY = GENERATED_CKEDITOR_LICENSE_KEY;
	}
}
