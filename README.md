# CKEditor 5 rich text editor component for Angular 2+

[![Join the chat at https://gitter.im/ckeditor/ckeditor5](https://badges.gitter.im/ckeditor/ckeditor5.svg)](https://gitter.im/ckeditor/ckeditor5?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-angular.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)
[![Build Status](https://travis-ci.org/ckeditor/ckeditor5-angular.svg?branch=master)](https://travis-ci.org/ckeditor/ckeditor5-angular)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5-angular/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5-angular?branch=master)
[![BrowserStack Status](https://automate.browserstack.com/automate/badge.svg?badge_key=d3hvenZqQVZERFQ5d09FWXdyT0ozVXhLaVltRFRjTTUyZGpvQWNmWVhUUT0tLUZqNlJ1YWRUd0RvdEVOaEptM1B2Q0E9PQ==--c9d3dee40b9b4471ff3fb516d9ecf8d09292c7e0)](https://automate.browserstack.com/public-build/d3hvenZqQVZERFQ5d09FWXdyT0ozVXhLaVltRFRjTTUyZGpvQWNmWVhUUT0tLUZqNlJ1YWRUd0RvdEVOaEptM1B2Q0E9PQ==--c9d3dee40b9b4471ff3fb516d9ecf8d09292c7e0)
<br>
[![Dependency Status](https://david-dm.org/ckeditor/ckeditor5-angular/status.svg)](https://david-dm.org/ckeditor/ckeditor5-angular)
[![devDependency Status](https://david-dm.org/ckeditor/ckeditor5-angular/dev-status.svg)](https://david-dm.org/ckeditor/ckeditor5-angular?type=dev)

Official [CKEditor 5](https://ckeditor.com/ckeditor-5/) rich text editor component for Angular 2+.

## Documentation

See the [Angular 2+ component](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html) article in the [CKEditor 5 documentation](https://ckeditor.com/docs/ckeditor5/latest).

## Contributing

After cloning this repository, install necessary dependencies:

```bash
npm install
```

### The structure of the repository

This repository contains the following code:

* `./src/ckeditor` contains the CKEditor component,
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

This project uses [ng-packagr](https://www.npmjs.com/package/ng-packagr) to create a package meeting the Angular Package Format specification.

Calling:

```bash
npm run build-package
```

creates a package in the `./dist` directory, which can be then published in the npm registry.

#### Testing the package before releasing

After generating the package, create a symlink to the `ckeditor5-angular/dist` package directory to test it in another (third–party) Angular project:

```bash
ln -s /path/to/ckeditor5-angular/dist node_modules/\@ckeditor/ckeditor5-angular
```

You may also need the following configuration in `angular.json` to include the symlinked component package without errors:

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

#### Publishing the package

To publish the new package in the npm registry, run:

```bash
npm run release
```

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the LICENSE.md file.
