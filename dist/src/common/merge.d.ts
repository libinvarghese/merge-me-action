import { getOctokit } from '@actions/github';
/**
 * Approves and merges a given Pull Request.
 */
export declare const merge: (octokit: ReturnType<typeof getOctokit>, { pullRequestId, reviewEdge, }: {
    pullRequestId: string;
    reviewEdge: {
        node: {
            state: string;
        };
    } | undefined;
}) => Promise<void>;
//# sourceMappingURL=merge.d.ts.map