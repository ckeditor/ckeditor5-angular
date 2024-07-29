import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from 'src/ckeditor';
import { DemoReactiveFormComponent } from './demo-reactive-form.component';

@NgModule( {
	declarations: [
		DemoReactiveFormComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: DemoReactiveFormComponent
			}
		] )
	]
} )
export class DemoReactiveFormModule {}
