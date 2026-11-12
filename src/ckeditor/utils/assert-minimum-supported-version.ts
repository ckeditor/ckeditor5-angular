/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { compareInstalledCKBaseVersion } from '@ckeditor/ckeditor5-integrations-common';

/**
 * Checks if currently installed version of the editor is supported by the integration.
 */
export function assertMinimumSupportedVersion(): void {
	switch ( compareInstalledCKBaseVersion( '49.0.0' ) ) {
		case null:
			console.warn( 'Cannot find the "CKEDITOR_VERSION" in the "window" scope.' );
			break;

		case -1:
			console.warn( 'The <CKEditor> component requires using CKEditor 5 in version 49+ or nightly build.' );
			break;
	}
}
