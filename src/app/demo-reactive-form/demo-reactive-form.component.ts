import type {
	AfterViewInit
} from '@angular/core';
import {
	Component
} from '@angular/core';

import type { AbstractControl } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';

import AngularEditor from '../../../ckeditor/build/ckeditor';

@Component( {
	selector: 'app-demo-reactive-form',
	templateUrl: './demo-reactive-form.component.html',
	styleUrls: [ './demo-reactive-form.component.css' ]
} )
export class DemoReactiveFormComponent implements AfterViewInit {
	public Editor = AngularEditor;

	public demoReactiveForm = new FormGroup( {
		name: new FormControl( 'John' ),
		surname: new FormControl( 'Doe' ),
		description: new FormControl( '<p>A <b>really</b> nice fellow.</p>' )
	} );

	public formDataPreview?: string;
	public shouldDisableTwoWayDataBinding = false;

	public editorInstance?: AngularEditor;

	public toggleDisableTwoWayDataBinding(): void {
		this.shouldDisableTwoWayDataBinding = !this.shouldDisableTwoWayDataBinding;
	}

	public ngAfterViewInit(): void {
		this.demoReactiveForm!.valueChanges
			.subscribe( values => {
				this.formDataPreview = JSON.stringify( values );
			} );
	}

	public onReady( editor: AngularEditor ): void {
		this.editorInstance = editor;
	}

	public onSubmit(): void {
		// Read editor's data only when two-way data binding is disabled
		if ( this.shouldDisableTwoWayDataBinding ) {
			this.demoReactiveForm.value.description = this.editorInstance!.getData();
		}

		console.log( 'Form submit, model', this.demoReactiveForm.value );
	}

	public reset(): void {
		this.demoReactiveForm!.reset();
	}

	public get description(): AbstractControl {
		return this.demoReactiveForm!.controls.description;
	}
}
