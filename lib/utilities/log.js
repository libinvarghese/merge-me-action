"use strict";
/* eslint-disable @typescript-eslint/no-base-to-string */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarning = exports.logInfo = exports.logError = exports.logDebug = void 0;
const core_1 = require("@actions/core");
const stringify = (value) => {
    var _a;
    return typeof value === 'string'
        ? value
        : value instanceof Error
            ? (_a = value.stack) !== null && _a !== void 0 ? _a : value.toString() : typeof value === 'number'
            ? value.toString()
            : JSON.stringify(value);
};
const log = (logger) => (message) => logger(stringify(message));
exports.logDebug = log(core_1.debug);
exports.logError = log(core_1.error);
exports.logInfo = log(core_1.info);
exports.logWarning = log(core_1.warning);
//# sourceMappingURL=log.js.map