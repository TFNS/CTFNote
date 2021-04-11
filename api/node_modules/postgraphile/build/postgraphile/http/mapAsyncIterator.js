"use strict";
// This file is a copy from the GraphQL codebase, modified to work in TypeScript:
//   https://github.com/graphql/graphql-js/blob/f56905bd6b030d5912092a1239ed21f73fbdd408/src/subscription/mapAsyncIterator.js
/* tslint:disable no-any */
/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */
Object.defineProperty(exports, "__esModule", { value: true });
const iterall_1 = require("iterall");
/**
 * Given an AsyncIterable and a callback function, return an AsyncIterator
 * which produces values mapped via calling the callback function.
 */
function mapAsyncIterator(iterable, callback, rejectCallback) {
    const iterator = iterall_1.getAsyncIterator(iterable);
    let $return;
    let abruptClose;
    // $FlowFixMe(>=0.68.0)
    if (typeof iterator.return === 'function') {
        $return = iterator.return;
        abruptClose = (error) => {
            const rethrow = () => Promise.reject(error);
            return $return.call(iterator).then(rethrow, rethrow);
        };
    }
    function mapResult(result) {
        return result.done
            ? result
            : asyncMapValue(result.value, callback).then(iteratorResult, abruptClose);
    }
    let mapReject;
    if (rejectCallback) {
        // Capture rejectCallback to ensure it cannot be null.
        const reject = rejectCallback;
        mapReject = (error) => asyncMapValue(error, reject).then(iteratorResult, abruptClose);
    }
    const mappedIterator = {
        next() {
            return iterator.next().then(mapResult, mapReject);
        },
        return() {
            return $return
                ? $return.call(iterator).then(mapResult, mapReject)
                : Promise.resolve({ value: undefined, done: true });
        },
        throw(error) {
            if (typeof iterator.throw === 'function') {
                return iterator.throw(error).then(mapResult, mapReject);
            }
            return Promise.reject(error).catch(abruptClose);
        },
        // @ts-ignore TypeScript doesn't seem to understand that this is really `Symbol.asyncIterator`
        [iterall_1.$$asyncIterator]() {
            return this;
        },
    };
    return mappedIterator;
}
exports.default = mapAsyncIterator;
function asyncMapValue(value, callback) {
    return new Promise(resolve => resolve(callback(value)));
}
function iteratorResult(value) {
    return { value, done: false };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwQXN5bmNJdGVyYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wb3N0Z3JhcGhpbGUvaHR0cC9tYXBBc3luY0l0ZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpRkFBaUY7QUFDakYsNkhBQTZIO0FBQzdILDJCQUEyQjtBQUMzQjs7Ozs7OztHQU9HOztBQUVILHFDQUE0RDtBQUc1RDs7O0dBR0c7QUFDSCxTQUF3QixnQkFBZ0IsQ0FDdEMsUUFBMEIsRUFDMUIsUUFBdUMsRUFDdkMsY0FBZ0Q7SUFFaEQsTUFBTSxRQUFRLEdBQUcsMEJBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUMsSUFBSSxPQUFZLENBQUM7SUFDakIsSUFBSSxXQUFnQixDQUFDO0lBQ3JCLHVCQUF1QjtJQUN2QixJQUFJLE9BQU8sUUFBUSxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUU7UUFDekMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDMUIsV0FBVyxHQUFHLENBQUMsS0FBVSxFQUFFLEVBQUU7WUFDM0IsTUFBTSxPQUFPLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM1QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUM7S0FDSDtJQUVELFNBQVMsU0FBUyxDQUFDLE1BQVc7UUFDNUIsT0FBTyxNQUFNLENBQUMsSUFBSTtZQUNoQixDQUFDLENBQUMsTUFBTTtZQUNSLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxJQUFJLFNBQWMsQ0FBQztJQUNuQixJQUFJLGNBQWMsRUFBRTtRQUNsQixzREFBc0Q7UUFDdEQsTUFBTSxNQUFNLEdBQUcsY0FBYyxDQUFDO1FBQzlCLFNBQVMsR0FBRyxDQUFDLEtBQVUsRUFBRSxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0tBQzVGO0lBRUQsTUFBTSxjQUFjLEdBQTZCO1FBQy9DLElBQUk7WUFDRixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFDRCxNQUFNO1lBQ0osT0FBTyxPQUFPO2dCQUNaLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO2dCQUNuRCxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELEtBQUssQ0FBQyxLQUFLO1lBQ1QsSUFBSSxPQUFPLFFBQVEsQ0FBQyxLQUFLLEtBQUssVUFBVSxFQUFFO2dCQUN4QyxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzthQUN6RDtZQUNELE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDbEQsQ0FBQztRQUNELDhGQUE4RjtRQUM5RixDQUFDLHlCQUFlLENBQUM7WUFDZixPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7S0FDRixDQUFDO0lBQ0YsT0FBTyxjQUFjLENBQUM7QUFDeEIsQ0FBQztBQW5ERCxtQ0FtREM7QUFFRCxTQUFTLGFBQWEsQ0FBTyxLQUFRLEVBQUUsUUFBdUM7SUFDNUUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFFRCxTQUFTLGNBQWMsQ0FBSSxLQUFRO0lBQ2pDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO0FBQ2hDLENBQUMifQ==