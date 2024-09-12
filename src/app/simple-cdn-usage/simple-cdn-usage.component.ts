import { Component, type OnInit } from '@angular/core';
import type { ClassicEditor, EditorConfig } from 'https://cdn.ckeditor.com/typings/ckeditor5.d.ts';

import {
	loadCKEditorCloud,
	type CKEditorCloudResult
} from '@ckeditor/ckeditor5-integrations-common';

@Component( {
	selector: 'app-simple-cdn-usage',
	templateUrl: './simple-cdn-usage.component.html',
	styleUrls: [ './simple-cdn-usage.component.css' ]
} )
export class SimpleCdnUsageComponent implements OnInit {
	public Editor: typeof ClassicEditor | null = null;

	public config: EditorConfig | null = null;

	public isDisabled = false;
	public editorData =
		`<p>Getting used to an entirely different culture can be challenging.
While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person.
You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>`;

	public componentEvents: Array<string> = [];

	public toggleDisableEditors(): void {
		this.isDisabled = !this.isDisabled;
	}

	public ngOnInit(): void {
		loadCKEditorCloud( {
			version: '43.0.0'
		} )
			.then( this._setupEditor.bind( this ) );
	}

	private _setupEditor( cloud: CKEditorCloudResult<{ version: '43.0.0' }> ) {
		const {
			ClassicEditor,
			Essentials,
			CKFinderUploadAdapter,
			Autoformat,
			Bold,
			Italic,
			BlockQuote,
			CKBox,
			CKFinder,
			CloudServices,
			EasyImage,
			Heading,
			Image,
			ImageCaption,
			ImageStyle,
			ImageToolbar,
			ImageUpload,
			Indent,
			Link,
			List,
			MediaEmbed,
			Paragraph,
			PasteFromOffice,
			PictureEditing,
			Table,
			TableToolbar,
			TextTransformation
		} = cloud.CKEditor;

		this.Editor = ClassicEditor;
		this.config = {
			plugins: [
				Essentials,
				CKFinderUploadAdapter,
				Autoformat,
				Bold,
				Italic,
				BlockQuote,
				CKBox,
				CKFinder,
				CloudServices,
				EasyImage,
				Heading,
				Image,
				ImageCaption,
				ImageStyle,
				ImageToolbar,
				ImageUpload,
				Indent,
				Link,
				List,
				MediaEmbed,
				Paragraph,
				PasteFromOffice,
				PictureEditing,
				Table,
				TableToolbar,
				TextTransformation
			],
			toolbar: {
				items: [
					'undo',
					'redo',
					'|',
					'heading',
					'|',
					'bold',
					'italic',
					'|',
					'link',
					'uploadImage',
					'insertTable',
					'blockQuote',
					'mediaEmbed',
					'|',
					'bulletedList',
					'numberedList',
					'outdent',
					'indent'
				]
			},
			image: {
				toolbar: [
					'imageStyle:inline',
					'imageStyle:block',
					'imageStyle:side',
					'|',
					'toggleImageCaption',
					'imageTextAlternative'
				]
			},
			table: {
				contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
			},
			language: 'en'
		};
	}

	public onReady(): void {
		this.componentEvents.push( 'The editor is ready.' );
	}

	public onChange(): void {
		this.componentEvents.push( 'Editor model changed.' );
	}

	public onFocus(): void {
		this.componentEvents.push( 'Focused the editing view.' );
	}

	public onBlur(): void {
		this.componentEvents.push( 'Blurred the editing view.' );
	}

	public onError(): void {
		this.componentEvents.push( 'The editor crashed.' );
	}
}
