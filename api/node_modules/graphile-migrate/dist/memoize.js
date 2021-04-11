"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
function memoize(fn) {
    let lastArgs;
    let lastResult;
    return (...args) => {
        if (lastArgs &&
            args.length === lastArgs.length &&
            args.every((arg, i) => arg === lastArgs[i])) {
            return lastResult;
        }
        else {
            lastArgs = args;
            lastResult = fn(...args);
            return lastResult;
        }
    };
}
exports.default = memoize;
//# sourceMappingURL=memoize.js.map