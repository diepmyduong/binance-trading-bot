import { GraphQLHelper } from "../../../helpers/graphql.helper";
import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper, KeycodeHelper } from "../../../helpers";
import { Context } from "../../context";
import { ProductLoader, ProductModel } from "../product/product.model";
import { collaboratorProductService } from "./collaboratorProduct.service";
import { set } from "lodash";
import { CollaboratorLoader, CollaboratorModel } from "../collaborator/collaborator.model";
import { SettingHelper } from "../setting/setting.helper";
import { SettingKey } from "../../../configs/settingData";
import { CollaboratorProductModel } from "./collaboratorProduct.model";

const Query = {
  getAllCollaboratorProduct: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);

    if (context.isCustomer()) {
      set(args, "q.filter.customerId", context.id);
    }

    return collaboratorProductService.fetch(args.q);
  },
  getOneCollaboratorProduct: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await collaboratorProductService.findOne({ _id: id });
  },
};

const Mutation = {
  createCollaboratorProduct: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { data } = args;
    const { collaboratorId, productId } = data;

    const host = await SettingHelper.load(SettingKey.APP_DOMAIN);
    const secret = `${collaboratorId}-${productId}`;

    let shortCode = KeycodeHelper.alpha(secret, 6);
    let shortUrl = `${host}/san-pham/${shortCode}`;

    const collaboratorProduct = await CollaboratorProductModel.find({ collaboratorId, productId });
    if(collaboratorProduct.length > 0){
      throw ErrorHelper.mgQueryFailed("Link sản phẩm đã tồn tại");
    }
    // console.log('collaboratorId', collaboratorId);
    const collaborator = await CollaboratorModel.findById(collaboratorId);
    // console.log('collaborator', collaborator);

    if(!collaborator){
      throw ErrorHelper.mgRecoredNotFound("Cộng tác viên");
    }

    const product = await ProductModel.findById(productId);
    if(!product){
      throw ErrorHelper.mgRecoredNotFound("Sản phẩm");
    }

    if(!product.isPrimary){
      throw ErrorHelper.somethingWentWrong("Sản phẩm phải là sản phẩm của bưu cục");
    }

    let countShortUrl = await CollaboratorModel.count({ shortUrl });
    while (countShortUrl > 0) {
      shortCode = KeycodeHelper.alpha(secret, 6);
      shortUrl = `${host}/ctv/${shortCode}`;
      countShortUrl = await CollaboratorModel.count({ shortUrl });
    }

    data.shortUrl = shortUrl;
    data.shortCode = shortCode;


    return await collaboratorProductService.create(data);
  },
  deleteOneCollaboratorProduct: async (
    root: any,
    args: any,
    context: Context
  ) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    const { id } = args;
    return await collaboratorProductService.deleteOne(id);
  },
};

// collaboratorId: { type: Schema.Types.ObjectId, ref: "Collaborator" },
// productId: { type: Schema.Types.ObjectId, ref: "Product" },
const CollaboratorProduct = {
  product: GraphQLHelper.loadById(ProductLoader, "productId"),
  collaborator: GraphQLHelper.loadById(CollaboratorLoader, "collaboratorId"),
};

export default {
  Query,
  Mutation,
  CollaboratorProduct,
};
