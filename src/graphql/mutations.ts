import { AllowedMergeMethods } from '../utilities/inputParsers';

export const approveAndMergePullRequestMutation = (
  mergeMethod: AllowedMergeMethods,
): string => `
  mutation ($pullRequestId: ID!) {
    addPullRequestReview(input: {event: APPROVE, pullRequestId: $pullRequestId}) {
      clientMutationId
    }
    mergePullRequest(input: {mergeMethod: ${mergeMethod}, pullRequestId: $pullRequestId}) {
      clientMutationId
    }
  }
`;

export const mergePullRequestMutation = (
  mergeMethod: AllowedMergeMethods,
): string => `
  mutation ($pullRequestId: ID!) {
    mergePullRequest(input: {mergeMethod: ${mergeMethod}, pullRequestId: $pullRequestId}) {
      clientMutationId
    }
  }
`;
