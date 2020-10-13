import { Component, ElementRef, ViewChild } from '@angular/core';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';
import * as CKSource from '../../../ckeditor/build/cksource';

@Component( {
	selector: 'watchdog-demo',
	templateUrl: './watchdog-demo.html',
	styleUrls: [ './watchdog-demo.css' ]
} )
export class WatchdogDemoComponent {
	public Editor = CKSource.ClassicEditor;
	@ViewChild( CKEditorComponent ) ckeditor?: ElementRef<CKEditorComponent>;

	public context: any;
	public config: any;
	public watchdog: any;
	public ready = false;

	public isDisabled = false;

	public onReady( editor: any ): void {
		console.log( editor );
	}

	ngOnInit(): void {
		const contextConfig = {
			foo: 'bar'
		};

		this.config = {
			collaboration: {
				channelId: 'foobar-baz'
			}
		};

		this.watchdog = new CKSource.ContextWatchdog( CKSource.Context );

		this.watchdog.create( contextConfig )
			.then( () => {
				this.ready = true;
			} );
	}

	toggle(): void {
		this.isDisabled = !this.isDisabled;
	}
}
