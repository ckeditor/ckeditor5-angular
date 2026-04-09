/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { EditorRelaxedConstructor } from '@ckeditor/ckeditor5-integrations-common';
import type { Editor, EditorConfig, WatchdogConfig } from 'ckeditor5';

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
	private _creator?: EditorRelaxedCreatorFunction<TEditor>;

	/**
	 * The destructor function.
	 */
	private _destructor?: ( editor: TEditor ) => Promise<void>;

	// eslint-disable-next-line @typescript-eslint/no-useless-constructor
	constructor(
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_editorConstructor: EditorRelaxedConstructor<TEditor>,
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		_config?: WatchdogConfig
	) {}

	/**
	 * Sets the creator function.
	 */
	public setCreator( creator: EditorRelaxedCreatorFunction<TEditor> ): void {
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
	public async create( sourceElementOrData: HTMLElement | string, config: EditorConfig ): Promise<unknown>;

	public async create( config: EditorConfig ): Promise<unknown>;

	public async create( ...args: Array<any> ): Promise<void> {
		this.editor = await this._creator!( ...args );
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

export type EditorRelaxedCreatorFunction<TEditor = Editor> = ( ...args: any ) => Promise<TEditor>;
