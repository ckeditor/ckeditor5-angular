Changelog
=========

## [12.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-angular/compare/v11.2.0...v12.0.0-alpha.0) (September 22, 2026)

### BREAKING CHANGES

* The Watchdog is gone, and with it the automatic restart of a crashed editor. An editor that crashes now stays as it is, with its content and its undo history, instead of being rebuilt from the data it had before. The `error` output still reports what happened.

  * **CKEditor 5 in version 49 or higher is now required.** That is where the error reporting this integration uses appears. The declared peer dependency and the runtime version check were raised to match.
  * The `watchdog`, `editorWatchdogConfig` and `disableWatchdog` inputs were removed from `<ckeditor>`. There is no watchdog left to pass, configure or disable.
  * **If you passed a `ContextWatchdog` through the `watchdog` input to share a context between editors**, create the `Context` yourself and pass it in the editor configuration instead:

    ```ts
    const context = await AngularEditor.Context.create( contextConfig );

    // Then, in the template: <ckeditor [editor]="Editor" [config]="config">
    config = { context };
    ```

    The context is yours now, so destroy it when you are done with it — `ContextWatchdog` used to own that.

  * **The `error` output now carries the error itself.** A runtime crash used to arrive either as `null`, which is what the watchdog passed where an `EventInfo` would otherwise go, or as `undefined` when the editor was an item of a `ContextWatchdog`. It is now the `CKEditorError` that escaped. Handlers written against the old shape need updating.
  * An error attributed to a `Context` rather than to a single editor is not emitted by this component, which reports only what belongs to its own editor. If you share a context and want those, register your own callback with `Editor.onEditorError()`.
  * The `DisabledEditorWatchdog` class was removed. It existed only to stand in for a watchdog when `disableWatchdog` was set, which is now the only behaviour.
  * The `editor` input no longer requires the editor class to expose a static `EditorWatchdog`, and requires a static `onEditorError` instead — every editor class has one.

  Integrators who relied on the restart should handle the `error` output themselves — reload the editor, tell the user, or report to their error tracker.

### Features

* The stylesheets loaded by `loadCKEditorCloud()` can now be injected into a shadow root instead of `document.head`, so the editor styles stay scoped to a component rather than leaking into the page. Pass the root as `targetNode` of the `injectedStylesheetsLocation` option.


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-angular/releases).
