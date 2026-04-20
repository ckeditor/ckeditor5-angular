import { afterEach, describe, expect, it, vi } from 'vitest';

describe( 'license-key helpers', () => {
	afterEach( () => {
		vi.unstubAllGlobals();
	} );

	it( 'uses the global license key when it is available', async () => {
		vi.stubGlobal( 'CKEDITOR_GLOBAL_LICENSE_KEY', 'foo' );

		const { getGlobalLicenseKey } = await import( './license-key' );

		expect( getGlobalLicenseKey() ).toBe( 'foo' );
	} );

	it( 'falls back to the generated default license key', async () => {
		vi.stubGlobal( 'CKEDITOR_GLOBAL_LICENSE_KEY', undefined );

		const { getGlobalLicenseKey, initializeGlobalLicenseKey } = await import( './license-key' );

		expect( getGlobalLicenseKey() ).toBe( 'GPL' );

		initializeGlobalLicenseKey();

		expect( window.CKEDITOR_GLOBAL_LICENSE_KEY ).toBe( 'GPL' );
	} );

	it( 'does not overwrite an existing global license key during initialization', async () => {
		vi.stubGlobal( 'CKEDITOR_GLOBAL_LICENSE_KEY', 'foo' );

		const { initializeGlobalLicenseKey } = await import( './license-key' );

		initializeGlobalLicenseKey();

		expect( window.CKEDITOR_GLOBAL_LICENSE_KEY ).toBe( 'foo' );
	} );
} );
