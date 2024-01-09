/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import type {
	AfterViewInit, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import {
	Component,
	Input,
	Output,
	NgZone,
	EventEmitter,
	forwardRef,
	ElementRef
} from '@angular/core';

import { ContextWatchdog, EditorWatchdog } from '@ckeditor/ckeditor5-watchdog';
import { WatchdogConfig } from '@ckeditor/ckeditor5-watchdog/src/watchdog';
import { type Editor, EditorConfig } from '@ckeditor/ckeditor5-core';
import type { GetEventInfo } from '@ckeditor/ckeditor5-utils';
import type { DocumentChangeEvent } from '@ckeditor/ckeditor5-engine';
import type { ViewDocumentBlurEvent, ViewDocumentFocusEvent } from '@ckeditor/ckeditor5-engine/src/view/observer/focusobserver';
import { first } from 'rxjs/operators';

import uid from './uid';

import type {
	ControlValueAccessor } from '@angular/forms';
import {
	NG_VALUE_ACCESSOR
} from '@angular/forms';

const ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID = 'Lock from Angular integration (@ckeditor/ckeditor5-angular)';

export interface BlurEvent<TEditor extends Editor = Editor> {
	event: GetEventInfo<ViewDocumentBlurEvent>;
	editor: TEditor;
}

export interface FocusEvent<TEditor extends Editor = Editor> {
	event: GetEventInfo<ViewDocumentFocusEvent>;
	editor: TEditor;
}

export interface ChangeEvent<TEditor extends Editor = Editor> {
	event: GetEventInfo<DocumentChangeEvent>;
	editor: TEditor;
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
export class CKEditorComponent<TEditor extends Editor = Editor> implements AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor {
	/**
	 * The reference to the DOM element created by the component.
	 */
	private elementRef!: ElementRef<HTMLElement>;

	/**
	 * The constructor of the editor to be used for the instance of the component.
	 * It can be e.g. the `ClassicEditorBuild`, `InlineEditorBuild` or some custom editor.
	 */
	@Input() public editor?: { create( sourceElementOrData: HTMLElement | string, config?: EditorConfig ): Promise<TEditor> };

	/**
	 * The configuration of the editor.
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editorconfig-EditorConfig.html
	 * to learn more.
	 */
	@Input() public config: EditorConfig = {};

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

	// TODO Change to ContextWatchdog<Editor, HTMLElement> after new ckeditor5 alpha release
	/**
	 * The context watchdog.
	 */
	@Input() public watchdog?: ContextWatchdog;

	/**
	 * Config for the EditorWatchdog.
	 */
	@Input() public editorWatchdogConfig?: WatchdogConfig;

	/**
	 * Allows disabling the two-way data binding mechanism. Disabling it can boost performance for large documents.
	 *
	 * When a component is connected using the [(ngModel)] or [formControl] directives and this value is set to true then none of the data
	 * will ever be synchronized.
	 *
	 * An integrator must call `editor.data.get()` manually once the application needs the editor's data.
	 * An editor instance can be received in the `ready()` callback.
	 */
	@Input() public disableTwoWayDataBinding = false;

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
	@Output() public ready = new EventEmitter<TEditor>();

	/**
	 * Fires when the content of the editor has changed. It corresponds with the `editor.model.document#change`
	 * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_model_document-Document.html#event-change
	 * event.
	 */
	@Output() public change = new EventEmitter<ChangeEvent<TEditor>>();

	/**
	 * Fires when the editing view of the editor is blurred. It corresponds with the `editor.editing.view.document#blur`
	 * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_document-Document.html#event-event:blur
	 * event.
	 */
	@Output() public blur = new EventEmitter<BlurEvent<TEditor>>();

	/**
	 * Fires when the editing view of the editor is focused. It corresponds with the `editor.editing.view.document#focus`
	 * https://ckeditor.com/docs/ckeditor5/latest/api/module_engine_view_document-Document.html#event-event:focus
	 * event.
	 */
	@Output() public focus = new EventEmitter<FocusEvent<TEditor>>();

	/**
	 * Fires when the editor component crashes.
	 */
	@Output() public error = new EventEmitter<unknown>();

	/**
	 * The instance of the editor created by this component.
	 */
	public get editorInstance(): TEditor | null {
		let editorWatchdog = this.editorWatchdog;

		if ( this.watchdog ) {
			// Temporarily use the `_watchdogs` internal map as the `getItem()` method throws
			// an error when the item is not registered yet.
			// See https://github.com/ckeditor/ckeditor5-angular/issues/177.
			// TODO should be able to change when new chages in Watcdog are released.
			editorWatchdog = ( this.watchdog as any )._watchdogs.get( this.id );
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
	private editorWatchdog?: EditorWatchdog<TEditor>;

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

	public getId(): string {
		return this.id;
	}

	public constructor( elementRef: ElementRef, ngZone: NgZone ) {
		this.ngZone = ngZone;
		this.elementRef = elementRef;

		// To avoid issues with the community typings and CKEditor 5, let's treat window as any. See #342.
		const { CKEDITOR_VERSION } = ( window as any );

		if ( CKEDITOR_VERSION ) {
			const [ major ] = CKEDITOR_VERSION.split( '.' ).map( Number );

			if ( major < 37 ) {
				console.warn( 'The <CKEditor> component requires using CKEditor 5 in version 37 or higher.' );
			}
		} else {
			console.warn( 'Cannot find the "CKEDITOR_VERSION" in the "window" scope.' );
		}
	}

	// Implementing the OnChanges interface. Whenever the `data` property is changed, update the editor content.
	public ngOnChanges( changes: SimpleChanges ): void {
		if ( Object.prototype.hasOwnProperty.call( changes, 'data' ) && changes.data && !changes.data.isFirstChange() ) {
			this.writeValue( changes.data.currentValue );
		}
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
			this.editorInstance.data.set( value );
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
				.subscribe( editor => {
					editor.data.set( this.data );
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
			if ( isDisabled ) {
				this.editorInstance.enableReadOnlyMode( ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID );
			} else {
				this.editorInstance.disableReadOnlyMode( ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID );
			}
		}

		// Store the state anyway to use it once the editor is created.
		this.initiallyDisabled = isDisabled;
	}

	/**
	 * Creates the editor instance, sets initial editor data, then integrates
	 * the editor with the Angular component. This method does not use the `editor.data.set()`
	 * because of the issue in the collaboration mode (#6).
	 */
	private attachToWatchdog() {
		// TODO: elementOrData parameter type can be simplified to HTMLElemen after templated Watchdog will be released.
		const creator = ( ( elementOrData: HTMLElement | string | Record<string, string>, config: EditorConfig ) => {
			return this.ngZone.runOutsideAngular( async () => {
				this.elementRef.nativeElement.appendChild( elementOrData as HTMLElement );

				const editor = await this.editor!.create( elementOrData as HTMLElement, config );

				if ( this.initiallyDisabled ) {
					editor.enableReadOnlyMode( ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID );
				}

				this.ngZone.run( () => {
					this.ready.emit( editor );
				} );

				this.setUpEditorEvents( editor );

				return editor;
			} );
		} );

		const destructor = async ( editor: Editor ) => {
			await editor.destroy();

			this.elementRef.nativeElement.removeChild( this.editorElement! );
		};

		const emitError = ( e?: unknown ) => {
			// Do not run change detection by re-entering the Angular zone if the `error`
			// emitter doesn't have any subscribers.
			// Subscribers are pushed onto the list whenever `error` is listened inside the template:
			// `<ckeditor (error)="onError(...)"></ckeditor>`.
			if ( hasObservers( this.error ) ) {
				this.ngZone.run( () => this.error.emit( e ) );
			}
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
			} ).catch( e => {
				emitError( e );
			} );

			this.watchdog.on( 'itemError', ( _, { itemId } ) => {
				if ( itemId === this.id ) {
					emitError();
				}
			} );
		} else {
			// In the other case create the watchdog by hand to keep the editor running.
			const editorWatchdog = new EditorWatchdog(
				this.editor!,
				this.editorWatchdogConfig );

			editorWatchdog.setCreator( creator );
			editorWatchdog.setDestructor( destructor );
			editorWatchdog.on( 'error', emitError );

			this.editorWatchdog = editorWatchdog;
			this.ngZone.runOutsideAngular( () => {
				// Note: must be called outside of the Angular zone too because `create` is calling
				// `_startErrorHandling` within a microtask which sets up `error` listener on the window.
				editorWatchdog.create( element, config ).catch( e => {
					emitError( e );
				} );
			} );
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
	private setUpEditorEvents( editor: TEditor ): void {
		const modelDocument = editor.model.document;
		const viewDocument = editor.editing.view.document;

		modelDocument.on<DocumentChangeEvent>( 'change:data', evt => {
			this.ngZone.run( () => {
				if ( this.disableTwoWayDataBinding ) {
					return;
				}

				if ( this.cvaOnChange && !this.isEditorSettingData ) {
					const data = editor.data.get();

					this.cvaOnChange( data );
				}

				this.change.emit( { event: evt, editor } );
			} );
		} );

		viewDocument.on<ViewDocumentFocusEvent>( 'focus', evt => {
			this.ngZone.run( () => {
				this.focus.emit( { event: evt, editor } );
			} );
		} );

		viewDocument.on<ViewDocumentBlurEvent>( 'blur', evt => {
			this.ngZone.run( () => {
				if ( this.cvaOnTouched ) {
					this.cvaOnTouched();
				}

				this.blur.emit( { event: evt, editor } );
			} );
		} );
	}
}

function hasObservers<T>( emitter: EventEmitter<T> ): boolean {
	// Cast to `any` because `observed` property is available in RxJS >= 7.2.0.
	// Fallback to checking `observers` list if this property is not defined.
	return ( emitter as any ).observed || emitter.observers.length > 0;
}
