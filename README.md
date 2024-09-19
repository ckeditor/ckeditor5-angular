# CKEditor 5 rich text editor component for Angular

[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-angular.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-angular)
[![CircleCI](https://circleci.com/gh/ckeditor/ckeditor5-angular.svg?style=shield)](https://app.circleci.com/pipelines/github/ckeditor/ckeditor5-angular?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5-angular/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5-angular?branch=master)
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
      <td><code>^9</code></td>
      <td><code>16+</code></td>
      <td>Migration to TypeScript&nbsp;5. Declaration files are not backward compatible. Requires CKEditor&nbsp;5 in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v43.0.0">43</a> or higher.</td>
    </tr>
    <tr>
      <td colspan="3">Past releases (no longer maintained)</td>
    </tr>
    <tr>
      <td><code>^8</code></td>
      <td><code>13+</code></td>
      <td>Requires CKEditor&nbsp;5 at least in version <a href="https://github.com/ckeditor/ckeditor5/releases/tag/v42.0.0">42</a>.</td>
    </tr>
    <tr>
      <td><code>^7</code></td>
      <td><code>13+</code></td>
      <td>Changes in peer dependencies. (<a href="https://github.com/ckeditor/ckeditor5-angular/issues/376">issue</a>)</td>
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
# Prepare the server.
npm run start
# Then, start tests.
npm run test:e2e
```

To run coverage tests, run:

```bash
npm run coverage
```

Play with the application and make sure the component works properly.

## Releasing package

CircleCI automates the release process and can release both channels: stable (`X.Y.Z`) and pre-releases (`X.Y.Z-alpha.X`, etc.).

Before you start, you need to prepare the changelog entries.

1. Make sure the `#master` branch is up-to-date: `git fetch && git checkout master && git pull`.
1. Prepare a release branch: `git checkout -b release-[YYYYMMDD]` where `YYYYMMDD` is the current day.
1. Generate the changelog entries: `yarn run changelog --branch release-[YYYYMMDD] [--from [GIT_TAG]]`.
    * By default, the changelog generator uses the latest published tag as a starting point for collecting commits to process.

      The `--from` modifier option allows overriding the default behavior. It is required when preparing the changelog entries for the next stable release while the previous one was marked as a prerelease, e.g., `@alpha`.

      **Example**: Let's assume that the `v40.5.0-alpha.0` tag is our latest and that we want to release it on a stable channel. The `--from` modifier should be equal to `--from v40.4.0`.
    * This task checks what changed in each package and bumps the version accordingly. It won't create a new changelog entry if nothing changes at all. If changes were irrelevant (e.g., only dependencies), it would make an "_internal changes_" entry.
    * Scan the logs printed by the tool to search for errors (incorrect changelog entries). Incorrect entries (e.g., ones without the type) should be addressed. You may need to create entries for them manually. This is done directly in CHANGELOG.md (in the root directory). Make sure to verify the proposed version after you modify the changelog.
1. Commit all changes and prepare a new pull request targeting the `#master` branch.
1. Ping the `@ckeditor/ckeditor-5-devops` team to review the pull request and trigger the release process.

## License

Licensed under the terms of [GNU General Public License Version 2 or later](http://www.gnu.org/licenses/gpl.html). For full details about the license, please check the LICENSE.md file.
