import { set } from "lodash";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CollaboratorModel } from "../collaborator/collaborator.model";
import { MemberHelper } from "../member/member.helper";
import { MemberLoader, MemberModel } from "../member/member.model";
import { ICustomer } from "./customer.model";
import { customerService } from "./customer.service";
import { CustomerIsCollaborator } from "./loader/customerIsCollaborator.loader";

const Query = {
  getAllCustomer: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    const memberHelper = await MemberHelper.fromContext(context);
    if (memberHelper) {
      set(args, "q.filter.pageAccounts", {
        $elemMatch: { memberId: memberHelper.member._id },
      });
    }
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
    return CustomerIsCollaborator.loader.load(root.phone);
  },
  //Danh sách các cửa hàng mà khách hàng đang cộng tác
  collaboratorShops: async (root: ICustomer, args: any, context: Context) => {
    const collaborator = await CollaboratorModel.find({ phone: root.phone });
    const memberIds = collaborator.map((c) => c.memberId);
    const members = await MemberModel.find({ _id: { $in: memberIds } });
    return members;
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