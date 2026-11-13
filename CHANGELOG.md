Changelog
=========

## [13.1.0](https://github.com/ckeditor/ckeditor5-angular/compare/v13.0.0...v13.1.0) (November 13, 2026)

### Features

* Added support for the multi-root editor with the `<ckeditor-multi-root>` component (`CKEditorMultiRootComponent`). It binds the data and the attributes of all roots with `[(data)]` and `[(rootsAttributes)]`, and adds or removes roots with `addRoot()` and `removeRoot()`. Without content, it renders the toolbar and the editables of all roots. For a custom layout, place `<ckeditor-multi-root-toolbar>`, `<ckeditor-multi-root-menu-bar>`, and `<ckeditor-multi-root-editable>` inside it yourself. Closes [#600](https://github.com/ckeditor/ckeditor5-angular/issues/600), [#135](https://github.com/ckeditor/ckeditor5-angular/issues/135).

  **This feature is in early access.** Its API may change without a major release.


## [13.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v12.0.0...v13.0.0) (October 26, 2026)

### BREAKING CHANGES

* Dropped support for Angular v20. The minimum supported Angular version is now **v21**. Closes [#601](https://github.com/ckeditor/ckeditor5-angular/issues/601).

### Other changes

* Upgraded Node.js to version 26.10.0.


## [12.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v12.0.0-alpha.1...v12.0.0) (October 8, 2026)

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
* Dropped support for Angular v19. The minimum supported Angular version is now **v20**. See [#572](https://github.com/ckeditor/ckeditor5-angular/issues/572).

### Features

* The stylesheets loaded by `loadCKEditorCloud()` can now be injected into a shadow root instead of `document.head`, so the editor styles stay scoped to a component rather than leaking into the page. Pass the root as `targetNode` of the `injectedStylesheetsLocation` option.
* Added support for Trusted Types when loading CKEditor 5 from CDN with `loadCKEditorCloud()`. Script URLs are now passed through the `ckeditor5-integrations` Trusted Types policy, so applications that enforce Trusted Types with the `require-trusted-types-for 'script'` CSP directive only need to add `ckeditor5-integrations` to the `trusted-types` directive.


## [12.0.0-alpha.1](https://github.com/ckeditor/ckeditor5-angular/compare/v12.0.0-alpha.0...v12.0.0-alpha.1) (October 1, 2026)

### Features

* Added support for Trusted Types when loading CKEditor 5 from CDN with `loadCKEditorCloud()`. Script URLs are now passed through the `ckeditor5-integrations` Trusted Types policy, so applications that enforce Trusted Types with the `require-trusted-types-for 'script'` CSP directive only need to add `ckeditor5-integrations` to the `trusted-types` directive.


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

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-angular/releases).
