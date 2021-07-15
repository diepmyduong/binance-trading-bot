import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CollaboratorModel } from "../collaborator/collaborator.model";
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
    const params: any = { phone: root.phone };
    if (context.isMember()) {
      params.memberId = context.id;
    }
    if (context.isCustomer()) {
      params.memberId = context.sellerId;
    }
    const collaborator = await CollaboratorModel.findOne(params);
    return collaborator ? true : false;
  },

  collaboratorShops: async (root: ICustomer, args: any, context: Context) => {
    const collaborator = await CollaboratorModel.find({ phone: root.phone });
    const memberIds = collaborator.map((c) => c.memberId);
    const members = await MemberModel.find({ _id: { $in: memberIds } });
    return members;
  },

  collaborator: async (root: ICustomer, args: any, context: Context) => {
    const params: any = { phone: root.phone };
    if (context.isMember()) {
      params.memberId = context.id;
    }
    if (context.isCustomer()) {
      params.memberId = context.sellerId;
    }
    const collaborator = await CollaboratorModel.findOne(params);
    return collaborator;
  },
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
