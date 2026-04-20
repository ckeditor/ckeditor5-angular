/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

'use strict';

const path = require( 'node:path' );
const fs = require( 'node:fs' );

function runPostinstall( {
	fileSystem = fs,
	pathModule = path,
	rootDirectory = path.join( __dirname, '..' ),
	installHusky = () => require( 'husky' ).install()
} = {} ) {
	const generatedLicenseKeyFile = pathModule.join( rootDirectory, 'src', 'generated', 'license-key.ts' );
	const generatedLicenseKeyDirectory = pathModule.dirname( generatedLicenseKeyFile );

	fileSystem.mkdirSync( generatedLicenseKeyDirectory, { recursive: true } );
	fileSystem.writeFileSync( generatedLicenseKeyFile, 'export const GENERATED_CKEDITOR_LICENSE_KEY = \'GPL\';\n' );

	// When installing a repository as a dependency, the `.git` directory does not exist.
	// In such a case, husky should not attach its hooks as npm treats it as a package, not a git repository.
	if ( fileSystem.existsSync( pathModule.join( rootDirectory, '.git' ) ) ) {
		installHusky();
	}
}

if ( require.main === module ) {
	runPostinstall();
}

module.exports = {
	runPostinstall
};
