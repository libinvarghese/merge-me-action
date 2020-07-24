"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergePullRequestMutation = exports.approveAndMergePullRequestMutation = void 0;
exports.approveAndMergePullRequestMutation = (mergeMethod) => `
  mutation ($commitHeadline: String!, $pullRequestId: ID!) {
    addPullRequestReview(input: {event: APPROVE, pullRequestId: $pullRequestId}) {
      clientMutationId
    }
    mergePullRequest(input: {commitBody: " ", commitHeadline: $commitHeadline, mergeMethod: ${mergeMethod}, pullRequestId: $pullRequestId}) {
      clientMutationId
    }
  }
`;
exports.mergePullRequestMutation = (mergeMethod) => `
  mutation ($commitHeadline: String!, $pullRequestId: ID!) {
    mergePullRequest(input: {commitHeadline: $commitHeadline, mergeMethod: ${mergeMethod}, pullRequestId: $pullRequestId}) {
      clientMutationId
    }
  }
`;
//# sourceMappingURL=mutations.js.map