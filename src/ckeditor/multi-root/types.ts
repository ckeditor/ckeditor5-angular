/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import type { AddRootRootConfig, EditorErrorCallback, MultiRootEditor, ViewRootElementDefinition } from 'ckeditor5';
import type { EditorRelaxedConstructor } from '@ckeditor/ckeditor5-integrations-common';

/**
 * The data of the multi-root editor: the HTML of each root, keyed by the root name.
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
export type MultiRootEditorData = Record<string, string>;

/**
 * The attributes of a single root of the multi-root editor.
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
export type MultiRootEditorRootAttributes = Record<string, unknown>;

/**
 * The attributes of each root of the multi-root editor, keyed by the root name.
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
export type MultiRootEditorRootsAttributes = Record<string, MultiRootEditorRootAttributes>;

/**
 * The constructor of a multi-root editor accepted by the `<ckeditor-multi-root>` component.
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
export type MultiRootEditorRelaxedConstructor<TEditor extends MultiRootEditor = MultiRootEditor> =
	EditorRelaxedConstructor<TEditor> & {

		/**
		 * Declared here because the component reaches for it instead of importing `onEditorError()`.
		 * Every editor class has it — it is a static on `Editor`.
		 */
		onEditorError: ( callback: EditorErrorCallback ) => () => void;
	};

/**
 * Describes the editable element created for a root.
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
export type MultiRootEditableOptions = {

	/**
	 * The placeholder of the editable. If not set, the one from the root configuration is used.
	 */
	placeholder?: string;

	/**
	 * The accessible label text describing the editable to assistive technologies.
	 */
	label?: string;

	/**
	 * The editable element to create: a tag name or an element definition. Defaults to `div`.
	 */
	element?: string | ViewRootElementDefinition;
};

/**
 * Options of `CKEditorMultiRootComponent#addRoot()`.
 *
 * **Early access:** The multi-root editor integration is in early access. Its API may change without a major release.
 *
 * @experimental
 */
export type AddRootOptions = {

	/**
	 * The name of the root to add.
	 */
	name: string;

	/**
	 * The initial data of the root.
	 */
	data?: string;

	/**
	 * The initial attributes of the root.
	 */
	attributes?: MultiRootEditorRootAttributes;

	/**
	 * Whether adding the root can be undone. Defaults to `true`.
	 */
	isUndoable?: boolean;

	/**
	 * The name of the model element used for the root, e.g. `$inlineRoot`. Defaults to `$root`.
	 */
	modelElement?: string;

	/**
	 * Describes the editable element created for the root. Stored in the root, so it survives undo and
	 * reaches other clients in real-time collaboration.
	 */
	editableOptions?: MultiRootEditableOptions;
} & Pick<AddRootRootConfig, 'description' | 'title'>;
