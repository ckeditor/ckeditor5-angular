import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { InitializationCrashComponent } from './initialization-crash.component';

@NgModule( {
	declarations: [
		InitializationCrashComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: InitializationCrashComponent
			}
		] )
	]
} )
export class InitializationCrashModule {}
