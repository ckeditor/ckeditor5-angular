import {
	Component,
	ViewChild,
	AfterViewInit
} from '@angular/core';

import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';

@Component( {
	selector: 'app-demo-form',
	templateUrl: './demo-form.component.html',
	styleUrls: [ './demo-form.component.css' ]
} )
export class DemoFormComponent implements AfterViewInit {
	@ViewChild( 'demoForm', { static: true } ) public demoForm?: NgForm;

	public Editor = ClassicEditorBuild;
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
