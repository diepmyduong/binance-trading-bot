import { Request, Response } from "express";
import { get } from "lodash";
import { onApprovedCompletedOrder } from "../../events/onApprovedCompletedOrder.event";
import { onApprovedFailureOrder } from "../../events/onApprovedFailureOrder.event";
import { onDelivering } from "../../events/onDelivering.event";
import { AhamoveWebhookLogModel } from "../../graphql/modules/ahamoveWebhookLog/ahamoveWebhookLog.model";
import { DeliveryLogModel } from "../../graphql/modules/deliveryLog/deliveryLog.model";
import {
  NotificationModel,
  NotificationTarget,
  NotificationType,
} from "../../graphql/modules/notification/notification.model";
import { OrderModel, OrderStatus, ShipMethod } from "../../graphql/modules/order/order.model";
import { OrderLogModel, OrderLogType } from "../../graphql/modules/orderLog/orderLog.model";
import { validateJSON } from "../../helpers";
import { Ahamove } from "../../helpers/ahamove/ahamove";
import SendNotificationJob from "../../scheduler/jobs/sendNotification.job";
export default [
  {
    method: "post",
    path: "/api/shippingTracking/ahamove",
    midd: [],
    action: async (req: Request, res: Response) => {
      res.json({ message: "OK" });
      try {
        validateJSON(req.body, {
          type: "object",
          required: ["api_key", "status", "_id"],
        });
        const {
          api_key,
          status,
          _id,
          supplier_name,
          supplier_id,
          sub_status,
          path,
          service_id,
        } = req.body;
        await AhamoveWebhookLogModel.create({ order: req.body }).catch((err) => {});
        const order = await OrderModel.findOne({ "deliveryInfo.orderId": _id });
        order.deliveryInfo.status = status;
        order.deliveryInfo.statusText = get(Ahamove.StatusText, status);
        order.driverName = supplier_name;
        order.driverPhone = supplier_id;
        await order.save();
        switch (status) {
          case "IDLE":
            break;
          case "ASSIGNING":
            break;
          case "ACCEPTED": {
            break;
          }
          case "IN PROCESS": {
            order.status = OrderStatus.DELIVERING;
            await order.save();
            await OrderLogModel.create({
              orderId: order._id,
              type: OrderLogType.MEMBER_DELIVERING,
              memberId: order.sellerId,
              customerId: order.buyerId,
              orderStatus: order.status,
            });
            onDelivering.next(order);
            break;
          }
          case "COMPLETED": {
            if (sub_status == "RETURNED" || path[1].fail_comment.length > 0) {
              order.status = OrderStatus.FAILURE;
              await order.save();
              onApprovedFailureOrder.next(order);
            } else {
              order.status = OrderStatus.COMPLETED;
              await order.save();
              onApprovedCompletedOrder.next(order);
            }
            break;
          }
          case "CANCELLED":
            break;
        }
        const deliveryLog = await DeliveryLogModel.create({
          orderId: order._id,
          memberId: order.sellerId,
          customerId: order.buyerId,
          orderNumber: _id,
          deliveryCode: _id,
          deliveryId: _id,
          shipMethod: ShipMethod.AHAMOVE,
          status: order.deliveryInfo.status,
          statusName: order.deliveryInfo.statusText,
          statusDetail: "",
          statusDate: new Date(),
          note: path[1].fail_comment,
          orderService: service_id,
        });
        const notify = new NotificationModel({
          target: NotificationTarget.CUSTOMER,
          type: NotificationType.ORDER,
          customerId: order.buyerId,
          title: `Đơn hàng hàng #${order.code}`,
          body: order.deliveryInfo.statusText,
          orderId: order._id,
        });
        await NotificationModel.create(notify);
        await SendNotificationJob.trigger();
        // console.log("Cập nhật đơn hàng", { api_key, status, _id, supplier_name, supplier_id });
      } catch (err) {}
    },
  },
];
