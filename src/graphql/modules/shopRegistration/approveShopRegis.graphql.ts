import { gql } from "apollo-server-express";
import { ROLES } from "../../../constants/role.const";
import { Context } from "../../context";
import { MemberModel } from "../member/member.model";
import { ShopRegistionStatus, ShopRegistrationModel } from "./shopRegistration.model";
import passwordHash from "password-hash";
import shortHash from "short-hash";
import { ShopConfigModel } from "../shopConfig/shopConfig.model";
import { MemberHelper } from "../member/member.helper";
import { shopConfigService } from "../shopConfig/shopConfig.service";

export default {
  schema: gql`
    extend type Mutation {
      approveShopRegis(regisId: ID!, approve: Boolean!): ShopRegistration
    }
  `,
  resolver: {
    Mutation: {
      approveShopRegis: async (root: any, args: any, context: Context) => {
        context.auth(ROLES.ADMIN_EDITOR);
        const { regisId, approve } = args;
        const regis = await ShopRegistrationModel.findById(regisId);
        if (!regis) throw Error("Không tìm thấy yêu cầu đăng ký");
        if (regis.status != ShopRegistionStatus.PENDING) throw Error("Yêu cầu đã được xử lý");
        if (approve) {
          if (await MemberModel.findOne({ username: regis.email }))
            throw Error("Email đã được sử dụng");
          if (await MemberModel.findOne({ code: regis.shopCode }))
            throw Error("Mã cửa hàng đã được sử dụng");
          const password = shortHash(regis.shopCode);
          const hashedPassword = passwordHash.generate(password);
          const helper = new MemberHelper(
            new MemberModel({
              username: regis.email,
              password: hashedPassword,
              phone: regis.phone,
              name: regis.name,
              code: regis.shopCode,
              shopName: regis.shopName,
              shopLogo: regis.shopLogo,
              address: regis.address,
              provinceId: regis.provinceId,
              districtId: regis.districtId,
              wardId: regis.wardId,
              province: regis.province,
              district: regis.district,
              ward: regis.ward,
              birthday: regis.birthday,
              gender: regis.gender,
            })
          );
          await helper.setActivedAt().member.save();
          regis.approvedAt = new Date();
          regis.status = ShopRegistionStatus.APPROVED;
          regis.memberId = helper.member._id;
          await Promise.all([
            regis.save(),
            ShopConfigModel.create({
              memberId: helper.member._id,
              ...shopConfigService.getDefaultConfig(),
            }),
          ]);
          return regis;
        } else {
          regis.status = ShopRegistionStatus.REJECTED;
          regis.rejectedAt = new Date();
          return await regis.save();
        }
      },
    },
  },
};
