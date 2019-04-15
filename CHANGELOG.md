Changelog
=========

## [1.1.0](https://github.com/ckeditor/ckeditor5-angular/compare/v1.0.1...v1.1.0) (2019-04-15)

### Features

* Re-exported `CKEditorModule`, `CKEditorComponent` and typings from the package entry point. Closes [#66](https://github.com/ckeditor/ckeditor5-angular/issues/66). ([2a6f55e](https://github.com/ckeditor/ckeditor5-angular/commit/2a6f55e))

### Bug fixes

* Fixed integration with collaboration features by changing the way how the initial data is passed to an editor instance. Previously the `<ckeditor>` component was using the `editor.setData()` method which produces invalid results in collaboration. Now, the initial data is injected directly into the container on which the editor will be created. Closes [#75](https://github.com/ckeditor/ckeditor5-angular/issues/75). ([63c0073](https://github.com/ckeditor/ckeditor5-angular/commit/63c0073))

### Other changes

* Improved performance by processing data only when effectively needed. Closes [#82](https://github.com/ckeditor/ckeditor5-angular/issues/82). Closes [#83](https://github.com/ckeditor/ckeditor5-angular/issues/83). ([0e4638e](https://github.com/ckeditor/ckeditor5-angular/commit/0e4638e))
* Added support for `config.initialData` introduced in CKEditor 5 v12.1.0. Effectively, the editor data can now be provided by `config.initialData` or `data` properties. Closes [#89](https://github.com/ckeditor/ckeditor5-angular/issues/89). ([2b96fa3](https://github.com/ckeditor/ckeditor5-angular/commit/2b96fa3))
* Upgraded the minimal versions of Node and npm. See: [ckeditor/ckeditor5#1507](https://github.com/ckeditor/ckeditor5/issues/1507). ([47f4ca4](https://github.com/ckeditor/ckeditor5-angular/commit/47f4ca4))


## [1.0.1](https://github.com/ckeditor/ckeditor5-angular/compare/v1.0.0...v1.0.1) (2018-11-05)

Internal changes only (updated dependencies, documentation, etc.).


## [1.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v1.0.0-beta.1...v1.0.0) (2018-10-09)

### Bug fixes

* The editor data is set to an empty string when the `ngModel` initializes or resets. ([9abe65d](https://github.com/ckeditor/ckeditor5-angular/commit/9abe65d))

### Other changes

* Added reset button to the form sample. Closes [#31](https://github.com/ckeditor/ckeditor5-angular/issues/31). ([0d973eb](https://github.com/ckeditor/ckeditor5-angular/commit/0d973eb))
* The package will now work fine with `Angular@5` so we decided to lower the minimal version of Angular to `>=5.0.0`. Closes [#39](https://github.com/ckeditor/ckeditor5-angular/issues/39). ([078c2d2](https://github.com/ckeditor/ckeditor5-angular/commit/078c2d2))


## [1.0.0-beta.1](https://github.com/ckeditor/ckeditor5-angular/tree/v1.0.0-beta.1) (2018-07-26)

First developer preview. It contains ready-to-use `<ckeditor>` component that allows using CKEditor 5 Builds and CKEditor 5 Framework in Angular 2+ applications.
