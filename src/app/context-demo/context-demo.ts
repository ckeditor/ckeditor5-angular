import { Component, ViewChild, type ElementRef } from '@angular/core';

import { AngularEditor } from 'src/editor/editor';
import { CKEditorComponent } from '../../ckeditor/ckeditor.component';

@Component( {
	selector: 'context-demo',
	templateUrl: './context-demo.html',
	styleUrls: [ './context-demo.css' ],
	standalone: false
} )
export class ContextDemoComponent {
	public Editor = AngularEditor;
	@ViewChild( CKEditorComponent, { static: true } ) public ckeditor?: ElementRef<CKEditorComponent>;

	public contextConfig: any;
	public context: any;
	public config: any;
	public ready = false;

	public onReady( editor: AngularEditor ): void {
		console.log( editor );
	}

	public ngAfterViewInit(): void {
		this.contextConfig = {
			// Fill in cloud services data here:
			collaboration: {
				channelId: 'foobar'
			}
		};

		AngularEditor.Context.create( this.contextConfig )
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
