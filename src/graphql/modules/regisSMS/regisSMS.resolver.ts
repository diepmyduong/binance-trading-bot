import { set } from "lodash";
import { ErrorHelper } from "../../../base/error";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper } from "../../../helpers";
import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { Context } from "../../context";
import { CustomerLoader, CustomerModel } from "../customer/customer.model";
import { MemberLoader, MemberModel } from "../member/member.model";
import { ProductLoader, ProductModel, ProductType } from "../product/product.model";
import { RegisServiceHelper } from "../regisService/regisService.helper";
import { RegisSMSHelper } from "./regisSMS.helper";
import { IRegisSMS, RegisSMSModel, RegisSMSStatus } from "./regisSMS.model";
import { regisSMSService } from "./regisSMS.service";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { CampaignLoader } from "../campaign/campaign.model";
import { campaignService } from "../campaign/campaign.service";
import { CampaignSocialResultLoader, CampaignSocialResultModel } from "../campaignSocialResult/campaignSocialResult.model";
// import { ObjectId } from "mongodb";

const Query = {

  //[Backend] Cung cấp API truy cập lich sử dịch vụ SMS
  getAllRegisSMS: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    if (context.isMember()) {
      set(args, "q.filter.sellerId", context.id);
    }
    if (context.isCustomer()) {
      set(args, "q.filter.registerId", context.id);
    }
    return regisSMSService.fetch(args.q);
  },

  getOneRegisSMS: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await regisSMSService.findOne({ _id: id });
  },

};

const Mutation = {
  createRegisSMS: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, [ROLES.CUSTOMER]);
    const { sellerId, id, campaignCode } = context;
    const customerId = id;
    const { data } = args;
    const {
      productId,
      registerName,
      registerPhone,
    } = data;


    // console.log('registerId', registerId);
    // Kiểm tra sản phẩm
    const [customer, product, member, campaign] = await Promise.all([
      CustomerModel.findById(customerId),
      ProductModel.findOne({ _id: productId, type: ProductType.SMS }),
      MemberModel.findById(sellerId),
      campaignService.getCampaignByCodeAndProduct(campaignCode, productId, sellerId)
    ]);

    // Kiểm tra sản phẩm
    if (!product) throw ErrorHelper.productNotExist();

    //Kiểm tra số điện thoại hợp lệ
    if (registerPhone) RegisServiceHelper.validatePhone(registerPhone);

    if (!customer)
      throw ErrorHelper.mgRecoredNotFound("Khách hàng");

    if (!member)
      throw ErrorHelper.mgRecoredNotFound("Thành viên");

    // Xoá các đơn đăng ký cũ
    const oldRegis = await RegisSMSModel.findOne({
      registerId: customerId,
      status: RegisSMSStatus.PENDING,
      productId
    });

    if (campaign) {
      const deletedOldRegisSMS = await RegisSMSModel.remove({ _id: oldRegis._id }).exec();
      if (deletedOldRegisSMS.deletedCount === 1) {
        await CampaignSocialResultModel.findOneAndUpdate(
          { memberId: sellerId, campaignId: campaign.id, productId },
          {
            $pullAll: { regisSMSIds: [oldRegis._id] }
          }
          , { new: true });
      }
    }

    const {
      commission0,// Hoa hồng Mobifone
      commission1,// Hoa hồng điểm bán
      commission2, // Hoa hồng giới thiệu
      name: productName,
      basePrice,
    } = product;

    const { _id: registerId } = customer;

    let params: any = {
      productId,
      productName,
      registerId,
      basePrice,
      sellerId,
      registerName,
      registerPhone,
      commission0,
      commission1,
      commission2,
    };

    // tính toán điểm thưởng cho khách hàng
    const UNIT_PRICE = await SettingHelper.load(SettingKey.UNIT_PRICE);
    const getPointFromPrice = (factor: any, price: any) => (Math.round(((price / UNIT_PRICE) * 100) / 100) * factor);
    // Điểm thưởng khách hàng
    if (product.enabledCustomerBonus)
      params.buyerBonusPoint = getPointFromPrice(product.customerBonusFactor, product.basePrice);
    // Điểm thưởng chủ shop
    if (product.enabledMemberBonus)
      params.sellerBonusPoint = getPointFromPrice(product.memberBonusFactor, product.basePrice);

    const campaignSocialResult = campaign ? await CampaignSocialResultModel.findOne({ memberId: sellerId, campaignId: campaign.id, productId }) : null;
    const regisSMSIds = campaignSocialResult ? campaignSocialResult.regisSMSIds : null;
    // nhúng campaign vào đơn
    if (campaign) {
      params.campaignId = campaign._id;
      params.campaignSocialResultId = campaignSocialResult._id;
    }
    // lưu lại đơn đăng ký
    const regisSMS = new RegisSMSModel(params);
    regisSMS.code = await RegisSMSHelper.generateCode();

    console.log('............................................')
    return await Promise.all([
      regisSMS.save(),
      campaignSocialResult && CampaignSocialResultModel.findByIdAndUpdate(campaignSocialResult.id, {
        $set: {
          regisSMSIds: [...regisSMSIds, regisSMS.id]
        }
      }, { new: true })
    ]).then((res) => {
      return res[0];
    });

  },
};

const RegisSMS = {
  seller: GraphQLHelper.loadById(MemberLoader, "sellerId"),
  product: GraphQLHelper.loadById(ProductLoader, "productId"),
  register: GraphQLHelper.loadById(CustomerLoader, "registerId"),
  campaign: GraphQLHelper.loadById(CampaignLoader, "campaignId"),
  campaignSocialResult: GraphQLHelper.loadById(CampaignSocialResultLoader, "campaignSocialResultId")
};

export default {
  Query,
  Mutation,
  RegisSMS,
};
