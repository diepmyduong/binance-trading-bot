import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CollaboratorLoader, CollaboratorModel } from "../collaborator/collaborator.model";
import { MemberLoader, MemberModel } from "../member/member.model";
import { ICustomer } from "./customer.model";
import { customerService } from "./customer.service";

const Query = {
  getAllCustomer: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    set(args, "q.filter.memberId", context.sellerId);
    return customerService.fetch(args.q);
  },
  getOneCustomer: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await customerService.findOne({ _id: id });
  },
};

const Mutation = {};

const Customer = {
  isCollaborator: async (root: ICustomer, args: any, context: Context) => {
    return !!root.collaboratorId;
  },
  collaboratorShops: async (root: ICustomer, args: any, context: Context) => {
    const collaborator = await CollaboratorModel.find({ phone: root.phone });
    const memberIds = collaborator.map((c) => c.memberId);
    const members = await MemberModel.find({ _id: { $in: memberIds } });
    return members;
  },
  collaborator: GraphQLHelper.loadById(CollaboratorLoader, "collaboratorId"),
};

const CustomerPageAccount = {
  member: GraphQLHelper.loadById(MemberLoader, "memberId"),
};

export default {
  Query,
  Mutation,
  Customer,
  CustomerPageAccount,
};
