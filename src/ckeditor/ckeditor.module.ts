/**
 * @license Copyright (c) 2003-2026, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorComponent } from './ckeditor.component';
import { EditorElementComponent } from './editor-element.component';
import { CKEditorMultiRootComponent } from './multi-root/ckeditor-multi-root.component';
import { CKEditorMultiRootEditableComponent } from './multi-root/ckeditor-multi-root-editable.component';
import {
	CKEditorMultiRootMenuBarComponent,
	CKEditorMultiRootToolbarComponent
} from './multi-root/ckeditor-multi-root-ui-element';

const MULTI_ROOT_COMPONENTS = [
	CKEditorMultiRootComponent,
	CKEditorMultiRootEditableComponent,
	CKEditorMultiRootMenuBarComponent,
	CKEditorMultiRootToolbarComponent
];

@NgModule( {
	imports: [
		FormsModule,
		CommonModule,
		EditorElementComponent,
		...MULTI_ROOT_COMPONENTS
	],
	declarations: [ CKEditorComponent ],
	exports: [
		CKEditorComponent,
		...MULTI_ROOT_COMPONENTS
	]
} )
export class CKEditorModule {}
