import { NgModule } from '@angular/core';
import { ShadowRootHostComponent } from './shadow-root-host.component';

@NgModule( {
	declarations: [ ShadowRootHostComponent ],
	exports: [ ShadowRootHostComponent ]
} )
export class ShadowRootHostModule {}
