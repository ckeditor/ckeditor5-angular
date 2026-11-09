/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

export * from './ckeditor.component';
export * from './ckeditor.module';

export { CKEditorMultiRootComponent } from './multi-root/ckeditor-multi-root.component';
export { CKEditorMultiRootEditableComponent } from './multi-root/ckeditor-multi-root-editable.component';
export {
	CKEditorMultiRootMenuBarComponent,
	CKEditorMultiRootToolbarComponent
} from './multi-root/ckeditor-multi-root-ui-element';
export type {
	AddRootOptions,
	MultiRootEditableOptions,
	MultiRootEditorData,
	MultiRootEditorRelaxedConstructor,
	MultiRootEditorRootAttributes,
	MultiRootEditorRootsAttributes
} from './multi-root/types';

export {
	loadCKEditorCloud,
	type CKEditorCloudResult,
	type CKEditorCloudConfig
} from '@ckeditor/ckeditor5-integrations-common';
