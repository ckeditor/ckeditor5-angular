Changelog
=========

## [11.1.0](https://github.com/ckeditor/ckeditor5-angular/compare/v11.0.1...v11.1.0) (March 24, 2026)

### Features

* Added support for CKEditor 5 `48.0.0` and the new `roots` editor configuration. Closes [#547](https://github.com/ckeditor/ckeditor5-angular/issues/547).


## [11.0.1](https://github.com/ckeditor/ckeditor5-angular/compare/v11.0.0...v11.0.1) (March 2, 2026)

### Other changes

* Accept internal CKEditor 5 releases in `peerDependencies`. Closes [#530](https://github.com/ckeditor/ckeditor5-angular/issues/530).


## [11.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v10.1.0...v11.0.0) (November 27, 2025)

### BREAKING CHANGES

* Dropped support for Angular v18. The minimum supported Angular version is now **v19**. Closes [#514](https://github.com/ckeditor/ckeditor5-angular/issues/514).


## [10.1.0](https://github.com/ckeditor/ckeditor5-angular/compare/v10.0.0...v10.1.0) (November 26, 2025)

### Features

* Introduce the `disableWatchdog` input to the `CKEditorComponent` that allows disabling the watchdog functionality even when a watchdog instance is provided via the `watchdog` input. Closes [#469](https://github.com/ckeditor/ckeditor5-angular/issues/469).

### Bug fixes

* Remove `itemError` event listener from the watchdog when the `CKEditorComponent` is destroyed. This prevents potential memory leaks when the component is removed from the DOM.

### Other changes

* Upgrade to Node v24.11.


## [10.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v9.1.0...v10.0.0) (July 9, 2025)

### BREAKING CHANGES

* Aligned the component with the latest CKEditor 5 release (`v46.0.0`), adopting the type import names. Starting from this version, previous CKEditor 5 releases are no longer compatible due to breaking changes in definitions and package structure. See [ckeditor/ckeditor5#18583](https://github.com/ckeditor/ckeditor5/issues/18583)

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-angular/releases).
