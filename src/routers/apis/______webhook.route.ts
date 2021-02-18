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

// const values = JSON.stringify();

// const data = {
//   values,
//   SendDate: "2021-02-19T01:22:40",
//   SignData:
//     "EwGGbP8Cx3a9RAk65vjzsZ1QudeBS6gw29ew66U6YT97rLfZqqOCIWK7Rrm1/OHk+jVX2uWfuI9v2KEygeAipG5EFvpgQWouJyV+M4ClgcfeeImWdMXTDf4e6XekVLmrpYQpZyhs3W+oV9thB6qhlSfr0TOZLgTrVq6JuhX3tXbdeQkra8qhW7J8+X5j2wJcdK0FoTu8HepcbnFE9pPTxOYHQ4nIyIqL/mjb4O2beHspsvEoW0+vMb7N6K4V5oRAaKcox1UOCrEElVx0DVr8hfua0+xvRfFDMpF/2VTLE/KbVaps5r4zogMR9l/rrawAdz7MDAUJyYwA/0s3Nteqiw==",
// };
