// Extremely small optimisation, reduces runtime prototype traversal
const baseHasOwnProperty = Object.prototype.hasOwnProperty;
export function isObject(val) {
    return typeof val === 'object' && val !== null;
}
export function isAsyncIterable(val) {
    return typeof Object(val)[Symbol.asyncIterator] === 'function';
}
export function areGraphQLErrors(obj) {
    return (Array.isArray(obj) &&
        // must be at least one error
        obj.length > 0 &&
        // error has at least a message
        obj.every((ob) => 'message' in ob));
}
export function hasOwnProperty(obj, prop) {
    return baseHasOwnProperty.call(obj, prop);
}
export function hasOwnObjectProperty(obj, prop) {
    return baseHasOwnProperty.call(obj, prop) && isObject(obj[prop]);
}
export function hasOwnArrayProperty(obj, prop) {
    return baseHasOwnProperty.call(obj, prop) && Array.isArray(obj[prop]);
}
export function hasOwnStringProperty(obj, prop) {
    return baseHasOwnProperty.call(obj, prop) && typeof obj[prop] === 'string';
}
