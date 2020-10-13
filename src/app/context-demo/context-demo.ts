import { Component, ElementRef, ViewChild } from '@angular/core';
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
	@ViewChild( CKEditorComponent, { static: true } ) ckeditor?: ElementRef<CKEditorComponent>;

	public contextConfig: any;
	public context: any;
	public config: any;
	public ready = false;

	public onReady( editor: any ): void {
		console.log( editor );
	}

	ngAfterViewInit(): void {
		this.contextConfig = {
			// Fill in cloud services data here:
			collaboration: {
				channelId: 'foobar'
			}
		};

		Context.create( this.contextConfig )
			.then( () => {
				this.config = {
					context: this.context,
					collaboration: {
						channelId: 'foobar-baz'
					}
				};

				this.ready = true;
			} );
	}
}
