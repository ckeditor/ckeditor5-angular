import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { ContextDemoComponent } from './context-demo';

@NgModule( {
	declarations: [
		ContextDemoComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: ContextDemoComponent
			}
		] )
	]
} )
export class ContextDemoModule {}
