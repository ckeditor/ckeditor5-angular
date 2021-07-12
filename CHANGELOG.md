Changelog
=========

## [2.0.2](https://github.com/ckeditor/ckeditor5-angular/compare/v2.0.1...v2.0.2) (2021-07-12)

### Bug fixes

* Fixed setting data on the editor component when the component is initializing. Closes [ckeditor/ckeditor5#9620](https://github.com/ckeditor/ckeditor5/issues/9620). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/bdfabf453349004043c930e605e7ccd0954bc804))

### Other changes

* Added support for Angular 11. Internal: Updated internal Angular deps to v. 11. Closes [#235](https://github.com/ckeditor/ckeditor5-angular/issues/235). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/5e9da543a7cd7313fc530d11482f293bd973ba17))


## [2.0.1](https://github.com/ckeditor/ckeditor5-angular/compare/v2.0.0...v2.0.1) (2020-10-15)

Internal changes only (updated dependencies, documentation, etc.).


## [2.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v1.2.3...v2.0.0) (2020-10-15)

### BREAKING CHANGES

* Angular<9 will not work with the new `ckeditor5-angular` library anymore (it's mostly connected with an update of TypeScript to version TS 4.0, which produces declaration files incompatible with the previous TypeScript versions used by older versions of Angular). 

### Other changes

* Bumped up all internals to match the Angular@10 ecosystem. Bumped up peer dependencies and dependencies of the library - to Angular>=9.  Building an Angular app with the `ckeditor5-angular` library on production with sourcemaps turned on will no longer throw errors. Closes [#182](https://github.com/ckeditor/ckeditor5-angular/issues/182), [#194](https://github.com/ckeditor/ckeditor5-angular/issues/194). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/012c06cfd839a2e6d712e9b2893be80381f75288))


## [1.2.3](https://github.com/ckeditor/ckeditor5-angular/compare/v1.2.2...v1.2.3) (2020-03-26)

### Bug fixes

* Changing `disabled` property on the `<ckeditor>` component while using the watchdog property won't throw an error anymore. Closes [#177](https://github.com/ckeditor/ckeditor5-angular/issues/177). ([496b39f](https://github.com/ckeditor/ckeditor5-angular/commit/496b39f))


## [1.2.2](https://github.com/ckeditor/ckeditor5-angular/compare/v1.2.1...v1.2.2) (2020-03-04)

### Bug fixes

* Fixed typings for `Watchdog` to make old TS compilers happy. Closes [#172](https://github.com/ckeditor/ckeditor5-angular/issues/172). ([2a3d121](https://github.com/ckeditor/ckeditor5-angular/commit/2a3d121))


## [1.2.1](https://github.com/ckeditor/ckeditor5-angular/compare/v1.2.0...v1.2.1) (2020-02-28)

### Bug fixes

* Added `ckeditor5-watchdog` to package dependencies. ([b4278d1](https://github.com/ckeditor/ckeditor5-angular/commit/b4278d1))


## [1.2.0](https://github.com/ckeditor/ckeditor5-angular/compare/v1.1.2...v1.2.0) (2020-02-27)

### Features

* Improved Angular integration to handle Context and ContextWatchdog. Closes [#165](https://github.com/ckeditor/ckeditor5-angular/issues/165). ([87a1c89](https://github.com/ckeditor/ckeditor5-angular/commit/87a1c89))


## [1.1.2](https://github.com/ckeditor/ckeditor5-angular/compare/v1.1.1...v1.1.2) (2019-11-04)

### Bug fixes

* Downgraded the `ng-packagr` package to fix the `ng build --prod` ([#153](https://github.com/ckeditor/ckeditor5-angular/issues/153)). ([5c9de91](https://github.com/ckeditor/ckeditor5-angular/commit/5c9de91))


## [1.1.1](https://github.com/ckeditor/ckeditor5-angular/compare/v1.1.0...v1.1.1) (2019-10-31)

### Bug fixes

* Fixed displaying events in simple-usage sample. ([50441c1](https://github.com/ckeditor/ckeditor5-angular/commit/50441c1))
* The `<ckeditor>` component won't call the CVA `registerOnChange()` when the change comes from the CVA. This will fix an issue with changing editor data in Reactive Forms. Closes [#139](https://github.com/ckeditor/ckeditor5-angular/issues/139). ([4fd431e](https://github.com/ckeditor/ckeditor5-angular/commit/4fd431e))

### Other changes

* Added example of integration reactive forms with `<ckeditor>` component. ([3f19f92](https://github.com/ckeditor/ckeditor5-angular/commit/3f19f92))
* Removed usages of `Angular 2+` from code and READMEs. Added information about supported Angular versions. Closes [#95](https://github.com/ckeditor/ckeditor5-angular/issues/95). ([3244433](https://github.com/ckeditor/ckeditor5-angular/commit/3244433))


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
