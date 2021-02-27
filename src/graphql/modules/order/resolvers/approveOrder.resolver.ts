import _, { set } from "lodash";
import { ROLES } from "../../../../constants/role.const";
import { AuthHelper, ErrorHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderModel, IOrder, OrderStatus, ShipMethod } from "../order.model";
import { onApprovedOrder } from "../../../../events/onApprovedOrder.event";
import { ProductModel } from "../../product/product.model";
import { OrderItemModel } from "../../orderItem/orderItem.model";

//[Backend] Cung cấp API duyệt lịch sử đăng ký dịch vụ SMS
const approveOrder = async (root: any, args: any, context: Context) => {
  AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
  const { id } = args;

  if (!id) throw ErrorHelper.requestDataInvalid("mã đơn hàng");

  // kiem tra ptvc
  // neu Tu lien he ->PENDING ->

  let params: any = {
    _id: id,
    // status: {$in:[OrderStatus.PENDING , OrderStatus.DELIVERING ]},
  };

  if (context.isMember()) {
    params.sellerId = context.id;
  }

  const order = await OrderModel.findOne(params);

  if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");

  // if(order.shipMethod === ShipMethod.VNPOST){
  //   if(order.status === OrderStatus.PENDING){
  //     throw ErrorHelper.somethingWentWrong("Không thể duyệt đơn hàng VN-POST do chưa tạo vận đơn.");
  //   }
  // }
  // Tạo bulk product và customer
  const productBulk = ProductModel.collection.initializeUnorderedBulkOp();
  for (const o of order.itemIds) {
    // Duyệt số lượng sao đó trừ inventory
    const item = await OrderItemModel.findByIdAndUpdate(
      o,
      { $set: { status: OrderStatus.COMPLETED } },
      { new: true }
    );
    productBulk.find({ _id: item.productId }).updateOne({
      $inc: { crossSaleInventory: -item.qty, crossSaleOrdered: -item.qty }, // Trừ có thể ra âm
    });
  }

  order.status = OrderStatus.COMPLETED;
  
  return await Promise.all([order.save(), productBulk.execute()]).then(
    async ([order]) => {
      onApprovedOrder.next(order);
      return order;
    }
  );
};

const Mutation = {
  approveOrder,
};
export default { Mutation };
