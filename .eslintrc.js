/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

/* eslint-env node */

module.exports = {
  extends: [
    'ckeditor5',
    'plugin:@typescript-eslint/recommended'
  ],
  env: {
    browser: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint/eslint-plugin'
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: [
      './tsconfig.json'
    ]
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': [ 'error', 'tab' ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': [ 'error', 'nofunc' ],
    '@typescript-eslint/no-var-requires': 'off',
    'new-cap': 'off',
  },
  overrides: [ {
    files: [ '**/*.spec.ts' ],
    env: {
      jasmine: true
    },
    parserOptions: {
      tsconfigRootDir: __dirname,
      project: 'tsconfig.spec.json'
    },
  } ]
}
