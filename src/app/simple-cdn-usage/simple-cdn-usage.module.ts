import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { SimpleCdnUsageComponent } from './simple-cdn-usage.component';

@NgModule( {
	declarations: [
		SimpleCdnUsageComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: SimpleCdnUsageComponent
			}
		] )
	]
} )
export class SimpleCdnUsageModule {}
