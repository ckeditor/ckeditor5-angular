/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type {
	Editor,
	EditorConfig,
	EditorWatchdogCreatorFunction,
	WatchdogConfig
} from 'ckeditor5';

/**
 * A dummy watchdog class is used when the watchdog is disabled.
 *
 * It provides a compatible API but does not perform any monitoring or restarting.
 */
export class DisabledEditorWatchdog<TEditor extends Editor = Editor> {
	/**
	 * The editor instance.
	 */
	public editor: TEditor | null = null;

	/**
	 * The creator function.
	 */
	private _creator?: EditorWatchdogCreatorFunction<TEditor>;

	/**
	 * The destructor function.
	 */
	private _destructor?: ( editor: TEditor ) => Promise<void>;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_editorConstructor: {
			create( sourceElementOrData: HTMLElement | string, config?: EditorConfig ): Promise<TEditor>;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_config?: WatchdogConfig
	) {}

	/**
	 * Sets the creator function.
	 */
	public setCreator( creator: EditorWatchdogCreatorFunction<TEditor> ): void {
		this._creator = creator;
	}

	/**
	 * Sets the destructor function.
	 */
	public setDestructor( destructor: ( editor: TEditor ) => Promise<void> ): void {
		this._destructor = destructor;
	}

	/**
	 * A dummy implementation of the `on` method.
	 */
	/* istanbul ignore next */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public on( _event: string, _callback: ( ...args: Array<any> ) => void ): void {
	}

	/**
	 * Creates the editor instance.
	 */
	public async create( elementOrData: HTMLElement | string, config?: EditorConfig ): Promise<void> {
		this.editor = await this._creator!( elementOrData, config || /* istanbul ignore next */ ( {} as any ) );
	}

	/**
	 * Destroys the editor instance.
	 */
	public async destroy(): Promise<void> {
		if ( this.editor ) {
			await this._destructor!( this.editor );
			this.editor = null;
		}
	}
}
