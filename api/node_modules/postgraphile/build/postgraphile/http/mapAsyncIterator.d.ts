/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
declare type PromiseOrValue<T> = T | Promise<T>;
/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
export default function mapAsyncIterator<T, U>(iterable: AsyncIterable<T>, callback: (val: T) => PromiseOrValue<U>, rejectCallback?: (val: any) => PromiseOrValue<U>): AsyncIterableIterator<U>;
export {};
