import { Component, ElementRef, ViewChild } from '@angular/core';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';
import { AngularEditor, Context, ContextWatchdog } from '../../../ckeditor/build/ckeditor';

@Component( {
	selector: 'watchdog-demo',
	templateUrl: './watchdog-demo.html',
	styleUrls: [ './watchdog-demo.css' ]
} )
export class WatchdogDemoComponent {
	public Editor = AngularEditor;

	@ViewChild( CKEditorComponent ) public ckeditor?: ElementRef<CKEditorComponent>;

	public config: any;
	public watchdog: any;
	public ready = false;

	public isDisabled = false;

	// eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types
	public onReady( editor: AngularEditor ): void {
		console.log( editor );
	}

	public ngOnInit(): void {
		const contextConfig = {
			foo: 'bar'
		};

		this.config = {
			collaboration: {
				channelId: 'foobar-baz'
			}
		};

		this.watchdog = new ContextWatchdog( Context );

		this.watchdog.create( contextConfig )
			.then( () => {
				this.ready = true;
			} );
	}

	public toggle(): void {
		this.isDisabled = !this.isDisabled;
	}
}
