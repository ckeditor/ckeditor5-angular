import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';

import { ShadowRootHostModule } from '../shared/shadow-root-host.module';
import { ShadowRootModeSelectModule } from '../shared/shadow-root-mode-select.module';
import { ShadowDomCdnUsageComponent } from './shadow-dom-cdn-usage.component';

@NgModule( {
	declarations: [
		ShadowDomCdnUsageComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		ShadowRootHostModule,
		ShadowRootModeSelectModule,
		RouterModule.forChild( [
			{
				path: '',
				component: ShadowDomCdnUsageComponent
			}
		] )
	]
} )
export class ShadowDomCdnUsageModule {}
