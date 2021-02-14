import { ROLES } from "../../../../constants/role.const";
import { Context } from "../../../context";
import { OrderModel } from "../order.model";
import { ErrorHelper } from "../../../../helpers/error.helper";
import { BranchModel } from "../../branch/branch.model";
import { ViettelPostHelper } from "../../../../helpers/viettelPost/viettelPost.helper";
import { AddressModel } from "../../address/address.model";

const Query = {
  getAllShipPrice: async (root: any, args: any, context: Context) => {
    context.auth(ROLES.ADMIN_EDITOR);
    const { orderId } = args;
    const order = await OrderModel.findById(orderId);
    // if (!order) throw ErrorHelper.orderNotFound();
    // const store = await BranchModel.findOne();
    // if (!store) throw ErrorHelper.somethingWentWrong("Chưa cấu hình chi nhánh kho");
    // const senderAddress = await AddressModel.findOne({ districtId: store.districtId });
    // const receiverAddress = await AddressModel.findOne({ wardId: order.wardId });
    // return await ViettelPostHelper.getPriceAll({
    //   senderProvince: senderAddress.viettelProvinceId,
    //   senderDistrict: senderAddress.viettelDistrictId,
    //   receiverProvince: receiverAddress.viettelProvinceId,
    //   receiverDistrict: receiverAddress.viettelDistrictId,
    //   productPrice: order.amount,
    //   moneyCollection: order.amount,
    //   productWeight: order.itemWeight,
    // });
  },
};

export default { Query };
