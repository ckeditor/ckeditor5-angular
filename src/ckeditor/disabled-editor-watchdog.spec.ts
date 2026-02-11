/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { DisabledEditorWatchdog } from './disabled-editor-watchdog';
import { describe, expect, it, vi } from 'vitest';

describe( 'DisabledEditorWatchdog', () => {
	const editorConstructor = {
		create: async () => {
			return {};
		}
	};

	it( 'creates editor with fallback config when no config is provided', async () => {
		const watchdog = new DisabledEditorWatchdog( editorConstructor as any );
		const editor = { id: 'editor' } as any;
		const creator = vi.fn().mockResolvedValue( editor );

		watchdog.setCreator( creator );

		const element = document.createElement( 'div' );

		await watchdog.create( element );

		expect( creator ).toHaveBeenCalledWith( element, {} );
		expect( watchdog.editor ).toBe( editor );
	} );

	it( 'does not call destructor when editor is not created', async () => {
		const watchdog = new DisabledEditorWatchdog( editorConstructor as any );
		const destructor = vi.fn().mockResolvedValue( undefined );

		watchdog.setDestructor( destructor );
		watchdog.on( 'error', vi.fn() );

		await watchdog.destroy();

		expect( destructor ).not.toHaveBeenCalled();
		expect( watchdog.editor ).toBeNull();
	} );

	it( 'destroys created editor and clears the reference', async () => {
		const watchdog = new DisabledEditorWatchdog( editorConstructor as any );
		const editor = { id: 'editor' } as any;
		const creator = vi.fn().mockResolvedValue( editor );
		const destructor = vi.fn().mockResolvedValue( undefined );

		watchdog.setCreator( creator );
		watchdog.setDestructor( destructor );

		await watchdog.create( document.createElement( 'div' ), {} as any );
		await watchdog.destroy();

		expect( destructor ).toHaveBeenCalledWith( editor );
		expect( watchdog.editor ).toBeNull();
	} );
} );
