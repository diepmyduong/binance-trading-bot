import { set } from "lodash";

import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { CustomerGroupLoader } from "./customerGroup.model";
import { customerGroupService } from "./customerGroup.service";

const Query = {
  getAllCustomerGroup: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    set(args, "q.filter.memberId", context.sellerId);
    return customerGroupService.fetch(args.q);
  },
  getOneCustomerGroup: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    return await customerGroupService.findOne({ _id: id, memberId: context.sellerId });
  },
};

const Mutation = {
  createCustomerGroup: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { data } = args;
    data.memberId = context.sellerId;
    return await customerGroupService.create(data);
  },
  updateCustomerGroup: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    await protectDoc(id, context);
    return await customerGroupService.updateOne(id, data);
  },
  deleteOneCustomerGroup: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    await protectDoc(id, context);
    return await customerGroupService.deleteOne(id);
  },
};

const CustomerGroup = {};

export default {
  Query,
  Mutation,
  CustomerGroup,
};
async function protectDoc(id: any, context: Context) {
  const doc = await CustomerGroupLoader.load(id);
  if (!doc || doc.memberId.toString() != context.sellerId) throw ErrorHelper.permissionDeny();
}
