import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { ErrorHandlingDemoComponent } from './error-handling-demo';

@NgModule( {
	declarations: [
		ErrorHandlingDemoComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: ErrorHandlingDemoComponent
			}
		] )
	]
} )
export class ErrorHandlingDemoModule {}
