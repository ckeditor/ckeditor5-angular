/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	Component,
	Input,
	Output,
	NgZone,
	EventEmitter,
	forwardRef,
	ViewChild,
	AfterViewInit, OnDestroy,
	ElementRef
} from '@angular/core';

import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component( {
	selector: 'ckeditor',
	template: '<div #element></div>',

	// Integration with @angular/forms.
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef( () => CKEditorComponent ),
			multi: true,
		}
	]
} )
export class CKEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
	/**
	 * The reference to the DOM element created by the component.
	 */
	@ViewChild( 'element' ) element!: ElementRef;

	/**
	 * The constructor of the editor build to be used for the instance of
	 * the component.
	 */
	@Input() build?: CKEditorBuild;

	/**
	 * The configuration of the editor.
	 * See https://docs.ckeditor.com/ckeditor5/latest/api/module_core_editor_editorconfig-EditorConfig.html
	 * to learn more.
	 */
	@Input() config: { [ key: string ]: any } = {};

	/**
	 * The initial data of the editor. Useful when not using the ngModel.
	 * See https://angular.io/api/forms/NgModel to learn more.
	 */
	@Input() data = '';

	/**
	 * When set `true`, the editor becomes read-only.
	 * See https://docs.ckeditor.com/ckeditor5/latest/api/module_core_editor_editor-Editor.html#member-isReadOnly
	 * to learn more.
	 */
	@Input() set disabled( isDisabled: boolean ) {
		this.setDisabledState( isDisabled );
	}

	get disabled() {
		return this.isDisabled;
	}

	/**
	 * Fires when the editor is ready. It corresponds with the `editor#ready`
	 * https://docs.ckeditor.com/ckeditor5/latest/api/module_core_editor_editor-Editor.html#event-ready
	 * event.
	 */
	@Output() ready = new EventEmitter<any>();

	/**
	 * Fires when the content of the editor has changed. It corresponds with the `editor.model.document#change`
	 * https://docs.ckeditor.com/ckeditor5/latest/api/module_engine_model_document-Document.html#event-change
	 * event.
	 */
	@Output() change = new EventEmitter<{ evt: any, editor: any, data: string }>();

	/**
	 * Fires when the editing view of the editor is blurred. It corresponds with the `editor.editing.view.document#blur`
	 * https://docs.ckeditor.com/ckeditor5/latest/api/module_engine_view_document-Document.html#event-event:blur
	 * event.
	 */
	@Output() blur = new EventEmitter<{ evt: any, editor: any }>();

	/**
	 * Fires when the editing view of the editor is focused. It corresponds with the `editor.editing.view.document#focus`
	 * https://docs.ckeditor.com/ckeditor5/latest/api/module_engine_view_document-Document.html#event-event:focus
	 * event.
	 */
	@Output() focus = new EventEmitter<{ evt: any, editor: any }>();

	/**
	 * The instance of the editor created by this component.
	 */
	public editor?: any;

	/**
	 * If the component is read–only before the editor instance is created, it remembers that state,
	 * so the editor can become read–only once it is ready.
	 */
	private initialIsDisabled = false;

	/**
	 * An instance of https://angular.io/api/core/NgZone to allow the interaction with the editor
	 * withing the Angular event loop.
	 */
	private ngZone: NgZone;

	/**
	 * A helper variable for `disabled` `@Input`
	 */
	private isDisabled = false;

	/**
	 * A callback executed when the content of the editor changes. Part of the
	 * `ControlValueAccessor` (https://angular.io/api/forms/ControlValueAccessor) interface.
	 *
	 * Note: Unset unless the component uses the `ngModel`.
	 */
	private cvaOnChange?: ( data: string ) => void;

	/**
	 * A callback executed when the editor has been blurred. Part of the
	 * `ControlValueAccessor` (https://angular.io/api/forms/ControlValueAccessor) interface.
	 *
	 * Note: Unset unless the component uses the `ngModel`.
	 */
	private cvaOnTouched?: () => void;

	constructor( ngZone: NgZone ) {
		this.ngZone = ngZone;
	}

	// Implementing the AfterViewInit interface.
	ngAfterViewInit() {
		this.ngZone.runOutsideAngular( () => {
			this.createEditor();
		} );
	}

	// Implementing the OnDestroy interface.
	ngOnDestroy() {
		if ( this.editor ) {
			this.editor.destroy();
			this.editor = null;
		}
	}

	// Implementing the ControlValueAccessor interface (only when binding to ngModel).
	writeValue( value: string ): void {
		// If already initialized
		if ( this.editor ) {
			this.editor.setData( value );
		}
		// If not, wait for it to be ready; store the data.
		else {
			this.data = value;
		}
	}

	// Implementing the ControlValueAccessor interface (only when binding to ngModel).
	registerOnChange( callback: ( data: string ) => void ): void {
		this.cvaOnChange = callback;
	}

	// Implementing the ControlValueAccessor interface (only when binding to ngModel).
	registerOnTouched( callback: () => void ): void {
		this.cvaOnTouched = callback;
	}

	// Implementing the ControlValueAccessor interface (only when binding to ngModel).
	setDisabledState( isDisabled: boolean ): void {
		// If already initialized
		if ( this.editor ) {
			this.editor.isReadOnly = isDisabled;
		}
		// If not, wait for it to be ready; store the state.
		else {
			this.initialIsDisabled = isDisabled;
		}

		this.isDisabled = isDisabled;
	}

	/**
	 * Creates the editor instance, sets initial editor data,
	 * then integrates the editor with the Angular component.
	 */
	private createEditor(): Promise<any> {
		return this.build!.create( this.element.nativeElement, this.config )
			.then( editor => {
				this.editor = editor;

				editor.setData( this.data );

				if ( this.initialIsDisabled ) {
					editor.isReadOnly = this.initialIsDisabled;
				}

				this.ready.emit( editor );
				this.setUpEditorEvents( editor );
			} )
			.catch( ( err: Error ) => {
				console.error( err.stack );
			} );
	}

	/**
	 * Integrates the editor with the component by attaching related event listeners.
	 */
	private setUpEditorEvents( editor: any ): void {
		const modelDocument = editor.model.document;
		const viewDocument = editor.editing.view.document;

		modelDocument.on( 'change:data', ( evt: any ) => {
			const data = editor.getData();

			if ( this.cvaOnChange ) {
				this.ngZone.run( () => this.cvaOnChange!( data ) );
			}

			this.change.emit( { evt, editor, data } );
		} );

		viewDocument.on( 'focus', ( evt: any ) => {
			this.focus.emit( { evt, editor } );
		} );

		viewDocument.on( 'blur', ( evt: any ) => {
			if ( this.cvaOnTouched ) {
				this.ngZone.run( () => this.cvaOnTouched!() );
			}

			this.blur.emit( { evt, editor } );
		} );
	}
}

export interface CKEditorBuild {
	create( sourceElementOrData: HTMLElement | string, config?: {} ): Promise<any>;
}
