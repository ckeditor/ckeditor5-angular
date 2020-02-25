import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';
import * as CKSource from '../../../ckeditor/build/cksource';

@Component( {
	selector: 'watchdog-demo',
	templateUrl: './watchdog-demo.html',
	styleUrls: [ './watchdog-demo.css' ]
} )
export class WatchdogDemoComponent {
	public Editor = CKSource.ClassicEditor;
	@ViewChild( CKEditorComponent, { static: false } ) ckeditor?: ElementRef<CKEditorComponent>;

	public context: any;
	public config: any;
	public watchdog: any;
	public ready = false;

	constructor( private ngZone: NgZone ) {
		this.ngZone = ngZone;
	}

	public onReady( editor: any ) {
		console.log( editor );
	}

	async ngOnInit() {
		const contextConfig = {
			// Fill in cloud services data here:
			cloudServices: {
				tokenUrl: 'https://33333.cke-cs.com/token/dev/dbIg4Hr2bqf5bSV3wuzN8bW8td7OAStvLjRlJof9ZW13cUXRHRraVJsD8J9J',
				webSocketUrl: '33333.cke-cs.com/ws',
				uploadUrl: 'https://33333.cke-cs.com/easyimage/upload/'
			},
			collaboration: {
				channelId: 'foobar'
			},
			presenceList: {
				container: document.createElement( 'div' )
			},
			sidebar: {
				container: document.createElement( 'div' )
			}
		};

		this.config = {
			collaboration: {
				channelId: 'foobar-baz'
			},
			cloudServices: {
				tokenUrl: 'https://33333.cke-cs.com/token/dev/dbIg4Hr2bqf5bSV3wuzN8bW8td7OAStvLjRlJof9ZW13cUXRHRraVJsD8J9J',
				webSocketUrl: '33333.cke-cs.com/ws',
				uploadUrl: 'https://33333.cke-cs.com/easyimage/upload/'
			},
			presenceList: {
				container: document.createElement( 'div' )
			},
			sidebar: {
				container: document.createElement( 'div' )
			},
		};

		this.watchdog = new CKSource.ContextWatchdog( CKSource.Context );

		await this.watchdog.create( contextConfig );

		this.ngZone.run( () => {
			this.ready = true;
		} );
	}
}
