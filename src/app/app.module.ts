import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { CKEditorModule } from '../ckeditor/ckeditor.module';
import { SimpleUsageComponent } from './simple-usage/simple-usage.component';
import { DemoFormComponent } from './demo-form/demo-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatFormFieldModule } from '@angular/material';
import { MaterialDesignComponent } from './material-design/material-design.component';

const appRoutes: Routes = [
	{ path: '', redirectTo: '/simple-usage', pathMatch: 'full' },
	{ path: 'simple-usage', component: SimpleUsageComponent },
	{ path: 'forms', component: DemoFormComponent },
	{ path: 'material', component: MaterialDesignComponent }
];

@NgModule( {
	imports: [
		BrowserModule,
		FormsModule,
		CKEditorModule,
		RouterModule.forRoot( appRoutes ),
		BrowserAnimationsModule,
		MatButtonModule,
		MatFormFieldModule
	],
	declarations: [
		AppComponent,
		DemoFormComponent,
		SimpleUsageComponent,
		MaterialDesignComponent,
	],
	providers: [],
	bootstrap: [ AppComponent ]
} )

export class AppModule { }
