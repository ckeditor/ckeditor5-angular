import {
	Component,
	ViewChild,
	AfterViewInit
} from '@angular/core';

import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';
import { NgForm } from '@angular/forms';

@Component( {
	selector: 'app-demo-material-design',
	templateUrl: './material-design.component.html',
	styleUrls: [ './material-design.component.css' ]
} )
export class MaterialDesignComponent implements AfterViewInit {
	@ViewChild( 'demoForm' ) demoForm?: NgForm;

	public Editor = ClassicEditorBuild;
	public model = {
		editor: '<p>A <b>really</b> nice fellow.</p>'
	};

	public formDataPreview?: string;

	ngAfterViewInit() {
		this.demoForm!.control.valueChanges
			.subscribe( values => this.formDataPreview = JSON.stringify( values ) );
	}

	onSubmit() {
		console.log( 'Form submit, model', this.model );
	}

	reset() {
		this.demoForm!.reset();
	}

	get editor() {
		return this.demoForm!.controls.editor;
	}
}
