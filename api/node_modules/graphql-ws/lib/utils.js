"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasOwnStringProperty = exports.hasOwnArrayProperty = exports.hasOwnObjectProperty = exports.hasOwnProperty = exports.areGraphQLErrors = exports.isAsyncIterable = exports.isObject = void 0;
// Extremely small optimisation, reduces runtime prototype traversal
const baseHasOwnProperty = Object.prototype.hasOwnProperty;
function isObject(val) {
    return typeof val === 'object' && val !== null;
}
exports.isObject = isObject;
function isAsyncIterable(val) {
    return typeof Object(val)[Symbol.asyncIterator] === 'function';
}
exports.isAsyncIterable = isAsyncIterable;
function areGraphQLErrors(obj) {
    return (Array.isArray(obj) &&
        // must be at least one error
        obj.length > 0 &&
        // error has at least a message
        obj.every((ob) => 'message' in ob));
}
exports.areGraphQLErrors = areGraphQLErrors;
function hasOwnProperty(obj, prop) {
    return baseHasOwnProperty.call(obj, prop);
}
exports.hasOwnProperty = hasOwnProperty;
function hasOwnObjectProperty(obj, prop) {
    return baseHasOwnProperty.call(obj, prop) && isObject(obj[prop]);
}
exports.hasOwnObjectProperty = hasOwnObjectProperty;
function hasOwnArrayProperty(obj, prop) {
    return baseHasOwnProperty.call(obj, prop) && Array.isArray(obj[prop]);
}
exports.hasOwnArrayProperty = hasOwnArrayProperty;
function hasOwnStringProperty(obj, prop) {
    return baseHasOwnProperty.call(obj, prop) && typeof obj[prop] === 'string';
}
exports.hasOwnStringProperty = hasOwnStringProperty;
