"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pushHandle = void 0;
const github_1 = require("@actions/github");
const queries_1 = require("../../graphql/queries");
const graphql_1 = require("../../utilities/graphql");
const log_1 = require("../../utilities/log");
const COMMIT_HEADLINE_MATCHER = /^(?<commitHeadline>.*)[\s\S]*$/u;
const SHORT_REFERENCE_MATCHER = /^refs\/heads\/(?<name>.*)$/u;
const getCommitMessageHeadline = () => {
    const { groups: { commitHeadline }, } = github_1.context.payload.commits[0].message.match(COMMIT_HEADLINE_MATCHER);
    return commitHeadline;
};
const getReferenceName = () => {
    const { groups: { name }, } = github_1.context.payload.ref.match(SHORT_REFERENCE_MATCHER);
    return name;
};
const getPullRequestInformation = async (octokit, query) => {
    const response = await octokit.graphql(queries_1.findPullRequestInfoAndReviews, query);
    if (response === null ||
        response.repository.pullRequests.nodes.length === 0) {
        return undefined;
    }
    const { repository: { pullRequests: { nodes: [{ id: pullRequestId, mergeable: mergeableState, merged, reviews: { edges: reviewEdges }, state: pullRequestState, },], }, }, } = response;
    return {
        mergeableState,
        merged,
        pullRequestId,
        pullRequestState,
        reviewEdges,
    };
};
const tryMerge = async (octokit, { commitMessageHeadline, mergeableState, merged, pullRequestId, pullRequestState, reviewEdges, }) => {
    if (mergeableState !== 'MERGEABLE') {
        log_1.logInfo(`Pull request is not in a mergeable state: ${mergeableState}.`);
    }
    else if (merged) {
        log_1.logInfo(`Pull request is already merged.`);
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
exports.pushHandle = async (octokit, gitHubLogin) => {
    if (github_1.context.payload.pusher.name !== gitHubLogin) {
        log_1.logInfo(`Pull request created by ${github_1.context.payload.pusher.name}, not ${gitHubLogin}, skipping.`);
        return;
    }
    try {
        const pullRequestInformation = await getPullRequestInformation(octokit, {
            referenceName: getReferenceName(),
            repositoryName: github_1.context.repo.repo,
            repositoryOwner: github_1.context.repo.owner,
        });
        if (pullRequestInformation === undefined) {
            log_1.logWarning('Unable to fetch pull request information.');
        }
        else {
            log_1.logInfo(`Found pull request information: ${JSON.stringify(pullRequestInformation)}.`);
            await tryMerge(octokit, {
                ...pullRequestInformation,
                commitMessageHeadline: getCommitMessageHeadline(),
            });
        }
    }
    catch (error) {
        log_1.logError(error);
    }
};
//# sourceMappingURL=index.js.map