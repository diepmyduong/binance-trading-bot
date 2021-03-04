import { ErrorHelper } from "../../../base/error";
import { SettingKey } from "../../../configs/settingData";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, KeycodeHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { AddressHelper } from "../address/address.helper";
import {
  CampaignSocialResultLoader,
  CampaignSocialResultModel,
  ICampaignSocialResult,
} from "../campaignSocialResult/campaignSocialResult.model";
import { MemberLoader, MemberModel } from "../member/member.model";
import { ProductLoader, ProductModel } from "../product/product.model";
import { SettingHelper } from "../setting/setting.helper";
import { CampaignHelper } from "./campaign.helper";
import { CampaignModel, ICampaign } from "./campaign.model";
import { campaignService } from "./campaign.service";

const Query = {
  getAllCampaign: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    return campaignService.fetch(args.q);
  },
  getOneCampaign: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN, ROLES.EDITOR]);
    const { id } = args;
    return await campaignService.findOne({ _id: id });
  },
};

const Mutation = {
  createCampaign: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);

    const data: ICampaign = args.data;

    data.code = data.code || (await CampaignHelper.generateCode());

    const {
      startDate,
      endDate,
      branchId,
      provinceId,
      productId,
      memberType,
    } = data;

    const diff = CampaignHelper.diffDate(startDate, endDate);

    if (diff <= 0)
      throw ErrorHelper.requestDataInvalid(
        ". Ngày bắt đầu và ngày kết thúc không đúng."
      );

    const memberFilterParams: any[] = [];

    memberType && memberFilterParams.push({ type: memberType });
    branchId && memberFilterParams.push({ branchId });
    if (provinceId) {
      memberFilterParams.push({ provinceId });
      await Promise.all([AddressHelper.setProvinceName(data)]);
    }

    const [members, product] = await Promise.all([
      MemberModel.find({ $and: memberFilterParams }),
      ProductModel.findOne({ _id: productId, isPrimary: true }),
    ]);

    // console.log('=========> members', members);

    if (!product) throw ErrorHelper.recoredNotFound("Sản phẩm");

    if (data.content === "test") data.content = testContent;

    const campaign = new CampaignModel(data);

    const campaignSocialResults: ICampaignSocialResult[] = [];

    for (const member of members) {
      if (member.fanpageId) {
        const campaignId = campaign.id;
        const productId = product._id;
        const memberId = member._id;
        const secret = `${campaignId.toString()}-${productId.toString()}-${memberId.toString()}`;
        let shortUrl = KeycodeHelper.alpha(secret, 6);
        // kiem tra tồn tại url thì cứ tạo key đến khi nó khác thì thôi
        let countShortUrl = await CampaignSocialResultModel.count({ shortUrl });
        while (countShortUrl > 0) {
          shortUrl = KeycodeHelper.alpha(secret, 6);
          countShortUrl = await CampaignSocialResultModel.count({ shortUrl });
        }

        const host = await SettingHelper.load(SettingKey.APP_DOMAIN);

        const affiliateLink = `${host}/cd/${shortUrl}`;

        const campaignSocial = new CampaignSocialResultModel({
          campaignId,
          affiliateLink,
          shortUrl,
          productId,
          memberId,
        });
        campaignSocialResults.push(campaignSocial);
      }
    }

    campaign.campainSocialResultIds = campaignSocialResults.map(
      (res) => res._id
    );
    campaign.memberIds = campaignSocialResults.map((res) => res.memberId);

    return await Promise.all([
      campaign.save(),
      CampaignSocialResultModel.insertMany(campaignSocialResults),
    ]).then(([savedCampaign]) => savedCampaign);
  },

  updateCampaign: async (root: any, args: any, context: Context) => {
    const { id } = args;
    const data: ICampaign = args.data;
    if (data.content === "test") data.content = testContent;
    return await campaignService.updateOne(id, data);
  },

  deleteOneCampaign: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.ADMIN]);
    const { id } = args;
    return await campaignService.deleteOne(id);
  },
};

const Campaign = {
  members: GraphQLHelper.loadManyById(MemberLoader, "memberIds"),
  product: GraphQLHelper.loadById(ProductLoader, "productId"),
  campaignSocialResults: GraphQLHelper.loadManyById(
    CampaignSocialResultLoader,
    "campainSocialResultIds"
  ),
};

export default {
  Query,
  Mutation,
  Campaign,
};

const testContent = `🔥 S50 - DATA KHÔNG GIỚI HẠN CHỈ VỚI 50.000Đ/THÁNG 🔥
✔️ MIỄN PHÍ DATA xem phim điện ảnh bom tấn Hollywood, Châu Á, phim truyền hình, Phim Việt Nam, Phim Hàn Quốc, Phim Trung Quốc..., mới nhất có bản quyền, cùng với Gameshow đỉnh cao trên ứng dụng giải trí VieON.
✔️ MIỄN PHÍ DATA truy cập Tiktok, Elsa Speak
✔️ Tặng data tốc độ cao không giới hạn, có sẵn 5GB/tháng data lướt nét.️ Hết dung lượng của gói, hệ thống hạ băng thông tốc độ 5Mbps, để khách hàng truy cập mạng miễn phí.
➡️ Soạn: DV8 S50 gửi 9084.
➡️ Giá 50.000đ/ tháng 
🔥 2S50 - CẢ THẾ GIỚI GIẢI TRÍ TRONG TẦM TAY CHỈ VỚI 𝟓𝟎.𝟎𝟎𝟎Đ/THÁNG 🔥 
👩‍🦰 Đối tượng đăng ký:
-  Thuê bao phát triển mới từ ngày 01/06/2020.
-  Có cước hàng tháng dưới 50.000đ trong 3 tháng gần nhất.
😙 Gói mới với ưu đãi "siêu to", đăng ký thôi cả nhà ơi!!!

{{LINK_AFFILIATE}}
`;
