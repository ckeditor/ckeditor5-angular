# CKEditor 5 rich text editor component for Angular

[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-angular.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)
[![CircleCI](https://circleci.com/gh/ckeditor/ckeditor5-angular.svg?style=shield)](https://app.circleci.com/pipelines/github/ckeditor/ckeditor5-angular?branch=master)
[![Coverage Status](https://codecov.io/github/ckeditor/ckeditor5-angular/graph/badge.svg)](https://codecov.io/github/ckeditor/ckeditor5-angular)
![Dependency Status](https://img.shields.io/librariesio/release/npm/@ckeditor/ckeditor5-angular)

Official [CKEditor 5](https://ckeditor.com/ckeditor-5/) rich text editor component for Angular 13+.

## [Developer Documentation](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html) 📖

See the ["Rich text editor component for Angular"](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/angular.html) guide in the [CKEditor 5 documentation](https://ckeditor.com/docs/ckeditor5/latest) to learn more:

* [Quick start](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/angular.html#quick-start)
* [Integration with `ngModel`](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/angular.html#integration-with-ngmodel)
* [Supported `@Input` properties](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/angular.html#supported-input-properties)
* [Supported `@Output` properties](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/angular.html#supported-output-properties)
* [Styling](https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/angular.html#styling)
* [Localization](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#localization)

## Supported Angular versions

Because of the breaking changes in the Angular library output format, the `@ckeditor/ckeditor5-angular` package is released in the following versions to support various Angular ecosystems:

<table>
  <thead>
    <tr>
      <th>CKEditor&nbsp;5&nbsp; Angular component version</th>
      <th>Angular&nbsp;version</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="3">Actively supported versions</td>
    </tr>
    <tr>
      <td><code>^11</code></td>
      <td><code>19+</code></td>
      <td>Requires CKEditor&nbsp;5 in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v47.0.0">47</a> or higher.</td>
    </tr>
    <tr>
    <tr>
      <td colspan="3">Past releases (no longer maintained)</td>
    </tr>
    </tr>
    <tr>
      <td><code>^10</code></td>
      <td><code>16+</code></td>
      <td>Requires CKEditor&nbsp;5 in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v46.0.0">46</a> or higher.</td>
    </tr>
    <tr>
      <td><code>^9</code></td>
      <td><code>16+</code></td>
      <td>Migration to TypeScript&nbsp;5. Declaration files are not backward compatible. Requires CKEditor&nbsp;5 in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v43.0.0">43</a> or higher.</td>
    </tr>
    <tr>
      <td><code>^8</code></td>
      <td><code>13+</code></td>
      <td>Requires CKEditor&nbsp;5 in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v42.0.0">42</a> or higher.</td>
    </tr>
    <tr>
      <td><code>^7</code></td>
      <td><code>13+</code></td>
      <td>Changes in peer dependencies (<a href="https://github.com/ckeditor/ckeditor5-angular/issues/376">issue</a>). Requires CKEditor&nbsp;5 in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v37.0.0">37</a> or higher.</td>
    </tr>
    <tr>
      <td><code>^6</code></td>
      <td><code>13+</code></td>
      <td>Requires CKEditor&nbsp;5 in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v37.0.0">37</a> or higher.</td>
    </tr>
    <tr>
      <td><code>^5</code></td>
      <td><code>13+</code></td>
      <td>Requires Angular in version 13+ or higher.</td>
    </tr>
    <tr>
      <td><code>^4</code></td>
      <td><code>9.1+</code></td>
      <td>Requires CKEditor&nbsp;5 in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v34.0.0">34</a> or higher.</td>
    </tr>
    <tr>
      <td><code>^3</code></td>
      <td><code>9.1+</code></td>
      <td>Requires Node.js in version 14 or higher.</td>
    </tr>
    <tr>
      <td><code>^2</code></td>
      <td><code>9.1+</code></td>
      <td>Migration to TypeScript&nbsp;4. Declaration files are not backward compatible.</td>
    </tr>
    <tr>
      <td><code>^1</code></td>
      <td><code>5.x&nbsp;-&nbsp;8.x</code></td>
      <td>Angular versions no longer maintained.</td>
    </tr>
  </tbody>
</table>

Note that the `package.json` file used in the main repository isn't published on npm (the production one is present in [`src/ckeditor/package.json`](https://github.com/ckeditor/ckeditor5-angular/blob/master/src/ckeditor/package.json)).

## Contributing

> [!NOTE]
> This project requires **pnpm v10** or higher. You can check your version with `pnpm --version` and update if needed with `npm install -g pnpm@latest`.

After cloning this repository, install necessary dependencies:

```bash
pnpm install
```

### The structure of the repository

This repository contains the following code:

* `./src/ckeditor` contains the implementation of the `<ckeditor>` component,
* `./src/app` is a demo application using the component.

**Note:** The [npm package](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular) contains a [packaged component](#packaging-the-component) only.

### Testing the component (demo)

To open the demo application using the component, run:

```bash
pnpm run start
```

To test it in production, use:

```bash
pnpm run start --configuration production
```

To run unit tests in watch mode (Vitest + Chrome), use:

```bash
pnpm run test
```

The unit test suite runs in a real browser (Chrome) using Vitest browser mode.

To run unit tests once (without watch), use:

```bash
pnpm run test:run
```

To run e2e tests, run:

```bash
# Prepare the server.
pnpm run start
# Then, start tests.
pnpm run test:e2e
```

To run coverage tests, run:

```bash
pnpm run coverage
```

The coverage report is generated in the `./coverage` directory.

Play with the application and make sure the component works properly.

## Releasing package

CircleCI automates the release process and can release both channels: stable (`X.Y.Z`) and pre-releases (`X.Y.Z-alpha.X`, etc.).

Before you start, you need to prepare the changelog entries.

1. Make sure the `#master` branch is up-to-date: `git fetch && git checkout master && git pull`.
1. Prepare a release branch: `git checkout -b release-[YYYYMMDD]` where `YYYYMMDD` is the current day.
1. Generate the changelog entries: `pnpm run release:prepare-changelog`.
	* You can specify the release date by passing the `--date` option, e.g., `--date=2025-06-11`.
	* By passing the `--dry-run` option, you can check what the script will do without actually modifying the files.
	* Read all the entries, correct poor wording and other issues, wrap code names in backticks to format them, etc.
	* Add the missing `the/a` articles, `()` to method names, "it's" -> "its", etc.
	* A newly introduced feature should have just one changelog entry – something like "The initial implementation of the FOO feature." with a description of what it does.
1. Commit all changes and prepare a new pull request targeting the `#master` branch.
1. Ping the `@ckeditor/ckeditor-5-platform` team to review the pull request and trigger the release process.

## License

Licensed under a dual-license model, this software is available under:

* the [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html),
* or commercial license terms from CKSource Holding sp. z o.o.

For more information, see: [https://ckeditor.com/legal/ckeditor-licensing-options](https://ckeditor.com/legal/ckeditor-licensing-options).
