import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { MemberLoader } from "../member/member.model";
import { CollaboratorModel } from "./collaborator.model";
import { collaboratorService } from "./collaborator.service";

const Query = {
  getAllCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);

    if (context.isMember()) {
    }

    return collaboratorService.fetch(args.q);
  },
  getOneCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await collaboratorService.findOne({ _id: id });
  },
};

const Mutation = {
  createCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { data } = args;

    const { phone } = data;

    const existedCollaborator = await CollaboratorModel.findOne({
      phone,
      memberId: context.id,
    });

    if (existedCollaborator) throw ErrorHelper.duplicateError("Số điện thoại");

    data.memberId = context.id;

    return await collaboratorService.create(data);
  },

  updateCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { id, data } = args;

    const { phone } = data;

    const existedCollaborator = await CollaboratorModel.findOne({
      phone,
      memberId: context.id,
    });

    if (existedCollaborator.id !== id)
      throw ErrorHelper.duplicateError("Số điện thoại");

    data.memberId = context.id;
    
    return await collaboratorService.updateOne(id, data);
  },

  deleteOneCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { id } = args;
    return await collaboratorService.deleteOne(id);
  },
};

const Collaborator = {
  member: GraphQLHelper.loadById(MemberLoader, 'memberId')
};

export default {
  Query,
  Mutation,
  Collaborator,
};
