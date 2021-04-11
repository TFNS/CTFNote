"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sluggify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "-")
        .replace(/--+/g, "-")
        .replace(/(^-+|-+$)/g, "")
        .substr(0, 60);
}
exports.sluggify = sluggify;
//# sourceMappingURL=sluggify.js.map