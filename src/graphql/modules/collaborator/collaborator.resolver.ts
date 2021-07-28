import { set } from "lodash";

import { ModelSelectLoader } from "../../../base/baseModel";
import { SettingKey } from "../../../configs/settingData";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, KeycodeHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { counterService } from "../counter/counter.service";
import { CustomerLoader } from "../customer/customer.model";
import { IMember, MemberLoader, MemberModel } from "../member/member.model";
import { SettingHelper } from "../setting/setting.helper";
import { CollaboratorLoader, CollaboratorModel } from "./collaborator.model";
import { collaboratorService } from "./collaborator.service";

const Query = {
  getAllCollaborator: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    set(args, "q.filter.memberId", context.id);
    return collaboratorService.fetch(args.q);
  },
  getOneCollaborator: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id } = args;
    return await collaboratorService.findOne({ _id: id, memberId: context.id });
  },
};

const Mutation = {
  createCollaborator: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { data } = args;
    const { phone } = data;
    await checkDuplicatePhone(phone, context);
    await checkDuplicateCode(data, context);
    if (!data.code) {
      data.code = await counterService.trigger("collaborator").then((res) => "CTV" + res);
    }
    data.memberId = context.id;
    const [host, member] = await Promise.all([
      SettingHelper.load(SettingKey.WEBAPP_DOMAIN),
      MemberLoader.load(context.id),
    ]);
    const secret = `${phone}-${context.id}`;
    let shortCode = KeycodeHelper.alpha(secret, 6);
    let shortUrl = `${host}/${member.code}/ctv/${shortCode}`;
    let countShortUrl = await CollaboratorModel.count({ shortUrl });
    while (countShortUrl > 0) {
      shortCode = KeycodeHelper.alpha(secret, 6);
      shortUrl = `${host}/ctv/${shortCode}`;
      countShortUrl = await CollaboratorModel.count({ shortUrl });
    }
    data.shortCode = shortCode;
    data.shortUrl = shortUrl;
    return await collaboratorService.create(data);
  },

  updateCollaborator: async (root: any, args: any, context: Context) => {
    context.auth([ROLES.MEMBER]);
    const { id, data } = args;
    await protectDoc(id, context);
    return await collaboratorService.updateOne(id, data);
  },

  deleteOneCollaborator: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.MEMBER]);
    const { id } = args;
    await protectDoc(id, context);
    return await collaboratorService.deleteOne(id);
  },
};
const memberLoader = ModelSelectLoader<IMember>(MemberModel, "id shopName shopLogo fanpageImage");

const Collaborator = {
  member: GraphQLHelper.loadById(memberLoader, "memberId"),
  customer: GraphQLHelper.loadById(CustomerLoader, "customerId"),
};

export default {
  Query,
  Mutation,
  Collaborator,
};
async function protectDoc(id: any, context: Context) {
  const col = await CollaboratorLoader.load(id);
  if (col.memberId.toString() != context.id) throw ErrorHelper.permissionDeny();
}

async function checkDuplicateCode(data: any, context: Context) {
  if (data.code) {
    if (await CollaboratorModel.findOne({ memberId: context.id, code: data.code })) {
      throw ErrorHelper.duplicateError("Mã CTV");
    }
  }
}

async function checkDuplicatePhone(phone: any, context: Context) {
  const existedCollaborator = await CollaboratorModel.findOne({
    phone,
    memberId: context.id,
  });
  if (existedCollaborator) throw ErrorHelper.duplicateError("Số điện thoại");
}
