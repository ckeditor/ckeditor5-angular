import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { CKEditorModule } from 'src/ckeditor';
import { DestroyDuringCreationComponent } from './destroy-during-creation.component';

@NgModule( {
	declarations: [
		DestroyDuringCreationComponent
	],
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forChild( [
			{
				path: '',
				component: DestroyDuringCreationComponent
			}
		] )
	]
} )
export class DestroyDuringCreationModule {}
