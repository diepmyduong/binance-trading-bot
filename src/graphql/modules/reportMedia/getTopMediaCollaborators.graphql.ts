import { gql } from "apollo-server-express";

import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { getMatch } from "./common";

export default {
  schema: gql`
    extend type Query {
      getTopMediaCollaborators(query: GetTopMediaCollaboratorsInput!): MediaCollaborators
    }

    input GetTopMediaCollaboratorsInput {
      sellerIds: [ID]
      branchId: ID
    }

    type MediaCollaborators {
      mostLikeCollaborators: [Collaborator]
      mostShareCollaborators: [Collaborator]
      mostCommentCollaborators: [Collaborator]
      mostViewCollaborators: [Collaborator]
    }
  `,
  resolver: {
    Query: {
      getTopMediaCollaborators: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER);
        const { sellerIds, branchId } = args.query;
        const $match = await getMatch(context, branchId, sellerIds);
        const [
          mostLikeCollaborators,
          mostShareCollaborators,
          mostCommentCollaborators,
          mostViewCollaborators,
        ] = await Promise.all([
          getMostLikeCollaborators($match),
          getMostShareCollaborators($match),
          getMostCommentCollaborators($match),
          getMostViewCollaborators($match),
        ]);

        return {
          mostLikeCollaborators,
          mostShareCollaborators,
          mostCommentCollaborators,
          mostViewCollaborators,
        };
      },
    },
  },
};

function getMostViewCollaborators($match: any): any[] | PromiseLike<any[]> {
  return CollaboratorModel.aggregate([
    { $match: $match },
    { $sort: { clickCount: -1 } },
    { $limit: 5 },
  ]);
}

function getMostCommentCollaborators($match: any): any[] | PromiseLike<any[]> {
  return CollaboratorModel.aggregate([
    { $match: $match },
    { $sort: { commentCount: -1 } },
    { $limit: 5 },
  ]);
}

function getMostShareCollaborators($match: any): any[] | PromiseLike<any[]> {
  return CollaboratorModel.aggregate([
    { $match: $match },
    { $sort: { shareCount: -1 } },
    { $limit: 5 },
  ]);
}

async function getMostLikeCollaborators($match: any) {
  return await CollaboratorModel.aggregate([
    { $match: $match },
    { $sort: { likeCount: -1 } },
    { $limit: 5 },
  ]);
}
