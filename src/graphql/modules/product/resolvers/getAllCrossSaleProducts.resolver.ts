import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { CrossSaleModel } from "../../crossSale/crossSale.model";
import { IMember, MemberModel } from "../../member/member.model";
import { IProduct, ProductModel } from "../product.model";

const Query = {
  getAllCrossSaleProducts: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR_MEMBER_CUSTOMER);
    let seller: IMember;
    if (context.isCustomer()) {
      seller = await MemberModel.findById(context.sellerId);
    } else if (context.isMember()) {
      seller = await MemberModel.findById(context.id);
    } else {
      seller = await MemberModel.findById(args.sellerId);
    }
    if (!seller) throw ErrorHelper.mgRecoredNotFound("Cửa hàng");
    const crossSaleProducts = await CrossSaleModel.find({
      sellerId: seller._id,
    });
    const products = await ProductModel.find({
      _id: { $in: crossSaleProducts.map((c) => c.productId) },
    });

    return products.map((p: IProduct) => {
      p.outOfStock = p.crossSaleInventory - p.crossSaleOrdered <= 0;
      return p;
    });
  },
};

export default {
  Query,
};
