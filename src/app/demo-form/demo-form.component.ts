import {
	Component,
	ViewChild,
	AfterViewInit
} from '@angular/core';

import { NgForm } from '@angular/forms';
import * as CKSource from '../../../ckeditor/build/cksource';

const ClassicEditor = CKSource.ClassicEditor;

@Component( {
	selector: 'app-demo-form',
	templateUrl: './demo-form.component.html',
	styleUrls: [ './demo-form.component.css' ]
} )
export class DemoFormComponent implements AfterViewInit {
	@ViewChild( 'demoForm', { static: true } ) public demoForm?: NgForm;

	public Editor = ClassicEditor;
	public model = {
		name: 'John',
		surname: 'Doe',
		description: '<p>A <b>really</b> nice fellow.</p>'
	};

	public formDataPreview?: string;

	public get description() {
		return this.demoForm!.controls.description;
	}

	public ngAfterViewInit() {
		this.demoForm!.control.valueChanges.subscribe( values => {
			this.formDataPreview = JSON.stringify( values );
		} );
	}

	public onSubmit() {
		console.log( 'Form submit, model', this.model );
	}

	public reset() {
		this.demoForm!.reset();
	}
}
