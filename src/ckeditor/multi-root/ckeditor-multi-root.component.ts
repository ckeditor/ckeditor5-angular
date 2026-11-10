/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	Component,
	EventEmitter,
	Input,
	NgZone,
	Output,
	computed,
	forwardRef,
	inject,
	signal,
	type AfterViewInit,
	type Signal,
	type OnChanges,
	type OnDestroy,
	type SimpleChanges
} from '@angular/core';

import type {
	EditorConfig,
	GetEventInfo,
	ModelDocumentChangeEvent,
	ModelRootElement,
	ModelWriter,
	MultiRootEditor,
	ViewDocumentBlurEvent,
	ViewDocumentFocusEvent
} from 'ckeditor5';

import {
	assignAttributesPropToMultiRootEditorConfig,
	assignInitialDataToMultirootEditorConfig
} from '@ckeditor/ckeditor5-integrations-common';

import { getLicenseKey } from '../utils/get-license-key';
import { hasObservers } from '../utils/has-observers';
import { assertMinimumSupportedVersion } from '../utils/assert-minimum-supported-version';
import { appendAllIntegrationPluginsToConfig } from '../plugins/append-all-integration-plugins-to-config';

import type { BlurEvent, ChangeEvent, FocusEvent } from '../ckeditor.component';

import { CKEDITOR_MULTI_ROOT_HOST, type MultiRootEditorHost } from './multi-root-host';
import { CKEditorMultiRootEditableComponent } from './ckeditor-multi-root-editable.component';
import { CKEditorMultiRootMenuBarComponent, CKEditorMultiRootToolbarComponent } from './ckeditor-multi-root-ui-element';
import type {
	AddRootOptions,
	MultiRootEditorData,
	MultiRootEditorRelaxedConstructor,
	MultiRootEditorRootAttributes,
	MultiRootEditorRootsAttributes
} from './types';
import { areArraysEqual, isDeepEqual, isInternalRootAttribute, pickUserAttributes } from './utils';

const ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID = 'Lock from Angular integration (@ckeditor/ckeditor5-angular)';

const EDITOR_DESTROYED_MESSAGE = 'The <ckeditor-multi-root> component was destroyed.';

/**
 * The Angular component of the multi-root editor.
 *
 * ```html
 * <ckeditor-multi-root
 * 	[editor]="Editor"
 * 	[config]="config"
 * 	[(data)]="data"
 * 	[(rootsAttributes)]="rootsAttributes"
 * />
 * ```
 *
 * Without content, it renders the toolbar (and the menu bar, if `config.menuBar.isVisible` is set) followed by
 * the editables of all roots. Put your own layout inside to place them yourself:
 *
 * ```html
 * <ckeditor-multi-root #multiRoot [editor]="Editor" [(data)]="data">
 * 	<ckeditor-multi-root-toolbar />
 *
 * 	@for ( rootName of multiRoot.roots(); track rootName ) {
 * 		<ckeditor-multi-root-editable [rootName]="rootName" />
 * 	}
 * </ckeditor-multi-root>
 * ```
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
@Component( {
	selector: 'ckeditor-multi-root',
	imports: [
		CKEditorMultiRootEditableComponent,
		CKEditorMultiRootMenuBarComponent,
		CKEditorMultiRootToolbarComponent
	],
	providers: [
		{
			provide: CKEDITOR_MULTI_ROOT_HOST,
			useExisting: forwardRef( () => CKEditorMultiRootComponent )
		}
	],
	styles: ':host { display: block; }',
	template: `
		<ng-content>
			@if ( isMenuBarVisible() ) {
				<ckeditor-multi-root-menu-bar />
			}

			<ckeditor-multi-root-toolbar />

			@for ( rootName of roots(); track rootName ) {
				<ckeditor-multi-root-editable [rootName]="rootName" />
			}
		</ng-content>
	`
} )
export class CKEditorMultiRootComponent<TEditor extends MultiRootEditor = MultiRootEditor>
implements MultiRootEditorHost, AfterViewInit, OnChanges, OnDestroy {
	/**
	 * The constructor of the multi-root editor, e.g. `MultiRootEditor` or a class extending it.
	 */
	@Input( { required: true } ) public editor!: MultiRootEditorRelaxedConstructor<TEditor>;

	/**
	 * The configuration of the editor.
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editorconfig-EditorConfig.html
	 * to learn more.
	 */
	@Input() public config: EditorConfig = {
		licenseKey: getLicenseKey()
	};

	/**
	 * The data of the editor: the HTML of each root, keyed by the root name. Bind it with `[(data)]` to keep it
	 * in sync with the editor.
	 *
	 * Setting a new object updates the editor: roots missing from the editor are added, roots missing from
	 * the object are detached, and the changed roots get the new data.
	 */
	@Input() public data: MultiRootEditorData = {};

	/**
	 * The attributes of each root, keyed by the root name. Bind it with `[(rootsAttributes)]` to keep it
	 * in sync with the editor.
	 *
	 * The editor keeps its own attributes in the roots too (their names start with `$`, e.g. `$rootEditableOptions`).
	 * They are left alone when missing from the object.
	 */
	@Input() public rootsAttributes: MultiRootEditorRootsAttributes = {};

	/**
	 * Allows disabling the two-way data binding mechanism. Disabling it can boost performance for large documents.
	 *
	 * When set to `true`, `dataChange` and `rootsAttributesChange` are not emitted. Read the data from the editor with
	 * `editor.getFullData()` once the application needs it.
	 */
	@Input() public disableTwoWayDataBinding = false;

	/**
	 * When set `true`, the editor becomes read-only.
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html#member-isReadOnly
	 * to learn more.
	 */
	@Input() public set disabled( isDisabled: boolean ) {
		const editor = this.currentEditor;

		if ( editor ) {
			if ( isDisabled ) {
				editor.enableReadOnlyMode( ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID );
			} else {
				editor.disableReadOnlyMode( ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID );
			}
		}

		this.isDisabled = isDisabled;
	}

	public get disabled(): boolean {
		return this.currentEditor?.isReadOnly ?? this.isDisabled;
	}

	/**
	 * Fires when the editor is ready. It corresponds with the `editor#ready`
	 * https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html#event-ready
	 * event.
	 */
	@Output() public ready = new EventEmitter<TEditor>();

	/**
	 * Fires when the content of the editor has changed, including roots being added or detached. It corresponds with
	 * the `editor.model.document#change:data`
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
	 * Fires when the editor fails to start or reports an error while running.
	 */
	@Output() public error = new EventEmitter<unknown>();

	/**
	 * Fires with the new data when the content of the editor changes. Makes `[(data)]` work.
	 */
	@Output() public dataChange = new EventEmitter<MultiRootEditorData>();

	/**
	 * Fires with the new attributes when the attributes of the roots change. Makes `[(rootsAttributes)]` work.
	 */
	@Output() public rootsAttributesChange = new EventEmitter<MultiRootEditorRootsAttributes>();

	/**
	 * The editor, once it is ready.
	 */
	public readonly instance: Signal<TEditor | null>;

	/**
	 * The names of the roots, in the order the editor knows them. Before the editor is ready, the keys of `data`.
	 */
	public readonly roots: Signal<ReadonlyArray<string>>;

	/**
	 * The instance of the editor created by this component.
	 */
	public get editorInstance(): TEditor | null {
		return this.currentEditor ?? null;
	}

	/**
	 * Whether the default layout renders the menu bar.
	 */
	protected readonly isMenuBarVisible = computed( () => !!this.editorSignal()?.config.get( 'menuBar.isVisible' ) );

	private readonly editorSignal = signal<TEditor | null>( null );

	private readonly rootsSignal = signal<ReadonlyArray<string>>( [] );

	private readonly ngZone = inject( NgZone );

	private currentEditor?: TEditor;

	private offEditorError?: () => void;

	private creating?: Promise<void>;

	private isDestroyed = false;

	private isDisabled = false;

	/**
	 * Set while the component pushes `data` or `rootsAttributes` into the editor, so that the change it causes
	 * is not emitted back.
	 */
	private isEditorSettingData = false;

	/**
	 * The objects last emitted, so that getting them back through `[(data)]` and `[(rootsAttributes)]` is not
	 * mistaken for a change.
	 */
	private lastEmittedData?: MultiRootEditorData;

	private lastEmittedRootsAttributes?: MultiRootEditorRootsAttributes;

	private readonly editorReady: Promise<TEditor>;

	private resolveEditorReady!: ( editor: TEditor ) => void;

	private rejectEditorReady!: ( error: unknown ) => void;

	public constructor() {
		assertMinimumSupportedVersion();

		this.instance = this.editorSignal.asReadonly();
		this.roots = this.rootsSignal.asReadonly();

		this.editorReady = new Promise<TEditor>( ( resolve, reject ) => {
			this.resolveEditorReady = resolve;
			this.rejectEditorReady = reject;
		} );

		// Only `addRoot()` and `removeRoot()` hand it out, and they rethrow. Nobody else waiting is not an error.
		this.editorReady.catch( () => {} );
	}

	// Implementing the OnChanges interface.
	public ngOnChanges( changes: SimpleChanges ): void {
		const editor = this.currentEditor;

		if ( !editor ) {
			if ( changes.data ) {
				this.rootsSignal.set( Object.keys( this.data ?? {} ) );
			}

			return;
		}

		const dataChange = changes.data;
		const rootsAttributesChange = changes.rootsAttributes;

		const isDataEcho = !dataChange || dataChange.currentValue === this.lastEmittedData;
		const isRootsAttributesEcho = !rootsAttributesChange || rootsAttributesChange.currentValue === this.lastEmittedRootsAttributes;

		if ( !isDataEcho || !isRootsAttributesEcho ) {
			this.syncEditorWithState( editor, {
				isDataChanged: !isDataEcho,
				isRootsAttributesChanged: !isRootsAttributesEcho
			} );
		}
	}

	// Implementing the AfterViewInit interface.
	public ngAfterViewInit(): void {
		this.initializeEditor();
	}

	// Implementing the OnDestroy interface.
	public async ngOnDestroy(): Promise<void> {
		this.isDestroyed = true;
		this.rejectEditorReady( new Error( EDITOR_DESTROYED_MESSAGE ) );

		// See `CKEditorComponent#destroyEditor()`: the editor may still be starting, and whatever the creation
		// settles as, an editor that exists has to be taken down.
		await this.creating?.catch( () => {} );

		this.offEditorError?.();
		this.offEditorError = undefined;

		const editor = this.currentEditor;

		this.currentEditor = undefined;
		this.editorSignal.set( null );

		// An integrator who owns the context destroys it themselves, and the editors in it with it.
		if ( editor && editor.state !== 'destroyed' ) {
			forceAssignFakeEditableElements( editor );

			await editor.destroy();
		}
	}

	/**
	 * Adds a root to the editor. Waits for the editor if it is not ready yet.
	 *
	 * The root is added to `data` and `rootsAttributes`, and an editable is rendered for it by the default layout.
	 */
	public async addRoot( { name, data = '', attributes = {}, editableOptions, ...rootOptions }: AddRootOptions ): Promise<void> {
		const editor = await this.waitForEditor();

		editor.addRoot( name, {
			isUndoable: true,
			...rootOptions,
			...editableOptions,
			initialData: data,
			modelAttributes: { ...attributes }
		} );
	}

	/**
	 * Detaches a root from the editor. Waits for the editor if it is not ready yet.
	 *
	 * Detaching can be undone, which brings the root back.
	 */
	public async removeRoot( name: string ): Promise<void> {
		const editor = await this.waitForEditor();

		editor.detachRoot( name, true );
	}

	private waitForEditor(): Promise<TEditor> {
		if ( this.isDestroyed ) {
			return Promise.reject( new Error( EDITOR_DESTROYED_MESSAGE ) );
		}

		if ( this.currentEditor ) {
			return Promise.resolve( this.currentEditor );
		}

		return this.editorReady;
	}

	private initializeEditor(): void {
		const Editor = this.editor;

		const emitError = ( e?: unknown ) => {
			if ( hasObservers( this.error ) ) {
				this.ngZone.run( () => this.error.emit( e ) );
			} else {
				console.error( e );
			}
		};

		// What the editor is created with, to tell later whether the inputs changed in the meantime.
		const creationData = this.data;
		const creationRootsAttributes = this.rootsAttributes;

		// Outside of the Angular zone, because creating an editor sets up listeners on the window within a microtask.
		this.creating = this.ngZone.runOutsideAngular( async () => {
			let editor: TEditor;

			try {
				editor = await Editor.create( this.getConfig() );
			} catch ( e ) {
				this.rejectEditorReady( e );
				emitError( e );

				return;
			}

			if ( this.isDestroyed ) {
				await editor.destroy();

				return;
			}

			this.currentEditor = editor;

			if ( this.isDisabled ) {
				editor.enableReadOnlyMode( ANGULAR_INTEGRATION_READ_ONLY_LOCK_ID );
			}

			// See `CKEditorComponent#initializeEditor()` for why it is read off the editor class, and why
			// only the errors of this editor are emitted.
			this.offEditorError = Editor.onEditorError( ( { error, source } ) => {
				if ( source === editor ) {
					emitError( error );
				}
			} );

			this.setUpEditorEvents( editor );

			this.ngZone.run( () => {
				const isDataChanged = this.data !== creationData;
				const isRootsAttributesChanged = this.rootsAttributes !== creationRootsAttributes;

				if ( isDataChanged || isRootsAttributesChanged ) {
					this.syncEditorWithState( editor, { isDataChanged, isRootsAttributesChanged } );
				}

				this.data = editor.getFullData();
				this.rootsAttributes = editor.getRootsAttributes();
				this.rootsSignal.set( editor.model.document.getRootNames() );
				this.editorSignal.set( editor );

				this.resolveEditorReady( editor );
				this.ready.emit( editor );
			} );
		} );
	}

	private getConfig(): EditorConfig {
		let config = assignAttributesPropToMultiRootEditorConfig( this.rootsAttributes, this.config );

		config = appendAllIntegrationPluginsToConfig( config );

		return assignInitialDataToMultirootEditorConfig( this.data, config ) as EditorConfig;
	}

	/**
	 * Integrates the editor with the component by attaching related event listeners.
	 */
	private setUpEditorEvents( editor: TEditor ): void {
		// See `CKEditorComponent#setUpEditorEvents()` for why these are cast.
		( editor.model.document as any ).on( 'change:data', ( evt: GetEventInfo<ModelDocumentChangeEvent> ) => {
			this.ngZone.run( () => {
				this.updateStateFromEditor( editor );
				this.change.emit( { event: evt, editor } );
			} );
		} );

		( editor.editing.view.document as any ).on( 'focus', ( evt: GetEventInfo<ViewDocumentFocusEvent> ) => {
			this.ngZone.run( () => {
				this.focus.emit( { event: evt, editor } );
			} );
		} );

		( editor.editing.view.document as any ).on( 'blur', ( evt: GetEventInfo<ViewDocumentBlurEvent> ) => {
			this.ngZone.run( () => {
				this.blur.emit( { event: evt, editor } );
			} );
		} );
	}

	/**
	 * Reads what the last change did to the editor, and emits it unless the component caused it.
	 *
	 * Only the roots the change touched are read again, so that typing does not serialize the whole document.
	 */
	private updateStateFromEditor( editor: TEditor ): void {
		const rootNames = editor.model.document.getRootNames();

		if ( !areArraysEqual( rootNames, this.rootsSignal() ) ) {
			this.rootsSignal.set( rootNames );
		}

		if ( this.disableTwoWayDataBinding || this.isEditorSettingData ) {
			return;
		}

		const differ = editor.model.document.differ;
		const rootsWithChangedData = new Set( differ.getChanges().map( change =>
			( ( 'position' in change ? change.position.root : change.range.root ) as ModelRootElement ).rootName
		) );
		const rootsWithChangedAttributes = new Set( differ.getChangedRoots().map( change => change.name ) );

		const data: MultiRootEditorData = {};
		const rootsAttributes: MultiRootEditorRootsAttributes = {};

		for ( const rootName of rootNames ) {
			data[ rootName ] = rootsWithChangedData.has( rootName ) || !( rootName in this.data ) ?
				editor.getData( { rootName } ) :
				this.data[ rootName ];

			rootsAttributes[ rootName ] = rootsWithChangedAttributes.has( rootName ) || !( rootName in this.rootsAttributes ) ?
				editor.getRootAttributes( rootName ) :
				this.rootsAttributes[ rootName ];
		}

		if ( !isDeepEqual( data, this.data ) ) {
			this.data = data;
			this.lastEmittedData = data;
			this.dataChange.emit( data );
		}

		if ( !isDeepEqual( rootsAttributes, this.rootsAttributes ) ) {
			this.rootsAttributes = rootsAttributes;
			this.lastEmittedRootsAttributes = rootsAttributes;
			this.rootsAttributesChange.emit( rootsAttributes );
		}
	}

	/**
	 * Makes the editor match the inputs that changed: `data`, `rootsAttributes`, or both.
	 *
	 * The input that did not change is not pushed, because it may be out of date: with `disableTwoWayDataBinding`,
	 * the component does not follow the editor, so pushing it would revert the editor to it.
	 */
	private syncEditorWithState(
		editor: TEditor,
		{ isDataChanged, isRootsAttributesChanged }: { isDataChanged: boolean; isRootsAttributesChanged: boolean }
	): void {
		const data = this.data ?? {};
		const rootsAttributes = this.rootsAttributes ?? {};

		const editorData = editor.getFullData();
		const editorRootsAttributes = editor.getRootsAttributes();

		const addedRoots = !isDataChanged ? [] : Object.keys( data ).filter( rootName => !( rootName in editorData ) );
		const removedRoots = !isDataChanged ? [] : Object.keys( editorData ).filter( rootName => !( rootName in data ) );
		const modifiedRoots = !isDataChanged ? [] : Object.keys( data ).filter( rootName =>
			rootName in editorData && editorData[ rootName ] !== data[ rootName ]
		);

		// The roots the editor is left with. The added ones get their attributes when they are added.
		const isRootKept = ( rootName: string ) => rootName in editorData && ( !isDataChanged || rootName in data );

		const rootsWithChangedAttributes = !isRootsAttributesChanged ? [] : Object.keys( rootsAttributes ).filter( rootName =>
			isRootKept( rootName ) &&
			!!rootsAttributes[ rootName ] &&
			!isDeepEqual( pickUserAttributes( editorRootsAttributes[ rootName ] ), pickUserAttributes( rootsAttributes[ rootName ] ) )
		);

		this.isEditorSettingData = true;

		try {
			editor.model.change( writer => {
				for ( const rootName of addedRoots ) {
					editor.addRoot( rootName, {
						isUndoable: true,
						initialData: data[ rootName ],
						modelAttributes: { ...rootsAttributes[ rootName ] }
					} );
				}

				for ( const rootName of removedRoots ) {
					editor.detachRoot( rootName, true );
				}

				if ( modifiedRoots.length ) {
					const modifiedData = Object.fromEntries( modifiedRoots.map( rootName => [ rootName, data[ rootName ] ] ) );

					editor.data.set( modifiedData, { suppressErrorInCollaboration: true } as any );
				}

				for ( const rootName of rootsWithChangedAttributes ) {
					setRootAttributes( editor, writer, rootName, rootsAttributes[ rootName ] );
				}
			} );
		} finally {
			this.isEditorSettingData = false;
		}
	}
}

/**
 * Sets the attributes of a root, and removes the ones missing from `attributes` (or set to `null`, which is how
 * the editor reports a registered attribute the root does not have), except for the editor's own.
 */
function setRootAttributes(
	editor: MultiRootEditor,
	writer: ModelWriter,
	rootName: string,
	attributes: MultiRootEditorRootAttributes
): void {
	const root = editor.model.document.getRoot( rootName )!;

	for ( const key of Object.keys( editor.getRootAttributes( rootName ) ) ) {
		if ( !isInternalRootAttribute( key ) && attributes[ key ] == null ) {
			writer.removeAttribute( key, root );
		}
	}

	for ( const [ key, value ] of Object.entries( attributes ) ) {
		if ( value != null ) {
			editor.registerRootAttribute( key );
			writer.setAttribute( key, value, root );
		}
	}
}

/**
 * The editor cannot be destroyed while some of its editables have no DOM element, e.g. when the application took
 * the element away without detaching the editable. Giving them a throwaway one lets it go.
 *
 * See: https://github.com/ckeditor/ckeditor5/issues/16561.
 */
function forceAssignFakeEditableElements( editor: MultiRootEditor ): void {
	for ( const editable of Object.values( editor.ui.view.editables ) ) {
		if ( !editor.editing.view.getDomRoot( editable.name! ) ) {
			editor.editing.view.attachDomRoot( document.createElement( 'div' ), editable.name! );
		}
	}
}
