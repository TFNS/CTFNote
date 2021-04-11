"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mergeWithoutClobbering(original, newStuff, message) {
    const result = Object.assign({}, original);
    for (const key in newStuff) {
        if (typeof result[key] === "undefined" || result[key] === newStuff[key]) {
            result[key] = newStuff[key];
        }
        else {
            throw new Error(`Refusing to clobber '${key}' (from '${original[key]}' to '${newStuff[key]}'): ${message}`);
        }
    }
    return result;
}
exports.mergeWithoutClobbering = mergeWithoutClobbering;
//# sourceMappingURL=lib.js.map