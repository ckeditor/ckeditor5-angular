import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, type Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CKEditorModule } from '../ckeditor/ckeditor.module';

const appRoutes: Routes = [
	{ path: '', redirectTo: '/simple-usage', pathMatch: 'full' },
	{
		path: 'context',
		loadChildren: () => import( './context-demo/context-demo.module' ).then( m => m.ContextDemoModule )
	},
	{
		path: 'forms',
		loadChildren: () => import( './demo-form/demo-form.module' ).then( m => m.DemoFormModule )
	},
	{
		path: 'reactive-forms',
		loadChildren: () => import( './demo-reactive-form/demo-reactive-form.module' ).then( m => m.DemoReactiveFormModule )
	},
	{
		path: 'reuse-watchdog',
		loadChildren: () => import( './reuse-watchdog-demo/reuse-watchdog-demo.module' ).then( m => m.ReuseWatchdogDemoModule )
	},
	{
		path: 'simple-usage',
		loadChildren: () => import( './simple-usage/simple-usage.module' ).then( m => m.SimpleUsageModule )
	},
	{
		path: 'simple-cdn-usage',
		loadChildren: () => import( './simple-cdn-usage/simple-cdn-usage.module' ).then( m => m.SimpleCdnUsageModule )
	},
	{
		path: 'init-crash',
		loadChildren: () => import( './initialization-crash/initialization-crash.module' ).then( m => m.InitializationCrashModule )
	}
];

@NgModule( {
	imports: [
		BrowserModule,
		CKEditorModule,
		RouterModule.forRoot( appRoutes, {
			onSameUrlNavigation: 'reload'
		} )
	],
	declarations: [
		AppComponent
	],
	providers: [],
	bootstrap: [ AppComponent ]
} )

export class AppModule {}
