/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorComponent } from './ckeditor.component';

@NgModule( {
	imports: [ FormsModule, CommonModule ],
	declarations: [ CKEditorComponent ],
	exports: [ CKEditorComponent ]
} )
export class CKEditorModule {}
