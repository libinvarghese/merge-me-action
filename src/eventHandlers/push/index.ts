import { context, getOctokit } from '@actions/github';

import { merge } from '../../common/merge';
import { findPullRequestInfoAndReviews as findPullRequestInformationAndReviews } from '../../graphql/queries';
import { GroupName, PullRequestInformation, Repository } from '../../types';
import { logInfo, logWarning } from '../../utilities/log';

const SHORT_REFERENCE_MATCHER = /^refs\/heads\/(?<name>.*)$/u;

const getReferenceName = (): string => {
  const {
    groups: { name },
  } = context.payload.ref.match(SHORT_REFERENCE_MATCHER) as GroupName;

  return name;
};

const getPullRequestInformation = async (
  octokit: ReturnType<typeof getOctokit>,
  query: {
    referenceName: string;
    repositoryName: string;
    repositoryOwner: string;
  },
): Promise<PullRequestInformation | undefined> => {
  const response = await octokit.graphql(
    findPullRequestInformationAndReviews,
    query,
  );

  if (
    response === null ||
    response.repository.pullRequests.nodes.length === 0
  ) {
    return undefined;
  }

  const {
    repository: {
      pullRequests: {
        nodes: [
          {
            id: pullRequestId,
            mergeable: mergeableState,
            merged,
            reviews: { edges: reviewEdges },
            state: pullRequestState,
          },
        ],
      },
    },
  } = response as Repository;

  return {
    mergeableState,
    merged,
    pullRequestId,
    pullRequestState,
    reviewEdges,
  };
};

const tryMerge = async (
  octokit: ReturnType<typeof getOctokit>,
  {
    mergeableState,
    merged,
    pullRequestId,
    pullRequestState,
    reviewEdges,
  }: PullRequestInformation,
): Promise<void> => {
  if (mergeableState !== 'MERGEABLE') {
    logInfo(`Pull request is not in a mergeable state: ${mergeableState}.`);
  } else if (merged) {
    logInfo(`Pull request is already merged.`);
  } else if (pullRequestState !== 'OPEN') {
    logInfo(`Pull request is not open: ${pullRequestState}.`);
  } else {
    await merge(octokit, {
      pullRequestId,
      reviewEdge: reviewEdges[0],
    });
  }
};

export const pushHandle = async (
  octokit: ReturnType<typeof getOctokit>,
  gitHubLogin: string,
): Promise<void> => {
  if (context.payload.pusher.name !== gitHubLogin) {
    logInfo(
      `Pull request created by ${
        context.payload.pusher.name as string
      }, not ${gitHubLogin}, skipping.`,
    );

    return;
  }

  const pullRequestInformation = await getPullRequestInformation(octokit, {
    referenceName: getReferenceName(),
    repositoryName: context.repo.repo,
    repositoryOwner: context.repo.owner,
  });

  if (pullRequestInformation === undefined) {
    logWarning('Unable to fetch pull request information.');
  } else {
    logInfo(
      `Found pull request information: ${JSON.stringify(
        pullRequestInformation,
      )}.`,
    );

    await tryMerge(octokit, {
      ...pullRequestInformation,
    });
  }
};
