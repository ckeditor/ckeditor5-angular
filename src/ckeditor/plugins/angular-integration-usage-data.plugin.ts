/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { VERSION } from '@angular/core';
import { createIntegrationUsageDataPlugin } from '@ckeditor/ckeditor5-integrations-common';

/**
 * This part of the code is not executed in open-source implementations using a GPL key.
 * It only runs when a specific license key is provided. If you are uncertain whether
 * this applies to your installation, please contact our support team.
 */
export const AngularIntegrationUsageDataPlugin = createIntegrationUsageDataPlugin(
	'angular',
	{
		version: /* replace-version:start */ '10.0.0-alpha.0' /* replace-version:end */,
		frameworkVersion: VERSION.full
	}
);
