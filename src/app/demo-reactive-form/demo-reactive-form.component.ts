import {
	Component,
	AfterViewInit
} from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';
import * as CKSource from '../../../ckeditor/build/cksource';

const ClassicEditor = CKSource.ClassicEditor;

@Component( {
	selector: 'app-demo-reactive-form',
	templateUrl: './demo-reactive-form.component.html',
	styleUrls: [ './demo-reactive-form.component.css' ]
} )
export class DemoReactiveFormComponent implements AfterViewInit {
	public Editor = ClassicEditor;

	public demoReactiveForm = new FormGroup( {
		name: new FormControl( 'John' ),
		surname: new FormControl( 'Doe' ),
		description: new FormControl( '<p>A <b>really</b> nice fellow.</p>' ),
	} );

	public formDataPreview?: string;

	public ngAfterViewInit() {
		this.demoReactiveForm!.valueChanges
			.subscribe( values => {
				this.formDataPreview = JSON.stringify( values );
			} );
	}

	public onSubmit() {
		console.log( 'Form submit, model', this.demoReactiveForm.value );
	}

	public reset() {
		this.demoReactiveForm!.reset();
	}

	public get description() {
		return this.demoReactiveForm!.controls.description;
	}
}
