/**
 * Base typings for the CKEditor5 elements.
 */
export namespace CKEditor5 {
	/**
	 * CKEditor5 editor constructor.
	 */
	export interface EditorConstructor {
		create( sourceElementOrData: HTMLElement | string, config?: Config ): Promise<Editor>;
	}

	/**
	 * CKEditor5 editor config.
	 */
	export interface Config {
		[ key: string ]: any;
	}

	/**
	 * https://docs.ckeditor.com/ckeditor5/latest/api/module_utils_eventinfo-EventInfo.html
	 */
	export interface EventInfo<name extends string> {
		readonly name: name;
		readonly path: any[];
		readonly source: any;
		return?: any;

		off(): void;
		stop(): void;
	}

	/**
	 * Editor that implements `setData()` and `getData()`, e.g. the `ClassicEditor`, `InlineEditor`, etc.
	 */
	export interface Editor extends BaseEditor {
		setData( data: string ): void;
		getData(): string;
	}

	/**
	 * Base Editor class.
	 *
	 * See https://docs.ckeditor.com/ckeditor5/latest/api/module_core_editor_editor-Editor.html
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
		listenTo( emitter: any, eventName: string, callback: Function, options?: any ): void;
		off( eventName: string, callback: Function ): void;
		on( eventName: string, callback: Function, options?: any ): void;
		once( eventName: string, callback: Function, options?: any ): void;
		stopListening( emitter: any, eventName: string, callback: Function ): void;
		t( ...args: any[] ): void;

		[ property: string ]: any;
	}
}
