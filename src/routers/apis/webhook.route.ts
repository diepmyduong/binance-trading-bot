import { Request, Response } from "express";
import { configs } from "../../configs";
import { WebhookLogModel } from "../../graphql/modules/webhookLog/webhookLog.model";
import { ErrorHelper } from "../../helpers/error.helper";
import { DeliveryLogModel } from "../../graphql/modules/deliveryLog/deliveryLog.model";
// import {
//   OrderModel,
//   ShipMethod,
// } from "../../graphql/modules/order/order.model";
// import moment from "moment-timezone";
// import { GetViettelDeliveryStatusText } from "../../helpers/viettelPost/viettelDeliveryStatus";
// export default [
//   {
//     method: "post",
//     path: "/api/delivery/webhook",
//     midd: [],
//     action: async (req: Request, res: Response) => {
//       WebhookLogModel.create({
//         name: "delivery",
//         body: req.body,
//         headers: req.headers,
//         query: req.query,
//       }).catch((err) => {});
//       if (!req.body["TOKEN"] || req.body["TOKEN"] != configs.viettelPost.secret)
//         throw ErrorHelper.badToken();
//       const data = req.body["DATA"];
//       const order = await OrderModel.findById(data["ORDER_REFERENCE"]);
//       if (!order) throw ErrorHelper.mgRecoredNotFound("Đơn hàng");
//       const deliveryLog = await DeliveryLogModel.create({
//         orderId: order._id,
//         // customerId: order.customerId,
//         orderNumber: data["ORDER_NUMBER"],
//         shipMethod: ShipMethod.VIETTEL_POST,
//         status: data["ORDER_STATUS"],
//         statusName: GetViettelDeliveryStatusText(
//           data["ORDER_STATUS"].toString()
//         ),
//         statusDetail: data["STATUS_NAME"],
//         statusDate: moment(data["ORDER_STATUSDATE"], "DD/MM/YYYY HH:mm:ss"),
//         note: data["Giao bưu cục đi nhận hàng.."],
//         moneyCollection: data["MONEY_COLLECTION"],
//         moneyFeeCOD: data["MONEY_FEECOD"],
//         moneyTotal: data["MONEY_TOTAL"],
//         expectedDelivery: data["EXPECTED_DELIVERY"],
//         productWeight: data["PRODUCT_WEIGHT"],
//         orderService: data["ORDER_SERVICE"],
//         locationCurrently: data["LOCALION_CURRENTLY"],
//         detail: data["DETAIL"],
//       });
//       // order.deliveryInfo.status = deliveryLog.status;
//       // order.deliveryInfo.statusName = deliveryLog.statusName;
//       await order.save();
//       res.sendStatus(200);
//     },
//   },
// ];
