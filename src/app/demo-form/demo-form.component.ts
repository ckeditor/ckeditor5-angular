import type {
	AfterViewInit
} from '@angular/core';
import {
	Component,
	ViewChild
} from '@angular/core';

import type { AbstractControl } from '@angular/forms';
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

	public get description(): AbstractControl {
		return this.demoForm!.controls.description;
	}

	public ngAfterViewInit(): void {
		this.demoForm!.control.valueChanges.subscribe( values => {
			this.formDataPreview = JSON.stringify( values );
		} );
	}

	public onSubmit(): void {
		console.log( 'Form submit, model', this.model );
	}

	public reset(): void {
		this.demoForm!.reset();
	}
}
