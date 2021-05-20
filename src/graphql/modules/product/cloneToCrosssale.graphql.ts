import { gql } from "apollo-server-express";
import { Types } from "mongoose";

import { ROLES } from "../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../helpers";
import { Context } from "../../context";
import { ProductHelper } from "./product.helper";
import { ProductModel, ProductType } from "./product.model";

export default {
  schema: gql`
    extend type Mutation {
      cloneToCrosssale(id: ID!, data: CloneToCrosssaleInput!): Product
    }
    input CloneToCrosssaleInput {
      crossSaleInventory: Int!
      commission1: Float
      commission2: Float
      commission3: Float
      enabledMemberBonus: Boolean
      enabledCustomerBonus: Boolean
      memberBonusFactor: Int
      customerBonusFactor: Int
    }
  `,
  resolver: {
    Mutation: {
      cloneToCrosssale: async (root: any, args: any, context: Context) => {
        AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
        const { id, data } = args;

        const {
          crossSaleInventory,
          commission1,
          commission2,
          commission3,
          memberBonusFactor,
          customerBonusFactor,
        } = data;

        if (crossSaleInventory <= 0) {
          throw ErrorHelper.requestDataInvalid("số lượng hàng bán chéo");
        }

        let product = await ProductModel.findOne({
          _id: id,
          type: ProductType.RETAIL,
          isCrossSale: false,
          isPrimary: false,
        }).select("-code -createdAt -updatedAt -__v");

        if (!product.width) throw Error("Sản phẩm chưa có chiều rộng");
        if (!product.length) throw Error("Sản phẩm chưa chó chiều dài");
        if (!product.height) throw Error("Sản phẩm chưa có chiều cao");
        if (!product.weight) throw Error("Sản phẩm chưa có cân nặng");

        product.code = product.code || (await ProductHelper.generateCode());
        product.crossSaleInventory = crossSaleInventory;
        product.commission1 = commission1;
        product.commission2 = commission2;
        product.commission3 = commission3;

        product.memberBonusFactor = memberBonusFactor; // Hệ số thưởng điểm bán
        product.customerBonusFactor = customerBonusFactor; // Hệ số thưởng khách hàng

        product.isCrossSale = true;
        product._id = new Types.ObjectId();
        product.createdAt = new Date();
        product.updatedAt = new Date();
        // console.log('product', product);
        //test
        await ProductModel.collection.insertOne(product);
        return product;
      },
    },
  },
};
