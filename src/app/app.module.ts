import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { CKEditorModule } from '../ckeditor/ckeditor.module';
import { SimpleUsageComponent } from './simple-usage/simple-usage.component';
import { DemoFormComponent } from './demo-form/demo-form.component';
import { DemoReactiveFormComponent } from './demo-reactive-form/demo-reactive-form.component';
import { ContextDemoComponent } from './context-demo/context-demo';
import { WatchdogDemoComponent } from './watchdog-demo/watchdog-demo';

const appRoutes: Routes = [
	{ path: '', redirectTo: '/simple-usage', pathMatch: 'full' },
	{ path: 'context', component: ContextDemoComponent },
	{ path: 'forms', component: DemoFormComponent },
	{ path: 'reactive-forms', component: DemoReactiveFormComponent },
	{ path: 'simple-usage', component: SimpleUsageComponent },
	{ path: 'watchdog', component: WatchdogDemoComponent }
];

@NgModule( {
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		CKEditorModule,
		RouterModule.forRoot( appRoutes )
	],
	declarations: [
		AppComponent,
		ContextDemoComponent,
		DemoFormComponent,
		DemoReactiveFormComponent,
		SimpleUsageComponent,
		WatchdogDemoComponent
	],
	providers: [],
	bootstrap: [ AppComponent ]
} )

export class AppModule {}
