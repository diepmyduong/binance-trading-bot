import { set } from "lodash";
import { SettingKey } from "../../../configs/settingData";

import { ROLES } from "../../../constants/role.const";
import {
  AuthHelper,
  ErrorHelper,
  firebaseHelper,
  UtilsHelper,
} from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { AddressHelper } from "../address/address.helper";
import {
  AddressDeliveryLoader,
  AddressDeliveryModel,
} from "../addressDelivery/addressDelivery.model";
import { AddressStorehouseLoader } from "../addressStorehouse/addressStorehouse.model";
import { BranchLoader } from "../branch/branch.model";
import { PositionLoader } from "../position/position.model";
import { SettingHelper } from "../setting/setting.helper";
import { MemberHelper } from "./member.helper";
import { IMember, MemberLoader, MemberModel } from "./member.model";
import { memberService } from "./member.service";

const Query = {
  getAllMember: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
    if (context.tokenData.role == ROLES.MEMBER) {
      set(args, "q.filter.parentIds", context.tokenData._id);
    }
    return memberService.fetch(args.q);
  },
  getOneMember: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await memberService.findOne({ _id: id });
  },
};

const Mutation = {
  createMember: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { password, ...data } = args.data;
    if (!UtilsHelper.isEmail(data.username))
      throw ErrorHelper.createUserError("email không đúng định dạng");
    if (password.length < 6)
      throw ErrorHelper.createUserError("mật khẩu phải có ít nhất 6 ký tự");
    const member = await MemberModel.findOne({ username: data.username });
    if (member) {
      throw ErrorHelper.createUserError("Tên tài khoản này đã tồn tại");
    }

    const fbUser = await firebaseHelper.createUser(data.username, password);
    data.uid = fbUser.uid;
    data.code = await memberService.generateCode();
    const helper = new MemberHelper(new MemberModel(data));

    await Promise.all([
      AddressHelper.setProvinceName(helper.member),
      AddressHelper.setDistrictName(helper.member),
      AddressHelper.setWardName(helper.member),
    ]);
    helper.setActivedAt();
    return await helper.member.save();
  },
  updateMember: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id, data } = args;
    return await memberService
      .updateOne(id, data)
      .then(async (res: IMember) => {
        const helper = new MemberHelper(res);
        await Promise.all([
          AddressHelper.setProvinceName(helper.member),
          AddressHelper.setDistrictName(helper.member),
          AddressHelper.setWardName(helper.member),
        ]);
        helper.setActivedAt();
        return await helper.member.save();
      });
  },
  deleteOneMember: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;
    return await memberService.deleteOne(id).then((m: IMember) => {
      firebaseHelper.deleteUser(m.uid).catch((err) => {});
      return m;
    });
  },
  deleteManyMember: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { ids } = args;
    let result = await memberService.deleteMany(ids);
    return result;
  },
};

const Member = {
  branch: GraphQLHelper.loadById(BranchLoader, "branchId"),
  position: GraphQLHelper.loadById(PositionLoader, "positionId"),
  parents: GraphQLHelper.loadManyById(MemberLoader, "parentIds"),
  mainAddressStorehouse: GraphQLHelper.loadById(
    AddressStorehouseLoader,
    "mainAddressStorehouseId"
  ),
  addressStorehouses: GraphQLHelper.loadManyById(
    AddressStorehouseLoader,
    "addressStorehouseIds"
  ),
  addressDeliverys: GraphQLHelper.loadManyById(
    AddressDeliveryLoader,
    "addressDeliveryIds"
  ),

  addressDelivery: async (root: IMember, args: any, context: Context) => {
    const address = await AddressDeliveryModel.findOne({ code: root.code });
    const noExistedAddress = root.addressDeliveryIds.findIndex(addr => addr.toString() === address.id.toString()) === -1;
    if(noExistedAddress) 
      return null;
    return address;
  },

  subscribers: async (root: IMember, args: any, context: Context) => {
    return new MemberHelper(root).getSubscribers();
  },

  chatbotRef: async (root: IMember, args: any, context: Context) => {
    const ref = await SettingHelper.load(SettingKey.STORY_REF);
    return root.fanpageId ? `https://m.me/${root.fanpageId}?ref=story.${ref}` : null;
  },

  shopUrl : async (root: IMember, args: any, context: Context) => {
    const host = await SettingHelper.load(SettingKey.WEBAPP_DOMAIN);
    // return `${host}?pageId=${root.fanpageId}`;
    return `${host}?code=${root.code}`;
  }
};


export default {
  Query,
  Mutation,
  Member,
};
