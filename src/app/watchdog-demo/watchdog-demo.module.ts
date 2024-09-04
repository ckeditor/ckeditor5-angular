import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { WatchdogDemoComponent } from './watchdog-demo';

@NgModule( {
	declarations: [
		WatchdogDemoComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: WatchdogDemoComponent
			}
		] )
	]
} )
export class WatchdogDemoModule {}
