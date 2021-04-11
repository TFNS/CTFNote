"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isNoTransactionDefined(sql) {
    const i = sql.indexOf("\n");
    const firstLine = i > 0 ? sql.substring(0, i) : sql;
    return /^--!\s*no-transaction\b/.test(firstLine);
}
exports.isNoTransactionDefined = isNoTransactionDefined;
//# sourceMappingURL=header.js.map