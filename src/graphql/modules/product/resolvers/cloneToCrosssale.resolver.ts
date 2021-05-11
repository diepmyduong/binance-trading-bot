import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { ProductHelper } from "../product.helper";
import { ProductModel, ProductType } from "../product.model";
import { ObjectId } from "mongodb";

const Mutation = {
  cloneToCrosssale: async (root: any, args: any, context: Context) => {
    AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR);
    const { id } = args;

    const product = await ProductModel.findOne({
      _id: id,
      type: ProductType.RETAIL,
      isCrossSale: false,
      isPrimary: false,
    }).select("-code -createdAt -updatedAt -__v");

    if (!product) {
      throw ErrorHelper.mgQueryFailed("Sản phẩm");
    }

    product.isCrossSale = true;
    product._id = new ObjectId();
    // console.log('product', product);
    //test
    await ProductModel.collection.insertOne(product);
    return product;
  },
};

export default {
  Mutation,
};
