import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { MultiRootCdnUsageComponent } from './multi-root-cdn-usage.component';

@NgModule( {
	declarations: [
		MultiRootCdnUsageComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: MultiRootCdnUsageComponent
			}
		] )
	]
} )
export class MultiRootCdnUsageModule {}
