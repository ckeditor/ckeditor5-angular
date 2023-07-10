# CKEditor 5 rich text editor component for Angular

[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-angular.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)
[![Build Status](https://travis-ci.org/ckeditor/ckeditor5-angular.svg?branch=master)](https://travis-ci.org/ckeditor/ckeditor5-angular)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5-angular/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5-angular?branch=master)
![Dependency Status](https://img.shields.io/librariesio/release/npm/@ckeditor/ckeditor5-angular)

Official [CKEditor 5](https://ckeditor.com/ckeditor-5/) rich text editor component for Angular 9.1+.

## [Developer Documentation](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html) 📖

See the ["Rich text editor component for Angular"](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html) guide in the [CKEditor 5 documentation](https://ckeditor.com/docs/ckeditor5/latest) to learn more:

* [Quick start](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#quick-start)
* [Integration with `ngModel`](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#integration-with-ngmodel)
* [Supported `@Input` properties](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#supported-input-properties)
* [Supported `@Output` properties](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#supported-output-properties)
* [Styling](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#styling)
* [Localization](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#localization)

## Supported Angular versions

Because of the breaking changes in the Angular library output format, the `@ckeditor/ckeditor5-angular` package is released in the following versions to support various Angular ecosystems:

<table>
  <thead>
    <tr>
      <th>Package&nbsp;version</th>
      <th>Angular&nbsp;version</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="3">Actively supported versions</td>
    </tr>
    <tr>
      <td><code>^7</code></td>
      <td><code>13+</code></td>
      <td>Changes in peer dependencies. (<a href="https://github.com/ckeditor/ckeditor5-angular/issues/376">issue</a>)</td>
    </tr>
    <tr>
      <td colspan="3">Past releases (no longer maintained)</td>
    </tr>
    <tr>
      <td><code>^6</code></td>
      <td><code>13+</code></td>
      <td>Requires CKEditor&nbsp;5 at least in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v37.0.0">37</a>.</td>
    </tr>
    <tr>
      <td><code>^5</code></td>
      <td><code>13+</code></td>
      <td>Requires Angular at least in version 13+. Lower versions are no longer maintained.</td>
    </tr>
    <tr>
      <td><code>^4</code></td>
      <td><code>9.1+</code></td>
      <td>Requires CKEditor&nbsp;5 at least in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v34.0.0">34</a>.</td>
    </tr>
    <tr>
      <td><code>^3</code></td>
      <td><code>9.1+</code></td>
      <td>Requires Node.js at least in version 14.</td>
    </tr>
    <tr>
      <td><code>^2</code></td>
      <td><code>9.1+</code></td>
      <td>Migration to TypeScript&nbsp;4. Declaration files are not backward compatible.</td>
    </tr>
    <tr>
      <td><code>^1</code></td>
      <td><code>5.x&nbsp;-&nbsp;8.x</code></td>
      <td>Angular versions are no longer maintained.</td>
    </tr>
  </tbody>
</table>

Note that the `package.json` file used in the main repository isn't published on npm (the production one is present in [`src/ckeditor/package.json`](https://github.com/ckeditor/ckeditor5-angular/blob/master/src/ckeditor/package.json)).

## Contributing

After cloning this repository, install necessary dependencies:

```bash
npm install
```

### The structure of the repository

This repository contains the following code:

* `./src/ckeditor` contains the implementation of the `<ckeditor>` component,
* `./src/app` is a demo application using the component.

**Note:** The [npm package](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular) contains a [packaged component](#packaging-the-component) only.

### Testing the component (demo)

First, the CKEditor 5 build should be created out of source files:

```bash
npm run build-ckeditor
```

To open the demo application using the component, run:

```bash
npm run start
```

To test it in production, use:

```bash
npm run start -- --configuration production
```

To run unit tests, use:

```bash
npm run test
```

To run e2e tests, run:

```bash
npm run e2e
```

To run coverage tests, run:

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

**Note** This step is required to test the package used as an npm dependency.

This project uses [ng-packagr](https://www.npmjs.com/package/ng-packagr) to create the package meeting the Angular Package Format specification.

Calling:

```bash
npm run build-package
```

creates a package in the `./dist` directory, which can be then published in the npm registry.

#### Testing the package before releasing

To test the `ckeditor5-angular` package, first bootstrap an empty Angular package using [`ng new`](https://angular.io/cli/new) and add the `<ckeditor>` component by following the [guide](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html).

Then, create a symlink to the `ckeditor5-angular/dist` package directory to test the `ckeditor5-angular` component via this repository.

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

Make sure to test the package with the production setup (`ng build --configuration production`) and with older Angular versions (at least with the 9.1).

#### Publishing the package

To create the release directory, run:

```bash
npm run release:prepare-packages
```

Then, to publish the new package in the npm registry, run:

```bash
npm run release:publish-packages
```

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the LICENSE.md file.
