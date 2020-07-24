"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPullRequestLastApprovedReview = exports.findPullRequestInfo = exports.findPullRequestInfoAndReviews = exports.findPullRequestNodeIdByHeadReferenceName = exports.findPullRequestNodeIdByPullRequestNumber = void 0;
exports.findPullRequestNodeIdByPullRequestNumber = `
  query FindPullRequestNodeId($repositoryOwner: String!, $repositoryName: String!, $pullRequestNumber: Int!) {
    repository(owner: $repositoryOwner, name: $repositoryName) {
      pullRequest(number: $pullRequestNumber) {
        id
      }
    }
  }
`;
exports.findPullRequestNodeIdByHeadReferenceName = `
  query FindPullRequestNodeId($repositoryOwner: String!, $repositoryName: String!, $referenceName: String!) {
    repository(owner: $repositoryOwner, name: $repositoryName) {
      pullRequests(headRefName: $referenceName, first: 1) {
        nodes {
          id
        }
      }
    }
  }
`;
exports.findPullRequestInfoAndReviews = `
  query FindPullRequestInfoAndReviews($repositoryOwner: String!, $repositoryName: String!, $referenceName: String!) {
    repository(owner: $repositoryOwner, name: $repositoryName) {
      pullRequests(headRefName: $referenceName, first: 1) {
        nodes {
          reviews(last: 1, states: APPROVED) {
            edges {
              node {
                state
              }
            }
          }
          mergeable
          merged
          state
          id
        }
      }
    }
  }
`;
exports.findPullRequestInfo = `
  query FindPullRequestInfo($repositoryOwner: String!, $repositoryName: String!, $pullRequestNumber: Int!) {
    repository(owner: $repositoryOwner, name: $repositoryName) {
      pullRequest(number: $pullRequestNumber) {
        reviews(last: 1, states: APPROVED) {
          edges {
            node {
              state
            }
          }
        }
        id
        commits(last: 1) {
          edges {
            node {
              commit {
                messageHeadline
                message
              }
            }
          }
        }
        mergeable
        merged
        state
      }
    }
  }
`;
exports.findPullRequestLastApprovedReview = `
  query FindPullRequestLastApprovedReview($repositoryOwner: String!, $repositoryName: String!, $pullRequestNumber: Int!) {
    repository(owner: $repositoryOwner, name: $repositoryName) {
      pullRequest(number: $pullRequestNumber) {
        reviews(last: 1, states: APPROVED) {
          edges {
            node {
              state
            }
          }
        }
      }
    }
  }
`;
//# sourceMappingURL=queries.js.map