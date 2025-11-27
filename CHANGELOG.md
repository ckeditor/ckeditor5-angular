Changelog
=========

## [11.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v10.1.0...v11.0.0) (November 27, 2025)

### BREAKING CHANGES

* Changed minimum supported version of Angular to `>=19.x`. Closes [#514](https://github.com/ckeditor/ckeditor5-angular/issues/514).


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


## [10.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-angular/compare/v9.1.0...v10.0.0-alpha.0) (July 2, 2025)

### BREAKING CHANGES

* Aligned the component with the latest CKEditor 5 release (`v46.0.0`), adopting the type import names. Starting from this version, previous CKEditor 5 releases are no longer compatible due to breaking changes in definitions and package structure. See [ckeditor/ckeditor5#18583](https://github.com/ckeditor/ckeditor5/issues/18583)


## [9.1.0](https://github.com/ckeditor/ckeditor5-angular/compare/v9.1.0-alpha.0...v9.1.0) (2024-11-25)

### Features

* Align integration to work with the future self-service plan. Read more in the [CKEditor 5 repository](https://github.com/ckeditor/ckeditor5/issues/17317). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/2833d50a39ed968b58c2f040a5c5f1d6f1d91dc5))
* Print editor errors in console if there is no (error) observer. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/ac9338787d696b87442ba861bb9cc0bceef6e808))

---

To see all releases, visit the [release page](https://github.com/ckeditor/ckeditor5-angular/releases).
