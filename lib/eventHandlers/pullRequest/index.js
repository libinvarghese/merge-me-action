"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pullRequestHandle = void 0;
const github_1 = require("@actions/github");
const queries_1 = require("../../graphql/queries");
const graphql_1 = require("../../utilities/graphql");
const log_1 = require("../../utilities/log");
const getPullRequestInformation = async (octokit, query) => {
    const response = await octokit.graphql(queries_1.findPullRequestLastApprovedReview, query);
    if (response === null) {
        return undefined;
    }
    const { repository: { pullRequest: { reviews: { edges: reviewEdges }, }, }, } = response;
    return {
        reviewEdges,
    };
};
exports.pullRequestHandle = async (octokit, gitHubLogin) => {
    const { repository, pull_request: pullRequest } = github_1.context.payload;
    if (pullRequest === undefined || repository === undefined) {
        log_1.logWarning('Required pull request information is unavailable.');
        return;
    }
    if (pullRequest.user.login !== gitHubLogin) {
        log_1.logInfo(`Pull request created by ${pullRequest.user.login}, not ${gitHubLogin}, skipping.`);
        return;
    }
    try {
        const pullRequestInformation = await getPullRequestInformation(octokit, {
            pullRequestNumber: pullRequest.number,
            repositoryName: repository.name,
            repositoryOwner: repository.owner.login,
        });
        if (pullRequestInformation === undefined) {
            log_1.logWarning('Unable to fetch pull request information.');
        }
        else {
            log_1.logInfo(`Found pull request information: ${JSON.stringify(pullRequestInformation)}.`);
            await octokit.graphql(graphql_1.mutationSelector(pullRequestInformation.reviewEdges[0]), {
                // eslint-disable-next-line max-len
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                commitHeadline: `Merge pull request #${pullRequest.number} from ${pullRequest.head.ref}`,
                pullRequestId: pullRequest.node_id,
            });
        }
    }
    catch (error) {
        log_1.logError(error);
    }
};
//# sourceMappingURL=index.js.map