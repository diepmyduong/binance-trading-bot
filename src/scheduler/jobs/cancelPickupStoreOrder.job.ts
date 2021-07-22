import { Job } from "agenda";
import moment from "moment-timezone";
import { onCanceledOrder } from "../../events/onCanceledOrder.event";
import { OrderModel, OrderStatus, PickupMethod } from "../../graphql/modules/order/order.model";
import { OrderItemModel } from "../../graphql/modules/orderItem/orderItem.model";
import { Agenda } from "../agenda";

export class CancelPickupStoreOrderJob {
  static jobName = "CancelPickupStoreOrder";
  static create(data: any) {
    return Agenda.create(this.jobName, data);
  }
  static async execute(job: Job) {
    console.log("Execute Job " + CancelPickupStoreOrderJob.jobName, moment().format());
    const orders = await OrderModel.find({
      status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] },
      pickupMethod: PickupMethod.STORE,
      pickupTime: { $lt: new Date() },
    });
    for (const order of orders) {
      try {
        order.status = OrderStatus.CANCELED;
        order.cancelReason = "Quá hẹn thời gian láy món";
        await OrderItemModel.updateMany(
          { orderId: order._id },
          { $set: { status: OrderStatus.CANCELED } }
        ).exec;
        await Promise.all([order.save()]).then(async (res) => {
          const result = res[0];
          onCanceledOrder.next(result);
          return result;
        });
      } catch (err) {
        console.log("error", err.message);
      }
    }
  }
}

export default CancelPickupStoreOrderJob;
