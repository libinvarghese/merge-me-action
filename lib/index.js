"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const eventHandlers_1 = require("./eventHandlers");
const log_1 = require("./utilities/log");
const GITHUB_TOKEN = core_1.getInput('GITHUB_TOKEN');
const GITHUB_LOGIN = core_1.getInput('GITHUB_LOGIN');
const octokit = new github_1.GitHub(GITHUB_TOKEN);
const main = async () => {
    log_1.logInfo(`Automatic merges enabled for GitHub login: ${GITHUB_LOGIN}.`);
    switch (github_1.context.eventName) {
        case 'check_suite':
            return eventHandlers_1.checkSuiteHandle(octokit, GITHUB_LOGIN);
        case 'pull_request':
            return eventHandlers_1.pullRequestHandle(octokit, GITHUB_LOGIN);
        case 'push':
            return eventHandlers_1.pushHandle(octokit, GITHUB_LOGIN);
        default:
            log_1.logWarning(`Unknown event ${github_1.context.eventName}, skipping.`);
    }
};
main().catch((error) => {
    var _a;
    core_1.setFailed(`An unexpected error occurred: ${error.message}, ${(_a = error.stack) !== null && _a !== void 0 ? _a : 'no stack trace'}.`);
});
//# sourceMappingURL=index.js.map