"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
exports.calculateHash = (str, previousHash, algorithm = "sha1") => algorithm +
    ":" +
    crypto
        .createHash(algorithm)
        .update(((previousHash || "") + "\n" + str.trim()).trim() + "\n")
        .digest("hex");
//# sourceMappingURL=hash.js.map