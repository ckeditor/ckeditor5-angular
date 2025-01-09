/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { appendExtraPluginsToEditorConfig, isCKEditorFreeLicense } from '@ckeditor/ckeditor5-integrations-common';
import type { EditorConfig, PluginConstructor } from 'ckeditor5';

import { AngularIntegrationUsageDataPlugin } from './angular-integration-usage-data.plugin';

/**
 * Appends all integration plugins to the editor configuration.
 *
 * @param editorConfig The editor configuration.
 * @returns The editor configuration with all integration plugins appended.
 */
export function appendAllIntegrationPluginsToConfig( editorConfig: EditorConfig ): EditorConfig {
	const extraPlugins: Array<PluginConstructor> = [];

	if ( !isCKEditorFreeLicense( editorConfig.licenseKey ) ) {
		/**
		 * This part of the code is not executed in open-source implementations using a GPL key.
		 * It only runs when a specific license key is provided. If you are uncertain whether
		 * this applies to your installation, please contact our support team.
		 */
		extraPlugins.push( AngularIntegrationUsageDataPlugin );
	}

	return appendExtraPluginsToEditorConfig( editorConfig, extraPlugins );
}
