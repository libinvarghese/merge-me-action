"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutationSelector = void 0;
const mutations_1 = require("../graphql/mutations");
const inputParsers_1 = require("./inputParsers");
/**
 * Returns the right GraphQl mutation depending on weather the
 * `reviewEdge` form the Pull Request contains a review with `'Approved'`
 * state or if it is `undefined`.
 * This prevents approving an already approved pull request.
 * @param reviewEdge
 * @returns `approveAndMergePullRequestMutation` | `mergePullRequestMutation`
 */
exports.mutationSelector = (reviewEdge) => {
    const mergeMethod = inputParsers_1.parseInputMergeMethod();
    if (reviewEdge === undefined) {
        return mutations_1.approveAndMergePullRequestMutation(mergeMethod);
    }
    return mutations_1.mergePullRequestMutation(mergeMethod);
};
//# sourceMappingURL=graphql.js.map