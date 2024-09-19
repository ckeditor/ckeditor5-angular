Changelog
=========

## [9.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v9.0.0-alpha.0...v9.0.0) (2024-09-19)

### BREAKING CHANGES

* Changed minimum supported version of Angular to the oldest supported LTS: `>=16.x`.
* Switched compiler from TypeScript `4.x` to `5.x` to ensure compatibility with the newest CKEditor 5 packages.

### Features

* **Experimental:** Add cloud CDN support. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/9c62280f4bdc487ccc258437ee7b6b7cbfa8cbf0))


## [9.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-angular/compare/v8.0.0...v9.0.0-alpha.0) (2024-09-06)

### BREAKING CHANGES

* Changed minimum supported version of Angular to the oldest supported LTS: `>=16.x`.
* Switched compiler from TypeScript `4.x` to `5.x` to ensure compatibility with the newest CKEditor 5 packages.

### Features

* Add cloud CDN support. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/9c62280f4bdc487ccc258437ee7b6b7cbfa8cbf0))

### Other changes

* Updated yarn.lock to fix dependabot alert. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/e11295591584f43be9aace89f62fdb4c0d449ea2))


## [8.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v8.0.0-alpha.0...v8.0.0) (2024-06-26)

We are excited to announce the next major version of the Angular integration.

This release is intended to allow the integration to work with the [latest version](https://github.com/ckeditor/ckeditor5/releases/tag/v42.0.0) of [new installation methods](https://github.com/ckeditor/ckeditor5/releases/tag/v42.0.0).

## [8.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-angular/compare/v7.0.1...v8.0.0-alpha.0) (2024-06-05)

We are happy to announce the alpha release of the next major version of the React integration.

This release is intended to allow the integration to work with existing and new installation methods [announced in this post](https://github.com/ckeditor/ckeditor5/issues/15502).

Please refer to [our nightly documentation build](https://ckeditor5.github.io/docs/nightly/ckeditor5/latest/index.html) for the installation instructions.

### Features

* Change the implementation to only depend on types from the `ckeditor5` package and not runtime code to make the integration work with existing and new installation methods. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/711aae3cddc57a78255bba69fbf711cda0ec6b78))


## [7.0.1](https://github.com/ckeditor/ckeditor5-angular/compare/v7.0.0...v7.0.1) (2023-10-12)

### Other changes

* Added catching and emitting errors that happen during editor initialization. Closes [#392](https://github.com/ckeditor/ckeditor5-angular/issues/392). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/eb8c355c73a11f6759a69e0757c8f3494625dbba))
* Updated the required version of Node.js to 18 when developing the repository. See [ckeditor/ckeditor5#14924](https://github.com/ckeditor/ckeditor5/issues/14924). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/693e01c278b79944e6a7dfcfd4ce47e1a0f74c3c))


## [7.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v6.0.1...v7.0.0) (2023-07-10)

### BREAKING CHANGES

* The [`@ckeditor/ckeditor5-angular`](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular) package requires the following peer dependencies:
  * [`@ckeditor/ckeditor5-core`](https://www.npmjs.com/package/@ckeditor/ckeditor5-core),
  * [`@ckeditor/ckeditor5-engine`](https://www.npmjs.com/package/@ckeditor/ckeditor5-engine),
  * [`@ckeditor/ckeditor5-utils`](https://www.npmjs.com/package/@ckeditor/ckeditor5-utils),
  * [`@ckeditor/ckeditor5-watchdog`](https://www.npmjs.com/package/@ckeditor/ckeditor5-watchdog).

  Make sure to install them in the same version as the editor build you want to use in your integration.

### Bug fixes

* Do not run change detection if `error` does not have observers. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/b82ce11cb5ae1a2172ce51abaf2c3ce333f94f84))

### Other changes

* Added the `getId()` method that returns the component id. Closes [#367](https://github.com/ckeditor/ckeditor5-angular/issues/367). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/e4bf808d5bca605635418a97acd40949ed289567))
* The following packages are now marked as peer dependencies [`@ckeditor/ckeditor5-core`](https://www.npmjs.com/package/@ckeditor/ckeditor5-core), [`@ckeditor/ckeditor5-engine`](https://www.npmjs.com/package/@ckeditor/ckeditor5-engine), [`@ckeditor/ckeditor5-utils`](https://www.npmjs.com/package/@ckeditor/ckeditor5-utils) and [`@ckeditor/ckeditor5-watchdog`](https://www.npmjs.com/package/@ckeditor/ckeditor5-watchdog) to avoid issues when upgrading the CKEditor 5 version within the angular application. Closes [#376](https://github.com/ckeditor/ckeditor5-angular/issues/376). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/37e691a2f26ec4f04bb321205620a1344083a1d5))


## [6.0.1](https://github.com/ckeditor/ckeditor5-angular/compare/v6.0.0...v6.0.1) (2023-04-18)

### Other changes

* Add the generic type for `Editor` in `CKEditorComponent` to allow making the typed event handlers. Closes [ckeditor/ckeditor5#13838](https://github.com/ckeditor/ckeditor5/issues/13838). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/d136bd453db40d79939b8b81115ab01c8568d7fa))


## [6.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v5.2.0...v6.0.0) (2023-04-07)

### BREAKING CHANGES

* Due to rewriting to TypeScript, the component requires CKEditor 5 typings that are available in version 37 or higher. See ckeditor/ckeditor5#11704.
* Upgraded the minimal versions of Node.js to `16.0.0` due to the end of LTS.

### Features

* Migrate package to TypeScript. Closes [ckeditor/ckeditor5#13541](https://github.com/ckeditor/ckeditor5/issues/13541). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/a8342c91d35c53bdbdaadb1303a5486f848fc8aa))

### Other changes

* Updated the required version of Node.js to 16. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/47cf02ddb7f450d3da6067848eded478984c8a04))


## [6.0.0-alpha.0](https://github.com/ckeditor/ckeditor5-angular/compare/v5.2.0...v6.0.0-alpha.0) (2023-03-30)

### BREAKING CHANGES

* Due to rewriting to TypeScript, the component requires CKEditor 5 typings that are available in version 37 or higher. See ckeditor/ckeditor5#11704.
* Upgraded the minimal versions of Node.js to `16.0.0` due to the end of LTS.

### Features

* Migrate package to TypeScript. Closes [ckeditor/ckeditor5#13541](https://github.com/ckeditor/ckeditor5/issues/13541). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/a8342c91d35c53bdbdaadb1303a5486f848fc8aa))

### Other changes

* Updated the required version of Node.js to 16. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/47cf02ddb7f450d3da6067848eded478984c8a04))


## [5.2.0](https://github.com/ckeditor/ckeditor5-angular/compare/v5.1.1...v5.2.0) (2023-03-02)

### Features

* Added the `editorWatchdogConfig` property that allows defining configuration for the [Watchdog](https://ckeditor.com/docs/ckeditor5/latest/features/watchdog.html) feature. Closes [#351](https://github.com/ckeditor/ckeditor5-angular/issues/351). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/3b9ef5b98d36e9408d04d3ec1d0f6997f7d31a7c))


## [5.1.1](https://github.com/ckeditor/ckeditor5-angular/compare/v5.1.0...v5.1.1) (2023-02-16)

### Bug fixes

* Added support for `OnChanges` lifecycle hook that updates editor content when data-bound property of a component changes. Closes [#215](https://github.com/ckeditor/ckeditor5-angular/issues/215). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/fc50094b68d507c2909ed5b1e7dce6c651dbd1e8))

### Other changes

* Removed the `@types/ckeditor__ckeditor5-utils` dependency to avoid issues with CKEditor 5 typings when building an application using CKEditor 5 sources (TypeScript). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/24b3e08b10bc4c707d1a336fcd659e870d617681))
* Replaced the minimal required version of the `@ckeditor/ckeditor5-watchdog` package with a caret range. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/24b3e08b10bc4c707d1a336fcd659e870d617681))


## [5.1.0](https://github.com/ckeditor/ckeditor5-angular/compare/v5.0.0...v5.1.0) (2023-02-09)

### Features

* Added an optional option called `disableTwoWayDataBinding` that allows disabling the two-way data binding. It increases performance when working with large documents. Closes [#141](https://github.com/ckeditor/ckeditor5-angular/issues/141). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/594c044fd49d37bd14b7519ae5eac363384fbf40))

### Bug fixes

* Aligned the `window.CKEDITOR_VERSION` type with the [community typings](https://www.npmjs.com/package/@types/ckeditor__ckeditor5-utils). Closes [#342](https://github.com/ckeditor/ckeditor5-angular/issues/342). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/44f3a63fe98b58cd06014fbc20b531669838353b))

### Other changes

* Marked the [`@ckeditor/ckeditor5-watchdog`](https://www.npmjs.com/package/@ckeditor/ckeditor5-watchdog) package as a dependency.

## [5.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v4.0.0...v5.0.0) (2023-02-01)

### BREAKING CHANGES

* The minimal supported version of Angular by the `<CKEditor>` component is 13.
* Make sure to install the [`@ckeditor/ckeditor5-watchdog`](https://www.npmjs.com/package/@ckeditor/ckeditor5-watchdog) package that is defined as a peer dependency of the `<CKEditor>` component in your integration.

### Other changes

* Upgraded dependencies to fix vulnerability issues. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/79ebca27e482bcb417e8f91329d697b838a21067))


## [4.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v3.0.0...v4.0.0) (2022-04-12)

### BREAKING CHANGES

* Due to introducing the lock mechanism for the `Editor#isReadOnly` property, the `<CKEditor>` component uses the new way of enabling the read-only mode in the editor. The component requires an instance of CKEditor 5 in version 34 or higher. See [ckeditor/ckeditor5#10496](https://github.com/ckeditor/ckeditor5/issues/10496).

### Other changes

* Aligned the `<CKEditor>` component API to use the new lock mechanism when enabling/disabling the read-only mode. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/cba95bfe4d7881c8013b8dabc58b6674bf61b442))
* Bumped Karma test runner to v6.x. Closes [#308](https://github.com/ckeditor/ckeditor5-angular/issues/308). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/c4c80cd9e8acce4054428c9b6402d1ac6b27db47))
* Upgraded the CKEditor 5 packages to their latest versions. Closes [#304](https://github.com/ckeditor/ckeditor5-angular/issues/304). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/cba95bfe4d7881c8013b8dabc58b6674bf61b442))


## [3.0.0](https://github.com/ckeditor/ckeditor5-angular/compare/v2.0.2...v3.0.0) (2022-03-09)

### BREAKING CHANGES

* Upgraded the minimal versions of Node.js to `14.0.0` due to the end of LTS.

### Other changes

* Updated the required version of Node.js to 14. See [ckeditor/ckeditor5#10972](https://github.com/ckeditor/ckeditor5/issues/10972). ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/bb14c61c1f88ec761334049fc9e204565718df80))
* Updated dependencies of the component. ([commit](https://github.com/ckeditor/ckeditor5-angular/commit/1e1ffaad531d50dc99ac0412d937d3e8ee4e16ed))


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
