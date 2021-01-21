/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

type AnyFunction = ( ...args: any[] ) => any;

/**
 * Basic typings for the CKEditor5 elements.
 */
export namespace CKEditor5 {

	/**
	 * The CKEditor5 editor config.
	 */
	export interface Config {
		[ key: string ]: any;
	}

	/**
	 * The event object passed to CKEditor5 event callbacks.
	 *
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_utils_eventinfo-EventInfo.html
	 */
	export interface EventInfo<EventName extends string> {
		readonly name: EventName;
		readonly path: any[];
		readonly source: any;
		return?: any;

		off(): void;
		stop(): void;
	}

	/**
	 * The base Editor class.
	 *
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editor-Editor.html
	 */
	export interface BaseEditor {
		readonly commands: any;
		readonly config: any;
		readonly conversion: any;
		readonly data: any;
		readonly editing: any;
		readonly keystrokes: any;
		readonly locale: any;
		readonly model: any;
		readonly plugins: any;
		readonly state: 'initializing' | 'ready' | 'destroyed';

		isReadOnly: boolean;

		delegate( events: string[] ): any;
		destroy(): Promise<void>;
		execute( commandName: string, ...params: any[] ): any;
		fire( eventName: string, args?: any ): any;
		listenTo( emitter: any, eventName: string, callback: AnyFunction, options?: any ): void;
		off( eventName: string, callback: AnyFunction ): void;
		on( eventName: string, callback: AnyFunction, options?: any ): void;
		once( eventName: string, callback: AnyFunction, options?: any ): void;
		stopListening( emitter: any, eventName: string, callback: AnyFunction ): void;
		t( ...args: any[] ): void;

		[ property: string ]: any;
	}

	/**
	 * The CKEditor5 DataApi interface.
	 *
	 * See https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_utils_dataapimixin-DataApi.html.
	 */
	export interface DataApi {
		getData(): string;
		setData( data: string ): void;
	}

	/**
	 * A CKEditor5 editor that implements the
	 * [DataApi interface](https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_utils_dataapimixin-DataApi.html).
	 * E.g. the `ClassicEditor`, `InlineEditor`, etc.
	 */
	export interface Editor extends BaseEditor, DataApi {}

	/**
	 * The CKEditor5 editor constructor.
	 */
	export interface EditorConstructor {
		create( sourceElementOrData: HTMLElement | string, config?: Config ): Promise<Editor>;
	}

	export interface Watchdog<T> {
		setCreator( creator: ( ...args: any[] ) => Promise<T> ): void;
		setDestructor( destructor: ( item: T ) => Promise<void> ): void;
		on( event: string, callback: ( ...args: any[] ) => any ): void;
		destroy(): Promise<void>;
		create( ...args: any[] ): Promise<void>;
	}

	export interface EditorWatchdog extends Watchdog<Editor> {
		editor: Editor;
	}

	export interface ContextWatchdog extends Watchdog<any> {
		context: any;
		_watchdogs: Map<string, EditorWatchdog>;
		add( items: any ): Promise<void>;
		remove( items: string | string[] ): Promise<void>;
		getItem( itemId: string ): Editor;
		addItemWatchdog( itemId: string, itemType: string, watchdog: Watchdog<any> ): Promise<void>;
	}
}
