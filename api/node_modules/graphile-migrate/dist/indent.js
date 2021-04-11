"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function indent(text, indentStringOrSpaces) {
    const indentString = typeof indentStringOrSpaces === "string"
        ? indentStringOrSpaces
        : " ".repeat(indentStringOrSpaces);
    return indentString + text.replace(/\n(?!$)/g, "\n" + indentString);
}
exports.default = indent;
//# sourceMappingURL=indent.js.map