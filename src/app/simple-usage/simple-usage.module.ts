import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { SimpleUsageComponent } from './simple-usage.component';

@NgModule( {
	declarations: [
		SimpleUsageComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: SimpleUsageComponent
			}
		] )
	]
} )
export class SimpleUsageModule {}
