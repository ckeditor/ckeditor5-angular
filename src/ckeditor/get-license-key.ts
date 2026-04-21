/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

export function getLicenseKey(): string {
	if ( typeof window !== 'undefined' && window.CKEDITOR_GLOBAL_LICENSE_KEY ) {
		return window.CKEDITOR_GLOBAL_LICENSE_KEY;
	}

	return 'GPL';
}
