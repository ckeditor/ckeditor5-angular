# CKEditor 5 rich text editor component for Angular

[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-angular.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)
[![Build Status](https://travis-ci.org/ckeditor/ckeditor5-angular.svg?branch=master)](https://travis-ci.org/ckeditor/ckeditor5-angular)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5-angular/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5-angular?branch=master)
<br>
[![Dependency Status](https://david-dm.org/ckeditor/ckeditor5-angular/status.svg)](https://david-dm.org/ckeditor/ckeditor5-angular)
[![devDependency Status](https://david-dm.org/ckeditor/ckeditor5-angular/dev-status.svg)](https://david-dm.org/ckeditor/ckeditor5-angular?type=dev)

Official [CKEditor 5](https://ckeditor.com/ckeditor-5/) rich text editor component for Angular 5+.

## [Developer Documentation](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html) 📖

See the ["Rich text editor component for Angular"](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html) guide in the [CKEditor 5 documentation](https://ckeditor.com/docs/ckeditor5/latest) to learn more:

* [Quick start](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#quick-start)
* [Integration with `ngModel`](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#integration-with-ngmodel)
* [Supported `@Input` properties](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#supported-input-properties)
* [Supported `@Output` properties](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#supported-output-properties)
* [Styling](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#styling)
* [Localization](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#localization)

## Supported Angular versions

The integration can be used together with Angular at version `5.0.0` and higher. It is an implication of Angular metadata produced for this package by the Angular builder. Note that the `package.json` used in the main repository isn't published on NPM (the production one is present in `src/ckeditor/package.json`), so there are only a few peer dependencies to `@angular/core >= 5.0.0`, `@angular/common >= 5.0.0` and `@angular/forms >= 5.0.0` required by this package.

## Contributing

After cloning this repository, install necessary dependencies:

```bash
npm install
```

### The structure of the repository

This repository contains the following code:

* `./src/ckeditor` contains the implementation of `<ckeditor>` component,
* `./src/app` is a demo application using the component.

**Note:** The [npm package](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular) contains a [packaged component](#packaging-the-component) only.

### Testing the component (demo)

To open the demo application using the component, run:

```bash
npm run start
```

To test it in production, use:

```bash
npm run start -- --prod
```

To run unit tests, use:

```bash
npm run test
```

To run e2e tests run:

```bash
npm run e2e
```

To run coverage tests run:

```bash
npm run coverage
```

Play with the application and make sure the component works properly.

### Releasing

#### Generating the changelog

```bash
npm run changelog
```

#### Packaging the component

**Note** This step is optional in the release process (the script is executed anyway by the postversion hook) but it is required to test the package used as an NPM dependency.

This project uses [ng-packagr](https://www.npmjs.com/package/ng-packagr) to create a package meeting the Angular Package Format specification.

Calling:

```bash
npm run build-package
```

creates a package in the `./dist` directory, which can be then published in the npm registry.

#### Testing the package before releasing

To test the `ckeditor5-angular` package, first bootstrap an empty Angular package using [`ng new`](https://angular.io/cli/new) and add the `<ckeditor>` component by following the [guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html).

Then, create a symlink to the `ckeditor5-angular/dist` package directory to test the `ckeditor5-angular` via this repository.

```bash
ln -s path/to/ckeditor5-angular/dist node_modules/\@ckeditor/ckeditor5-angular
```

Make sure that the `preserveSymlinks` option is set to `true` for the `build` architect in `angular.json`:

```json
{
	"project-name": {
		"architect": {
			"build": {
				"options": {
					"preserveSymlinks": true
				}
			}
		}
	}
}
```

Make sure to test package with the production setup (`ng build --prod`) and with older Angular versions (at least with the 5.2.).

#### Publishing the package

To publish the new package in the npm registry, run:

```bash
npm run release
```

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the LICENSE.md file.
