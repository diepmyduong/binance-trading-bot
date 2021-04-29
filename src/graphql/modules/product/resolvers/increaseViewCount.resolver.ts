import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import {  ProductModel } from "../product.model";
import { isValidObjectId } from "mongoose";

const Mutation = {
  increaseViewCount: async (root: any, args: any, context: Context) => {
    const { productId } = args;
    if (!productId) {
      throw ErrorHelper.requestDataInvalid("Mã sản phẩm");
    }
    else {
      if (!isValidObjectId(productId)) {
        throw ErrorHelper.requestDataInvalid("Mã sản phẩm");
      }
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      throw ErrorHelper.error("Sản phẩm này không tồn tại")
    }
    // tự cộng dồn hoa hồng
    let updateField: any = product.viewCount ? {
      $inc: {
        viewCount: 1,
      },
    }
      : {
        $set: {
          viewCount: 1,
        },
      };


    // cập nhật số dư hoa hồng trong member
    return ProductModel.findByIdAndUpdate(product.id, updateField, {
      new: true,
    });
  },

};

export default {
  Mutation,
};
