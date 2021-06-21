/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import {
	Component,
	Input,
	Output,
	NgZone,
	EventEmitter,
	forwardRef,
	AfterViewInit, OnDestroy,
	ElementRef
} from '@angular/core';

import EditorWatchdog from '@ckeditor/ckeditor5-watchdog/src/editorwatchdog';
import { first } from 'rxjs/operators';

import uid from './uid';

import {
	ControlValueAccessor,
	NG_VALUE_ACCESSOR
} from '@angular/forms';

import { CKEditor5 } from './ckeditor';

export interface BlurEvent {
	event: CKEditor5.EventInfo<'blur'>;
	editor: CKEditor5.Editor;
}

export interface FocusEvent {
	event: CKEditor5.EventInfo<'focus'>;
	editor: CKEditor5.Editor;
}

export interface ChangeEvent {
	event: CKEditor5.EventInfo<'change:data'>;
	editor: CKEditor5.Editor;
}

@Component( {
	selector: 'ckeditor',
	template: '<ng-template></ng-template>',

	// Integration with @angular/forms.
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			// eslint-disable-next-line @typescript-eslint/no-use-before-define
			useExisting: forwardRef( () => CKEditorComponent ),
			multi: true
		}
	]
} )
export class CKEditorComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
	/**
	 * The reference to the DOM element created by the component.
	 */
	private elementRef!: ElementRef<HTMLElement>;

	/**
	 * The constructor of the editor to be used for the instance of the component.
	 * It can be e.g. the `ClassicEditorBuild`, `InlineEditorBuild` or some custom editor.
	 */
	@Input() public editor?: CKEditor5.EditorConstructor;

	/**
	 * The configuration of the editor.
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editorconfig-EditorConfig.html
	 * to learn more.
	 */
	@Input() public config: CKEditor5.Config = {};

	/**
	 * The initial data of the editor. Useful when not using the ngModel.
	 * See https://angular.io/api/forms/NgModel to learn more.
	 */
	@Input() public data = '';

	/**
	 * Tag name of the editor component.
	 *
	 * The default tag is 'div'.
	 */
	@Input() public tagName = 'div';

	/**
	 * The context watchdog.
	 */
	@Input() public watchdog?: CKEditor5.ContextWatchdog;

	/**
	 * When set `true`, the editor becomes read-only.
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html#member-isReadOnly
	 * to learn more.
	 */
	@Input() public set disabled( isDisabled: boolean ) {
		this.setDisabledState( isDisabled );
	}

	public get disabled(): boolean {
		if ( this.editorInstance ) {
			return this.editorInstance.isReadOnly;
		}

		return this.initiallyDisabled;
	}

	/**
	 * Fires when the editor is ready. It corresponds with the `editor#ready`
	 * https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html#event-ready
	 * event.
	 */
	@Output() public ready = new EventEmitter<CKEditor5.Editor>();

	/**
	 * Fires when the content of the editor has changed. It corresponds with the `editor.model.document#change`
	 * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#event-change
	 * event.
	 */
	@Output() public change: EventEmitter<ChangeEvent> = new EventEmitter<ChangeEvent>();

	/**
	 * Fires when the editing view of the editor is blurred. It corresponds with the `editor.editing.view.document#blur`
	 * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_document-Document.html#event-event:blur
	 * event.
	 */
	@Output() public blur: EventEmitter<BlurEvent> = new EventEmitter<BlurEvent>();

	/**
	 * Fires when the editing view of the editor is focused. It corresponds with the `editor.editing.view.document#focus`
	 * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_document-Document.html#event-event:focus
	 * event.
	 */
	@Output() public focus: EventEmitter<FocusEvent> = new EventEmitter<FocusEvent>();

	/**
	 * Fires when the editor component crashes.
	 */
	@Output() public error: EventEmitter<void> = new EventEmitter<void>();

	/**
	 * The instance of the editor created by this component.
	 */
	public get editorInstance(): CKEditor5.Editor | null {
		let editorWatchdog = this.editorWatchdog;

		if ( this.watchdog ) {
			// Temporarily use the `_watchdogs` internal map as the `getItem()` method throws
			// an error when the item is not registered yet.
			// See https://github.com/ckeditor/ckeditor5-angular/issues/177.
			editorWatchdog = this.watchdog._watchdogs.get( this.id );
		}

		if ( editorWatchdog ) {
			return editorWatchdog.editor;
		}

		return null;
	}

	/**
	 * The editor watchdog. It is created when the context watchdog is not passed to the component.
	 * It keeps the editor running.
	 */
	private editorWatchdog?: CKEditor5.EditorWatchdog;

	/**
	 * If the component is read–only before the editor instance is created, it remembers that state,
	 * so the editor can become read–only once it is ready.
	 */
	private initiallyDisabled = false;

	/**
	 * An instance of https://angular.io/api/core/NgZone to allow the interaction with the editor
	 * withing the Angular event loop.
	 */
	private ngZone: NgZone;

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

	/**
	 * Reference to the source element used by the editor.
	 */
	private editorElement?: HTMLElement;

	/**
	 * A lock flag preventing from calling the `cvaOnChange()` during setting editor data.
	 */
	private isEditorSettingData = false;

	private id = uid();

	public constructor( elementRef: ElementRef, ngZone: NgZone ) {
		this.ngZone = ngZone;
		this.elementRef = elementRef;
	}

	// Implementing the AfterViewInit interface.
	public ngAfterViewInit(): void {
		this.attachToWatchdog();
	}

	// Implementing the OnDestroy interface.
	public async ngOnDestroy(): Promise<void> {
		if ( this.watchdog ) {
			await this.watchdog.remove( this.id );
		} else if ( this.editorWatchdog && this.editorWatchdog.editor ) {
			await this.editorWatchdog.destroy();

			this.editorWatchdog = undefined;
		}
	}

	// Implementing the ControlValueAccessor interface (only when binding to ngModel).
	public writeValue( value: string | null ): void {
		// This method is called with the `null` value when the form resets.
		// A component's responsibility is to restore to the initial state.
		if ( value === null ) {
			value = '';
		}

		// If already initialized.
		if ( this.editorInstance ) {
			// The lock mechanism prevents from calling `cvaOnChange()` during changing
			// the editor state. See #139
			this.isEditorSettingData = true;
			this.editorInstance.setData( value );
			this.isEditorSettingData = false;
		}
		// If not, wait for it to be ready; store the data.
		else {
			// If the editor element is already available, then update its content.
			this.data = value;

			// If not, then wait until it is ready
			// and change data only for the first `ready` event.
			this.ready
				.pipe( first() )
				.subscribe( ( editor: CKEditor5.Editor ) => {
					editor.setData( this.data );
				} );
		}
	}

	// Implementing the ControlValueAccessor interface (only when binding to ngModel).
	public registerOnChange( callback: ( data: string ) => void ): void {
		this.cvaOnChange = callback;
	}

	// Implementing the ControlValueAccessor interface (only when binding to ngModel).
	public registerOnTouched( callback: () => void ): void {
		this.cvaOnTouched = callback;
	}

	// Implementing the ControlValueAccessor interface (only when binding to ngModel).
	public setDisabledState( isDisabled: boolean ): void {
		// If already initialized.
		if ( this.editorInstance ) {
			this.editorInstance.isReadOnly = isDisabled;
		}

		// Store the state anyway to use it once the editor is created.
		this.initiallyDisabled = isDisabled;
	}

	/**
	 * Creates the editor instance, sets initial editor data, then integrates
	 * the editor with the Angular component. This method does not use the `editor.setData()`
	 * because of the issue in the collaboration mode (#6).
	 */
	private attachToWatchdog() {
		const creator = async ( element: HTMLElement, config: CKEditor5.Config ) => {
			return this.ngZone.runOutsideAngular( async () => {
				this.elementRef.nativeElement.appendChild( element );

				const editor = await this.editor!.create( element, config );

				if ( this.initiallyDisabled ) {
					editor.isReadOnly = this.initiallyDisabled;
				}

				this.ngZone.run( () => {
					this.ready.emit( editor );
				} );

				this.setUpEditorEvents( editor );

				return editor;
			} );
		};

		const destructor = async ( editor: CKEditor5.Editor ) => {
			await editor.destroy();

			this.elementRef.nativeElement.removeChild( this.editorElement! );
		};

		const emitError = () => {
			this.ngZone.run( () => {
				this.error.emit();
			} );
		};

		const element = document.createElement( this.tagName );
		const config = this.getConfig();

		this.editorElement = element;

		// Based on the presence of the watchdog decide how to initialize the editor.
		if ( this.watchdog ) {
			// When the context watchdog is passed add the new item to it based on the passed configuration.
			this.watchdog.add( {
				id: this.id,
				type: 'editor',
				creator,
				destructor,
				sourceElementOrData: element,
				config
			} );

			this.watchdog.on( 'itemError', ( _, { itemId } ) => {
				if ( itemId === this.id ) {
					emitError();
				}
			} );
		} else {
			// In the other case create the watchdog by hand to keep the editor running.
			const editorWatchdog: CKEditor5.EditorWatchdog = new EditorWatchdog( this.editor );

			editorWatchdog.setCreator( creator );
			editorWatchdog.setDestructor( destructor );
			editorWatchdog.on( 'error', emitError );

			this.editorWatchdog = editorWatchdog;

			this.editorWatchdog.create( element, config );
		}
	}

	private getConfig() {
		if ( this.data && this.config.initialData ) {
			throw new Error( 'Editor data should be provided either using `config.initialData` or `data` properties.' );
		}

		const config = { ...this.config };

		// Merge two possible ways of providing data into the `config.initialData` field.
		const initialData = this.config.initialData || this.data;

		if ( initialData ) {
			// Define the `config.initialData` only when the initial content is specified.
			config.initialData = initialData;
		}

		return config;
	}

	/**
	 * Integrates the editor with the component by attaching related event listeners.
	 */
	private setUpEditorEvents( editor: CKEditor5.Editor ): void {
		const modelDocument = editor.model.document;
		const viewDocument = editor.editing.view.document;

		modelDocument.on( 'change:data', ( evt: CKEditor5.EventInfo<'change:data'> ) => {
			this.ngZone.run( () => {
				if ( this.cvaOnChange && !this.isEditorSettingData ) {
					const data = editor.getData();

					this.cvaOnChange( data );
				}

				this.change.emit( { event: evt, editor } );
			} );
		} );

		viewDocument.on( 'focus', ( evt: CKEditor5.EventInfo<'focus'> ) => {
			this.ngZone.run( () => {
				this.focus.emit( { event: evt, editor } );
			} );
		} );

		viewDocument.on( 'blur', ( evt: CKEditor5.EventInfo<'blur'> ) => {
			this.ngZone.run( () => {
				if ( this.cvaOnTouched ) {
					this.cvaOnTouched();
				}

				this.blur.emit( { event: evt, editor } );
			} );
		} );
	}
}
