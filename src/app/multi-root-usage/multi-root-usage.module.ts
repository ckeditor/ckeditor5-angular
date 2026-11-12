import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { MultiRootUsageComponent } from './multi-root-usage.component';

@NgModule( {
	declarations: [
		MultiRootUsageComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: MultiRootUsageComponent
			}
		] )
	]
} )
export class MultiRootUsageModule {}
