import { omit, set, isNull } from "lodash";
import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { GraphQLHelper } from "../../../../helpers/graphql.helper";
import { Context } from "../../../context";
import { CategoryLoader } from "../../category/category.model";
import { MemberHelper } from "../../member/member.helper";
import { MemberLoader } from "../../member/member.model";
import { ProductHelper } from "../product.helper";
import { IProduct, ProductModel, ProductType } from "../product.model";
import { productService } from "../product.service";
import { ObjectId } from 'mongodb';

const Mutation = {
  cloneToCrosssale: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);

    const {
      id,
      data
    } = args;

    const {
      crossSaleInventory,
      commission0,
      commission1,
      commission2,
      memberBonusFactor,
      customerBonusFactor } = data;

    if (crossSaleInventory <= 0) {
      throw ErrorHelper.requestDataInvalid("số lượng hàng bán chéo");
    }

    let product = await ProductModel.findOne({ _id: id, type: ProductType.RETAIL, isCrossSale: false, isPrimary: false }).select("-code -createdAt -updatedAt -__v");

    if (!data) {
      throw ErrorHelper.mgQueryFailed("Sản phẩm");
    }

    product.code = product.code || (await ProductHelper.generateCode());
    product.crossSaleInventory = crossSaleInventory;
    product.commission0 = commission0;
    product.commission1 = commission1;
    product.commission2 = commission2;

    product.memberBonusFactor = memberBonusFactor; // Hệ số thưởng điểm bán
    product.customerBonusFactor = customerBonusFactor; // Hệ số thưởng khách hàng

    product.isCrossSale = true;
    product._id = new ObjectId()
    // console.log('product', product);
    //test
    await ProductModel.collection.insertOne(product);
    return product;
  },

};

export default {
  Mutation,
};
