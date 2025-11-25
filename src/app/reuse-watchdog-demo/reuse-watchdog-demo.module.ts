import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { ReuseWatchdogDemoComponent } from './reuse-watchdog-demo';

@NgModule( {
	declarations: [
		ReuseWatchdogDemoComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: ReuseWatchdogDemoComponent
			}
		] )
	]
} )
export class ReuseWatchdogDemoModule {}
