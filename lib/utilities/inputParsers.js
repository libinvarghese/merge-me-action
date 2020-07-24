"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInputMergeMethod = exports.AllowedMergeMethods = void 0;
const core_1 = require("@actions/core");
const log_1 = require("./log");
var AllowedMergeMethods;
(function (AllowedMergeMethods) {
    AllowedMergeMethods["MERGE"] = "MERGE";
    AllowedMergeMethods["SQUASH"] = "SQUASH";
    AllowedMergeMethods["REBASE"] = "REBASE";
})(AllowedMergeMethods = exports.AllowedMergeMethods || (exports.AllowedMergeMethods = {}));
exports.parseInputMergeMethod = () => {
    const input = core_1.getInput('MERGE_METHOD');
    if (input.length === 0 || AllowedMergeMethods[input] === undefined) {
        log_1.logWarning('MERGE_METHOD value input is ignored because its malformed, defaulting to SQUASH.');
        return AllowedMergeMethods.SQUASH;
    }
    return AllowedMergeMethods[input];
};
//# sourceMappingURL=inputParsers.js.map