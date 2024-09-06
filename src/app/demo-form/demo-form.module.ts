import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CKEditorModule } from 'src/ckeditor';
import { DemoFormComponent } from './demo-form.component';

@NgModule( {
	declarations: [
		DemoFormComponent
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: DemoFormComponent
			}
		] )
	]
} )
export class DemoFormModule {}
