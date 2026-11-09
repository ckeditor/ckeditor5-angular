/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import {
	MultiRootEditor,
	Essentials,
	Autoformat,
	Bold,
	Italic,
	BlockQuote,
	Heading,
	Indent,
	Link,
	List,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	TextTransformation
} from 'ckeditor5';

import { getLicenseKey } from '../ckeditor/utils/get-license-key';

export class AngularMultiRootEditor extends MultiRootEditor {
	public static override builtinPlugins = [
		Essentials,
		Autoformat,
		Bold,
		Italic,
		BlockQuote,
		Heading,
		Indent,
		Link,
		List,
		Paragraph,
		PasteFromOffice,
		Table,
		TableToolbar,
		TextTransformation
	];

	public static override defaultConfig = {
		licenseKey: getLicenseKey(),
		toolbar: {
			items: [
				'undo', 'redo',
				'|', 'heading',
				'|', 'bold', 'italic',
				'|', 'link', 'insertTable', 'blockQuote',
				'|', 'bulletedList', 'numberedList', 'outdent', 'indent'
			]
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		},
		language: 'en'
	};
}
