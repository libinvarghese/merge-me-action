"use strict";
/* eslint-disable no-await-in-loop */
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSuiteHandle = void 0;
const github_1 = require("@actions/github");
const queries_1 = require("../../graphql/queries");
const graphql_1 = require("../../utilities/graphql");
const log_1 = require("../../utilities/log");
const getPullRequestInformation = async (octokit, query) => {
    const response = await octokit.graphql(queries_1.findPullRequestInfo, query);
    if (response === null || response.repository.pullRequest === null) {
        return undefined;
    }
    const { repository: { pullRequest: { id: pullRequestId, commits: { edges: [{ node: { commit: { messageHeadline: commitMessageHeadline }, }, },], }, reviews: { edges: reviewEdges }, mergeStateStatus, mergeable: mergeableState, merged, state: pullRequestState, }, }, } = response;
    return {
        commitMessageHeadline,
        mergeStateStatus,
        mergeableState,
        merged,
        pullRequestId,
        pullRequestState,
        reviewEdges,
    };
};
const tryMerge = async (octokit, { commitMessageHeadline, mergeStateStatus, mergeableState, merged, pullRequestId, pullRequestState, reviewEdges, }) => {
    if (mergeableState !== 'MERGEABLE') {
        log_1.logInfo(`Pull request is not in a mergeable state: ${mergeableState}.`);
    }
    else if (merged) {
        log_1.logInfo(`Pull request is already merged.`);
    }
    else if (mergeStateStatus !== 'CLEAN' &&
        /*
         * cspell:ignore merlinnot
         *
         * TODO(merlinnot) [2020-09-01] Start pulling the value once it reaches
         * GA.
         */
        mergeStateStatus !== undefined) {
        log_1.logInfo('Pull request cannot be merged cleanly. ' +
            `Current state: ${mergeStateStatus}.`);
    }
    else if (pullRequestState !== 'OPEN') {
        log_1.logInfo(`Pull request is not open: ${pullRequestState}.`);
    }
    else {
        await octokit.graphql(graphql_1.mutationSelector(reviewEdges[0]), {
            commitHeadline: commitMessageHeadline,
            pullRequestId,
        });
    }
};
exports.checkSuiteHandle = async (octokit, gitHubLogin) => {
    var _a, _b;
    const pullRequests = github_1.context.payload.check_suite.pull_requests;
    for (const pullRequest of pullRequests) {
        if (typeof github_1.context.payload.sender !== 'object' ||
            github_1.context.payload.sender.login !== gitHubLogin) {
            log_1.logInfo(`Pull request created by ${(_b = (_a = github_1.context.payload.sender) === null || _a === void 0 ? void 0 : _a.login) !== null && _b !== void 0 ? _b : 'unknown sender'}, not ${gitHubLogin}, skipping.`);
            return;
        }
        try {
            const pullRequestInformation = await getPullRequestInformation(octokit, {
                pullRequestNumber: pullRequest.number,
                repositoryName: github_1.context.repo.repo,
                repositoryOwner: github_1.context.repo.owner,
            });
            if (pullRequestInformation === undefined) {
                log_1.logWarning('Unable to fetch pull request information.');
            }
            else {
                log_1.logInfo(`Found pull request information: ${JSON.stringify(pullRequestInformation)}.`);
                await tryMerge(octokit, pullRequestInformation);
            }
        }
        catch (error) {
            log_1.logError(error);
        }
    }
};
//# sourceMappingURL=index.js.map