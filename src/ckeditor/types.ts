/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * Represents a type that can be awaited.
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Overwrites properties of type `T` with properties of type `U`.
 */
export type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;
