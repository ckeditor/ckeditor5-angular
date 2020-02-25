import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';
import * as CKSource from '../../../ckeditor/build/cksource';

const Context = CKSource.Context;

@Component( {
	selector: 'context-demo',
	templateUrl: './context-demo.html',
	styleUrls: [ './context-demo.css' ]
} )
export class ContextDemoComponent {
	public Editor = CKSource.ClassicEditor;
	@ViewChild( CKEditorComponent, { static: false } ) ckeditor?: ElementRef<CKEditorComponent>;

	public contextConfig: any;
	public context: any;
	public config: any;
	public ready = false;

	public onReady( editor: any ) {
		console.log( editor );
	}

	constructor( private ngZone: NgZone ) {
		this.ngZone = ngZone;
	}

	async ngAfterViewInit() {
		this.contextConfig = {
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

		this.context = await Context.create( this.contextConfig );

		this.config = {
			context: this.context,
			collaboration: {
				channelId: 'foobar-baz'
			}
		};

		this.ngZone.run( () => {
			this.ready = true;
		} );
	}
}
