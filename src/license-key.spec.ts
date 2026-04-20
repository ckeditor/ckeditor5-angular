import { afterEach, describe, expect, it, vi } from 'vitest';

import { getGlobalLicenseKey } from './ckeditor/license-key';
import { GENERATED_CKEDITOR_LICENSE_KEY } from './generated/license-key';

describe( 'license key initialization', () => {
	afterEach( () => {
		vi.unstubAllGlobals();
	} );

	it( 'returns GPL when the global license key is missing', () => {
		vi.stubGlobal( 'CKEDITOR_GLOBAL_LICENSE_KEY', undefined );

		expect( getGlobalLicenseKey() ).toBe( 'GPL' );
	} );

	it( 'returns the global license key when it is defined', () => {
		vi.stubGlobal( 'CKEDITOR_GLOBAL_LICENSE_KEY', 'foo' );

		expect( getGlobalLicenseKey() ).toBe( 'foo' );
	} );

	it( 'uses the generated default license key when the global is missing', async () => {
		vi.stubGlobal( 'CKEDITOR_GLOBAL_LICENSE_KEY', undefined );

		const { initializeGlobalLicenseKey } = await import( './license-key' );

		initializeGlobalLicenseKey();

		expect( window.CKEDITOR_GLOBAL_LICENSE_KEY ).toBe( GENERATED_CKEDITOR_LICENSE_KEY );
	} );

	it( 'does not overwrite an existing global license key during initialization', async () => {
		vi.stubGlobal( 'CKEDITOR_GLOBAL_LICENSE_KEY', 'foo' );

		const { initializeGlobalLicenseKey } = await import( './license-key' );

		initializeGlobalLicenseKey();

		expect( window.CKEDITOR_GLOBAL_LICENSE_KEY ).toBe( 'foo' );
	} );
} );
