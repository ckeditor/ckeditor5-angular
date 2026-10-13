import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormField } from '@angular/forms/signals';

import { CKEditorModule } from 'src/ckeditor';
import { DemoSignalFormComponent } from './demo-signal-form.component';

@NgModule( {
	declarations: [
		DemoSignalFormComponent
	],
	imports: [
		BrowserModule,
		FormField,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: DemoSignalFormComponent
			}
		] )
	]
} )
export class DemoSignalFormModule {}
