import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { EditorWatchdogDemoComponent } from './editor-watchdog-demo';

@NgModule( {
	declarations: [
		EditorWatchdogDemoComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: EditorWatchdogDemoComponent
			}
		] )
	]
} )
export class EditorWatchdogDemoModule {}
