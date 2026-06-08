Changelog
=========

## [11.2.0](https://github.com/ckeditor/ckeditor5-angular/compare/v11.1.2...v11.2.0) (June 8, 2026)

### Features

* It is now possible to customize the editable element tag name, classes, styles, and attributes via `config.root.element` or `config.roots.main.element`. The value can be a plain string (tag name) or an object:

  ```ts
  import { BalloonEditor } from 'ckeditor5';

  // In your component:
  public BalloonEditor = BalloonEditor;
  public config = {
  	root: {
  		element: {
  			name: 'article',
  			classes: [ 'my-editor', 'custom-class' ],
  			styles: { color: 'red' },
  			attributes: { role: 'textbox' }
  		}
  	}
  };
  ```

  ```html
  <ckeditor [editor]="BalloonEditor" [config]="config"></ckeditor>
  ```

  To configure the root as a paragraph-like (inline-content only) editor, also pass `modelElement: '$inlineRoot'`:

  ```ts
  public config = {
  	root: {
  		element: 'h1',
  		modelElement: '$inlineRoot',
  		initialData: 'Document title',
  		placeholder: 'Enter title...'
  	}
  };
  ```

  For editors that use the Angular-rendered element as their editable (such as `InlineEditor` or `BalloonEditor`), the editable falls back to the `tagName` input (`div` by default) when no element definition is provided in the config. For `ClassicEditor`, which creates its own editable internally, `config.root.element` (or `config.roots.main.element`) should always be provided explicitly.

  The `tagName` input has been deprecated in favor of this new configuration.

### Other changes

* Readme simplification.


## [11.1.2](https://github.com/ckeditor/ckeditor5-angular/compare/v11.1.1...v11.1.2) (April 15, 2026)

### Bug fixes

* Fixed an issue where the editor's alpha version was being compared incorrectly.


## [11.1.1](https://github.com/ckeditor/ckeditor5-angular/compare/v11.1.0...v11.1.1) (April 13, 2026)

### Other changes

* Improved compatibility with the latest CKEditor 48.x. Closes [#550](https://github.com/ckeditor/ckeditor5-angular/issues/550).


## [11.1.0](https://github.com/ckeditor/ckeditor5-angular/compare/v11.0.1...v11.1.0) (March 24, 2026)

### Features

* Added support for CKEditor 5 `48.0.0` and the new `roots` editor configuration. Closes [#547](https://github.com/ckeditor/ckeditor5-angular/issues/547).


## [11.0.1](https://github.com/ckeditor/ckeditor5-angular/compare/v11.0.0...v11.0.1) (March 2, 2026)

### Other changes

* Accept internal CKEditor 5 releases in `peerDependencies`. Closes [#530](https://github.com/ckeditor/ckeditor5-angular/issues/530).

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-angular/releases).
