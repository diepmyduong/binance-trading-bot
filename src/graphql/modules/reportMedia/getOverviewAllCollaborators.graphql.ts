import { gql } from "apollo-server-express";
import { get, set } from "lodash";
import { Types } from "mongoose";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { MemberModel } from "../member/member.model";
import { getMatch } from "./common";

export default {
  schema: gql`
    extend type Query {
      getOverviewAllCollaborators(branchId: ID, sellerIds: [ID]): OverviewMediaCollaboratorStats
    }
    type OverviewMediaCollaboratorStats {
      shareCount: Int
      likeCount: Int
      commentCount: Int
      collaboratorCount: Int
      clickCount: Int
    }
  `,
  resolver: {
    Query: {
      getOverviewAllCollaborators: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR_MEMBER);
        const { branchId, sellerIds } = args;
        const $match: any = await getMatch(context, branchId, sellerIds);
        const query: any = [
          { $match: $match },
          {
            $group: {
              _id: null,
              shareCount: { $sum: "$shareCount" },
              likeCount: { $sum: "$likeCount" },
              commentCount: { $sum: "$commentCount" },
              clickCount: { $sum: "$clickCount" },
              collaboratorCount: { $sum: 1 },
            },
          },
        ];
        return await CollaboratorModel.aggregate(query).then((res) =>
          get(res, "0", {
            shareCount: 0,
            likeCount: 0,
            commentCount: 0,
            clickCount: 0,
            collaboratorCount: 0,
          })
        );
      },
    },
  },
};
