import { ErrorHelper } from "../../../../base/error";
import { ROLES } from "../../../../constants/role.const";
import { onCanceledOrder } from "../../../../events/onCanceledOrder.event";
import { AuthHelper } from "../../../../helpers";
import { Context } from "../../../context";
import { OrderItemModel } from "../../orderItem/orderItem.model";
import { ProductModel } from "../../product/product.model";
import { OrderModel, OrderStatus } from "../order.model";

const Mutation = {
    cancelOrder: async (root: any, args: any, context: Context) => {
        AuthHelper.acceptRoles(context, ROLES.ADMIN_EDITOR_MEMBER);
        const { id } = args;

        let params: any = {
            _id: id,
            status: OrderStatus.PENDING
        };

        if (context.isMember()) {
            params.sellerId = context.id;
            params.isPrimary = false;
        }

        console.log('-----', params);

        const order = await OrderModel.findOne(params);

        if (!order)
            throw ErrorHelper.requestDataInvalid("Đơn hàng không hợp lệ");

        // Thực hiện huỷ đơn
        order.status = OrderStatus.CANCELED;
        // Trừ orderQty
        for (const o of order.itemIds) {
            // Duyệt số lượng sao đó trừ inventory
            const item = await OrderItemModel.findByIdAndUpdate(o, { $set: { status: OrderStatus.CANCELED } }, { new: true });
            await ProductModel.findByIdAndUpdate(item.productId, {
                $inc: { crossSaleOrdered: -item.qty },
            }, { new: true });
        }

        return await Promise.all([
            order.save()
        ]).then(async (res) => {
            const result = res[0];
            onCanceledOrder.next(result);
            return result;
        });
    }
}

export default { Mutation };