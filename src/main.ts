import { enableProdMode } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { initializeGlobalLicenseKey } from './license-key';

if ( environment.production ) {
	enableProdMode();
}

initializeGlobalLicenseKey();

platformBrowser()
	.bootstrapModule( AppModule )
	.catch( err => console.log( err ) );
