/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	Component,
	EventEmitter,
	forwardRef,
	Inject,
	Input,
	NgZone,
	Output,
	ViewChild,
	type AfterViewInit,
	type OnChanges,
	type OnDestroy,
	type SimpleChanges
} from '@angular/core';

import { first } from 'rxjs/operators';
import { NG_VALUE_ACCESSOR, type ControlValueAccessor } from '@angular/forms';

import type {
	Editor,
	EditorConfig,
	EditorErrorCallback,
	GetEventInfo,
	ModelDocumentChangeEvent,
	ViewDocumentBlurEvent,
	ViewDocumentFocusEvent
} from 'ckeditor5';

import {
	assignElementToEditorConfig,
	assignInitialDataToEditorConfig,
	compareInstalledCKBaseVersion,
	getInstalledCKBaseFeatures,
	uid,
	type EditorRelaxedConfig,
	type EditorRelaxedConstructor
} from '@ckeditor/ckeditor5-integrations-common';

import { getLicenseKey } from './utils/get-license-key';
import { appendAllIntegrationPluginsToConfig } from './plugins/append-all-integration-plugins-to-config';

import type { EditorElementComponent } from './editor-element.component';
import type { EditorElementDefinition } from './utils/normalize-editor-element-definition';

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
	event: GetEventInfo<ModelDocumentChangeEvent>;
	editor: TEditor;
}

@Component( {
	selector: 'ckeditor',
	template: '<ckeditor-editor-element [definition]="elementDefinition" #editorEl />',
	// Integration with @angular/forms.
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef( () => CKEditorComponent ),
			multi: true
		}
	],
	standalone: false
} )
export class CKEditorComponent<TEditor extends Editor = Editor> implements AfterViewInit, OnDestroy, OnChanges, ControlValueAccessor {
	/**
	 * The constructor of the editor to be used for the instance of the component.
	 * It can be e.g. the `ClassicEditorBuild`, `InlineEditorBuild` or some custom editor.
	 */
	@Input( { required: true } ) public editor!: EditorRelaxedConstructor<TEditor> & {

		/**
		 * Declared here because the component reaches for it instead of importing `onEditorError()`.
		 * Every editor class has it — it is a static on `Editor`.
		 */
		onEditorError: ( callback: EditorErrorCallback ) => () => void;
	};

	/**
	 * The configuration of the editor.
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editorconfig-EditorConfig.html
	 * to learn more.
	 */
	@Input() public config: EditorConfig = {
		licenseKey: getLicenseKey()
	};

	/**
	 * The initial data of the editor. Useful when not using the ngModel.
	 * See https://angular.io/api/forms/NgModel to learn more.
	 */
	@Input() public data = '';

	/**
	 * Tag name of the editor component.
	 *
	 * The default tag is 'div'.
	 *
	 * @deprecated Use `config.root.element` (or `config.roots.main.element`) instead.
	 */
	@Input() public tagName = 'div';

	/**
	 * Allows disabling the two-way data binding mechanism. Disabling it can boost performance for large documents.
	 *
	 * When a component is connected using the [(ngModel)] or [formControl] directives, and this value is set to true, then none of the data
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
	 * Reference to the child component responsible for creating and managing
	 * the DOM element that the editor attaches to.
	 */
	@ViewChild( 'editorEl', { static: true } )
	private editorElementComponent!: EditorElementComponent;

	/**
	 * Returns the element definition derived from the current editor constructor
	 * and config. Used by the template to pass the correct definition down to
	 * editor element component.
	 */
	protected get elementDefinition(): EditorElementDefinition {
		return getEditorElementDefinition( this.editor, this.config, this.tagName );
	}

	/**
	 * The instance of the editor created by this component.
	 */
	public get editorInstance(): TEditor | null {
		return this.currentEditor ?? null;
	}

	/**
	 * The editor created by this component. Nothing wraps it any more, so the component holds it directly.
	 */
	private currentEditor?: TEditor;

	/**
	 * Unregisters the error reporting callback when the editor goes away.
	 */
	private offEditorError?: () => void;

	/**
	 * The pending creation, so that destroying the component can wait for it instead of walking away from
	 * an editor that does not exist yet.
	 */
	private creating?: Promise<void>;

	/**
	 * Whether the component is already on its way out. Creation checks it, because it can finish after.
	 */
	private isDestroyed = false;

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
	 * A lock flag preventing from calling the `cvaOnChange()` during setting editor data.
	 */
	private isEditorSettingData = false;

	/**
	 * The unique ID of the editor instance.
	 */
	private id = uid();

	public getId(): string {
		return this.id;
	}

	public constructor( @Inject( NgZone ) ngZone: NgZone ) {
		this.ngZone = ngZone;

		assertMinimumSupportedVersion();
	}

	// Implementing the OnChanges interface. Whenever the `data` property is changed, update the editor content.
	public ngOnChanges( changes: SimpleChanges ): void {
		if ( Object.prototype.hasOwnProperty.call( changes, 'data' ) && changes.data && !changes.data.isFirstChange() ) {
			this.writeValue( changes.data.currentValue );
		}
	}

	// Implementing the AfterViewInit interface.
	public ngAfterViewInit(): void {
		this.initializeEditor();
	}

	// Implementing the OnDestroy interface.
	public async ngOnDestroy(): Promise<void> {
		await this.destroyEditor();
	}

	private async destroyEditor(): Promise<void> {
		this.isDestroyed = true;

		// The editor may still be starting. Without this, the component would find nothing to destroy and
		// the creation would then register a page-level error callback that nothing would ever remove.
		await this.creating;

		this.offEditorError?.();
		this.offEditorError = undefined;

		const editor = this.currentEditor;

		if ( editor ) {
			this.currentEditor = undefined;

			await editor.destroy();
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
	 * Creates the editor instance, sets the initial editor data, then integrates
	 * the editor with the Angular component. This method does not use the `editor.data.set()`
	 * because of the issue in the collaboration mode (#6).
	 */
	private initializeEditor() {
		const Editor = this.editor;

		const supports = getInstalledCKBaseFeatures();
		const element = this.editorElementComponent.element!;

		const emitError = ( e?: unknown ) => {
			// Do not run change detection by re-entering the Angular zone if the `error`
			// emitter doesn't have any subscribers.
			// Subscribers are pushed onto the list whenever `error` is listened inside the template:
			// `<ckeditor (error)="onError(...)"></ckeditor>`.
			if ( hasObservers( this.error ) ) {
				this.ngZone.run( () => this.error.emit( e ) );
			} else {
				// Print error to the console when there are no subscribers to the `error` event.
				console.error( e );
			}
		};

		// Note: must be called outside of the Angular zone too because creating an editor sets up
		// listeners on the window within a microtask.
		this.creating = this.ngZone.runOutsideAngular( async () => {
			let editor: TEditor;

			try {
				const config = this.getConfig();

				editor = await (
					supports.elementConfigAttachment ?
						Editor.create( assignElementToEditorConfig( Editor, element, config ) ) :
						Editor.create( element, config )
				);
			} catch ( e ) {
				emitError( e );

				return;
			}

			// The component can be destroyed while the editor is being created. Nothing below should run
			// then, and the editor nobody asked for any more has to go.
			if ( this.isDestroyed ) {
				await editor.destroy();

				return;
			}

			this.currentEditor = editor;

			if ( this.initiallyDisabled ) {
				editor.enableReadOnlyMode( ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID );
			}

			// Errors that escape a running editor. An editor that failed to start is reported by the
			// rejected `create()` above instead, because reporting only covers a running one.
			//
			// Off the editor class rather than imported: importing a value from CKEditor loads the npm
			// build, and an application that meant to load it from a CDN is then refused.
			this.offEditorError = Editor.onEditorError( ( { error, source } ) => {
				// One registration serves the whole page, so every component hears about every editor.
				// This is what keeps an error with the component whose editor it came from.
				//
				// An error attributed to a `Context` rather than to an editor is therefore not emitted
				// here. An integrator sharing a context and wanting those has to register their own
				// callback with `Editor.onEditorError()`.
				if ( source === editor ) {
					emitError( error );
				}
			} );

			this.ngZone.run( () => {
				this.ready.emit( editor );
			} );

			this.setUpEditorEvents( editor );
		} );
	}

	private getConfig() {
		const config = assignInitialDataToEditorConfig( this.config, this.data );

		return appendAllIntegrationPluginsToConfig( config );
	}

	/**
	 * Integrates the editor with the component by attaching related event listeners.
	 */
	private setUpEditorEvents( editor: TEditor ): void {
		const modelDocument = editor.model.document;
		const viewDocument = editor.editing.view.document;

		// `.on()` comes from the `Emitter` mixin that `ModelDocument`/`ViewDocument` extend via an
		// anonymous constructor type. Angular's ivy partial-compilation type-checker (ng-packagr)
		// fails to resolve members inherited that way, unlike a plain `tsc` run, so the cast below
		// works around the false-positive `TS2339` it reports.
		( modelDocument as any ).on( 'change:data', ( evt: GetEventInfo<ModelDocumentChangeEvent> ) => {
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

		( viewDocument as any ).on( 'focus', ( evt: GetEventInfo<ViewDocumentFocusEvent> ) => {
			this.ngZone.run( () => {
				this.focus.emit( { event: evt, editor } );
			} );
		} );

		( viewDocument as any ).on( 'blur', ( evt: GetEventInfo<ViewDocumentBlurEvent> ) => {
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

/**
 * Checks if currently installed version of the editor is supported by the integration.
 */
function assertMinimumSupportedVersion(): void {
	switch ( compareInstalledCKBaseVersion( '49.0.0' ) ) {
		case null:
			console.warn( 'Cannot find the "CKEDITOR_VERSION" in the "window" scope.' );
			break;

		case -1:
			console.warn( 'The <CKEditor> component requires using CKEditor 5 in version 49+ or nightly build.' );
			break;
	}
}

/**
 * Get definition of the element used to create editor.
 */
function getEditorElementDefinition(
	editor: EditorRelaxedConstructor,
	config: EditorRelaxedConfig,
	defaultTag: string
): EditorElementDefinition {
	// Classic editor hides the element rendered by the integration, so it makes no sense to use a custom tag here.
	if ( !editor.editorName || editor.editorName === 'ClassicEditor' ) {
		return defaultTag;
	}

	return config.roots?.main?.element ?? config.root?.element ?? defaultTag;
}
