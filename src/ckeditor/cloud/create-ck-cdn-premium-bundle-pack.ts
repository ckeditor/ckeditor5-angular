/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type * as CKEditorPremiumFeatures from 'ckeditor5-premium-features';

import type { CKCdnResourcesPack } from './load-ck-cdn-resources-pack';
import type { CKCdnBaseBundlePackConfig } from './create-ck-cdn-base-bundle-pack';

import { createCKCdnUrl } from './create-ck-cdn-url';
import { waitForWindowEntry } from '../utils/wait-for-window-entry';
import { injectScriptsInParallel } from '../utils/inject-script';

/**
 * Type of the exported global variables of the CKEditor Premium Features.
 */
declare global {
	interface Window {
		CKEDITOR_PREMIUM_FEATURES: typeof CKEditorPremiumFeatures;
		'ckeditor5-premium-features': Window['CKEDITOR_PREMIUM_FEATURES'];
	}
}

/**
 * Creates a pack of resources for the CKEditor Premium Features.
 *
 * @param config The configuration of the CKEditor Premium Features pack.
 * @returns A pack of resources for the CKEditor Premium Features.
 * @example
 *
 * ```ts
 * const { SlashCommand } = await loadCKCdnResourcesPack(
 * 	createCKCdnPremiumBundlePack( {
 * 		version: '42.0.0',
 * 		languages: [ 'en', 'de' ]
 * 	} )
 * );
 * ```
 */
export const createCKCdnPremiumBundlePack = (
	{
		version,
		languages
	}: CKCdnPremiumBundlePackConfig
): CKCdnResourcesPack<Window['CKEDITOR_PREMIUM_FEATURES']> => {
	const urls = {
		scripts: [
			// Load the main script of the premium features.
			createCKCdnUrl( 'ckeditor5-premium-features', 'ckeditor5-premium-features.umd.js' )( version ),

			// Load all JavaScript files from the premium features.
			...( languages || [] ).map( language =>
				createCKCdnUrl( 'ckeditor5-premium-features', `translations/${ language }.umd.js` )( version )
			)
		],

		stylesheets: [
			createCKCdnUrl( 'ckeditor5-premium-features', 'ckeditor5-premium-features.css' )( version )
		]
	};

	return {
		// Preload resources specified in the pack, before loading the main script.
		preload: [
			...urls.stylesheets,
			...urls.scripts
		],

		scripts: [
			// It's safe to load translations and the main script in parallel.
			async () => injectScriptsInParallel( urls.scripts )
		],

		// Load all stylesheets of the premium features.
		stylesheets: urls.stylesheets,

		// Pick the exported global variables from the window object.
		getExportedEntries: async () =>
			waitForWindowEntry( [ 'ckeditor5-premium-features', 'CKEDITOR_PREMIUM_FEATURES' ] )
	};
};

/**
 * Configuration of the CKEditor Premium Features pack.
 */
export type CKCdnPremiumBundlePackConfig = Pick<CKCdnBaseBundlePackConfig, 'languages' | 'version'>;
